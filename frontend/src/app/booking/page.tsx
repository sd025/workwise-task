"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "@/app/libs/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const bookingSchema = z.object({
  numberOfSeats: z
    .string()
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 1 && num <= 7;
    }, { message: "Enter a valid number between 1 and 7" }),
});

export default function BookingPage() {
  const [seats, setSeats] = useState<any[]>([]);
  const [numberOfSeats, setNumberOfSeats] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Polling interval (in milliseconds)
  const POLL_INTERVAL = 5000;

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
    } else {
      fetchSeats();
      // Set up polling every POLL_INTERVAL ms
      const intervalId = setInterval(() => {
        fetchSeats();
      }, POLL_INTERVAL);

      // Clean up the interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [token, router]);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/seats");
      setSeats(data.seats);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to fetch seats");
    }
  };

  const handleBookSeats = async () => {
    const result = bookingSchema.safeParse({ numberOfSeats });
    if (!result.success) {
      const errorMessages = result.error.errors.map(e => e.message).join(", ");
      toast.error(errorMessages);
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.post("/booking/book", { numOfSeats: numberOfSeats });
      toast.success(data.message);
      setNumberOfSeats("");
      fetchSeats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      const { data } = await api.delete("/booking/cancel");
      toast.success(data.message);
      fetchSeats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Cancellation failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Seat Grid */}
          <div className="grid grid-cols-7 gap-2">
            {seats.length === 0 ? (
              <p className="col-span-7 text-center">No seats available</p>
            ) : (
              seats.map((seat) => (
                <div
                  key={seat.id}
                  className={`border text-center py-2 rounded ${
                    seat.status === "available" ? "bg-green-400" : "bg-red-400"
                  }`}
                >
                  {seat.seat_number}
                </div>
              ))
            )}
          </div>
          {/* Booking Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Book Seats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="number"
                placeholder="Enter number of seats..."
                value={numberOfSeats}
                onChange={(e) => setNumberOfSeats(e.target.value)}
                className="w-full"
              />
              <Button onClick={handleBookSeats} className="w-full">
                Book
              </Button>
              <Button variant="secondary" onClick={handleReset} className="w-full">
                Reset Booking
              </Button>
              <div className="mt-4 flex justify-between text-sm">
                <p>
                  Booked Seats:{" "}
                  <span className="font-semibold">
                    {seats.filter((s) => s.status !== "available").length}
                  </span>
                </p>
                <p>
                  Available Seats:{" "}
                  <span className="font-semibold">
                    {seats.filter((s) => s.status === "available").length}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
