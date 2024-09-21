/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { DisputeChatComponent } from "./dispute-chat";

const mockTransactions = [
  {
    id: "0x51774388...3f9",
    date: "2024-09-21 03:04",
    buyer: "0x102B2aEEc94384fe4A0F8f1A2d7FCc40E4B3661e",
    amount: "40.26",
    status: "Claimable",
    userPerspective: "merchant",
  },
  {
    id: "0xd0201874...f5a",
    date: "2024-09-19 06:54",
    buyer: "0x9B9Ba98A7859B8A20287bC2f03890f19B9C1b2B7",
    amount: "91.69",
    status: "Pending",
    userPerspective: "merchant",
  },
  {
    id: "0xdcb56143...8f8",
    date: "2024-09-21 08:32",
    buyer: "0x1c6a7d30b72fef2a09d5f9bf55c23af8c7d07f91",
    amount: "68.88",
    status: "Disputed",
    disputeEndDate: "2024-09-28 03:04",
    disputeAmount: "30.00",
    userPerspective: "merchant",
  },
  {
    id: "0xd0709338...b16",
    date: "2024-09-20 02:52",
    buyer: "0x0bc452858b6dc54b3c2592d7a1505cfe7559fbd9",
    amount: "90.66",
    status: "Pending",
    userPerspective: "merchant",
  },
  {
    id: "0xb5ff0e92...91d",
    date: "2024-09-19 11:23",
    buyer: "0x102B2aEEc94384fe4A0F8f1A2d7FCc40E4B3661e",
    amount: "81.76",
    status: "Pending",
    userPerspective: "merchant",
  },
  {
    id: "0x9b9b93d3...b11",
    date: "2024-09-19 12:11",
    buyer: "0xf29d01986fecc7610ca12462f2d4479af455eee0",
    amount: "33.63",
    status: "Claimable",
    userPerspective: "merchant",
  },
  {
    id: "0xf34bc324...aab",
    date: "2024-09-18 18:31",
    buyer: "0x71ab8586b73623d1d5c98fedeaa78662695e7270",
    amount: "53.08",
    status: "Claimable",
    userPerspective: "merchant",
  },
  {
    id: "0x63c48def...ce0",
    date: "2024-09-20 16:18",
    buyer: "0x064b713552eb6b974e533c62f9d7c9c982fbf14e",
    amount: "24.74",
    status: "Disputed",
    disputeEndDate: "2024-09-27 03:04",
    disputeAmount: "10.00",
    userPerspective: "merchant",
  },
  {
    id: "0xd0d734da...6e6",
    date: "2024-09-21 02:35",
    buyer: "0x492bc465177de2ebf430d5d51be57a350c87e0d8",
    amount: "51.97",
    status: "Pending",
    userPerspective: "merchant",
  },
  {
    id: "0x442cdff5...1a0",
    date: "2024-09-18 22:53",
    buyer: "0xd33e58855c44dc0663c1e5ebac3e74fbe859df95",
    amount: "72.64",
    status: "Claimable",
    userPerspective: "merchant",
  },
];

const statusIcons = {
  Pending: <Clock className="h-4 w-4 text-yellow-500" />,
  Claimable: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  Disputed: <AlertCircle className="h-4 w-4 text-red-500" />,
  Completed: <CheckCircle2 className="h-4 w-4 text-blue-500" />,
};

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Claimable: "bg-green-100 text-green-800",
  Disputed: "bg-red-100 text-red-800",
  Completed: "bg-blue-100 text-blue-800",
};

// Create a Wagmi config
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

// Create a react-query client
const queryClient = new QueryClient();

type Transaction = {
  id: string;
  date: string;
  buyer: string;
  amount: string;
  status: string;
};

function MerchantDashboardContent() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDisputeChatOpen, setIsDisputeChatOpen] = useState(false);
  const [selectedDisputeTransaction, setSelectedDisputeTransaction] =
    useState<Transaction | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const mockClaimFunds = async (transactionId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call or blockchain interaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(`Claiming funds for transaction ${transactionId}`);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error claiming funds:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimFunds = async (transactionId: string) => {
    try {
      await mockClaimFunds(transactionId);
    } catch (error) {
      console.error("Error claiming funds:", error);
      // Show an error toast here if needed
    } finally {
      // Update the transaction status to "Completed"
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === transactionId
            ? { ...transaction, status: "Completed" }
            : transaction
        )
      );
      // Close the dialog
      closeDialog();
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedTransaction(null);
  };

  const openDisputeChat = (transaction: Transaction) => {
    setSelectedDisputeTransaction(transaction);
    setIsDisputeChatOpen(true);
  };

  // useEffect(() => {
  //   if (isSuccess) {
  //     toast({
  //       title: "Funds Claimed Successfully",
  //       description:
  //         "The transaction has been processed and the funds have been transferred to your wallet.",
  //     });
  //   }

  //   if (isError) {
  //     toast({
  //       title: "Error Claiming Funds",
  //       description:
  //         "There was an error processing your claim. Please try again or contact support.",
  //       variant: "destructive",
  //     });
  //   }
  // }, [isSuccess, isError]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Merchant Transaction Dashboard
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Date and Time</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Amount (USDC)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-mono">{transaction.id}</TableCell>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.buyer}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    statusColors[
                      transaction.status as keyof typeof statusColors
                    ]
                  }
                >
                  {statusIcons[transaction.status as keyof typeof statusIcons]}
                  <span className="ml-1">{transaction.status}</span>
                </Badge>
              </TableCell>
              <TableCell>
                {transaction.status === "Claimable" && (
                  <Button
                    className="w-full md:w-32"
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setIsDialogOpen(true);
                    }}
                  >
                    Claim Funds
                  </Button>
                )}
                {transaction.status === "Disputed" && (
                  <Button
                    variant="secondary"
                    className="w-full md:w-32"
                    onClick={() => openDisputeChat(transaction)}
                  >
                    Open Chat
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Status Legend</h2>
        <div className="flex space-x-4">
          {Object.entries(statusIcons).map(([status, icon]) => (
            <TooltipProvider key={status}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className={
                      statusColors[status as keyof typeof statusColors]
                    }
                  >
                    {icon}
                    <span className="ml-1">{status}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getStatusDescription(status)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Claim Funds Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to claim the funds for this transaction?
              <br />
              Transaction ID: {selectedTransaction?.id}
              <br />
              Amount: {selectedTransaction?.amount} USDC
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedTransaction?.id) {
                  handleClaimFunds(selectedTransaction.id);
                }
              }}
              disabled={isLoading || !selectedTransaction?.id}
            >
              {isLoading ? "Processing..." : "Confirm Claim"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDisputeChatOpen} onOpenChange={setIsDisputeChatOpen}>
        <DialogContent className="max-w-4xl">
          {selectedDisputeTransaction && (
            <DisputeChatComponent
              messages={[]}
              transactionId={selectedDisputeTransaction.id}
              disputeEndDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)} // Set dispute end date to 7 days from now
              userPerspective="merchant"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getStatusDescription(status: string) {
  switch (status) {
    case "Pending":
      return "Transaction is being processed and awaiting confirmation.";
    case "Claimable":
      return "Funds are available to be claimed by the merchant.";
    case "Disputed":
      return "There is an ongoing dispute for this transaction.";
    case "Completed":
      return "Transaction has been successfully completed and funds have been claimed.";
    default:
      return "Unknown status";
  }
}

export function MerchantTransactionsListComponent() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MerchantDashboardContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
