"use client";

import ArrowUp from "mdi-react/ArrowUpIcon";
import ArrowRight from "mdi-react/ArrowRightIcon";
import CloseIcon from "mdi-react/CloseIcon";
import { CustomCard } from "@/components";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closeStudyHistoryModal } from "@/redux/features/studyHistoryModalSlice";
import { motion } from "framer-motion";
import Modal from "@/components/Modal";

export default function StudyHistoryModal() {
  const modalOpen = useAppSelector((state) => state.studyHistoryModal.visible);
  const id = useAppSelector((state) => state.studyHistoryModal.id);

  const dispatch = useAppDispatch();

  return (
    modalOpen && (
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ ease: "easeInOut" }}
        key={"studyModal"}
        className="z-50 fixed top-0 bottom-0 w-screen h-screen bg-black bg-opacity-10 backdrop-blur-sm flex justify-center items-center"
      >
        <Modal className='overflow-y-scroll max-h-96'>
          <hgroup className="flex items-center justify-between w-full">
            <h3 className="font-bold text-2xl case text-slate-700">
              Study History-{id}
            </h3>
            <button
              className="bg-rose-500 hover:bg-rose-500/70 text-white rounded-md p-[2px]"
              onClick={() => dispatch(closeStudyHistoryModal())}
            >
              <CloseIcon />
            </button>
          </hgroup>
          <p className="text-slate-400">Nama subjek</p>
          <ul className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index} className="relative flex gap-2">
                <div className="">
                  {index === 0 ? (
                    <>
                      <div className="w-4 h-4 aspect-square rounded-full bg-sky-400 mt-1" />
                      <div className="w-4 h-4 aspect-square rounded-full bg-sky-200 absolute top-1 -z-10 animate-ping" />
                    </>
                  ) : (
                    <div className="w-4 h-4 aspect-square rounded-full bg-neutral-200 mt-1" />
                  )}
                  <div className="bg-neutral-300 w-[2px] h-full mx-auto" />
                </div>
                <CustomCard className="p-4 flex-1 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">08:03 - 09:15</p>
                    <p>Waktu belajar: 47 menit</p>
                    <p>Waktu istirahat: 10 menit</p>
                  </div>
                  <div className="inline-flex items-center">
                    <span className="text-xl font-bold text-rose-500">64</span>{" "}
                    <ArrowRight className="mx-2 stroke-current" />{" "}
                    <span className="text-xl font-semibold text-amber-500">
                      84
                    </span>{" "}
                    <span className="ml-4 inline-flex items-center text-emerald-500 gap-1">
                      30% <ArrowUp className="stroke-emerald-500" size={16} />
                    </span>
                  </div>
                </CustomCard>
              </li>
            ))}
          </ul>
        </Modal>
      </motion.div>
    )
  );
}
