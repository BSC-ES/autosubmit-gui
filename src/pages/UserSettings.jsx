import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { cn } from "../services/utils";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import * as Tooltip from "@radix-ui/react-tooltip";

const PreferredUsernameInput = () => {
  const {
    data,
    isLoading: isLoadingPreferredUsername,
    error: preferredUsernameError,
  } = autosubmitApiV4.endpoints.getPreferredUsername.useQuery();

  const [preferredUsername, setPreferredUsernameInput] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isNotAvailable, setIsNotAvailable] = useState(false);

  const [
    updatePreferredUsername,
    {
      isLoading: isUpdatingPreferredUsername,
      isSuccess: isUpdatedPreferredUsername,
      isError: isUpdatePreferredUsernameError,
      error: updatePreferredUsernameError,
    },
  ] = autosubmitApiV4.endpoints.updatePreferredUsername.useMutation();

  useEffect(() => {
    if (data && data.preferred_username !== undefined) {
      setPreferredUsernameInput(data.preferred_username);
      setIsDirty(false);
    }
    console.log("preferredUsernameError", preferredUsernameError || "none");
    if (preferredUsernameError && preferredUsernameError.status === 404) {
      setIsNotAvailable(true);
    } else {
      setIsNotAvailable(false);
    }
  }, [data, preferredUsernameError]);

  const handlePreferredUsernameChange = (e) => {
    setPreferredUsernameInput(e.target.value);
    setIsDirty(true);
  };

  const handlePreferredUsernameSave = (e) => {
    e.preventDefault();
    updatePreferredUsername({ preferred_username: preferredUsername });
    setIsDirty(false);
  };

  return (
    <form
      className="flex items-center min-w-0 grow"
      onSubmit={handlePreferredUsernameSave}
      style={{ minWidth: 0 }}
    >
      <input
        className="min-w-0 grow px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 focus:border-primary focus:bg-white dark:focus:bg-neutral-900 focus:outline-none transition-all duration-150 bg-neutral-50 dark:bg-neutral-900 text-base text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
        type="text"
        value={preferredUsername}
        onChange={handlePreferredUsernameChange}
        disabled={
          isLoadingPreferredUsername ||
          isUpdatingPreferredUsername ||
          isNotAvailable
        }
        placeholder="Enter preferred username"
        maxLength={128}
        style={{ minWidth: "100px", maxWidth: "220px" }}
        readOnly={isLoadingPreferredUsername || isUpdatingPreferredUsername}
      />
      <button
        type="submit"
        className="ml-2 px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-base transition disabled:opacity-50"
        disabled={
          isLoadingPreferredUsername ||
          isUpdatingPreferredUsername ||
          !isDirty ||
          preferredUsername.trim() === "" ||
          isNotAvailable
        }
        title="Save preferred username"
        style={{
          minWidth: 32,
          minHeight: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i
          className={cn(
            "fa-solid",
            isUpdatingPreferredUsername
              ? "fa-spinner fa-spin"
              : "fa-floppy-disk"
          )}
        ></i>
      </button>
      {isUpdatedPreferredUsername && !isUpdatingPreferredUsername && (
        <span className="text-success ms-2 text-sm">Saved!</span>
      )}
      {isUpdatePreferredUsernameError && (
        <span className="text-danger ms-2 text-sm">
          {updatePreferredUsernameError?.data?.detail || "Error saving"}
        </span>
      )}
      {isNotAvailable && (
        <span className="text-danger ms-2 text-sm">
          The preferred username option is not available.
        </span>
      )}
    </form>
  );
};

const TokenBox = () => {
  const token = (localStorage.getItem("token") || "").replace("Bearer ", "");
  const [tokenHide, setTokenHide] = useState(true);
  const copyToClipboard = useCopyToClipboard()[1];
  const [copied, setCopied] = useState(false);

  const censorToken = (token) => {
    // replace all the characters to •
    return "•".repeat(token.length);
  };

  const handleCopy = () => {
    copyToClipboard(token);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex border rounded grow overflow-hidden">
      <input
        className="grow px-2 truncate min-w-0"
        type="text"
        value={tokenHide ? censorToken(token) : token}
        readOnly
        disabled
      />
      <button
        title={tokenHide ? "Show" : "Hide"}
        className="border-l dark:border-l-neutral-600 px-2 opacity-70"
        onClick={() => setTokenHide(!tokenHide)}
      >
        <i className={cn("fa-solid", tokenHide ? "fa-eye-slash" : "fa-eye")} />
      </button>
      <button
        title="Copy to clipboard"
        className="border-l dark:border-l-neutral-600 px-2 opacity-70"
        onClick={handleCopy}
      >
        <i
          className={cn(
            copied ? "fa-solid fa-check text-success" : "fa-regular fa-copy"
          )}
        />
      </button>
    </div>
  );
};

const UserSettings = () => {
  useASTitle(`User settings`);
  useBreadcrumb([
    {
      name: `User settings`,
    },
  ]);

  const authState = useSelector((state) => state.auth);

  useEffect(() => {});

  return (
    <div className="flex flex-col gap-4">
      <div className="border rounded-2xl px-8 pt-8 pb-12">
        <div className="markdown-container">
          <h2>User settings</h2>

          <hr className="mt-2 mb-8" />

          <div className="px-4 flex flex-col gap-6 w-full">
            <div className="flex">
              <span className="font-semibold me-4">Username:</span>
              {authState.user_id}
            </div>

            <div className="flex flex-wrap items-center">
              <span className="font-semibold me-4">
                Preferred username{" "}
                <Tooltip.Provider>
                  <Tooltip.Root delayDuration={300}>
                    <Tooltip.Trigger>
                      <i className="fa-solid fa-info-circle opacity-70" />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="top"
                      align="center"
                      className="text-xs bg-black/85 text-white px-2 py-1 rounded max-w-[16rem] text-center font-normal"
                    >
                      This username will be suggested when you are about to
                      submit any command through a Runner
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>{" "}
                :
              </span>
              <PreferredUsernameInput />
            </div>

            <div className="flex flex-wrap">
              <span className="font-semibold me-4">Token: </span>
              <TokenBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
