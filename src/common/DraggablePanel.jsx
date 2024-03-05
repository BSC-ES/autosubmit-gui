import { useDragControls, motion, AnimatePresence } from "framer-motion"
import { cn } from "../services/utils"



export default function DraggablePanel({ title, dragConstraints, children, className, show, onClose }) {
  const dragControl = useDragControls()

  const startDrag = (e) => {
    e.preventDefault()
    dragControl.start(e)
  }

  return (
    <>
      <AnimatePresence>
        {
          show &&
          <motion.div
            initial={{ scale: 0, opacity: 0}}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            drag
            dragElastic={0.05}
            whileDrag={{ scale: 0.95 }}
            dragConstraints={dragConstraints}
            dragControls={dragControl}
            dragMomentum={false}
            dragListener={false}
            className={cn("drop-shadow-lg fixed max-w-[90vw] w-[28rem]", className)}>

            <div
              onPointerDown={startDrag}
              className="bg-dark text-white rounded-t-2xl px-6 py-2 flex justify-between items-center cursor-move">
              <div className="font-bold">{title}</div>
              {
                onClose &&
                <div className="cursor-pointer" onClick={onClose}>
                  <i className="fa-solid fa-xmark"></i>
                </div>
              }
            </div>

            <div className="px-6 py-4 bg-white text-black rounded-b-2xl">
              {children}
            </div>
            
          </motion.div>
        }
      </AnimatePresence>

    </>

  )
}