import LinkButton from "@/app/components/LinkButton";

export default function StudyPage() {
  return (
    <main className="h-screen w-screen bg-sky-500 flex flex-col justify-around items-center">
      <div className="flex flex-col gap-4 items-center w-2/3">
        <h2 className="text-3xl tracking-wide text-white opacity-75 font-semibold">
          Fokus
        </h2>
        <h2 className="text-4xl tracking-tight text-white font-semibold text-center">
          Menghitung Tambah-tambahan
        </h2>
      </div>

      <div className="flex flex-col gap-2 items-center">
        <h2 className="text-9xl text-white font-bold tracking-widest">12:34</h2>
        <h2 className="text-2xl text-white opacity-75 tracking-wide">
          Belajar
        </h2>
      </div>

      <div className="flex flex-row gap-4">
        <LinkButton text="Selesai" href="/dashboard" />
        <LinkButton text="Istirahat" href="/dashboard" />
      </div>
    </main>
  );
}
