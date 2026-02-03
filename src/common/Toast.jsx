import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "../services/utils";
import { hideToast } from "../store/toastSlice";

const Toast = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.toast.toasts);

  useEffect(() => {
    if (toasts.length > 0) {
      const latestToast = toasts[toasts.length - 1];
      const timer = setTimeout(() => {
        dispatch(hideToast(latestToast.id));
      }, latestToast.duration);

      return () => clearTimeout(timer);
    }
  }, [toasts, dispatch]);

  const getToastStyles = (type) => {
    const baseStyles = "shadow-lg";
    switch (type) {
      case "success":
        return `${baseStyles} bg-green-50 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-200`;
      case "error":
        return `${baseStyles} bg-red-50 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-200`;
      case "warning":
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200`;
      case "info":
      default:
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200`;
    }
  };

  const getToastIcon = (type) => {
    switch (type) {
      case "success":
        return "fa-circle-check";
      case "error":
        return "fa-circle-xmark";
      case "warning":
        return "fa-triangle-exclamation";
      case "info":
      default:
        return "fa-circle-info";
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          key={toast.id}
          className={cn(
            "p-4 rounded-lg flex items-start gap-3",
            getToastStyles(toast.type),
          )}
        >
          <i
            className={cn(
              "fa-solid",
              getToastIcon(toast.type),
              "text-xl mt-0.5",
            )}
          />
          <div className="flex-1 text-sm">{toast.message}</div>
          <button
            onClick={() => dispatch(hideToast(toast.id))}
            className="text-current opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close notification"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default Toast;
