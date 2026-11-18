import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";

/**
 * Hook to fetch and manage experiment ETA data.
 *
 * @param {Object} param0 - The parameters for the hook.
 * @param {boolean} param0.activeMonitor - Whether the monitor is active.
 * @param {string} param0.expid - The experiment ID.
 * @param {Object} param0.pklData - Jobs data.
 * @param {Object|undefined} [param0.sectionsTree] - Optional. Jobs category tree used to filter section names.
 * @param {Array|undefined} [param0.jobs] - Jobs used to identify sections that contain chunks if sectionsTree is not provided.
 * @returns {Object} ETA data.
 */
const useExperimentEta = ({
  activeMonitor,
  expid,
  pklData,
  sectionsTree = {},
  jobs = [],
}) => {
  const defaultSection = "SIM";

  const [userSelectedEtaSection, setUserSelectedEtaSection] = useState(null);
  const [fetchEta] = autosubmitApiV4.endpoints.getExperimentEta.useLazyQuery();

  const hasCategoryTree = useMemo(() =>
    sectionsTree &&
      typeof sectionsTree === "object" &&
      Object.keys(sectionsTree).length > 0,
  [sectionsTree]);

  const chunkSections = useMemo(() => {
    const chunkSections = new Set();

    // Check the category tree was provided and is valid
    if (hasCategoryTree) {
      const isCategoryValue = (value) =>
        value !== null && value !== undefined && value !== "" && value !== "NA";

      // Explore startdates and members to find sections that contain chunks
      // A section with a 
      Object.entries(sectionsTree).forEach(([date, members]) => {
        if (!members || typeof members !== "object") return;

        Object.entries(members).forEach(([member, sections]) => {
          const belongsToChunk = isCategoryValue(date) && isCategoryValue(member);
          if (!belongsToChunk || !sections || typeof sections !== "object") return;

          Object.keys(sections).forEach((section) => {
            if (!section) return;
            const status_counter = Object.values(sections[section]).reduce(
              (total, count) => total + count,
              0,
            );

            if (status_counter > 1) chunkSections.add(section);
          });
        });
      });
    }
    // Fallback for views that just provide the job list
    else if (jobs && Array.isArray(jobs)) {
      (jobs || []).forEach((job) => {
        if (job?.chunk != null && job?.section) {
          chunkSections.add(job.section);
        }
      });
    }

    return Array.from(chunkSections);
  }, [sectionsTree, jobs, hasCategoryTree]);

  const selectedEtaSection = useMemo(() => {
    if (chunkSections.length === 0) return null;

    if (userSelectedEtaSection !== null && chunkSections.includes(userSelectedEtaSection)) {
      return userSelectedEtaSection;
    }

    return chunkSections.includes(defaultSection) ? defaultSection : chunkSections[0];
  }, [chunkSections, userSelectedEtaSection]);

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
    if (!etaArgs || chunkSections.length === 0 || !chunkSections.includes(selectedEtaSection)) return;
    fetchEta(etaArgs);
  }, [etaArgs, chunkSections, pklData?.pkl_timestamp, fetchEta]);

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
    chunkSections,
    etaData,
    isEtaError,
    etaError,
    etaTotalChunks,
    etaCompletedChunks
  };
};

export default useExperimentEta;
