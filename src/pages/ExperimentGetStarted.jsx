import { Link, useParams } from "react-router-dom";
import CommandPreview from "../common/CommandPreview";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";

const ExperimentGetStarted = () => {
  const routeParams = useParams();

  useASTitle(`Experiment ${routeParams.expid} get started`);
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`,
    },
    {
      name: `Get Started`,
      route: `/experiment/${routeParams.expid}/get-started`,
    },
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="border rounded-2xl px-8 pt-6 pb-8">
        <div className="flex items-center gap-4 mb-6 border rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
          <i className="fa-solid fa-circle-check text-5xl text-green-600"></i>
          <div>
            <h1 className="text-2xl font-semibold mb-1">
              Experiment {routeParams.expid} created successfully!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your experiment is ready to be set up
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Next Steps</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Congratulations! Your experiment{" "}
            <span className="font-semibold text-primary">
              {routeParams.expid}
            </span>{" "}
            has been created successfully. To get started, you'll need to set up
            the experiment structure on the command line:
          </p>

          <CommandPreview
            command={`autosubmit create -np ${routeParams.expid}`}
          />

          <div className="mt-4 flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <i className="fa-solid fa-info-circle text-blue-600 dark:text-blue-400 mt-0.5"></i>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              This will set up all necessary directories and configuration files
              for your experiment. Once complete, you'll be ready to monitor and
              run your workflows!
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Everything done? Let's continue!
          </p>
          <Link
            to={`/experiment/${routeParams.expid}/quick`}
            className="inline-flex items-center gap-2 btn bg-primary text-white hover:bg-primary/90 px-6 py-2.5"
            reloadDocument
          >
            Go to Quick View <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ExperimentGetStarted;
