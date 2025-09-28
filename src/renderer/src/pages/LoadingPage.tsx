import { LoaderCircle } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Loading Spinner */}
        <div className="flex justify-center">
          <LoaderCircle className="h-12 w-12 animate-spin text-gray-300" />
        </div>

        {/* Loading Text */}
        <div>
          <h2 className="text-xl font-medium text-foreground">Loading</h2>
        </div>
      </div>
    </div>
  );
}
