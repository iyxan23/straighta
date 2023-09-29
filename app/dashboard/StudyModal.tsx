"use client";

import CallbackButton from "@/components/CallbackButton";
import Modal from "@/components/Modal";
import {
  closeStartStudyModal,
  finishStartStudyModal,
} from "@/redux/features/startStudyModalSlice";
import { startStudySession } from "@/redux/features/studySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useListSubjectsQuery } from "@/redux/services/subjectApi";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function StudyModal() {
  const modalOpen = useAppSelector((state) => state.startStudyModal.visible);
  const selectedMaterialId = useAppSelector(
    (state) => state.startStudyModal.selectedMaterialId
  );

  const dispatch = useAppDispatch();
  // const { data } = useListSubjectsQuery({ limit: 99, offset: 0 });
  const { push } = useRouter();

  return (
    <>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ ease: "easeInOut" }}
          key={"studyModal"}
          className="z-50 fixed top-0 bottom-0 w-screen h-screen bg-black bg-opacity-10 backdrop-blur-sm flex justify-center items-center"
        >
          <Modal
            content={() => (
              <>
                <h2 className="text-xl font-bold text-slate-700">
                  Mulai belajar
                </h2>
                <p>Pilih materi untuk dipelajari</p>
                <select>
                  <option value=""></option>
                </select>
                <div className="flex flex-row gap-2 justify-end">
                  <CallbackButton
                    text="Close"
                    size="md"
                    className="bg-red-500 hover:bg-red-400 active:bg-red-700 focus:ring-red-200"
                    onClick={() => dispatch(closeStartStudyModal())}
                  />
                  <CallbackButton
                    text="Ok"
                    size="md"
                    onClick={() => {
                      if (!selectedMaterialId) {
                        return;
                      }

                      dispatch(
                        startStudySession({
                          materialId: selectedMaterialId,
                          startDate: new Date(),
                        })
                      );
                      push("/dashboard/study");
                      dispatch(finishStartStudyModal());
                    }}
                  />
                </div>
              </>
            )}
          />
        </motion.div>
      )}
    </>
  );
}
