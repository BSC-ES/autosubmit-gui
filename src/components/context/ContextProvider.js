import ExperimentState from "./experiment/ExperimentState";
import GraphState from "./graph/GraphState";
import TreeState from "./tree/TreeState";
import AlertState from "./alert/AlertState";
import StatsState from "./statistics/StatsState";
import LightState from "./lighter/LighterState";

const ContextProvider = ({ children }) => {
    return (
        <ExperimentState>
            <GraphState>
                <TreeState>
                    <LightState>
                        <AlertState>
                            <StatsState>
                                {children}
                            </StatsState>
                        </AlertState>
                    </LightState>
                </TreeState>
            </GraphState>
        </ExperimentState>
    )
}

export default ContextProvider;