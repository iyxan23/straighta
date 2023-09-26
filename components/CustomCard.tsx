import React from 'react';

const CustomCard = ({
  children,
  className,
  hoverable,
}: {
  children?: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}) => {
  return (
    <div
      className={`border border-slate-200 bg-white rounded-md w-full select-none ${className} ${
        hoverable && 'hover:bg-gray-100 transition-colors cursor-pointer'
      }`}
    >
      {children}
    </div>
  );
};

export default CustomCard;
