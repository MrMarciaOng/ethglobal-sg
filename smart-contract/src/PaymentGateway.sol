// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

//! require 3 moderators to approve
//! charge fees for merchant withdrawals maybe a % of withdrawal maybe 1%

/**
 * @title   PaymentGateway
 * @dev     Contract for managing USDC payments for a single merchant with dispute resolution
 * @notice  This contract allows for creating transactions, disputing them, and resolving disputes through off-chain moderation
 */
contract PaymentGateway is AccessControl {
    /*//////////////////////////////////////////////////////////////
                               VARIABLES
    //////////////////////////////////////////////////////////////*/
    IERC20 public s_usdcToken;

    address public immutable i_merchant; // The merchant's address

    /// @notice Struct to represent a transaction
    struct Transaction {
        address buyer;
        uint256 amount;
        uint256 timestamp;
        bool isDisputed;
        bool isResolved;
    }

    mapping(uint256 => Transaction) public s_transactions;

    uint256 public s_transactionCount;
    uint256 public constant DISPUTE_FEE = 10 * 10 ** 6; // 10 USDC
    uint256 public constant DISPUTE_PERIOD = 24 hours;

    /* Roles */
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");
    bytes32 public constant MERCHANT_ROLE = keccak256("MERCHANT_ROLE");

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/
    event TransactionCreated(uint256 indexed transactionId, address buyer, uint256 amount);
    event TransactionDisputed(uint256 indexed transactionId);
    event DisputeResolved(uint256 indexed transactionId, bool buyerWon);
    event PaymentReleased(uint256 indexed transactionId, uint256 amount);
    event FeesWithdrawn(address indexed admin, uint256 amount);

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    constructor(address _usdcTokenAddress, address _merchant) {
        s_usdcToken = IERC20(_usdcTokenAddress);
        i_merchant = _merchant;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MERCHANT_ROLE, _merchant);
    }

    /*//////////////////////////////////////////////////////////////
                               FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    /**
     * @notice  Create a new transaction
     * @param   amount  The amount of USDC to be transferred
     */
    function createTransaction(uint256 amount) external {
        require(s_usdcToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        uint256 newTransactionId = s_transactionCount;
        s_transactions[newTransactionId] = Transaction({
            buyer: msg.sender,
            amount: amount,
            timestamp: block.timestamp,
            isDisputed: false,
            isResolved: false
        });

        emit TransactionCreated(newTransactionId, msg.sender, amount);
        s_transactionCount++;
    }

    /**
     * @notice  Dispute a transaction
     * @param   transactionId  The ID of the transaction to dispute
     * @notice  Buyer can open a dispute
     */
    function disputeTransaction(uint256 transactionId) external {
        Transaction storage transaction = s_transactions[transactionId];
        require(msg.sender == transaction.buyer, "Only buyer can dispute");
        require(block.timestamp <= transaction.timestamp + DISPUTE_PERIOD, "Dispute period ended");
        require(!transaction.isDisputed, "Already disputed");

        require(s_usdcToken.transferFrom(msg.sender, address(this), DISPUTE_FEE), "Dispute fee transfer failed");

        transaction.isDisputed = true;

        emit TransactionDisputed(transactionId);
    }

    /**
     * @notice  Resolve a disputed transaction
     * @param   transactionId  The ID of the disputed transaction
     * @param   buyerWon  Whether the buyer won the dispute
     */
    function resolveDispute(uint256 transactionId, bool buyerWon) external onlyRole(MODERATOR_ROLE) {
        Transaction storage transaction = s_transactions[transactionId];
        require(transaction.isDisputed, "Transaction not disputed");
        require(!transaction.isResolved, "Dispute already resolved");

        transaction.isResolved = true;

        if (buyerWon) {
            require(s_usdcToken.transfer(transaction.buyer, transaction.amount), "Refund to buyer failed");
        } else {
            require(s_usdcToken.transfer(i_merchant, transaction.amount), "Transfer to merchant failed");
        }

        // The DISPUTE_FEE is always kept by the contract

        emit DisputeResolved(transactionId, buyerWon);
    }

    /**
     * @notice  Release payment for a non-disputed transaction after the dispute period
     * @param   transactionId  The ID of the transaction
     */
    function releasePayment(uint256 transactionId) external onlyRole(MERCHANT_ROLE) {
        Transaction storage transaction = s_transactions[transactionId];
        require(!transaction.isDisputed, "Transaction is disputed");
        require(block.timestamp > transaction.timestamp + DISPUTE_PERIOD, "Dispute period not ended");

        require(s_usdcToken.transfer(i_merchant, transaction.amount), "Transfer failed");

        emit PaymentReleased(transactionId, transaction.amount);
    }

    /**
     * @notice  Withdraw accumulated fees (dispute fees)
     * @param   amount  The amount of USDC to withdraw
     */
    function withdrawFees(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(amount <= s_usdcToken.balanceOf(address(this)), "Insufficient balance");
        require(s_usdcToken.transfer(msg.sender, amount), "Transfer failed");
        emit FeesWithdrawn(msg.sender, amount);
    }

    /**
     * @notice  Get all transaction IDs for the merchant
     * @return  uint256[]  An array of transaction IDs
     */
    function getMerchantTransactions() external view returns (uint256[] memory) {
        uint256[] memory merchantTxIds = new uint256[](s_transactionCount);
        for (uint256 i = 0; i < s_transactionCount; i++) {
            merchantTxIds[i] = i;
        }
        return merchantTxIds;
    }
}
