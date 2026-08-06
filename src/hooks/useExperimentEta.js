import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";

const useExperimentEta = ({
  activeMonitor,
  expid,
  pklData,
  jobs = [],
}) => {
  const defaultSection = "SIM";

  const [userSelectedEtaSection, setUserSelectedEtaSection] = useState(null);

  const [fetchEta] = autosubmitApiV4.endpoints.getExperimentEta.useLazyQuery();

  const sections = useMemo(() => {
    const uniqueSections = new Set();

    jobs.forEach((job) => {
      if (job?.chunk && !uniqueSections.has(job?.section)) {
        uniqueSections.add(job.section);
      }
    });

    return Array.from(uniqueSections);
  }, [jobs]);

  const selectedEtaSection = useMemo(() => {
    if (sections.length === 0) return null;

    if (userSelectedEtaSection !== null && sections.includes(userSelectedEtaSection)) {
      return userSelectedEtaSection;
    }

    return sections.includes(defaultSection) ? defaultSection : sections[0];
  }, [sections, userSelectedEtaSection]);

  const etaArgs = useMemo(() => {
    if (!activeMonitor || !selectedEtaSection) {
      return undefined;
    }

    return {
      expid,
      section: selectedEtaSection,
    };
  }, [activeMonitor, expid, selectedEtaSection]);

  useEffect(() => {
    if (!etaArgs || sections.length === 0 || !sections.includes(selectedEtaSection)) return;
    fetchEta(etaArgs);
  }, [etaArgs, sections, pklData?.pkl_timestamp, fetchEta]);

  const etaSelector = useMemo(() => {
    if (!etaArgs) {
      return null;
    }

    return autosubmitApiV4.endpoints.getExperimentEta.select(etaArgs);
  }, [etaArgs]);

  const etaCacheEntry = useSelector((state) =>
    etaSelector
      ? etaSelector(state)
      : {
          data: undefined,
          isError: false,
          error: undefined,
        }
  );

  const etaData = etaCacheEntry?.data;
  const isEtaError = etaCacheEntry?.isError ?? false;
  const etaError = etaCacheEntry?.error;

  const etaTotalChunks = etaData?.chunks_total;
  const etaRemainingChunks = etaData?.chunks_remaining;
  const etaCompletedChunks = etaTotalChunks != null && etaRemainingChunks != null
    ? etaTotalChunks - etaRemainingChunks
    : undefined;

  return {
    selectedEtaSection,
    setUserSelectedEtaSection,
    sections,
    etaData,
    isEtaError,
    etaError,
    etaTotalChunks,
    etaCompletedChunks
  };
};

export default useExperimentEta;
