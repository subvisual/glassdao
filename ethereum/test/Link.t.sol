// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Link} from "../src/Link.sol";

contract LinkTest is Test {
    Link public link;

    address public alice = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address public bob = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

    function setUp() public {
        link = new Link(0);
    }

    function test_createCompany() public {
        vm.startPrank(address(alice));
        vm.expectEmit();

        emit Link.CompanyCreated(1, "A", address(alice));

        uint company_id = link.createCompany("A");
        assertEq(link.getCompanyName(company_id), "A");
    }

    function test_addEmployee() public {
        vm.startPrank(address(alice));

        uint company_id = link.createCompany("A");

        vm.expectEmit();
        emit Link.EmployeeAdded(1, address(bob));

        link.addEmployee(company_id, address(bob));

        Link.EmployeeRecord memory expected = Link.EmployeeRecord(address(bob), "no signature", Link.EmployeeState.PENDING);
        Link.EmployeeRecord memory e = link.getEmployee(company_id, address(bob));

        bytes memory expectedBytes = abi.encode(expected);
        bytes memory eBytes = abi.encode(e);

        assertEq(expectedBytes, eBytes);
    }

    function test_confirm() public {
        vm.startPrank(address(alice));

        uint company_id = link.createCompany("A");
        link.addEmployee(company_id, address(bob));

        vm.stopPrank();
        vm.startPrank(address(bob));
        vm.expectEmit();

        emit Link.EmployeeConfirmed(1, address(bob), "mina signature");

        link.confirm(company_id, "mina signature");
        vm.stopPrank();

        Link.EmployeeRecord memory expected = Link.EmployeeRecord(address(bob), "mina signature", Link.EmployeeState.APPROVED);
        bytes memory expectedBytes = abi.encode(expected);

        Link.EmployeeRecord memory e = link.getEmployee(company_id, address(bob));
        bytes memory eBytes = abi.encode(e);

        assertEq(expectedBytes, eBytes);
    }
}
