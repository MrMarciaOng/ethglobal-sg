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

    function disputeTransaction() external {}

    function resolveDispute() external {}

    function releasePayment() external {}

    function withdrawFees() external {}
}
