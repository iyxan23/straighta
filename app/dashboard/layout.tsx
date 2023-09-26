import React from 'react';
import Navigation from '../../components/client/Navigation';
import BottomButtonsBar from './BottomButtonsBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-screen max-h-screen w-screen flex flex-col'>
      {children}
      <header className='relative h-20 z-10 w-full bg-white shadow-lg border-slate-200 border-t-2 flex flex-row justify-between py-3 px-4'>
        <div className='flex items-center gap-4 w-full'>
          <div className='bg-black rounded-full h-full aspect-square' />
          <div>
            <strong>Nur Ihsan Al Ghifari</strong>
            <p className='opacity-50 text-sm'>What in the world</p>
          </div>
        </div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <BottomButtonsBar />
        </div>
        <Navigation />
      </header>
    </div>
  );
}
