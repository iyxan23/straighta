import React from 'react'
import ClientButton from './client/private/ClientButton'

type ButtonType = 'reset' | 'button' | 'submit';

interface CustomButtonProps {
  type?: ButtonType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children?: React.ReactNode
}

const CustomButton = ({ children, ...props }: CustomButtonProps) => {
  return (
    <ClientButton {...props}>
      {children}
    </ClientButton>
  )
}

export default CustomButton