export default function DashbardMainPage() {
  return (
    <div className="flex flex-row h-full bg-slate-100">
      <div className="flex flex-col gap-4 w-full bg-white p-8 rounded-r-3xl shadow-lg max-h-screen sticky top-0">
        <h2 className="font-bold text-2xl text-slate-700">Schedule</h2>
        <div className="flex flex-row w-full h-72 gap-2">
          <div className="border border-slate-200 rounded-md bg-white w-full h-full"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-full"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-full"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-full"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-full"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-full"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-full"></div>
        </div>
      </div>
      <div className="w-1/3 p-8 flex flex-col gap-4">
        <h2 className="font-bold text-2xl text-slate-700">History</h2>
        <div className="flex flex-col w-full gap-4">
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
          <div className="border border-slate-200 bg-white rounded-md w-full h-36"></div>
        </div>
      </div>
    </div>
  );
}
