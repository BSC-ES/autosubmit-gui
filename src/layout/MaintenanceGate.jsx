import { useEffect, useState } from "react";
import Maintenance from "../pages/Maintenance";
import { MAINTENANCE_URL } from "../consts";

const MaintenanceGate = ({ children }) => {
    const [config, setConfig] = useState(null);
    const [checked, setChecked] = useState(false); // to avoid rendering the children before the maintenance check is complete

    useEffect(() => {
        const controller = new AbortController();
        let disposed = false;

        const checkMaintenance = async () => {
            try {
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

                // Ignore the SPA fallback and when the JSON file is missing
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
                        "Expected enabled (boolean), title (string) and message (string)"
                    );
                }

                // Update the state only if the component is still mounted
                if (!disposed) {
                    setConfig({
                        enabled: nextConfig.enabled,
                        title: nextConfig.title,
                        message: nextConfig.message,
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
            />
        );
    }

    return children;
};

export default MaintenanceGate;
