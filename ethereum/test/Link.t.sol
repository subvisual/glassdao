// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Link} from "../src/Link.sol";

contract LinkTest is Test {
    Link public link;

    address public alice = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address public bob = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

    function setUp() public {
        link = new Link();
    }

    function test_createCompany() public {
        uint company_id = link.createCompany("A");
        assertEq(link.getCompanyName(company_id), "A");
    }

    function test_addEmployee() public {
        uint company_id = link.createCompany("A");
        assertEq(link.getCompanyName(company_id), "A");

        link.addEmployee(company_id, address(alice));

        Link.EmployeeRecord memory expected = Link.EmployeeRecord(address(alice), "0", Link.EmployeeState.PENDING);
        Link.EmployeeRecord memory e = link.getEmployee(company_id, address(alice));

        bytes memory expectedBytes = abi.encode(expected);
        bytes memory eBytes = abi.encode(e);

        assertEq(expectedBytes, eBytes);
    }

    function test_confirm() public {
        uint company_id = link.createCompany("A");
        link.addEmployee(company_id, address(bob));

        vm.startPrank(address(bob));
        link.confirm(company_id, "1");
        vm.stopPrank();

        Link.EmployeeRecord memory expected = Link.EmployeeRecord(address(bob), "1", Link.EmployeeState.APPROVED);
        bytes memory expectedBytes = abi.encode(expected);

        Link.EmployeeRecord memory e = link.getEmployee(company_id, address(bob));
        bytes memory eBytes = abi.encode(e);

        assertEq(expectedBytes, eBytes);
    }
}
