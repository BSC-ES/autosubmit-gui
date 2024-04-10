import { Menu, Transition } from "@headlessui/react";
import { Fragment, forwardRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "../services/utils";
import ProgressBar from "./ProgressBar";

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
  const isActive = experiment?.status === "RUNNING";

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
          <Menu as="div" className="relative">
            <Menu.Button className="btn btn-light dark:btn-dark">
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                as="div"
                className={"absolute right-0 bg-white border z-40 rounded-xl"}
              >
                <div className="py-3 flex flex-col">
                  {["quick", "tree", "graph"].map((item) => {
                    return (
                      <Menu.Item key={item}>
                        {({ active }) => (
                          <Link
                            role="button"
                            as="button"
                            to={`/experiment/${experiment.name}/${item}`}
                            className={cn([
                              "text-dark text-center px-10 py-1 w-full transition-colors ",
                              { "bg-primary text-white": active },
                            ])}
                          >
                            <div>{item.toUpperCase()}</div>
                          </Link>
                        )}
                      </Menu.Item>
                    );
                  })}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
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
