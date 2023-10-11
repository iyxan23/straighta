import { CustomCard, CustomForm } from "@/components";
import React from "react";

const MateriPage = () => {
  return (
    <div>
      <h3 className="font-medium text-slate-700 text-2xl text-center">
        Seberapa sering belajar
      </h3>
      <div className="flex flex-col gap-5 justify-center mt-12">
        {Array.from({ length: 2 }).map((_, index) => (
          <CustomCard key={index} className="p-4 w-96">
            <h4 className="text-xl">Bahasa Indonesia</h4>
            <p className="mt-4">Membuat puisi</p>
            <p className="mt-4">Membuat makalah</p>
            <p className="mt-4">Membuat skripsi</p>
            <CustomForm className="mt-4 flex w-full justify-between gap-2">
              <input
                type="text"
                className="border rounded-md px-2 py-1 w-full"
              />
              <button
                type="submit"
                className="bg-blue-700 text-white px-8 rounded-md hover:bg-blue-600"
              >
                T
              </button>
            </CustomForm>
          </CustomCard>
        ))}
      </div>
    </div>
  );
};

export default MateriPage;
