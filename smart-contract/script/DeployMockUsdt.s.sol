// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import {Script} from "forge-std/Script.sol";
import {MockUsdt} from "../src/MockUsdt.sol";

contract DeployMockUsdt is Script {
    function run() external returns (address) {
        address usdt = deployUsdt("USDT", "USDT", 6); // USDT is 6 decimal
        return usdt;
    }

    function deployUsdt(string memory name, string memory symbol, uint8 decimal) public returns (address) {
        vm.startBroadcast();

        MockUsdt usdt = new MockUsdt(name, symbol, decimal);

        vm.stopBroadcast();
        return address(usdt);
    }
}
