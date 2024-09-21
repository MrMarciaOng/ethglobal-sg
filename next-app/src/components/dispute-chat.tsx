"use client";

import { useState, useEffect } from "react";
import { PaperclipIcon, SendIcon, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Message = {
  id: number;
  sender: "user" | "merchant";
  content: string;
  timestamp: string;
};

const dummyMessages: Message[] = [
  {
    id: 1,
    sender: "user",
    content: "Hello, I have an issue with my order.",
    timestamp: "2023-04-01 10:00 AM",
  },
  {
    id: 2,
    sender: "merchant",
    content: "I'm sorry to hear that. Can you please provide more details?",
    timestamp: "2023-04-01 10:05 AM",
  },
  {
    id: 3,
    sender: "user",
    content: "The product I received is damaged.",
    timestamp: "2023-04-01 10:10 AM",
  },
];

interface DisputeChatProps {
  transactionId: string;
  disputeEndDate?: Date;
  messages: Message[];
  onSendMessage?: (content: string, sender: "user" | "merchant") => void;
  userPerspective: "user" | "merchant";
}

export function DisputeChatComponent({
  transactionId,
  disputeEndDate,
  messages = dummyMessages,
  onSendMessage,
  userPerspective,
}: DisputeChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const [localMessages, setLocalMessages] = useState(messages);
  //if message is empty, set it to dummyMessages
  useEffect(() => {
    if (messages.length === 0) {
      setLocalMessages(dummyMessages);
    }
  }, [messages]);
  const formatDate = (date: Date | undefined) => {
    if (!date) return "No end date set";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: localMessages.length + 1,
        sender: userPerspective,
        content: newMessage.trim(),
        timestamp: new Date().toLocaleString(),
      };
      setLocalMessages([...localMessages, newMsg]);
      onSendMessage?.call(undefined, newMessage.trim(), userPerspective);
      setNewMessage("");
    }
  };

  const isDisputeEnded = disputeEndDate ? new Date() > disputeEndDate : false;

  return (
    <Card className="w-full max-w-4xl mx-auto mt-4">
      {" "}
      {/* Added mt-8 for top margin */}
      <CardHeader className="bg-primary text-primary-foreground p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <h2 className="text-3xl font-bold">
            Dispute Chat ({userPerspective === "user" ? "Customer" : "Merchant"}
            )
          </h2>
          <div className="text-lg">
            <div className="font-semibold">
              Transaction ID: #{transactionId}
            </div>
            <div className="flex items-center mt-2">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Ends: {formatDate(disputeEndDate)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isDisputeEnded && (
          <Alert variant="destructive" className="m-6">
            <AlertTitle className="text-lg">Dispute Ended</AlertTitle>
            <AlertDescription className="text-base">
              The time limit for this dispute has expired.
            </AlertDescription>
          </Alert>
        )}
        <ScrollArea className="h-[600px] p-6">
          {localMessages.map((message) => (
            <div
              key={message.id}
              className={`mb-6 ${
                message.sender === userPerspective ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-4 rounded-lg max-w-[80%] ${
                  message.sender === userPerspective
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-lg mb-2">{message.content}</p>
                <span className="text-sm opacity-70">{message.timestamp}</span>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-6 border-t">
        <div className="flex items-center space-x-4 w-full">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isDisputeEnded}
            className="text-lg p-6"
          />
          <Button
            size="lg"
            variant="outline"
            className="shrink-0"
            disabled={isDisputeEnded}
          >
            <PaperclipIcon className="h-6 w-6" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Button
            size="lg"
            onClick={handleSendMessage}
            className="shrink-0"
            disabled={isDisputeEnded}
          >
            <SendIcon className="h-6 w-6" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
