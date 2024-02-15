import * as Progress from "@radix-ui/react-progress";
import { Menu, Transition } from '@headlessui/react'
import { Fragment, forwardRef, useImperativeHandle, useState } from "react"
import { Link } from "react-router-dom"
import { cn } from '../services/utils'


const getProgressPercentage = (value, max) => {
  let _max = max || 1;
  let _value = value || 0;
  return (_max - _value) / _max
}


const ExperimentCard = forwardRef(({ experiment }, ref) => {
  const [show, setShow] = useState(true)

  const expand = () => { setShow(true) }
  const collapse = () => { setShow(false) }
  const toggle = () => { setShow(!show) }

  useImperativeHandle(ref, () => {
    return {
      expand,
      collapse
    }
  })

  return (
    <div className="flex flex-col w-full h-full">
      <div className={cn([
        "flex px-6 py-3 items-center gap-4 transition-colors bg-light border has-[>a:hover]:bg-dark text-dark has-[>a:hover]:text-light",
        (show ? "rounded-t-2xl" : "rounded-2xl")])}>
        <div
          className={"min-w-6 min-h-6 rounded-full border " + (experiment?.status === "RUNNING" ? "bg-success animate-pulse-soft" : "bg-white")}
          title={(experiment?.status === "RUNNING" ? "ACTIVE" : "INACTIVE")}
        />
        <Link to={`/experiment/${experiment.name}/quick`}
          className="text-2xl font-bold">
          {experiment.name}
        </Link>
        <Link to={`/experiment/${experiment.name}/quick`} className="grow text-sm line-clamp-2 items-center">
          {experiment.description}
        </Link>
        {/* <div onClick={toggle} className="ms-auto"
            style={{ cursor: "pointer" }}>
            <i className={"text-white fs-2 fa-solid " + (show ? "fa-angle-up" : "fa-angle-down")}></i>
          </div> */}

        <Menu as="div" className="relative">
          <Menu.Button>
            <button className="btn btn-light">
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>
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
            <Menu.Items as="div" className={"absolute right-0 bg-white border z-40 rounded-xl"}>
              <div className="py-3 flex flex-col">
                <Menu.Item>
                  {
                    ({ active }) => (
                      <Link role="button" as="button" to={`/experiment/${experiment.name}/quick`}
                        className={cn(["text-dark text-center px-10 py-1 w-full transition-colors ", { "bg-primary text-white": active }])}>
                        <div>QUICK</div>
                      </Link>
                    )
                  }
                </Menu.Item>
                <Menu.Item>
                  {
                    ({ active }) => (
                      <Link role="button" to={`/experiment/${experiment.name}/tree`}
                        className={cn(["text-dark text-center px-10 py-1 w-full transition-colors ", { "bg-primary text-white": active }])}>
                        <div>TREE</div>
                      </Link>
                    )
                  }
                </Menu.Item>
                <Menu.Item>
                  {
                    ({ active }) => (
                      <Link role="button" to={`/experiment/${experiment.name}/graph`}
                        className={cn(["text-dark text-center px-10 py-1 w-full transition-colors ", { "bg-primary text-white": active }])}>
                        <div>GRAPH</div>
                      </Link>
                    )
                  }
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>


      </div>

      {
        show &&
        <div className="grow border border-t-0 rounded-b-2xl py-4 px-6 w-full flex flex-col gap-4">
          <div className="flex gap-4 items-center w-full">
            <div className="grow flex flex-col gap-1">
              <div className="flex gap-4 items-center justify-between">
                <div className="flex gap-1">
                  {
                    experiment?.queuing > 0 &&
                    <span className='badge bg-queue text-black'>
                      {experiment.queuing}
                    </span>
                  }
                  {
                    experiment?.running > 0 &&
                    <span className='badge bg-success text-white'>
                      {experiment.running}
                    </span>
                  }
                  {
                    experiment?.failed > 0 &&
                    <span className='badge bg-danger text-white'>
                      {experiment.failed}
                    </span>
                  }
                  {
                    experiment?.completed > 0 &&
                    <span className='badge bg-completed text-black'>
                      {experiment.completed}
                    </span>
                  }
                </div>
                <span className='font-bold'>
                  /{experiment.total}
                </span>
              </div>

              <Progress.Root value={experiment?.completed} max={experiment?.total}
                className="relative h-4 w-full overflow-hidden rounded-full bg-light border"
                style={{
                  // Fix overflow clipping in Safari https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
                  transform: 'translateZ(0)',
                }}>
                <Progress.Indicator className={"h-full w-full flex-1 transition-all " + (
                  (experiment?.failed > 0) ? "bg-danger" : (
                    (experiment?.queuing > 0 && !(experiment?.running > 0)) ? "bg-queue" : "bg-success"
                  )) + ((experiment?.status === "RUNNING") ? " animate-pulse-soft" : "")}
                  style={{ transform: `translateX(-${100 * getProgressPercentage(experiment?.completed, experiment?.total)}%)` }}
                />
              </Progress.Root>

            </div>


          </div>
          {/* <div className="grid gap-2">
            <Link to={`/experiment/${experiment.name}/quick`}
              className="g-col-4">
              <button type="button"
                className="w-100 btn btn-sm btn-outline-primary fw-bold text-nowrap">
                QUICK
              </button>
            </Link>
            <Link to={`/experiment/${experiment.name}/tree`}
              className="g-col-4">
              <button type="button"
                className="w-100 btn btn-sm btn-outline-primary fw-bold text-nowrap">
                TREE
              </button>
            </Link>
            <Link to={`/experiment/${experiment.name}/graph`}
              className="g-col-4">
              <button type="button"
                className="w-100 btn btn-sm btn-outline-primary fw-bold text-nowrap">
                GRAPH
              </button>
            </Link>
          </div> */}
          <div className="grid grid-cols-2 px-2 gap-2">
            <div className="text-sm" title="User">
              <i className="fa-solid fa-user me-3" /> {experiment.user || "-"}
            </div>
            <div className="text-sm" title="HPC">
              <i className="fa-solid fa-computer me-3" /> {experiment.hpc || "-"}
            </div>
            <div className="text-sm" title="Autosubmit version">
              <i className="fa-solid fa-code-branch me-3" /> {experiment.version || "-"}
            </div>
            <div className="text-sm" title="Last modified date">
              <i className="fa-solid fa-calendar me-3" /> {experiment.modified || "-"}
            </div>
          </div>


          {/* <button type="button"
              className="btn btn-primary fw-bold px-4 text-white text-nowrap">
              SUMMARY
            </button> */}
        </div>
      }

    </div>

  )
})

export default ExperimentCard