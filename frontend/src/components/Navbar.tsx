"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; 

export default function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.firstName || "");
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <nav className="w-full bg-black text-white p-4 flex justify-between items-center">
      <Link href="/">
        <span className="text-lg font-bold cursor-pointer">Ticket Booking</span>
      </Link>
      <div className="flex items-center gap-4">
        {username && <span>Hello, {username}</span>}
        <Button onClick={handleLogout} variant="destructive">
          Logout
        </Button>
      </div>
    </nav>
  );
}
