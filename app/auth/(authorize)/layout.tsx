export default function AuthorizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='overflow-hidden bg-slate-200 h-screen w-screen flex justify-center items-center'>
      {children}
    </main>
  );
}
