"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CopyIcon, EditIcon, CheckIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// In a real application, you would fetch this data from an API or database
const merchantData = {
  name: "EthGlobal Demo Merchant Account",
  email: "contact@ethglobal.com",
  contractAddress: "0xF8d56ca172a99CD17B9aaE9de3b84C2a851A3202",
  createdAt: "2024-09-21",
  chain: ["Sepolia", "Base", "Arbitrum", "Hedera"],
};

export function MerchantProfileComponent() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({ ...merchantData });
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);

        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  // Function to determine the color of the chain badge
  const getChainColor = (chain: string) => {
    switch (chain.toLowerCase()) {
      case "sepolia":
        return "bg-blue-600";
      case "polygon":
        return "bg-purple-500";
      case "binance smart chain":
        return "bg-yellow-500";
      case "base":
        return "bg-blue-700";
      case "arbitrum":
        return "bg-blue-500";
      case "hedera":
        return "bg-black";
      default:
        return "bg-gray-500";
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log("Submitting edited data:", editedData);
    // Update the merchantData (in a real app, this would be handled by state management or API)
    Object.assign(merchantData, editedData);
    setIsEditModalOpen(false);
  };

  return (
    <div className="container mx-auto py-8 px-5">
      <h1 className="text-3xl font-bold mb-8">{merchantData.name}</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Smart Contract Payment Account</CardTitle>
            <CardDescription>Your on-chain account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Contract Address</Label>
              <div className="flex items-center mt-1">
                <code className="bg-muted px-2 py-1 rounded text-sm flex-1 truncate">
                  {merchantData.contractAddress}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(merchantData.contractAddress)}
                  aria-label="Copy contract address"
                >
                  {isCopied ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Blockchain Networks</Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {merchantData.chain.map((chain) => (
                  <Badge
                    key={chain}
                    className={`${getChainColor(chain)} text-white`}
                  >
                    {chain}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Merchant Information</CardTitle>
            <CardDescription>Your business details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="mt-1">{merchantData.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Account Created</Label>
              <p className="mt-1">{merchantData.createdAt}</p>
            </div>
          </CardContent>
          <Separator className="my-4" />
          <CardFooter>
            <Button className="w-full" onClick={() => setIsEditModalOpen(true)}>
              <EditIcon className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </CardFooter>
        </Card>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Merchant Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedData.email}
                    onChange={(e) =>
                      setEditedData({ ...editedData, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
