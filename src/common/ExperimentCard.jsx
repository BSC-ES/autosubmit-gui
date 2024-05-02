import { forwardRef, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../services/utils";
import ProgressBar from "./ProgressBar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";

const ActiveIndicator = ({ isActive }) => {
  return (
    <div
      title={isActive ? "ACTIVE" : "INACTIVE"}
      className={cn(
        "relative",
        "min-w-6 min-h-6 rounded-full border",
        "dark:border-dark",
        isActive ? "bg-success animate-pulse-soft" : "bg-white"
      )}
    >
      {isActive && (
        <div className="absolute animate-ping bg-success/50 w-full h-full rounded-full" />
      )}
    </div>
  );
};

const ExperimentCard = forwardRef(({ experiment }, ref) => {
  const isActive = useMemo(() => {
    return experiment?.status === "RUNNING";
  }, [experiment]);
  const [open, setOpen] = useState(false);

  return (
    <Link to={`/experiment/${experiment.name}/quick`}>
      <div className="group flex flex-col w-full h-full border dark:border-neutral-700 rounded-2xl overflow-hidden">
        <div
          className={cn(
            "flex items-center gap-4 px-6 py-3 h-16",
            "bg-neutral-100 text-neutral-900",
            "dark:bg-neutral-700 dark:text-neutral-50",
            "group-hover:bg-neutral-200 dark:group-hover:bg-neutral-600"
          )}
        >
          <ActiveIndicator isActive={isActive} />
          <div className="text-2xl font-bold">{experiment.name}</div>
          <div className="grow text-sm line-clamp-2 items-center">
            {experiment.description}
          </div>
          <DropdownMenu.Root modal={false} open={open} onOpenChange={setOpen}>
            <DropdownMenu.Trigger
              className="btn btn-light dark:btn-dark"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </DropdownMenu.Trigger>
            <AnimatePresence>
              {open && (
                <DropdownMenu.Portal forceMount>
                  <DropdownMenu.Content asChild align="end">
                    <motion.div
                      className="bg-white border z-40 rounded-xl"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <div className="py-3 flex flex-col">
                        {["quick", "tree", "graph"].map((item) => {
                          return (
                            <DropdownMenu.Item key={item} asChild>
                              <Link
                                to={`/experiment/${experiment.name}/${item}`}
                                className={cn([
                                  "text-dark text-center px-10 py-1 w-full transition-colors ",
                                  "hover:bg-primary hover:text-white",
                                  "focus:bg-primary focus:text-white",
                                ])}
                              >
                                <div>{item.toUpperCase()}</div>
                              </Link>
                            </DropdownMenu.Item>
                          );
                        })}
                      </div>
                    </motion.div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              )}
            </AnimatePresence>
          </DropdownMenu.Root>
        </div>

        <div
          className={cn(
            "grow py-4 px-6 w-full flex flex-col gap-4 border-t dark:border-neutral-700",
            "bg-white",
            "dark:bg-neutral-600",
            "group-hover:bg-neutral-50 dark:group-hover:bg-neutral-500"
          )}
        >
          <div className="flex gap-4 items-center w-full">
            <div className="grow flex flex-col gap-1">
              <div className="flex gap-4 items-center justify-between">
                <div className="flex gap-1">
                  {experiment?.queuing > 0 && (
                    <span className="badge bg-queue text-black">
                      {experiment.queuing}
                    </span>
                  )}
                  {experiment?.running > 0 && (
                    <span className="badge bg-success text-white">
                      {experiment.running}
                    </span>
                  )}
                  {experiment?.failed > 0 && (
                    <span className="badge bg-danger text-white">
                      {experiment.failed}
                    </span>
                  )}
                  {experiment?.completed > 0 && (
                    <span className="badge bg-completed text-black">
                      {experiment.completed}
                    </span>
                  )}
                </div>
                <span className="font-bold">/{experiment.total}</span>
              </div>
              <ProgressBar
                animated={isActive}
                value={experiment?.completed}
                max={experiment?.total}
                indicatorClass={
                  experiment?.failed > 0
                    ? "bg-danger"
                    : experiment?.queuing > 0 && !(experiment?.running > 0)
                    ? "bg-queue"
                    : "bg-success"
                }
                containerClass={"border"}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 px-2 gap-2">
            <div className="text-sm" title="User">
              <i className="fa-solid fa-user me-3" /> {experiment.user || "-"}
            </div>
            <div className="text-sm" title="HPC">
              <i className="fa-solid fa-computer me-3" />{" "}
              {experiment.hpc || "-"}
            </div>
            <div className="text-sm" title="Autosubmit version">
              <i className="fa-solid fa-code-commit me-3" />{" "}
              {experiment.version || "-"}
            </div>
            <div className="text-sm" title="Last modified date">
              <i className="fa-solid fa-calendar me-3" />{" "}
              {experiment.modified || "-"}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

export default ExperimentCard;
