// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract PaymentGateway is AccessControl {
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
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event TransactionCreated(uint256 indexed transactionId, address buyer, uint256 amount);
    event TransactionDisputed(uint256 indexed transactionId);
    event DisputeResolved(uint256 indexed transactionId, bool buyerWon);
    event PaymentReleased(uint256 indexed transactionId, uint256 amount);
    event FeesWithdrawn(address indexed admin, uint256 amount);

    constructor(address _usdcTokenAddress, address[] memory _moderators, address _merchant) {
        s_usdcToken = IERC20(_usdcTokenAddress);
        i_merchant = _merchant;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MERCHANT_ROLE, _merchant);

        for (uint256 i = 0; i < _moderators.length; i++) {
            _grantRole(MODERATOR_ROLE, _moderators[i]);
        }
    }

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

    function disputeTransaction(uint256 transactionId) external {
        Transaction storage transaction = s_transactions[transactionId];
        require(msg.sender == transaction.buyer, "Only buyer can dispute");
        require(block.timestamp <= transaction.timestamp + DISPUTE_PERIOD, "Dispute period ended");
        require(!transaction.isDisputed, "Already disputed");

        require(s_usdcToken.transferFrom(msg.sender, address(this), DISPUTE_FEE), "Dispute fee transfer failed");

        transaction.isDisputed = true;

        emit TransactionDisputed(transactionId);
    }

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

    function releasePayment(uint256 transactionId) external onlyRole(MERCHANT_ROLE) {
        Transaction storage transaction = s_transactions[transactionId];
        require(!transaction.isDisputed, "Transaction is disputed");
        require(block.timestamp > transaction.timestamp + DISPUTE_PERIOD, "Dispute period not ended");

        require(s_usdcToken.transfer(i_merchant, transaction.amount), "Transfer failed");

        emit PaymentReleased(transactionId, transaction.amount);
    }

    function withdrawFees(uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(amount <= s_usdcToken.balanceOf(address(this)), "Insufficient balance");
        require(s_usdcToken.transfer(msg.sender, amount), "Transfer failed");
        emit FeesWithdrawn(msg.sender, amount);
    }

    function getMerchantTransactions() external view returns (uint256[] memory) {
        uint256[] memory merchantTxIds = new uint256[](s_transactionCount);
        for (uint256 i = 0; i < s_transactionCount; i++) {
            merchantTxIds[i] = i;
        }
        return merchantTxIds;
    }
}
