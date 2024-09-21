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
    address public moderator1;
    address public moderator2;
    address public moderator3;
    address public admin;

    uint256 public constant INITIAL_BALANCE = 1000e6; // 1000 USDC
    uint256 public constant TRANSACTION_AMOUNT = 100e6; // 100 USDC
    uint256 public constant DISPUTE_FEE = 1e6; // 1 USDC
    uint256 public constant MERCHANT_FEE_PERCENTAGE = 100; // 1% in basis points

    function setUp() public {
        // Set up addresses
        merchant = makeAddr("merchant");
        buyer = makeAddr("buyer");
        moderator1 = makeAddr("moderator1");
        moderator2 = makeAddr("moderator2");
        moderator3 = makeAddr("moderator3");
        admin = address(this);

        // Deploy MockUsdt (as USDC)
        deployerUsdt = new DeployMockUsdt();
        address mockUsdcAddress = deployerUsdt.run();
        mockUsdt = MockUsdt(mockUsdcAddress);

        // Deploy PaymentGateway
        deployerPaymentGateway = new DeployPaymentGateway();
        address paymentGatewayAddress = deployerPaymentGateway.run(mockUsdcAddress, merchant);
        paymentGateway = PaymentGateway(paymentGatewayAddress);

        // Grant roles
        paymentGateway.grantRole(paymentGateway.MODERATOR_ROLE(), moderator1);
        paymentGateway.grantRole(paymentGateway.MODERATOR_ROLE(), moderator2);
        paymentGateway.grantRole(paymentGateway.MODERATOR_ROLE(), moderator3);

        // Fund accounts
        mockUsdt.mint(buyer, INITIAL_BALANCE);
        mockUsdt.mint(merchant, INITIAL_BALANCE);

        // Label addresses for easier debugging
        vm.label(address(paymentGateway), "PaymentGateway");
        vm.label(address(mockUsdt), "USDC");
        vm.label(merchant, "Merchant");
        vm.label(buyer, "Buyer");
        vm.label(moderator1, "Moderator1");
        vm.label(moderator2, "Moderator2");
        vm.label(moderator3, "Moderator3");
        vm.label(admin, "Admin");
    }

    function test_CreateTransaction() public {
        vm.startPrank(buyer);
        mockUsdt.approve(address(paymentGateway), TRANSACTION_AMOUNT);
        paymentGateway.createTransaction(TRANSACTION_AMOUNT);
        vm.stopPrank();

        assertEq(mockUsdt.balanceOf(address(paymentGateway)), TRANSACTION_AMOUNT);
    }

    function test_ResolveDispute_BuyerWins() public {
        // Create transaction and dispute
        vm.startPrank(buyer);
        mockUsdt.approve(address(paymentGateway), TRANSACTION_AMOUNT + DISPUTE_FEE);
        paymentGateway.createTransaction(TRANSACTION_AMOUNT);
        mockUsdt.approve(address(paymentGateway), DISPUTE_FEE);
        paymentGateway.disputeTransaction(0);
        vm.stopPrank();

        // Vote on dispute (3 votes for buyer)
        vm.prank(moderator1);
        paymentGateway.voteOnDispute(0, true);
        vm.prank(moderator2);
        paymentGateway.voteOnDispute(0, true);
        vm.prank(moderator3);
        paymentGateway.voteOnDispute(0, true);

        // Check balances
        assertEq(mockUsdt.balanceOf(buyer), INITIAL_BALANCE - DISPUTE_FEE);
        assertEq(mockUsdt.balanceOf(address(paymentGateway)), DISPUTE_FEE);
    }

    function test_ResolveDispute_MerchantWins() public {
        // Create transaction and dispute
        vm.startPrank(buyer);
        mockUsdt.approve(address(paymentGateway), TRANSACTION_AMOUNT + DISPUTE_FEE);
        paymentGateway.createTransaction(TRANSACTION_AMOUNT);
        mockUsdt.approve(address(paymentGateway), DISPUTE_FEE);
        paymentGateway.disputeTransaction(0);
        vm.stopPrank();

        // Vote on dispute (2 votes for buyer, 1 for merchant)
        vm.prank(moderator1);
        paymentGateway.voteOnDispute(0, true);
        vm.prank(moderator2);
        paymentGateway.voteOnDispute(0, true);
        vm.prank(moderator3);
        paymentGateway.voteOnDispute(0, false);

        // Check balances (buyer should win as 3 moderators voted, with 2 in favor)
        assertEq(mockUsdt.balanceOf(buyer), INITIAL_BALANCE - DISPUTE_FEE);
        assertEq(mockUsdt.balanceOf(address(paymentGateway)), DISPUTE_FEE);
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

        uint256 merchantFee = (TRANSACTION_AMOUNT * MERCHANT_FEE_PERCENTAGE) / 10000;
        assertEq(mockUsdt.balanceOf(merchant), INITIAL_BALANCE + TRANSACTION_AMOUNT - merchantFee);
        assertEq(mockUsdt.balanceOf(address(paymentGateway)), merchantFee);
    }

    function testFail_DisputeAfterPeriod() public {
        // Create a transaction
        vm.startPrank(buyer);
        mockUsdt.approve(address(paymentGateway), TRANSACTION_AMOUNT + DISPUTE_FEE);
        paymentGateway.createTransaction(TRANSACTION_AMOUNT);

        // Wait for the dispute period to end
        vm.warp(block.timestamp + paymentGateway.DISPUTE_PERIOD() + 1);

        // Try to dispute (should fail)
        paymentGateway.disputeTransaction(0);
        vm.stopPrank();
    }

    function testFail_UnauthorizedVoteOnDispute() public {
        // Create and dispute a transaction
        vm.startPrank(buyer);
        mockUsdt.approve(address(paymentGateway), TRANSACTION_AMOUNT + DISPUTE_FEE);
        paymentGateway.createTransaction(TRANSACTION_AMOUNT);
        paymentGateway.disputeTransaction(0);
        vm.stopPrank();

        // Try to vote on the dispute as an unauthorized address (should fail)
        vm.prank(buyer);
        paymentGateway.voteOnDispute(0, true);
    }

    function test_DisputeResolutionWithMultipleVotes() public {
        // Create and dispute a transaction
        vm.startPrank(buyer);
        mockUsdt.approve(address(paymentGateway), TRANSACTION_AMOUNT + DISPUTE_FEE);
        paymentGateway.createTransaction(TRANSACTION_AMOUNT);
        paymentGateway.disputeTransaction(0);
        vm.stopPrank();

        // Vote on dispute (2 votes for buyer, 1 for merchant)
        vm.prank(moderator1);
        paymentGateway.voteOnDispute(0, true);
        vm.prank(moderator2);
        paymentGateway.voteOnDispute(0, true);
        vm.prank(moderator3);
        paymentGateway.voteOnDispute(0, false);

        // Check buyer's balance
        // Expected: INITIAL_BALANCE (dispute resolved in favor of buyer)
        assertEq(mockUsdt.balanceOf(buyer), INITIAL_BALANCE - DISPUTE_FEE, "Buyer balance is incorrect");

        // Check PaymentGateway's balance
        // Expected: DISPUTE_FEE
        assertEq(mockUsdt.balanceOf(address(paymentGateway)), DISPUTE_FEE, "Contract balance is incorrect");

        // Check merchant's balance
        // Expected: INITIAL_BALANCE (unchanged, as buyer won the dispute)
        assertEq(mockUsdt.balanceOf(merchant), INITIAL_BALANCE, "Merchant balance should be unchanged");
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
        mockUsdt.approve(address(paymentGateway), DISPUTE_FEE);
        paymentGateway.disputeTransaction(0);
        vm.stopPrank();

        // Resolve the dispute (buyer wins as 3 moderators voted)
        vm.prank(moderator1);
        paymentGateway.voteOnDispute(0, true);
        vm.prank(moderator2);
        paymentGateway.voteOnDispute(0, true);
        vm.prank(moderator3);
        paymentGateway.voteOnDispute(0, true);

        // Withdraw fees
        paymentGateway.withdrawFees(DISPUTE_FEE);

        // Check balances
        assertEq(mockUsdt.balanceOf(address(this)), DISPUTE_FEE, "Admin balance is incorrect");
        assertEq(mockUsdt.balanceOf(address(paymentGateway)), 0, "PaymentGateway balance should be 0");
        assertEq(mockUsdt.balanceOf(buyer), INITIAL_BALANCE - DISPUTE_FEE, "Buyer balance is incorrect");
    }
}
