// src/app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "@/app/libs/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  country: z.string().optional(),
  email: z.string().email("Invalid email format"),
  contact: z.string().optional(),
});

export default function ProfilePage() {
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    email: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch user details when component mounts
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const { data } = await api.get("/user");
        setFormData({
          firstName: data.user.firstname || "",
          lastName: data.user.lastname || "",
          country: data.user.country || "",
          email: data.user.email || "",
          contact: data.user.contact || "",
        });
        // Also store user details in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(data.user));
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        toast.error(error.response?.data?.message || "Failed to fetch user details");
      }
    }

    if (token) {
      fetchUser();
    } else {
      router.push("/auth/login");
    }
  }, [token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const errorMessages = result.error.errors.map(err => err.message).join(", ");
      toast.error(errorMessages);
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.put("/user", formData);
      toast.success(data.message);
      localStorage.setItem("user", JSON.stringify(data.user));
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 w-full"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 w-full"
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="mt-1 w-full"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full"
              />
            </div>
            <div>
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="mt-1 w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
