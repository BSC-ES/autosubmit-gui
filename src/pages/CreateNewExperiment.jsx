import { useCallback, useEffect, useMemo, useState } from "react";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { useForm } from "react-hook-form";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import { RunnerOptionsFormSection } from "../common/RunnerOptionsFormSection";
import { useNavigate } from "react-router-dom";
import CommandPreview from "../common/CommandPreview";

const CreateNewExperimentPage = () => {
  useASTitle("Create New Experiment");
  useBreadcrumb([
    {
      name: "Create New Experiment",
    },
  ]);

  const navigate = useNavigate();
  const [runnerProfileOptions, setRunnerProfileOptions] = useState({
    profile_name: "",
    profile_params: {},
  });

  const [
    createNewExperiment,
    {
      data: createExpData,
      isLoading: isCreateExpLoading,
      isSuccess: isCreateExpSuccess,
      isError: isCreateExpError,
    },
  ] = autosubmitApiV4.endpoints.runnerCreateNewExperiment.useMutation();

  const handleRunnerSelectionChange = useCallback((selection) => {
    setRunnerProfileOptions(selection);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const formData = watch();

  const experimentCommandPreview = useMemo(() => {
    let command = `autosubmit expid --description "${formData.description}"`;

    if (formData.copy_expid) {
      command += ` --copy "${formData.copy_expid}"`;
    }

    if (formData.hpc) {
      command += ` --HPC "${formData.hpc}"`;
    }
    if (formData.type) {
      if (formData.type === "testcase") {
        command += ` --testcase`;
      } else if (formData.type === "operational") {
        command += ` --operational`;
      }
    }
    if (formData.minimal) {
      command += ` --minimal_configuration`;
    }
    if (formData.use_local_minimal) {
      command += ` --use_local_minimal`;
    }
    if (formData.git_repo) {
      command += ` --git_repo "${formData.git_repo}"`;
    }
    if (formData.git_branch) {
      command += ` --git_branch "${formData.git_branch}"`;
    }
    if (formData.git_conf_dir) {
      command += ` --git_as_conf "${formData.git_conf_dir}"`;
    }
    return command;
  }, [formData]);

  const onSubmit = (data) => {
    const body = {
      profile_name: runnerProfileOptions.profile_name,
      profile_params: runnerProfileOptions.profile_params,
      command_params: {
        description: data.description,
        hpc: data.hpc || null,
        operational: data.type === "operational",
        testcase: data.type === "testcase",
        minimal: data.minimal || false,
        use_local_minimal: data.use_local_minimal || false,
        git_repo: data.git_repo || null,
        git_branch: data.git_branch || null,
        config_path: data.git_conf_dir || null,
        copy: data.copy_expid || null,
      },
    };
    console.log("Creating experiment with body:", body);
    createNewExperiment(body);
  };

  useEffect(() => {
    if (isCreateExpSuccess && createExpData?.expid) {
      // Go to /experiment/{expid}/quick after successful creation
      const expid = createExpData.expid;
      navigate(`/experiment/${expid}/quick?new=true`);
    }
  }, [isCreateExpSuccess]);

  return (
    <div className="flex flex-col gap-4">
      <form
        className="border rounded-2xl px-8 pt-6 pb-8 overflow-x-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-semibold mb-4">Create New Experiment</h2>
        <div className="flex flex-col gap-4 mb-4">
          <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
            <label className="pt-2 text-right" htmlFor="experiment-description">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col">
              <textarea
                type="text"
                id="experiment-description"
                className="form-input"
                placeholder="Enter experiment description"
                rows="3"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <label className="text-right" htmlFor="experiment-copy-expid">
              Copy from
            </label>
            <div className="flex flex-col">
              <input
                type="text"
                id="experiment-copy-expid"
                className="form-input"
                placeholder="Enter expid to copy from"
                {...register("copy_expid")}
              />
              {errors.copy_expid && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.copy_expid.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <label className="text-right" htmlFor="experiment-hpc">
              HPC
            </label>
            <div className="flex flex-col">
              <input
                type="text"
                id="experiment-hpc"
                className="form-input"
                placeholder="Enter target HPC"
                {...register("hpc")}
              />
              {errors.hpc && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.hpc.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <label className="text-right" htmlFor="experiment-type">
              Type
            </label>
            <div className="flex flex-col">
              <select
                id="experiment-type"
                className="px-2 py-1 border rounded text-sm"
                {...register("type")}
              >
                <option value="">Standard</option>
                <option value="testcase">Testcase</option>
                <option value="operational">Operational</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <div></div>
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="experiment-minimal"
                  className="me-2"
                  {...register("minimal")}
                />
                <label className="cursor-pointer" htmlFor="experiment-minimal">
                  Minimal configuration
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="experiment-use-local-minimal"
                  className="me-2"
                  {...register("use_local_minimal")}
                />
                <label
                  className="cursor-pointer"
                  htmlFor="experiment-use-local-minimal"
                >
                  Use local minimal
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <label className="text-right" htmlFor="experiment-git-repo">
              Git Repo
            </label>
            <div className="flex flex-col">
              <input
                type="text"
                id="experiment-git-repo"
                className="form-input"
                placeholder="Enter git repository URL"
                {...register("git_repo")}
              />
              {errors.git_repo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.git_repo.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <label className="text-right" htmlFor="experiment-git-branch">
              Git Branch
            </label>
            <div className="flex flex-col">
              <input
                type="text"
                id="experiment-git-branch"
                className="form-input"
                placeholder="Enter git branch"
                {...register("git_branch")}
              />
              {errors.git_branch && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.git_branch.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <label className="text-right" htmlFor="experiment-git-conf-dir">
              Git Conf Dir
            </label>
            <div className="flex flex-col">
              <input
                type="text"
                id="experiment-git-conf-dir"
                className="form-input"
                placeholder="Enter git config directory"
                {...register("git_conf_dir")}
              />
              {errors.git_conf_dir && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.git_conf_dir.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <CommandPreview command={experimentCommandPreview} className="mb-4" />

        <hr className="mt-6 mb-4" />

        <div className="py-2 flex flex-col items-center">
          <RunnerOptionsFormSection
            onSelectionChange={handleRunnerSelectionChange}
          />

          {isCreateExpError && (
            <div className="text-red-600 mt-2 text-sm">
              Error running the experiment. Please check your configuration and
              try again.
            </div>
          )}

          <button
            className="mt-2 bg-success text-white px-4 py-2 rounded hover:bg-success/90 disabled:bg-success/70"
            disabled={!runnerProfileOptions.profile_name || isCreateExpLoading}
            onClick={() => setShowConfirm(true)}
          >
            {isCreateExpLoading ? (
              <span>
                <i className="fa fa-spinner fa-spin me-2" /> CREATING...
              </span>
            ) : (
              "CREATE NEW EXPERIMENT"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNewExperimentPage;
