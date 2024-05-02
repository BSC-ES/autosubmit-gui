import { forwardRef } from "react";
import { cn } from "../services/utils";

const Table = forwardRef(({ className, ...props }, ref) => {
  return (
    <table
      ref={ref}
      className={cn("caption-bottom w-full", className)}
      {...props}
    />
  );
});

const TableHead = forwardRef(({ className, ...props }, ref) => {
  return <thead ref={ref} className={cn("", className)} {...props} />;
});

const TableHeader = forwardRef(({ className, ...props }, ref) => {
  return <th ref={ref} className={cn("p-2 text-left", className)} {...props} />;
});

const TableBody = forwardRef(({ className, ...props }, ref) => {
  return <tbody ref={ref} className={cn("", className)} {...props} />;
});

const TableRow = forwardRef(({ className, ...props }, ref) => {
  return <tr ref={ref} className={cn("", className)} {...props} />;
});

const TableCell = forwardRef(({ className, ...props }, ref) => {
  return (
    <td
      ref={ref}
      className={cn("p-2 border-t border-b border-neutral-200", className)}
      {...props}
    />
  );
});

export { Table, TableHead, TableHeader, TableBody, TableRow, TableCell };
