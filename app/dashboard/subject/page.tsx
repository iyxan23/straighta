import SearchIcon from "mdi-react/SearchIcon";

export default function SubjectPage() {
  return (
    <div className="h-full p-8 bg-slate-100 overflow-y-scroll flex flex-col items-center">
      <h1 className="text-3xl font-bold text-slate-700">Materials</h1>
      <div className="flex flex-col items-center w-screen">
        <div className="sticky -top-8 flex flex-col items-center p-8 w-full bg-slate-100">
          <div className="w-1/3 flex flex-row items-center border rounded-full border-slate-200">
            <input
              type="text"
              className="py-2 px-4 rounded-l-full w-full focus:outline-none focus:ring focus:ring-sky-200"
            />
            <button className="py-2 px-6 rounded-r-full group hover:bg-sky-400 bg-sky-500 h-full flex items-center focus:outline-none focus:ring focus:ring-sky-200 active:bg-sky-600 active:scale-95 transition-all">
              <SearchIcon size={24} className="fill-white" />
            </button>
          </div>
        </div>
        <div className="flex flex-col w-2/3 gap-4">
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
          <div className="border border-slate-200 rounded-md bg-white w-full h-36 hover:bg-gray-100 transition-colors cursor-pointer"></div>
        </div>
      </div>
    </div>
  );
}
