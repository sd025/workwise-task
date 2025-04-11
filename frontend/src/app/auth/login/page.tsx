"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import toast from "react-hot-toast";
import api, { setAuthToken } from "@/app/libs/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const errorMessages = result.error.errors.map((err) => err.message).join(", ");
      toast.error(errorMessages);
      return;
    }

    try {
      const { data } = await api.post("/auth/login", formData);
      toast.success(data.message);
      setAuthToken(data.token);
      localStorage.setItem("token", data.token);
      router.push("/booking");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="block mb-2">
                Email
              </Label>
              <Input 
                id="email" 
                name="email" 
                placeholder="Enter your email" 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>
            <div className="relative">
              <Label htmlFor="password" className="block mb-2">
                Password
              </Label>
              <Input 
                type={showPassword ? "text" : "password"}
                id="password" 
                name="password" 
                placeholder="Enter your password" 
                value={formData.password} 
                onChange={handleChange} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 p-5 mt-5 flex items-center text-gray-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-blue-500 underline">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
