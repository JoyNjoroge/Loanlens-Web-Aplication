import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ResultCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

const ResultCard = ({
  title,
  icon: Icon,
  children,
  className,
  variant = "default",
}: ResultCardProps) => {
  const variantStyles = {
    default: "border-border",
    success: "border-success/30 bg-success/5",
    warning: "border-warning/30 bg-warning/5",
    destructive: "border-destructive/30 bg-destructive/5",
  };

  const iconStyles = {
    default: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    destructive: "text-destructive bg-destructive/10",
  };

  return (
    <div
      className={cn(
        "bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow duration-300",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              iconStyles[variant]
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
};

export default ResultCard;
