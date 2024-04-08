import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../services/utils";

const ModalHeader = ({ children, className }) => {
  return (
    <Dialog.Title
      className={cn(
        "bg-dark text-white py-4 px-4 text-2xl font-semibold rounded-t-lg flex gap-4 justify-between items-center",
        className
      )}
    >
      {children}
    </Dialog.Title>
  );
};

const ModalContent = ({ children, className }) => {
  return (
    <div
      className={cn("bg-white text-black py-6 px-6 rounded-b-lg", className)}
    >
      {children}
    </div>
  );
};

const Modal = ({ show, onClose, children }) => {
  return (
    <AnimatePresence>
      {show && (
        <Dialog
          onClose={() => onClose()}
          open={show}
          className={"relative z-50"}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                type: "spring",
                bounce: 0.6,
                duration: 0.5,
                opacity: { bounce: 0 },
              },
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 overflow-y-auto"
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="drop-shadow max-w-[95vw]">
                {children}
              </Dialog.Panel>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default Modal;

export { Modal, ModalHeader, ModalContent };
