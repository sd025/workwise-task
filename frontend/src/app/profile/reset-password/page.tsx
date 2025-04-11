"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "@/app/libs/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = passwordSchema.safeParse(formData);
    if (!result.success) {
      const errorMessages = result.error.errors.map(err => err.message).join(", ");
      toast.error(errorMessages);
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.put("/user/resetpassword", formData);
      toast.success(data.message);
      setLoading(false);
      router.push("/profile");
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Password reset failed");
    }
  };

  if (loading)
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      </>
    );

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 w-full"
                />
              </div>
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
