'use client';

const CustomForm = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`${className} select-none`}
    >
      {children}
    </form>
  );
};

export default CustomForm;
