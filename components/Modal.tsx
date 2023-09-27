// pesan buat bang bani:
//   mending pakai context g sih? nanti biar state Modal di simpen secara global
//   jadi nanti kita tinggal panggil function di client component
//   untuk nampilin modal. nah trus ada callback or something gitu.
export default function Modal({
  title,
  description,
  buttons,
}: {
  title: string;
  description: string;
  buttons: () => JSX.Element;
}) {
  return (
    <div className="z-20 rounded-lg shadow-md flex flex-col p-6 gap-2 bg-white">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      <p className="text-slate-700">{description}</p>
      <div className="flex flex-row p-2">{buttons()}</div>
    </div>
  );
}
