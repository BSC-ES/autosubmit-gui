import useExperimentEta from "../hooks/useExperimentEta";
import ExperimentEtaView from "./ExperimentEtaView";

const ExperimentEtaPanel = ({
  activeMonitor,
  expid,
  pklData,
  jobs = [],
  isMobile = false
}) => {
  const {
    selectedEtaSection,
    setUserSelectedEtaSection,
    sections,
    etaData,
    isEtaError,
    etaError,
    etaTotalChunks,
    etaCompletedChunks,
  } = useExperimentEta({ activeMonitor, expid, pklData, jobs });

  return (
    <ExperimentEtaView
      selectedEtaSection={selectedEtaSection}
      onSelectedEtaSectionChange={setUserSelectedEtaSection}
      sections={sections}
      etaData={etaData}
      isEtaError={isEtaError}
      etaError={etaError}
      etaTotalChunks={etaTotalChunks}
      etaCompletedChunks={etaCompletedChunks}
      isMobile={isMobile}
    />
  );
};

export default ExperimentEtaPanel;
