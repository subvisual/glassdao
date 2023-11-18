// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {Link} from "src/Link.sol";

contract LinkScript is Script {
    Link link;
    function setUp() public {
        link = Link(0x5FbDB2315678afecb367f032d93F642f64180aa3);
    }

    function run() public {

        vm.broadcast();

        link.createCompany("A");
    }
}
