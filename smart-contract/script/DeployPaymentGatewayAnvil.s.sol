// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {PaymentGateway} from "../src/PaymentGateway.sol";

contract DeployPaymentGateway is Script {
    address private constant DEFAULT_USDC_ADDRESS = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
    address private constant DEFAULT_MERCHANT = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC; // account index 2

    function run() external returns (address) {
        return deployPaymentGateway(DEFAULT_USDC_ADDRESS, DEFAULT_MERCHANT);
    }

    function deployPaymentGateway(address usdcAddress, address merchant) public returns (address) {
        address[] memory moderators = new address[](1);
        moderators[0] = vm.addr(1); // account index 1

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
