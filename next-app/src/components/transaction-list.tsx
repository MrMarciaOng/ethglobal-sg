"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useContractWrite,
  WagmiProvider,
  createConfig,
  http,
} from "wagmi";
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
import { toast } from "@/components/ui/use-toast";

// Function to generate a random date within the last 3 days
function getRandomRecentDate() {
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  return new Date(
    threeDaysAgo.getTime() +
      Math.random() * (now.getTime() - threeDaysAgo.getTime())
  );
}

// Function to format date as "YYYY-MM-DD HH:mm"
function formatDate(date: Date) {
  return date.toISOString().slice(0, 16).replace("T", " ");
}

// Function to generate a random wallet address
function generateRandomWalletAddress() {
  return `0x${Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("")}`;
}

// Generate random mock transactions
// const mockTransactions = Array.from({ length: 10 }, (_, index) => {
//   const statuses = ["Pending", "Claimable", "Disputed", "Completed"];
//   const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
//   const randomAmount = (Math.random() * 100 + 10).toFixed(2);
//   const randomDate = getRandomRecentDate();

//   return {
//     id: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random()
//       .toString(16)
//       .slice(2, 5)}`,
//     date: formatDate(randomDate),
//     buyer: generateRandomWalletAddress(),
//     amount: randomAmount,
//     status: randomStatus,
//   };
// });
const mockTransactions = [
  {
    id: "0x51774388...3f9",
    date: "2024-09-21 03:04",
    buyer: "0x8603b59f2bac4cdb1bf9d844d9008cacf1659d72",
    amount: "40.26",
    status: "Claimable",
  },
  {
    id: "0xd0201874...f5a",
    date: "2024-09-19 06:54",
    buyer: "0x8d0649a99fcd566411fe3ebaa809511bf3bdef22",
    amount: "91.69",
    status: "Pending",
  },
  {
    id: "0xdcb56143...8f8",
    date: "2024-09-21 08:32",
    buyer: "0x1c6a7d30b72fef2a09d5f9bf55c23af8c7d07f91",
    amount: "68.88",
    status: "Disputed",
  },
  {
    id: "0xd0709338...b16",
    date: "2024-09-20 02:52",
    buyer: "0x0bc452858b6dc54b3c2592d7a1505cfe7559fbd9",
    amount: "90.66",
    status: "Pending",
  },
  {
    id: "0xb5ff0e92...91d",
    date: "2024-09-19 11:23",
    buyer: "0x782e0cfd4534f47b8864b66068cc8c81b3487f51",
    amount: "81.76",
    status: "Pending",
  },
  {
    id: "0x9b9b93d3...b11",
    date: "2024-09-19 12:11",
    buyer: "0xf29d01986fecc7610ca12462f2d4479af455eee0",
    amount: "33.63",
    status: "Claimable",
  },
  {
    id: "0xf34bc324...aab",
    date: "2024-09-18 18:31",
    buyer: "0x71ab8586b73623d1d5c98fedeaa78662695e7270",
    amount: "53.08",
    status: "Claimable",
  },
  {
    id: "0x63c48def...ce0",
    date: "2024-09-20 16:18",
    buyer: "0x064b713552eb6b974e533c62f9d7c9c982fbf14e",
    amount: "24.74",
    status: "Disputed",
  },
  {
    id: "0xd0d734da...6e6",
    date: "2024-09-21 02:35",
    buyer: "0x492bc465177de2ebf430d5d51be57a350c87e0d8",
    amount: "51.97",
    status: "Pending",
  },
  {
    id: "0x442cdff5...1a0",
    date: "2024-09-18 22:53",
    buyer: "0xd33e58855c44dc0663c1e5ebac3e74fbe859df95",
    amount: "72.64",
    status: "Claimable",
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
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { address: _address } = useAccount();

  // Replace with your actual contract details
  const {
    writeAsync: claimFunds,
    isLoading,
    isSuccess,
    isError,
  } = useContractWrite({
    address: "0x..." as `0x${string}`,
    abi: [] as const,
    functionName: "claimFunds",
  });

  const handleClaimFunds = async (transactionId: string) => {
    try {
      await claimFunds({ args: [transactionId] });
    } catch (error) {
      console.error("Error claiming funds:", error);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedTransaction(null);
  };

  useEffect(() => {
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
  }, [isSuccess, isError, closeDialog]);

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
          {mockTransactions.map((transaction) => (
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
