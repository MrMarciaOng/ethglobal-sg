"use client";

import { useState } from "react";
import {
  useAccount,
  useContractWrite,
  WagmiProvider,
  createConfig,
  http,
} from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { parseEther } from "viem";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  XCircle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Mock data for demonstration purposes
const mockTransactions = [
  {
    id: "0x123...abc",
    date: "2023-06-01 14:30",
    buyer: "User123",
    amount: "0.5",
    status: "Pending",
  },
  {
    id: "0x456...def",
    date: "2023-06-02 09:15",
    buyer: "User456",
    amount: "1.2",
    status: "Claimable",
  },
  {
    id: "0x789...ghi",
    date: "2023-06-03 16:45",
    buyer: "User789",
    amount: "0.8",
    status: "Disputed",
  },
  {
    id: "0xabc...123",
    date: "2023-06-04 11:00",
    buyer: "User321",
    amount: "2.0",
    status: "Completed",
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

function MerchantDashboardContent() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { address } = useAccount();

  // Replace with your actual contract details
  const {
    write: claimFunds,
    isLoading,
    isSuccess,
    isError,
  } = useContractWrite({
    address: "0x...",
    abi: [],
    functionName: "claimFunds",
  });

  const handleClaimFunds = (transactionId) => {
    claimFunds({ args: [transactionId] });
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedTransaction(null);
  };

  if (isSuccess) {
    toast({
      title: "Funds Claimed Successfully",
      description:
        "The transaction has been processed and the funds have been transferred to your wallet.",
    });
    closeDialog();
  }

  if (isError) {
    toast({
      title: "Error Claiming Funds",
      description:
        "There was an error processing your claim. Please try again or contact support.",
      variant: "destructive",
    });
  }

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
            <TableHead>Amount (ETH)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-mono">{transaction.id}</TableCell>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.buyer}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={statusColors[transaction.status]}
                >
                  {statusIcons[transaction.status]}
                  <span className="ml-1">{transaction.status}</span>
                </Badge>
              </TableCell>
              <TableCell>
                {transaction.status === "Claimable" && (
                  <Button
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setIsDialogOpen(true);
                    }}
                  >
                    Claim Funds
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
                <TooltipTrigger>
                  <Badge variant="outline" className={statusColors[status]}>
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
              Amount: {selectedTransaction?.amount} ETH
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              onClick={() => handleClaimFunds(selectedTransaction?.id)}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Claim"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getStatusDescription(status) {
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
