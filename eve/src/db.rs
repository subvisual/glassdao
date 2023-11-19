use std::sync::Arc;
use std::{collections::HashMap, sync::RwLock};

use ethers::core::types::{H160, U256};
use serde::Serialize;

//event CompanyCreated(uint company_id, string name, address owner);
//event EmployeeAdded(uint company_id, address employee);
//event EmployeeConfirmed(uint company_id, address employee, string mina_signature);

#[derive(Debug, Clone, Hash, PartialEq, Eq, Serialize)]
pub struct Id(pub U256);

#[derive(Debug, Clone)]
pub struct Owner(pub H160);

#[derive(Debug, Clone, Hash, PartialEq, Eq)]
pub struct Name(pub String);

#[derive(Debug, Clone, Hash, PartialEq, Eq)]
pub struct Employee(pub H160);

#[derive(Debug, Clone)]
pub struct Company(pub Name, pub Owner);

#[derive(Debug, Clone, Hash, PartialEq, Eq, Serialize)]
pub struct MinaSignature(pub Option<String>);

#[derive(Debug, Clone)]
pub enum Record {
    CompanyCreated(Id, Name, Owner),
    EmployeeAdded(Id, Employee),
    EmployeeConfirmed(Id, Employee, MinaSignature),
}

#[derive(Debug, Clone)]
pub struct DB {
    pub companies: HashMap<Id, Company>,
    pub employees: HashMap<Id, HashMap<Employee, MinaSignature>>,
}

impl DB {
    pub fn new() -> Self {
        DB {
            companies: HashMap::new(),
            employees: HashMap::new(),
        }
    }

    pub fn insert_company(&mut self, id: Id, name: Name, owner: Owner) {
        self.companies.insert(id, Company(name, owner));
    }

    pub fn insert_employee(&mut self, company_id: Id, employee: Employee) {
        let company = self.employees.get_mut(&company_id);
        match company {
            Some(company) => {
                company.insert(employee, MinaSignature(None));
            }
            None => {
                let mut company = HashMap::new();
                company.insert(employee, MinaSignature(None));
                self.employees.insert(company_id, company);
            }
        }
    }

    pub fn confirm_employee(
        &mut self,
        company_id: Id,
        employee: Employee,
        signature: MinaSignature,
    ) {
        let company = self.employees.get_mut(&company_id);
        match company {
            Some(company) => {
                company.insert(employee, signature);
            }
            None => {
                let mut company = HashMap::new();
                company.insert(employee, signature);
                self.employees.insert(company_id, company);
            }
        }
    }

    pub fn get_companies(&self) -> HashMap<Id, Company> {
        self.companies.clone()
    }

    pub fn get_employee(&self, company_id: Id, employee: Employee) -> MinaSignature {
        let company = self.employees.get(&company_id);
        match company {
            Some(company) => {
                let signature = company.get(&employee);
                match signature {
                    Some(signature) => signature.clone(),
                    None => MinaSignature(None),
                }
            }
            None => MinaSignature(None),
        }
    }
    pub fn get_employees(&self) -> HashMap<Id, HashMap<Employee, MinaSignature>> {
        self.employees.clone()
    }

    pub fn get_company(&self, company_id: Id) -> Option<Company> {
        let company = self.companies.get(&company_id);
        match company {
            Some(company) => Some(company.clone()),
            None => None,
        }
    }
}
