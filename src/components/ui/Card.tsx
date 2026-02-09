import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
