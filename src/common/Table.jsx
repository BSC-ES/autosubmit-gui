import { forwardRef } from "react";
import { cn } from "../services/utils";

const Table = forwardRef(({ className, ...props }, ref) => {
  return (
    <table className={cn("caption-bottom w-full", className)} {...props} />
  );
});

const TableHead = forwardRef(({ className, ...props }, ref) => {
  return <thead className={cn("", className)} {...props} />;
});

const TableHeader = forwardRef(({ className, ...props }, ref) => {
  return <th className={cn("p-2 text-left", className)} {...props} />;
});

const TableBody = forwardRef(({ className, ...props }, ref) => {
  return <tbody className={cn("", className)} {...props} />;
});

const TableRow = forwardRef(({ className, ...props }, ref) => {
  return <tr className={cn("", className)} {...props} />;
});

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

export { Table, TableHead, TableHeader, TableBody, TableRow, TableCell };
