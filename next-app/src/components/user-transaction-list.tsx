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

const mockUserTransactions = [
  {
    id: "0x51774388...3f9",
    date: "2024-09-21 03:04",
    merchant: "0x102B2aEEc94384fe4A0F8f1A2d7FCc40E4B3661e",
    amount: "40.26",
    status: "Completed",
    userPerspective: "buyer",
  },
  {
    id: "0xd0201874...f5a",
    date: "2024-09-19 06:54",
    merchant: "0x9B9Ba98A7859B8A20287bC2f03890f19B9C1b2B7",
    amount: "91.69",
    status: "Pending",
    userPerspective: "buyer",
  },
  {
    id: "0xdcb56143...8f8",
    date: "2024-09-21 08:32",
    merchant: "0x1c6a7d30b72fef2a09d5f9bf55c23af8c7d07f91",
    amount: "68.88",
    status: "Disputed",
    disputeEndDate: "2024-09-28 03:04",
    disputeAmount: "30.00",
    userPerspective: "buyer",
  },
  // Add more user transactions here...
];

const statusIcons = {
  Pending: <Clock className="h-4 w-4 text-yellow-500" />,
  Completed: <CheckCircle2 className="h-4 w-4 text-blue-500" />,
  Disputed: <AlertCircle className="h-4 w-4 text-red-500" />,
};

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Completed: "bg-blue-100 text-blue-800",
  Disputed: "bg-red-100 text-red-800",
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
  merchant: string;
  amount: string;
  status: string;
};

function UserDashboardContent() {
  const [transactions, setTransactions] = useState(mockUserTransactions);
  const [selectedDisputeTransaction, setSelectedDisputeTransaction] =
    useState<Transaction | null>(null);
  const [isDisputeChatOpen, setIsDisputeChatOpen] = useState(false);

  const openDisputeChat = (transaction: Transaction) => {
    setSelectedDisputeTransaction(transaction);
    setIsDisputeChatOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Transaction Dashboard</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Date and Time</TableHead>
            <TableHead>Merchant</TableHead>
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
              <TableCell>{transaction.merchant}</TableCell>
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
                {transaction.status === "Disputed" && (
                  <Button
                    variant="secondary"
                    className="w-full md:w-32"
                    onClick={() => openDisputeChat(transaction)}
                  >
                    Open Dispute Chat
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

      <Dialog open={isDisputeChatOpen} onOpenChange={setIsDisputeChatOpen}>
        <DialogContent className="max-w-4xl">
          {selectedDisputeTransaction && (
            <DisputeChatComponent
              messages={[]}
              transactionId={selectedDisputeTransaction.id}
              disputeEndDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)} // Set dispute end date to 7 days from now
              userPerspective="user"
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
    case "Completed":
      return "Transaction has been successfully completed.";
    case "Disputed":
      return "There is an ongoing dispute for this transaction.";
    default:
      return "Unknown status";
  }
}

export function UserTransactionsListComponent() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <UserDashboardContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
