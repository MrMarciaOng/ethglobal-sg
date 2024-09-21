/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Add ERC20 ABI for allowance and approve functions
const erc20Abi = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) public returns (bool)',
];

export async function POST(request: Request) {
  try {
    console.log('Receive transfer request from frontend');
    const { amount } = await request.json();
    console.log(amount)
    if (amount === undefined || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'A valid amount is required.' }, { status: 400 });
    }

    const privateKey = process.env.CLIENT_KEY;
    if (!privateKey) {
      return NextResponse.json({ error: 'Client key not configured.' }, { status: 500 });
    }

    const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/duUfPIm7dDzbShP1Z4Zs2tYCH8uHQuwN');
    const wallet = new ethers.Wallet(privateKey, provider);

    // Initialize USDC contract
    const usdcAddress = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
    const usdcContract = new ethers.Contract(usdcAddress, erc20Abi, wallet);

    // Spender address
    const spenderAddress = '0xF8d56ca172a99CD17B9aaE9de3b84C2a851A3202';

    // Check current allowance
    const currentAllowance = await usdcContract.allowance(wallet.address, spenderAddress);
    console.log(`Current USDC allowance: ${currentAllowance.toString()}`);

    // If allowance is zero, approve infinite allowance
    if (currentAllowance === 0) {
      console.log('Allowance is zero. Approving infinite allowance...');
      const approveTx = await usdcContract.approve(spenderAddress, ethers.MaxUint256);
      console.log(`Approve transaction sent. Hash: ${approveTx.hash}`);
      await approveTx.wait();
      console.log('Infinite allowance approved.');
    } else {
      console.log('Sufficient allowance already set.');
    }

    // Proceed with creating the transaction
    const contractAddress = '0xF8d56ca172a99CD17B9aaE9de3b84C2a851A3202';
    const abi = [
      'function createTransaction(uint256 amount) public',
      'event TransactionCreated(uint256 indexed transactionId, address indexed buyer, uint256 amount)',
    ];
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    console.log(`Client initiating transfer of ${amount} USDC`);

    const formattedAmount = ethers.parseUnits(amount.toString(), 6); // USDC has 6 decimals
    const tx = await contract.createTransaction(formattedAmount);
    console.log(`Transaction sent. Hash: ${tx.hash}`);

    let receipt = await tx.wait();
    console.log(`Transaction confirmed. Block Number: ${receipt.blockNumber}`);
    receipt = await provider.getTransactionReceipt(tx.hash);
    // Find the TransactionCreated event
    const event = receipt.logs?.find(
      (log: any) => log.topics[0] == '0xfd27d176b6ebb21e0182c0e43df5818e0d632867e1eb47c383c58d221205fce3'
    );
    console.log(event)
    if (!event) {
      throw new Error('TransactionCreated event not found.');
    }

    const transactionIdBigNumber = ethers.getBigInt(event.topics[1]);
    console.log(`Transaction ID extracted: ${transactionIdBigNumber}`);

    return NextResponse.json({
      success: true,
      txHash: tx.hash,
      transactionId: transactionIdBigNumber.toString(),
    });
  } catch (error: any) {
    console.error('Error in /api/transfer:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}