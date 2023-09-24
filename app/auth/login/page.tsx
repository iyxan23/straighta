import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="overflow-hidden bg-slate-200 h-screen w-screen flex justify-center items-center">
      <section className="px-8 py-6 bg-white rounded-lg shadow-md flex flex-col gap-6">
        <h1 className="text-2xl text-slate-700 font-bold">Login</h1>
        <LoginForm />
      </section>
    </main>
  );
}
