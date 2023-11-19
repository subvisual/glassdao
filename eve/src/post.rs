use tokio::sync::broadcast;

use crate::db::Record;
use ethers::core::types::U256;
use reqwest::{Client, StatusCode};
use serde::Serialize;

pub struct Post {
    recv_post: broadcast::Receiver<Record>,
    shutdown: broadcast::Receiver<()>,
    client: Client,
    local: bool,
}

#[derive(Debug, Clone, Hash, PartialEq, Eq, Serialize)]
pub struct Employee {
    pub company_id: U256,
    pub employee: String,
    pub signature: String,
}

impl Post {
    pub fn new(
        recv_post: broadcast::Receiver<Record>,
        shutdown: broadcast::Receiver<()>,
        local: bool,
    ) -> Self {
        Post {
            recv_post,
            shutdown,
            client: Client::new(),
            local,
        }
    }

    pub async fn run_post(&mut self) {
        loop {
            tokio::select! {
                Ok(record) = self.recv_post.recv() => {
                    println!("insert received, inserting record: {:?}", record);
                    match record {
                        Record::EmployeeConfirmed(company_id,employee, signature) => {
                            let employee = Employee{
                                company_id : company_id.0,
                                employee : format!("0x{:x}",employee.0),
                                signature : signature.0.unwrap_or("".to_string()),
                            };
                            if self.local {

                                println!("employee: {:?}", employee);
                            }
                            else {

                                let res = self.client.post(std::env::var("VERCEL_API").expect("Couldn't get vercel api url")).json(&employee).send().await;
                                match res {
                                    Ok(res) => {
                                        if res.status() == StatusCode::OK {
                                            println!("employee posted");
                                        }
                                        else {
                                            println!("employee post failed");
                                        }
                                    }
                                    Err(e) => {
                                        println!("employee post failed: {:?}", e);
                                    }
                                }
                            }
                        }

                        _ => {}
                    }
                },
                _ = self.shutdown.recv() => {
                    println!("shutdown received, starting graceful shutdown");
                    break;
                }
            }
        }
    }
}
