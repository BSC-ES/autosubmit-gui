import { useEffect, useState } from "react";
import Maintenance from "../pages/Maintenance";
import MaintenanceContext from "../contexts/MaintenanceContext";
import { MAINTENANCE_URL } from "../consts";

const isValidTimestampFormat = (timestamp) => {
    return (
        typeof timestamp === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(timestamp)
    );
}

const parseScheduleDate = (value, field) => {
    const timestamp = Date.parse(value);

    if (Number.isNaN(timestamp)) {
        throw new Error(`${field} date could not be parsed: ${value}`);
    }

    return timestamp;
};

const MaintenanceGate = ({ children }) => {
    const [config, setConfig] = useState(null);
    const [bannerData, setBannerData] = useState(null);
    const [checked, setChecked] = useState(false); // to avoid rendering the children before the maintenance check is complete

    useEffect(() => {
        const controller = new AbortController();
        let disposed = false;

        const checkMaintenance = async () => {
            let isWithinSchedule = true;
            let isUpcoming = false;

            try {
                if (!MAINTENANCE_URL) {
                    return;
                }
                const response = await fetch(MAINTENANCE_URL, {
                    cache: "no-store",
                    signal: controller.signal,
                });

                if (response.status === 404) {
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                // Ignore non-JSON responses, including the SPA fallback
                if (
                    !response.headers
                        .get("content-type")
                        ?.toLowerCase()
                        .includes("application/json")
                ) {
                    return;
                }

                const nextConfig = await response.json();

                // Validate the structure of the config file
                if (
                    !nextConfig ||
                    typeof nextConfig.enabled !== "boolean" ||
                    typeof nextConfig.title !== "string" ||
                    typeof nextConfig.message !== "string"
                ) {
                    throw new Error(
                        "Expected enabled (boolean), title (string) and message (string) fields in the \
                        maintenance config. Optional: start and end (string, 'YYYY-MM-DDTHH:mm:ssZ' format)."
                    );
                }

                // Validate the optional maintenance schedule
                if (nextConfig.enabled && (nextConfig.start || nextConfig.end)) {
                    const hasStart = Boolean(nextConfig.start);
                    const hasEnd = Boolean(nextConfig.end);

                    if (hasStart && !isValidTimestampFormat(nextConfig.start)) {
                        throw new Error(
                            "Invalid start format. Expected YYYY-MM-DDTHH:mm:ssZ."
                        );
                    }
                    if (hasEnd && !isValidTimestampFormat(nextConfig.end)) {
                        throw new Error(
                            "Invalid end format. Expected YYYY-MM-DDTHH:mm:ssZ."
                        );
                    }

                    const startTimestamp = hasStart
                        ? parseScheduleDate(nextConfig.start, "start")
                        : null;
                    const endTimestamp = hasEnd
                        ? parseScheduleDate(nextConfig.end, "end")
                        : null;

                    if (hasStart && hasEnd && startTimestamp >= endTimestamp) {
                        throw new Error("Start must be earlier than end.");
                    }

                    const currentTimestamp = Date.now();

                    isWithinSchedule = (!hasStart || currentTimestamp >= startTimestamp) &&
                        (!hasEnd || currentTimestamp < endTimestamp);

                    isUpcoming = hasStart && currentTimestamp < startTimestamp;
                }

                // Update the state only if the component is still mounted
                if (!disposed) {
                    setConfig({
                        enabled: nextConfig.enabled && isWithinSchedule,
                        title: nextConfig.title,
                        message: nextConfig.message,
                        start: nextConfig.start,
                        end: nextConfig.end,
                    });
                    setBannerData({
                        isUpcoming: nextConfig.enabled && isUpcoming,
                        start: nextConfig.start,
                        end: nextConfig.end,
                    });
                }
            } catch (error) {
                if (!disposed && error.name !== "AbortError") {
                    console.error(
                        "Failed to fetch a valid maintenance configuration.",
                        error
                    );
                }
            } finally {
                if (!disposed) {
                    setChecked(true);
                }
            }
        };

        checkMaintenance();

        return () => {
            disposed = true;
            controller.abort();
        };
    }, []);

    if (!checked) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <div className="spinner-border" role="status" />
            </div>
        );
    }

    if (config?.enabled) {
        return (
            <Maintenance
                title={config.title}
                message={config.message}
                start={config.start}
                end={config.end}
            />
        );
    }

    return (
        <MaintenanceContext.Provider value={bannerData}>
            {children}
        </MaintenanceContext.Provider>
    );
};

export default MaintenanceGate;
