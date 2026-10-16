import { motion } from "framer-motion";
import Logo from "../common/Logo.svg?react";
import AnimatedBackground from "../common/AnimatedBackground";
import useASTitle from "../hooks/useASTitle";

const Maintenance = ({ title, message }) => {
    useASTitle(`Maintenance`);

    return (
        <div className="flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    transition: {
                        type: "spring",
                        bounce: 0.6,
                        duration: 0.5,
                    },
                }}
                className="flex w-full max-w-2xl flex-col gap-8 break-words rounded-2xl border bg-white px-6 py-12 text-center text-neutral-800 shadow sm:px-20"
            >
                <Logo className="h-20" />

                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-semibold">{title}</h1>

                    <p className="whitespace-pre-line text-neutral-600">{message}</p>
                </div>

                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="btn btn-light self-center border px-5 py-2 text-center font-semibold"
                >
                    Check again
                </button>
            </motion.div>

            <AnimatedBackground />
        </div>
    );
};

export default Maintenance;
