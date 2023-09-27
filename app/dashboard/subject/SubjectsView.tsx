"use client";

import CallbackButton from "@/components/CallbackButton";
import Modal from "@/components/Modal";
import {
  closeNewSubjectModal,
  finishNewSubjectModal,
  setSubjectMaterials,
  setSubjectName,
} from "@/redux/features/newSubjectModalSlice";
import { setQuery } from "@/redux/features/querySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCreateSubjectMutation } from "@/redux/services/subjectApi";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import SubjectItems from "./SubjectItems";
import SubjectItemSearch from "./SubjectItemSearch";

export default function SubjectsView() {
  const query = useAppSelector((state) => state.query.query);
  const newSubjectName = useAppSelector(
    (state) => state.newSubjectModal.newSubjectName
  );
  const newSubjectMaterials = useAppSelector(
    (state) => state.newSubjectModal.subjectMaterials
  );
  const modalOpen = useAppSelector((state) => state.newSubjectModal.visible);
  const dispatch = useAppDispatch();

  const [createSubject, { isLoading: createSubjectLoading }] =
    useCreateSubjectMutation();
  return (
    <AnimatePresence>
      <div className="flex flex-col items-center w-screen">
        <div className="sticky -top-8 flex flex-col items-center p-8 w-full bg-slate-100">
          <SubjectItemSearch
            query={query ?? ""}
            onSearch={(query) => {
              dispatch(setQuery(query));
            }}
            onChange={(query) => {
              dispatch(setQuery(query));
            }}
          />
        </div>
        <div className="flex flex-col w-2/3 gap-4 mb-8">
          {createSubjectLoading && <>Membuat subjek {newSubjectName}...</>}
          <SubjectItems />
        </div>
      </div>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ ease: "easeInOut" }}
          key={"modal"}
          className="z-20 fixed top-0 bottom-0 w-screen h-screen bg-black bg-opacity-10 backdrop-blur-sm flex justify-center items-center"
        >
          <Modal
            content={() => (
              <>
                <h2 className="text-xl font-bold text-slate-700">
                  Buat pembelajaran baru
                </h2>
                <p>Nama pembelajaran:</p>
                <input
                  value={newSubjectName}
                  onChange={(ev) => dispatch(setSubjectName(ev.target.value))}
                  className="border"
                  type="text"
                />
                <p>Materi-materi pembelajaran tersebut:</p>
                <input
                  value={newSubjectMaterials}
                  onChange={(ev) =>
                    dispatch(setSubjectMaterials(ev.target.value))
                  }
                  className="border"
                  type="text"
                />
                <p className="text-sm opacity-50">
                  (pisah menggunakan koma (,))
                </p>
                <div className="flex flex-row gap-2 justify-end">
                  <CallbackButton
                    text="Close"
                    size="md"
                    className="bg-red-500 hover:bg-red-400 active:bg-red-700 focus:ring-red-200"
                    onClick={() => dispatch(closeNewSubjectModal())}
                  />
                  <CallbackButton
                    text="OK"
                    size="md"
                    onClick={() => {
                      createSubject({
                        title: newSubjectName,
                        materials:
                          newSubjectMaterials.trim().length !== 0
                            ? newSubjectMaterials.trim().split(",")
                            : undefined,
                      });
                      dispatch(finishNewSubjectModal());
                    }}
                  />
                </div>
              </>
            )}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
