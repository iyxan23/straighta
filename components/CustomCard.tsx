import React from "react";

const CustomCard = React.forwardRef<
  HTMLDivElement,
  {
    children?: React.ReactNode;
    className?: string;
    hoverable?: boolean;
  }
>(({ children, className, hoverable }, ref) => {
  return (
    <div
      ref={ref}
      className={`border border-slate-200 bg-white rounded-md w-full select-none ${className} ${
        hoverable && "hover:bg-gray-100 transition-colors cursor-pointer"
      }`}
    >
      {children}
    </div>
  );
});

// apparently using React.forwardRef will remove its displayName
CustomCard.displayName = "Custom Card";

export default CustomCard;
