// pesan buat bang bani:
//   mending pakai context g sih? nanti biar state Modal di simpen secara global
//   jadi nanti kita tinggal panggil function di client component
//   untuk nampilin modal. nah trus ada callback or something gitu.
export default function Modal({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="z-20 rounded-lg shadow-md flex flex-col p-6 gap-2 bg-white max-w-lg">
      {children}
    </div>
  );
}
