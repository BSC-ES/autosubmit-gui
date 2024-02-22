import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../store/appSlice";

export default function DarkThemeSwitcher() {
  const theme = useSelector(state => state.app.theme)
  const dispatch = useDispatch()

  const toggleMode = () => {
    dispatch(appActions.toggleTheme())
  }

  return (
    <button className="btn btn-light dark:btn-dark rounded-full drop-shadow" onClick={toggleMode}>
      {theme === "light" ? <div><i className="fa-solid fa-circle-half-stroke"></i></div> :  <div><i className="fa-solid fa-circle-half-stroke"></i></div>}
    </button>
  )
}