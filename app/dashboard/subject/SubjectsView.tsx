"use client";

import CallbackButton from "@/components/CallbackButton";
import Modal from "@/components/Modal";
import { closeModal } from "@/redux/features/newSubjectModalVisibilitySlice";
import { setQuery } from "@/redux/features/querySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import SubjectItems from "./SubjectItems";
import SubjectItemSearch from "./SubjectItemSearch";

export default function SubjectsView() {
  const query = useAppSelector((state) => state.query.query);
  const modalOpen = useAppSelector(
    (state) => state.newSubjectModalVisibility.visible
  );
  const dispatch = useAppDispatch();

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
            title={"hello world"}
            description={"bruhadhaskdasdasjdlkkjdkas"}
            buttons={() => (
              <>
                <CallbackButton
                  text="deez"
                  onClick={() => dispatch(closeModal())}
                />
              </>
            )}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
