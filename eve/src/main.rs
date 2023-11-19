use axum::error_handling::HandleErrorLayer;
use axum::extract::Path;
use axum::BoxError;
use axum::{extract::State, http::StatusCode, response::IntoResponse, routing::get, Json, Router};
use ethers::types::Address;
use eve::db;
use eve::listen;
use eve::post;
use eve::updater;
use eyre::Result;
use std::net::SocketAddr;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tokio::signal;
use tokio::sync::broadcast;
use tower_http::trace::TraceLayer;

use serde::Serialize;
use tower::ServiceBuilder;

#[tokio::main]
async fn main() -> Result<()> {
    // run it
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::debug!("listening on {}", addr);

    let (shutdown_send, shutdown_recv) = broadcast::channel(1);
    let (shutdown_send2, shutdown_recv2) = broadcast::channel(1);
    let (shutdown_send3, shutdown_recv3) = broadcast::channel(1);
    let (insert_send, insert_recv) = broadcast::channel(1);
    let (post_send, post_recv) = broadcast::channel(1);

    let local = true;

    let event_listener = tokio::spawn({
        let local = local.clone();
        async move {
            listen::start(0, local, shutdown_recv, insert_send, post_send)
                .await
                .unwrap();
        }
    });

    let db = Arc::new(Mutex::new(db::DB::new()));

    let db_thread = tokio::spawn({
        let db = db.clone();

        async move {
            updater::Updater::new(db, insert_recv, shutdown_recv2)
                .run_receiver()
                .await;
        }
    });

    let post_thread = tokio::spawn(async move {
        post::Post::new(post_recv, shutdown_recv3, local)
            .run_post()
            .await;
    });

    // build our application with some routes
    let app = Router::new()
        .route("/company", get(company_index))
        .route("/employee", get(employee_index))
        .route("/company/:id", get(company_get))
        .route("/company/:id/employee/:address", get(employee_get))
        .route("/", get(|| async { "ok" }))
        .layer(
            ServiceBuilder::new()
                .layer(HandleErrorLayer::new(|error: BoxError| async move {
                    if error.is::<tower::timeout::error::Elapsed>() {
                        Ok(StatusCode::REQUEST_TIMEOUT)
                    } else {
                        Err((
                            StatusCode::INTERNAL_SERVER_ERROR,
                            format!("Unhandled internal error: {error}"),
                        ))
                    }
                }))
                .timeout(Duration::from_secs(10))
                .layer(TraceLayer::new_for_http())
                .into_inner(),
        )
        .with_state(db.clone());

    println!("listening on {}", addr);
    let _ = tokio::join!(
        post_thread,
        event_listener,
        db_thread,
        hyper::Server::bind(&addr)
            .serve(app.into_make_service())
            .with_graceful_shutdown(shutdown_signal(vec![
                shutdown_send,
                shutdown_send2,
                shutdown_send3
            ]))
    );

    Ok(())
}

#[derive(Debug, Serialize, Clone)]
struct Company {
    id: String,
    name: String,
    owner: String,
}

async fn company_index(State(db): State<Arc<Mutex<db::DB>>>) -> impl IntoResponse {
    let unlocked = db.lock().unwrap().get_companies();
    let mut companies = vec![];
    for (id, company) in unlocked.iter() {
        companies.push(Company {
            id: id.0.to_string(),
            name: company.0 .0.clone(),
            owner: format!("0x{:x}", company.1 .0),
        })
    }

    Json(companies)
}

#[derive(Debug, Serialize, Clone)]
struct Employee {
    id: String,
    employee: String,
    signature: String,
}

async fn employee_index(State(db): State<Arc<Mutex<db::DB>>>) -> impl IntoResponse {
    let unlocked = db.lock().unwrap().get_employees();
    let mut employees = vec![];

    for (id, company) in unlocked.iter() {
        for (employee, signature) in company.iter() {
            employees.push(Employee {
                id: id.0.to_string(),
                employee: format!("0x{:x}", employee.0),
                signature: signature.clone().0.unwrap_or("".to_string()),
            })
        }
    }

    Json(employees)
}

async fn employee_get(
    Path((company_id, address)): Path<(u64, String)>,
    State(db): State<Arc<Mutex<db::DB>>>,
) -> Result<impl IntoResponse, StatusCode> {
    let unlocked = db.lock().unwrap();
    let parsed_address: Address = address.parse().map_err(|_| StatusCode::NOT_FOUND)?;
    let signature = unlocked.get_employee(db::Id(company_id.into()), db::Employee(parsed_address));

    let employee = Employee {
        id: company_id.to_string(),
        employee: address,
        signature: signature.0.ok_or(StatusCode::NOT_FOUND)?,
    };

    Ok(Json(employee))
}

async fn company_get(
    Path(id): Path<u64>,
    State(db): State<Arc<Mutex<db::DB>>>,
) -> Result<impl IntoResponse, StatusCode> {
    let unlocked = db.lock().unwrap();
    let company = unlocked
        .get_company(db::Id(id.into()))
        .ok_or(StatusCode::NOT_FOUND)?;

    let company = Company {
        id: id.to_string(),
        name: company.0 .0.clone(),
        owner: format!("0x{:x}", company.1 .0),
    };

    Ok(Json(company))
}

async fn shutdown_signal(shutdown_send: Vec<broadcast::Sender<()>>) {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }

    shutdown_send.iter().for_each(|s| {
        s.send(()).expect("failed to send shutdown signal");
    });

    println!("signal received, starting graceful shutdown");
}
