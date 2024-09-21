// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {PaymentGateway} from "../src/PaymentGateway.sol";

contract DeployPaymentGateway is Script {
    function run(address usdcAddress, address merchant) external returns (address) {
        vm.startBroadcast();

        // Deploy the contract
        PaymentGateway paymentGateway = new PaymentGateway(usdcAddress, merchant);

        // Grant the DEFAULT_ADMIN_ROLE to the deployer (which will be the test contract in this case)
        paymentGateway.grantRole(paymentGateway.DEFAULT_ADMIN_ROLE(), msg.sender);

        vm.stopBroadcast();

        // Log the deployed contract address
        console.log("PaymentGateway deployed to:", address(paymentGateway));

        return address(paymentGateway);
    }
}
