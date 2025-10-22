

import { Suspense } from "react";
import BookingSuccessContent from "../../components/bookindSuccessContent";
import { Card } from "@/components/base/card";

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container max-w-2xl mx-auto px-4">
            <Card className="p-8 text-center">
              <div className="animate-pulse">
                <div className="h-16 w-16 bg-gray-300 rounded-full mx-auto mb-6"></div>
                <div className="h-8 bg-gray-300 rounded mb-4 w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-300 rounded mb-6 w-1/2 mx-auto"></div>
                <div className="h-48 bg-gray-300 rounded mb-6"></div>
                <div className="h-10 bg-gray-300 rounded w-48 mx-auto"></div>
              </div>
            </Card>
          </div>
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}
