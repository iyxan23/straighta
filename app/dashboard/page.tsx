import { CustomCard } from '@/components';

export default function DashbardMainPage() {
  return (
    <div className='flex flex-row h-[calc(100%-70px)] bg-slate-100'>
      <div className='flex flex-col gap-4 w-full bg-white p-8 rounded-r-3xl shadow-lg max-h-full sticky top-0'>
        <h2 className='font-bold text-2xl text-slate-700'>Schedule</h2>
        <div className='flex flex-row w-full h-72 gap-2'>
          {Array.from({ length: 7 }).map((_, index) => (
            <CustomCard key={index} className='h-full' hoverable />
          ))}
        </div>
      </div>
      <div className='w-1/3 p-8 h-full overflow-y-scroll max-h-full'>
        <h2 className='font-bold text-2xl text-slate-700 mb-4'>History</h2>
        <div className='flex flex-col w-full gap-4'>
          {Array.from({ length: 17 }).map((_, index) => (
            <CustomCard key={index} className='h-36' hoverable />
          ))}
        </div>
      </div>
    </div>
  );
}
