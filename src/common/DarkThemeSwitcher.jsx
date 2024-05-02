import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../store/appSlice";
import { cn } from "../services/utils";

export default function DarkThemeSwitcher({ className, showLabel }) {
  const theme = useSelector((state) => state.app.theme);
  const dispatch = useDispatch();

  const toggleMode = () => {
    dispatch(appActions.toggleTheme());
  };

  return (
    <button
      className={cn(
        "btn btn-light dark:btn-dark rounded-full drop-shadow border dark:border-neutral-700",
        className
      )}
      onClick={toggleMode}
    >
      {theme === "light" ? (
        <div>
          <i className="fa-solid fa-circle-half-stroke"></i>{" "}
          {showLabel && <span className="ms-2">Light</span>}
        </div>
      ) : (
        <div>
          <i className="fa-solid fa-circle-half-stroke"></i>
          {showLabel && <span className="ms-2">Dark</span>}
        </div>
      )}
    </button>
  );
}
