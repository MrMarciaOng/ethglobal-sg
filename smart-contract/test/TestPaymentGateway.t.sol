// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.18;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {DeployMockUsdt} from "../script/DeployMockUsdt.s.sol";
import {DeployPaymentGateway} from "../script/DeployPaymentGateway.s.sol";
import {PaymentGateway} from "../src/PaymentGateway.sol";
import {MockUsdt} from "../src/MockUsdt.sol";

contract TestPaymentGateway is Test {
    DeployMockUsdt public deployerUsdt;
    DeployPaymentGateway public deployerPaymentGateway;
    PaymentGateway public paymentGateway;
    MockUsdt public mockUsdt;

    address public merchant;
    address public buyer;
    address public moderator;
    address public admin;

    uint256 public constant INITIAL_BALANCE = 1000e6; // 1000 USDT
    uint256 public constant TRANSACTION_AMOUNT = 100e6; // 100 USDT
    uint256 public constant DISPUTE_FEE = 10e6; // 10 USDT

    function setUp() public {
        // Set up addresses
        merchant = makeAddr("merchant");
        buyer = makeAddr("buyer");
        moderator = makeAddr("moderator");
        admin = address(this); // Set admin as the test contract

        // Deploy MockUsdt
        deployerUsdt = new DeployMockUsdt();
        address mockUsdtAddress = deployerUsdt.run();
        mockUsdt = MockUsdt(mockUsdtAddress);

        // Deploy PaymentGateway
        deployerPaymentGateway = new DeployPaymentGateway();
        address paymentGatewayAddress = deployerPaymentGateway.run(address(mockUsdt), merchant);
        paymentGateway = PaymentGateway(paymentGatewayAddress);

        // Grant moderator role
        paymentGateway.grantRole(paymentGateway.MODERATOR_ROLE(), moderator);

        // Fund accounts
        mockUsdt.mint(buyer, INITIAL_BALANCE);
        mockUsdt.mint(merchant, INITIAL_BALANCE);

        // Label addresses for easier debugging
        vm.label(address(paymentGateway), "PaymentGateway");
        vm.label(address(mockUsdt), "USDT");
        vm.label(merchant, "Merchant");
        vm.label(buyer, "Buyer");
        vm.label(moderator, "Moderator");
        vm.label(admin, "Admin");
    }

    function test_ResolveDispute_BuyerWins() public {
        // Create transaction
        vm.startPrank(buyer);
        mockUsdt.approve(address(paymentGateway), TRANSACTION_AMOUNT + DISPUTE_FEE);
        paymentGateway.createTransaction(TRANSACTION_AMOUNT);
        paymentGateway.disputeTransaction(0);
        vm.stopPrank();

        // moderator resolves dispute
        vm.prank(moderator);
        paymentGateway.resolveDispute(0, true);

        assertEq(mockUsdt.balanceOf(buyer), INITIAL_BALANCE - DISPUTE_FEE); // Buyer gets refunded transaction amount, but not dispute fee
        assertEq(mockUsdt.balanceOf(address(paymentGateway)), DISPUTE_FEE); // Contract keeps the dispute fee
    }

    function test_ResolveDispute_MerchantWins() public {
        // Create and dispute a transaction
        vm.startPrank(buyer);
        mockUsdt.approve(address(paymentGateway), TRANSACTION_AMOUNT + DISPUTE_FEE);
        paymentGateway.createTransaction(TRANSACTION_AMOUNT);
        paymentGateway.disputeTransaction(0);
        vm.stopPrank();

        // Resolve the dispute in favor of the merchant
        vm.prank(moderator);
        paymentGateway.resolveDispute(0, false);

        assertEq(mockUsdt.balanceOf(merchant), INITIAL_BALANCE + TRANSACTION_AMOUNT);
        assertEq(mockUsdt.balanceOf(address(paymentGateway)), DISPUTE_FEE); // Contract keeps the dispute fee
    }

    function test_ReleasePayment() public {
        // Create a transaction
        vm.startPrank(buyer);
        mockUsdt.approve(address(paymentGateway), TRANSACTION_AMOUNT);
        paymentGateway.createTransaction(TRANSACTION_AMOUNT);
        vm.stopPrank();

        // Wait for the dispute period to end
        vm.warp(block.timestamp + paymentGateway.DISPUTE_PERIOD() + 1);

        // Release the payment
        vm.prank(merchant);
        paymentGateway.releasePayment(0);

        assertEq(mockUsdt.balanceOf(merchant), INITIAL_BALANCE + TRANSACTION_AMOUNT);
        assertEq(mockUsdt.balanceOf(address(paymentGateway)), 0);
    }

    function testFail_DisputeAfterPeriod() public {
        // Create a transaction
        vm.startPrank(buyer);
        mockUsdt.approve(address(paymentGateway), TRANSACTION_AMOUNT);
        paymentGateway.createTransaction(TRANSACTION_AMOUNT);

        // Wait for the dispute period to end
        vm.warp(block.timestamp + paymentGateway.DISPUTE_PERIOD() + 1);

        // Try to dispute (should fail)
        mockUsdt.approve(address(paymentGateway), DISPUTE_FEE);
        paymentGateway.disputeTransaction(0);
    }

    function testFail_UnauthorizedResolveDispute() public {
        // Create and dispute a transaction
        vm.startPrank(buyer);
        mockUsdt.approve(address(paymentGateway), TRANSACTION_AMOUNT + DISPUTE_FEE);
        paymentGateway.createTransaction(TRANSACTION_AMOUNT);
        paymentGateway.disputeTransaction(0);
        vm.stopPrank();

        // Try to resolve the dispute as an unauthorized address (should fail)
        vm.prank(buyer);
        paymentGateway.resolveDispute(0, true);
    }

    function testFail_ReleasePaymentBeforePeriod() public {
        // Create a transaction
        vm.startPrank(buyer);
        mockUsdt.approve(address(paymentGateway), TRANSACTION_AMOUNT);
        paymentGateway.createTransaction(TRANSACTION_AMOUNT);
        vm.stopPrank();

        // Try to release the payment before the dispute period ends (should fail)
        vm.prank(merchant);
        paymentGateway.releasePayment(0);
    }

    function test_WithdrawFees() public {
        // Create and dispute a transaction to generate fees
        vm.startPrank(buyer);
        mockUsdt.approve(address(paymentGateway), TRANSACTION_AMOUNT + DISPUTE_FEE);
        paymentGateway.createTransaction(TRANSACTION_AMOUNT);
        paymentGateway.disputeTransaction(0);
        vm.stopPrank();

        // Withdraw fees
        paymentGateway.withdrawFees(DISPUTE_FEE);

        assertEq(mockUsdt.balanceOf(address(this)), DISPUTE_FEE);
        assertEq(mockUsdt.balanceOf(address(paymentGateway)), TRANSACTION_AMOUNT);
    }

    function testFail_UnauthorizedWithdrawFees() public {
        // Create and dispute a transaction to generate fees
        vm.startPrank(buyer);
        mockUsdt.approve(address(paymentGateway), TRANSACTION_AMOUNT + DISPUTE_FEE);
        paymentGateway.createTransaction(TRANSACTION_AMOUNT);
        paymentGateway.disputeTransaction(0);
        vm.stopPrank();

        // Try to withdraw fees as an unauthorized address (should fail)
        vm.prank(buyer);
        paymentGateway.withdrawFees(DISPUTE_FEE);
    }
}