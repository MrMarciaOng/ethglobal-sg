import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

export async function POST(request: Request) {
  try {
    console.log('Receive request from frontend');
    const { transactionId } = await request.json();

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const privateKey = process.env.MERCHANT_KEY;
    if (!privateKey) {
      return NextResponse.json({ error: 'Merchant key not configured' }, { status: 500 });
    }

    const provider = ethers.getDefaultProvider("sepolia");
    const wallet = new ethers.Wallet(privateKey, provider);

    const contractAddress = '0xF8d56ca172a99CD17B9aaE9de3b84C2a851A3202';
    const abi = [
      'function claimTransaction(string id) public',
    ];
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    console.log(`MErchant claiming transaction with transaction id ${transactionId}`)
    const tx = await contract.claimTransaction(transactionId);
    await tx.wait();

    return NextResponse.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error('Error in /api/claimFunds:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}