import { LoaderCircle } from "lucide-react";

export default function AuthLoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        {/* Enhanced Loading Animation */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            {/* Outer ring */}
            <div className=" w-20 h-20 rounded-full border-0 border-accent animate-pulse"></div>
            {/* Inner spinning circle */}
            <div className="absolute inset-2 flex items-center justify-center">
              <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
            </div>
            {/* Pulsing dots around the circle */}
          </div>

          {/* Dynamic Loading Text */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-foreground animate-fade-in">Loading</h2>
            <p className="text-muted-foreground text-sm animate-fade-in">Checking Facebook Authentication</p>
          </div>
        </div>
      </div>
    </div>
  );
}
