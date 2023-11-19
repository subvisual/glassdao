use crate::db::Record;
use crate::db::DB;
use std::sync::Arc;
use std::sync::Mutex;

use tokio::sync::broadcast;

pub struct Updater {
    db: Arc<Mutex<DB>>,
    recv_insert: broadcast::Receiver<Record>,
    shutdown: broadcast::Receiver<()>,
}

impl Updater {
    pub fn new(
        db: Arc<Mutex<DB>>,
        recv_insert: broadcast::Receiver<Record>,
        shutdown: broadcast::Receiver<()>,
    ) -> Self {
        Updater {
            db,
            recv_insert,
            shutdown,
        }
    }

    pub async fn run_receiver(&mut self) {
        loop {
            tokio::select! {
                Ok(record) = self.recv_insert.recv() => {
                    println!("insert received, inserting record: {:?}", record);

                    let mut unlocked = self.db.lock().unwrap();
                    match record {
                        Record::CompanyCreated(id, name, owner) => {
                            unlocked.insert_company(id, name, owner);
                     },
                        Record::EmployeeAdded(company_id,  employee) => {
                            unlocked.insert_employee(company_id,  employee);
                        },
                        Record::EmployeeConfirmed(company_id,employee, signature) => {
                            unlocked.confirm_employee(company_id, employee, signature);
                        }
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
