"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/app/libs/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

export default function SeatDetailPage() {
  const { seatId } = useParams();
  const router = useRouter();
  const [seat, setSeat] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seatId) {
      fetchSeat();
    }
  }, [seatId]);

  const fetchSeat = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/seats/${seatId}`);
      setSeat(data.seat);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to fetch seat details");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Loading...
      </div>
    );

  if (!seat)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <p>Seat not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Back
          </Button>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Seat Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>Seat Number:</strong> {seat.seat_number}
            </p>
            <p>
              <strong>Row Number:</strong> {seat.row_number}
            </p>
            <p>
              <strong>Status:</strong> {seat.status}
            </p>
            <Button onClick={() => router.back()} className="mt-4">
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
