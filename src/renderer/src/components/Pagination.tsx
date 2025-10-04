import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function Pagination({ currentPage, totalPages, onNextPage, onPreviousPage, hasNextPage, hasPreviousPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button size={"icon"} onClick={onPreviousPage} disabled={!hasPreviousPage}>
        <ArrowLeft />
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <Button size={"icon"} onClick={onNextPage} disabled={!hasNextPage}>
        <ArrowRight />
      </Button>
    </div>
  );
}
