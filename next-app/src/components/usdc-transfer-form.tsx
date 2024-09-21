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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { CheckCircle2 } from "lucide-react";

export function UsdcTransferForm() {
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(`Successfully transferred ${amount} USDC to ${merchant}`);
      // Reset form fields
      setMerchant("");
      setAmount("");
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    }, 2000);
  };

  return (
    <div className="container mx-auto py-8 px-5">
      <Card className="w-[687.5px]">
        {" "}
        {/* Increased from 550px to 687.5px (25% increase) */}
        <CardHeader>
          <CardTitle>Transfer USDC</CardTitle>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              {successMessage}
            </div>
          )}
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
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!merchant || !amount || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Transfer"
            )}
          </Button>
        </CardFooter>
        <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Transfer</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to transfer {amount} USDC to {merchant}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
}
