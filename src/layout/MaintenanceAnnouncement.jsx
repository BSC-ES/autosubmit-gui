import { useContext } from "react";
import MaintenanceContext from "../contexts/MaintenanceContext";

const MaintenanceAnnouncement = () => {
    const maintenance = useContext(MaintenanceContext);

    if (!maintenance?.isUpcoming || !maintenance?.start) {
        return null;
    }

    return (
        <div className="w-full border-b border-amber-300 bg-amber-100 px-4 py-3 text-amber-950 sm:px-6">
            <div className="flex items-center justify-center gap-3">
                <i class="fa-solid fa-triangle-exclamation"></i>

                <div className="text-sm">
                    <p><strong>Scheduled maintenance. </strong>
                        The Autosubmit GUI will be unavailable from{" "}
                        {new Date(maintenance.start).toLocaleString()}
                        {maintenance.end && (" until " + new Date(maintenance.end).toLocaleString())}
                        {"."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceAnnouncement;
