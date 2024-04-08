import { forwardRef } from "react";
import { cn } from "../services/utils";

const TableCell = forwardRef(({ className, ...props }, ref) => {
  return (
    <td
      className={cn(
        "p-2 text-nowrap border-t border-b border-neutral-200",
        className
      )}
      {...props}
    />
  );
});

const Table = forwardRef(({ className, ...props }, ref) => {
  return <table className={cn("caption-bottom", className)} {...props} />;
});

export { Table, TableCell };
