export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center gap-4 min-h-[calc(100vh-200px)]">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
      </div>
      <div className="text-left">
        <h3 className="text-xl font-bold text-foreground">Loading...</h3>
        <p className="text-sm text-muted-foreground">Please wait while we load your listings</p>
      </div>
    </div>
  );
}
