'use client';

import React from 'react';

type ButtonType = 'reset' | 'button' | 'submit';

interface ClientButtonProps {
  type?: ButtonType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children?: React.ReactNode;
}

const ClientButton = ({ children, ...props }: ClientButtonProps) => {
  return <button {...props}>{children}</button>;
};

export default ClientButton;
