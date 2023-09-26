'use client';

const CustomForm = ({ children }: { children: React.ReactNode }) => {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className='w-1/3 flex flex-row items-center border rounded-full border-slate-200'
    >
      {children}
    </form>
  );
};

export default CustomForm;
