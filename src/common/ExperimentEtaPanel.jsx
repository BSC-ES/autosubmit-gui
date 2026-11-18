import useExperimentEta from "../hooks/useExperimentEta";
import ExperimentEtaView from "./ExperimentEtaView";

const ExperimentEtaPanel = ({
  activeMonitor,
  expid,
  pklData,
  sectionsTree,
  jobs,
  isMobile = false
}) => {
  const {
    selectedEtaSection,
    setUserSelectedEtaSection,
    chunkSections,
    etaData,
    isEtaError,
    etaError,
    etaTotalChunks,
    etaCompletedChunks,
  } = useExperimentEta({ activeMonitor, expid, pklData, sectionsTree, jobs });

  return (
    <ExperimentEtaView
      selectedEtaSection={selectedEtaSection}
      onSelectedEtaSectionChange={setUserSelectedEtaSection}
      sections={chunkSections}
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
