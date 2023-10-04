"use client";

import CallbackButton from "@/components/CallbackButton";
import Modal from "@/components/Modal";
import {
  closeStartStudyModal,
  finishStartStudyModal,
  setStartStudyModalMaterialId,
} from "@/redux/features/startStudyModalSlice";
import { startStudySession } from "@/redux/features/studySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useListAllMaterialsQuery } from "@/redux/services/materialApi";
import { useCreateStudySessionMutation } from "@/redux/services/studyApi";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StudyModal() {
  const modalOpen = useAppSelector((state) => state.startStudyModal.visible);
  const selectedMaterialId = useAppSelector(
    (state) => state.startStudyModal.selectedMaterialId,
  );

  const dispatch = useAppDispatch();
  const { data, error } = useListAllMaterialsQuery({ limit: 99, offset: 0 });
  const { push } = useRouter();

  const [
    createStudySession,
    { data: studySessionData, error: studySessionError },
  ] = useCreateStudySessionMutation();

  useEffect(() => {
    if (studySessionData && selectedMaterialId && !studySessionError) {
      dispatch(
        startStudySession({
          studySessionId: studySessionData.id,
          materialId: selectedMaterialId,
          start: new Date().getTime(),
        }),
      );
      push("/dashboard/study");
      dispatch(finishStartStudyModal());
    }
  }, [studySessionData, dispatch, push, selectedMaterialId, studySessionError]);

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
          {error ? (
            <>Error: {error}</>
          ) : studySessionError ? (
            <>Error ketika membuat sesi belajar: {error}</>
          ) : !data ? (
            <Modal>
              <p className="animate-pulse">Loading...</p>
            </Modal>
          ) : (
            <Modal>
              <h2 className="text-xl font-bold text-slate-700">
                Mulai belajar
              </h2>
              <p>Pilih materi untuk dipelajari</p>
              {data ? (
                <select
                  onChange={(ev) => {
                    dispatch(
                      setStartStudyModalMaterialId(Number(ev.target.value)),
                    );
                  }}
                  value={selectedMaterialId}
                >
                  {data.map((s) => (
                    <option value={s.id} key={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-slate-700 animate-pulse">Loading</p>
              )}
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

                    createStudySession({
                      materialId: selectedMaterialId,
                      score: 85, // todo: ask the user
                    });
                  }}
                />
              </div>
            </Modal>
          )}
        </motion.div>
      )}
    </>
  );
}
