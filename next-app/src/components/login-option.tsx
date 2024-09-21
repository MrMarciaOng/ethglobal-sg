"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Store, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function EnhancedLoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginType, setLoginType] = useState<"demo" | "merchant" | null>(null);
  const router = useRouter();

  const handleLogin = (type: "demo" | "merchant") => {
    setLoggingIn(true);
    setLoginType(type);
    
    // Simulate login process
    setTimeout(() => {
      setIsOpen(false);
      setLoggingIn(false);
      if (type === "demo") {
        router.push('/user');
      } else {
        router.push('/merchant');
      }
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="inline-flex text-lg items-center justify-center rounded-md bg-gradient-to-r from-[#00b894] to-[#55efc4] px-6 py-3 text-base font-medium text-white hover:text-white shadow transition-all duration-200 ease-in-out hover:from-[#00a785] hover:to-[#4de6b5] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Launch App
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-w-full bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-4xl font-bold text-center mb-8 text-gray-800">
            {loggingIn ? "Logging In" : "Choose Login Type"}
          </DialogTitle>
        </DialogHeader>
        {loggingIn ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-16 w-16 animate-spin text-[#00b894] mb-4" />
            <p className="text-xl text-gray-600 text-center">
              {loginType === "demo" 
                ? "Logging in with demo user address 0x102B...661e" 
                : "Logging in with merchant address 0xB2ED8...8484"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-6">
            <LoginOption
              icon={<User size={60} />}
              title="Demo User"
              description="Try out our platform with a demo account"
              onClick={() => handleLogin("demo")}
            />
            <LoginOption
              icon={<Store size={60} />}
              title="Demo Merchant Account"
              description="Access your business dashboard"
              onClick={() => handleLogin("merchant")}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Fix the lint issue by adding type annotations
function LoginOption({ 
  icon, 
  title, 
  description, 
  onClick 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Button
        variant="outline"
        className="
          w-full h-auto min-h-[16rem] py-8 flex flex-col items-center justify-center space-y-4
          bg-gradient-to-r from-[#00b894] to-[#55efc4]
          hover:from-[#00a884] hover:to-[#4de0b3]
          border-2 border-[#00b894]
          text-white hover:text-gray-100
          shadow-lg rounded-lg transition-colors duration-300
        "
        onClick={onClick}
      >
        <div className="text-5xl mb-3">{icon}</div>
        <div className="text-2xl font-bold text-center px-3">{title}</div>
        <div className="text-base opacity-90 text-center px-6 whitespace-normal">
          {description}
        </div>
      </Button>
    </motion.div>
  );
}
