// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {PaymentGateway} from "../src/PaymentGateway.sol";

contract DeployPaymentGateway is Script {
    // address private constant DEFAULT_USDC_ADDRESS = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238; // Sepolia USDC
    address private constant DEFAULT_USDC_ADDRESS = 0xF8d56ca172a99CD17B9aaE9de3b84C2a851A3202; // Hedera

    address private constant DEFAULT_MERCHANT = 0xB2ED87074E123d1EF6bf1cB2949076baf5498484; // account index 1
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
