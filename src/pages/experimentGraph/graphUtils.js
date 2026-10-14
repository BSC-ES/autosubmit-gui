import { ACTIVE_JOB_STATUSES } from "../../services/utils";

const FIT_DURATION = 500;

export const anyActiveJobs = (elements = []) => {
    return elements.some(
        (element) =>
            element.group === "nodes" &&
            ACTIVE_JOB_STATUSES.includes(element.data?.status)
    );
};

export const fitJobsInView = (
    cy,
    elements,
) => {
    if (!cy.current || cy.current.destroyed() || !elements || elements.length === 0) {
        return;
    }

    cy.current.stop();

    cy.current.animate(
        {
            fit: {
                eles: elements,
            },
        },
        {
            duration: FIT_DURATION,
            easing: "ease-in-out-cubic",
        },
    );
};

export const fitActiveJobsInView = (cy) => {
    return requestAnimationFrame(() => {
        if (!cy.current || cy.current.destroyed()) {
            return;
        }

        const activeJobsSelector = ACTIVE_JOB_STATUSES.map(
            (status) => `node[status = '${status}']`
        ).join(", ");

        const activeJobs = cy.current.nodes(activeJobsSelector);

        if (activeJobs.length > 0) {
            fitJobsInView(cy, activeJobs);
        } else {
            fitJobsInView(cy, cy.current.elements());
        }
    });
};
