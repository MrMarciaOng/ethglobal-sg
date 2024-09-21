/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export function UsdcTransferForm() {
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [transferTxHash, setTransferTxHash] = useState<string | null>(null);
  const [transferTransactionId, setTransferTransactionId] = useState<string | null>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [transferErrorMessage, setTransferErrorMessage] = useState<string | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!merchant || !amount) {
        throw new Error("Please select a merchant and enter an amount.");
      }

      const transferAmount = parseFloat(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        throw new Error("Please enter a valid amount.");
      }

      setIsLoading(true);
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: transferAmount }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTransferTxHash(data.txHash);
        setTransferTransactionId(data.transactionId);
        setIsSuccessDialogOpen(true);
      } else {
        throw new Error(data.error || 'Transfer failed.');
      }
    } catch (error: any) {
      console.error('Error during transfer:', error);
      setTransferErrorMessage(error.message || 'Transfer failed.');
      setIsErrorDialogOpen(true);
    } finally {
      setIsLoading(false);
      setAmount("");
      setMerchant("");
    }
  };

  return (
    <div className="container mx-auto py-8 px-5">
      <Card className="w-[687.5px]">
        <CardHeader>
          <CardTitle>Transfer USDC</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="merchant">Merchant</Label>
                <Select value={merchant} onValueChange={setMerchant}>
                  <SelectTrigger id="merchant">
                    <SelectValue placeholder="Select merchant" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="0xB2ED87074E123d1EF6bf1cB2949076baf5498484">Demo Merchant 1 (0xB2ED87074E123d1EF6bf1cB2949076baf5498484)</SelectItem>
                    <SelectItem value="0xB2ED87074E123d1EF6bf1cB2949076baf5498484">Demo Merchant 2 (0xB2ED87074E123d1EF6bf1cB2949076baf5498484)</SelectItem>
                    <SelectItem value="0xB2ED87074E123d1EF6bf1cB2949076baf5498484">Demo Merchant 3 (0xB2ED87074E123d1EF6bf1cB2949076baf5498484)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Amount (USDC)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="any"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => { /* Optional: handle cancel */ }}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!merchant || !amount || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Transfer"
            )}
          </Button>
        </CardFooter>

        <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transfer Successful</DialogTitle>
              <DialogDescription>
                Your transfer has been successfully processed.
                <br />
                Transaction Hash: {transferTxHash}
                <br />
                Transaction ID: {transferTransactionId}
                <br />
                <a
                  href={`https://sepolia.etherscan.io/tx/${transferTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View on Sepolia Etherscan
                </a>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => {
                  setIsSuccessDialogOpen(false);
                  setTransferTxHash(null);
                  setTransferTransactionId(null);
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transfer Failed</DialogTitle>
              <DialogDescription>
                There was an error processing your transfer.
                <br />
                Error: {transferErrorMessage}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => {
                  setIsErrorDialogOpen(false);
                  setTransferErrorMessage(null);
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
