import { CustomCard } from "@/components";
import React from "react";

const BelajarPage = () => {
  return (
    <div>
      <h3 className="font-medium text-slate-700 text-2xl text-center">
        Seberapa sering belajar
      </h3>
      <div className='flex flex-wrap gap-5 justify-center mt-12'>
        {Array.from({ length: 5 }).map((_, index) => (
          <CustomCard key={index} className="p-4 w-1/4" hoverable>
            <h4 className="text-xl">Cukup</h4>
            <p className="mt-4">Lorem ipsum dolor sit amet.</p>
          </CustomCard>
        ))}
      </div>
    </div>
  );
};

export default BelajarPage;
