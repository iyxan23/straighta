'use client';

import React, { useEffect, useState } from 'react';
import { CustomButton, CustomForm } from '@/components';
import PlusIcon from 'mdi-react/PlusIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import CustomCard from '@/components/CustomCard';
import Link from 'next/link';

interface SubjectItem {
  id: string;
  content: string;
}

export default function QuestionsPage() {
  const [subjectContent, setSubjectContent] = useState<string>('');
  const [subjectList, setSubjectList] = useState<Array<SubjectItem>>([]);

  useEffect(() => {});

  return (
    <CustomForm>
      <h2 className='text-4xl font-bold text-slate-700'>
        Sedang belajar apa saja?
      </h2>
      <fieldset className='flex mt-8'>
        <input
          type='text'
          className='py-2 px-4 rounded-l-md w-full focus:outline-none focus:ring focus:ring-sky-200'
          placeholder='IPA, IPS, PPKn'
          onChange={(e) => setSubjectContent(e.target.value)}
          value={subjectContent}
        />
        <button
          className='py-2 px-4 rounded-r-md hover:bg-sky-400 bg-sky-500 h-full flex items-center focus:outline-none focus:ring focus:ring-sky-200 active:bg-sky-600 active:scale-95 transition-all'
          onClick={() => {
            setSubjectList([
              ...subjectList,
              {
                id: new Date().toString(),
                content: subjectContent,
              },
            ]);
            setSubjectContent('');
          }}
        >
          <PlusIcon
            size={24}
            className='fill-white'
          />
        </button>
      </fieldset>
      <ul className='text-slate-700 space-y-2 mt-4'>
        {subjectList.map((item, index) => (
          <li
            key={index}
            className=''
          >
            <CustomCard
              className='w-full p-4 flex justify-between items-center'
              hoverable
            >
              <span className=''>{item.content}</span>
              <CustomButton
                className='bg-rose-500 text-slate-50 p-1 rounded-md hover:bg-rose-400 active:bg-rose-600'
                type='button'
                onClick={() => {
                  setSubjectList([
                    ...subjectList.filter((list) => list.id !== item.id),
                  ]);
                  setSubjectContent('');
                }}
              >
                <CloseIcon />
              </CustomButton>
            </CustomCard>
          </li>
        ))}
      </ul>
      <Link
        href={''}
        className='px-4 py-2 bg-violet-500 text-slate-50 mt-12 block rounded-md ml-auto w-fit'
      >
        NEXT
      </Link>
    </CustomForm>
  );
}
