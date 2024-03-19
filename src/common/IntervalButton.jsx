import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../services/utils";
import { INTERVAL_BUTTON_REFRESH_RATE } from '../consts';

const IntervalButton = ({ intervalCallback }) => {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const monitorRef = useRef();

  const toggleMonitor = () => {
    if (isMonitoring) {
      clearInterval(monitorRef.current)
      setIsMonitoring(false)
    } else {
      const id = setInterval(intervalCallback, INTERVAL_BUTTON_REFRESH_RATE * 1000)
      monitorRef.current = id;
      setIsMonitoring(true)
    }
  }

  useEffect(() => {
    // Unmount component
    return (() => {
      clearInterval(monitorRef.current)
    })
  }, [])

  return (
    <button className={cn("btn flex items-center justify-center btn-success")}
      title="Automatic refresh data"
      onClick={() => { toggleMonitor() }}>
      {
        isMonitoring ?
          <svg className="w-4 h-4 rotate-90" fill="none" width={200} height={200} viewBox="0 0 200 200">
            <rect x={60} y={60} width={80} height={80} fill="#ffffff" />
            <circle stroke={"rgba(255, 255, 255, 0.3)"} r={85} cx={100} cy={100} strokeWidth={30} />
            <motion.circle stroke={"#ffffff"} r={85} cx={100} cy={100} strokeWidth={30}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, transition: { duration: INTERVAL_BUTTON_REFRESH_RATE, repeat: Infinity } }}
            />
          </svg>
          :
          <i className="w-4 h-4 fa-solid fa-stopwatch"></i>
      }
    </button>
  )
}

export default IntervalButton;