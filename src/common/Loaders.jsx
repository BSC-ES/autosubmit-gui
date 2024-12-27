import React from "react";
import "./Loaders.css";
import { cn } from "../services/utils";

const DotLoader = ({className, dotClassName}) => {
  return (
    <div className={cn("dot-loader", className)}>
      <div className={cn("dot", dotClassName)}></div>
      <div className={cn("dot", dotClassName)}></div>
      <div className={cn("dot", dotClassName)}></div>
    </div>
  );
};

export { DotLoader };
