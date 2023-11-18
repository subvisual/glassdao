// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Link {
    enum EmployeeState {
        UNINITIALIZED,
        PENDING,
        APPROVED
    }

    struct EmployeeRecord {
        address eth_addr;
        string mina_addr;
        EmployeeState state;
    }

    struct CompanyDetails {
        string name;
    }

    // Company address => (User address => EmployeeRecord)
    mapping (address => mapping (address => EmployeeRecord)) companiesEmployees;

    uint companyId;

    // Company id to Company address
    mapping (uint => address) companyIdToAddress;

    // company id => CompanyDetails
    mapping (uint => CompanyDetails) companies;

    function createCompany(string memory name) external returns (uint _companyId) {
        companyId++;

        companyIdToAddress[companyId] = msg.sender;

        CompanyDetails storage company = companies[companyId];
        company.name = name;

        EmployeeRecord memory e = EmployeeRecord({
          eth_addr: msg.sender,
          mina_addr: "0",
          state: EmployeeState.APPROVED
        });

        companiesEmployees[msg.sender][msg.sender] = e ;

        return companyId;
    }

    function getCompanyName(uint company_id) public view returns (string memory name) {
        return companies[company_id].name;
    }

    function addEmployee(uint company_id, address employee) public {
      EmployeeRecord memory e = EmployeeRecord({
        eth_addr: employee,
        mina_addr: "0",
        state: EmployeeState.PENDING
      });

      address company = companyIdToAddress[company_id];
      companiesEmployees[company][employee] = e;
    }

    function getEmployee(uint company_id, address employee) public view returns (EmployeeRecord memory e) {
      address company = companyIdToAddress[company_id];

      return companiesEmployees[company][employee];
    }

    function confirm(uint company_id, string calldata mina_addr) external {
      address company = companyIdToAddress[company_id];

      EmployeeRecord memory e = companiesEmployees[company][msg.sender];
      e.mina_addr = mina_addr;
      e.state = EmployeeState.APPROVED;

      companiesEmployees[company][msg.sender] = e;
    }
}
