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
import { User, Store } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function EnhancedLoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogin = (type: "demo" | "merchant") => {
    // Implement login logic here
    console.log(`Logging in as ${type}`);
    setIsOpen(false);
    
    // Redirect based on login type
    if (type === "demo") {
      router.push('/user');
    } else {
      router.push('/merchant');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="inline-flex text-lg items-center justify-center rounded-md bg-gradient-to-r from-[#00b894] to-[#55efc4] px-4 py-2 text-sm font-medium text-white hover:text-white shadow transition-all duration-200 ease-in-out hover:from-[#00a785] hover:to-[#4de6b5] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Launch App
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-w-full bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-6 text-gray-800">
            Choose Login Type
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
          <LoginOption
            icon={<User size={40} />}
            title="Demo User"
            description="Try out our platform with a demo account"
            onClick={() => handleLogin("demo")}
          />
          <LoginOption
            icon={<Store size={40} />}
            title="Demo Merchant Account"
            description="Access your business dashboard"
            onClick={() => handleLogin("merchant")}
          />
        </div>
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
          w-full h-auto min-h-[12rem] py-6 flex flex-col items-center justify-center space-y-3
          bg-gradient-to-r from-[#00b894] to-[#55efc4]
          hover:from-[#00a884] hover:to-[#4de0b3]
          border-2 border-[#00b894]
          text-white hover:text-gray-100
          shadow-lg rounded-lg transition-colors duration-300
        "
        onClick={onClick}
      >
        <div className="text-4xl mb-2">{icon}</div>
        <div className="text-xl font-bold text-center px-2">{title}</div>
        <div className="text-sm opacity-90 text-center px-4 whitespace-normal">
          {description}
        </div>
      </Button>
    </motion.div>
  );
}
