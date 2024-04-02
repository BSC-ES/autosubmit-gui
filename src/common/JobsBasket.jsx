import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from 'react';
import { STATUS_STYLES, cn, getStatusBadgeStyle } from '../services/utils';
import Modal from './Modal';
import { commandGeneratorGraph, statusChangeTextGeneratorGraph } from '../components/context/utils';
import { useCopyToClipboard } from '@uidotdev/usehooks';



function CommandGeneratorModal({ expid, selectedJobs, show, onHide }) {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [targetStatus, setTargetStatus] = useState("READY");
  const [type, setType] = useState("cmd");
  const [copied, setCopied] = useState("");

  const jobNames = useMemo(() => {
    return selectedJobs.map(j => j.name)
  }, [selectedJobs])

  const handleCopy = () => {
    let content = ""
    if (type === "cmd") {
      content = commandGeneratorGraph(expid, jobNames, targetStatus)
    } else if (type === "txt") {
      content = statusChangeTextGeneratorGraph(jobNames, targetStatus)
    }
    copyToClipboard(content)
    setCopied("Copied!")
    setTimeout(() => {
      setCopied("")
    }, 2000)
  }
  return (
    <Modal show={show} onClose={onHide}>
      <div className="bg-white text-black py-6 px-6 rounded-lg relative w-[40rem] max-w-[95vw]">
        <div className="cursor-pointer absolute top-4 right-4" onClick={onHide}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-2'>
            <div>Change Status to: </div>
            <select value={targetStatus} onChange={(e) => setTargetStatus(e.target.value)}>
              {Object.keys(STATUS_STYLES).sort().map(item => {
                return (
                  <option value={item} key={item}>{item}</option>
                )
              })}
            </select>
          </div>
          <div className='flex gap-2'>
            <div>Method: </div>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="cmd">Command Line</option>
              <option value="txt">Text File</option>
            </select>
          </div>
          <div className='bg-black text-white p-2 font-mono relative'>
            <button className='absolute bottom-2 right-4 opacity-50'
              onClick={handleCopy}>
              <i className="fa-regular fa-copy"></i> {copied}
            </button>
            {
              type === "cmd" &&
              commandGeneratorGraph(expid, jobNames, targetStatus)
            }
            {
              type === "txt" &&
              statusChangeTextGeneratorGraph(jobNames, targetStatus).split("\n").map((item, index) => (
                <p key={index}>{item}</p>
              ))
            }
          </div>
        </div>

      </div>
    </Modal>
  )

}


export default function JobsBasket({ expid, selectedJobs = [], onRemoveJob, onClear }) {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleRemove = (job) => {
    if (onRemoveJob) onRemoveJob(job);
  }

  const toggleModal = () => { setShowModal(!showModal) }

  return (
    <>
      <CommandGeneratorModal selectedJobs={selectedJobs} show={showModal} onHide={toggleModal} expid={expid} />

      <DropdownMenu.Root modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger asChild>
          <button className="btn btn-success text-center font-bold flex items-center">
            <i className={cn("w-4 fa-solid", open ? "fa-x" : "fa-basket-shopping")} /> <span className='ms-2'>({selectedJobs?.length || 0})</span>
          </button>
        </DropdownMenu.Trigger>
        <AnimatePresence>
          {
            open &&
            <DropdownMenu.Portal forceMount>
              <DropdownMenu.Content sideOffset={8} align='end' asChild onInteractOutside={(e) => { e.preventDefault() }}>
                <motion.div
                  className='bg-white dark:bg-neutral-700 rounded-lg py-2 flex flex-col items-center drop-shadow max-w-[100vw] max-h-[70vh]'
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div id="job-basket-header" className='w-full flex gap-4 justify-between px-4'>
                    <DropdownMenu.Label className='font-semibold'>Selected Jobs</DropdownMenu.Label>
                    <button className='text-sm rounded px-2 dark:hover:bg-white/5 hover:bg-black/5 hover:text-primary'
                      onClick={onClear}>
                      Clear
                    </button>
                  </div>

                  <DropdownMenu.Separator className='w-full h-[1px] bg-neutral-200 dark:bg-neutral-500 my-1' />

                  <div id="job-basket-body" className='w-full px-4 py-2 min-h-[8rem] max-h-[24rem] overflow-auto flex flex-col gap-2 items-center'>
                    {
                      (selectedJobs?.length === 0) &&
                      <div className='w-full h-full flex flex-col items-center justify-center font-semibold opacity-50'>
                        No selected jobs
                      </div>
                    }
                    {
                      selectedJobs.map(job => (
                        <div key={job.name} className='w-full flex gap-2 items-center' onSelect={(e) => { e.preventDefault() }}>
                          <div className='text-sm max-w-[14rem] truncate me-auto' title={job.name}>{job.name}</div>
                          <div className={cn('rounded-full px-2 text-xs font-bold flex items-center', getStatusBadgeStyle(job.status))}>
                            {job.status}
                          </div>
                          <button className='text-danger' onClick={() => { handleRemove(job) }}><i className="fa-regular fa-trash-can"></i></button>
                        </div>
                      ))
                    }
                  </div>

                  <DropdownMenu.Separator className='w-full h-[1px] bg-neutral-200 dark:bg-neutral-500 my-1' />

                  <div id="job-basket-footer" className='w-full flex flex-col items-center px-4'>
                    <button className='btn btn-primary' onClick={toggleModal}>
                      Change Status
                    </button>
                  </div>

                  <DropdownMenu.Arrow className='fill-white dark:fill-neutral-700' />

                </motion.div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          }
        </AnimatePresence>
      </DropdownMenu.Root>
    </>
  )
}