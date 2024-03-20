import * as Progress from "@radix-ui/react-progress";
import { cn } from "../services/utils";

export default function ProgressBar({ animated, containerClass, indicatorClass, value = 0, max = 1 }) {

    const getProgressPercentage = (value, max) => {
        let _max = max || 1;
        let _value = value || 0;
        return (_max - _value) / _max
    }

    return (
        <Progress.Root value={value} max={max}
            className={cn(
                "relative h-4 w-full overflow-hidden rounded-full bg-light border",
                containerClass
            )}
            style={{
                // Fix overflow clipping in Safari https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
                transform: 'translateZ(0)',
            }}>
            <Progress.Indicator className={cn(
                "h-full w-full flex-1 transition-all",
                { "animate-striped-bg": animated },
                indicatorClass
            )}
                style={{ transform: `translateX(-${100 * getProgressPercentage(value, max)}%)` }}
            />
        </Progress.Root>
    )
}