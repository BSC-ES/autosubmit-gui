import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { cn } from "../services/utils";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import * as Tooltip from "@radix-ui/react-tooltip";
import RunnerHelpModal from "../common/RunnerHelpModal";
import CopyButton from "../common/CopyButton";
import Modal, { ModalContent, ModalHeader } from "../common/Modal";

const SECRET_COOLDOWN_SECONDS = 10;
const SECRET_AUTOHIDE_SECONDS = 10;
const SECRET_MASK = "•".repeat(80);

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
              : "fa-floppy-disk",
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

const RevealSecretModal = ({ show, onHide, onReveal }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(SECRET_COOLDOWN_SECONDS);
  const isCooldownComplete = remainingSeconds === 0;

  useEffect(() => {
    setRemainingSeconds(SECRET_COOLDOWN_SECONDS);

    if (!show) {
      return undefined;
    }

    const cooldown = setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);
    return () => clearInterval(cooldown);
  }, [show]);

  return (
    <Modal show={show} onClose={onHide}>
      <ModalHeader className="bg-red-400 text-white">
        <span><i className="fa-solid fa-triangle-exclamation mr-2" /> You are about to reveal a secret key</span>
        <button className="cursor-pointer" onClick={onHide}>
          <i className="fa-solid fa-xmark" />
        </button>
      </ModalHeader>
      <ModalContent>
        <div className="py-2 flex flex-col max-w-[600px] gap-2">
          <p className="font-semibold mb-4 gap-2 text-center">
            Please, read the following advisory before performing any action.
          </p>
          <p>
            Anyone with access to your secret key may be able to access private information and
            perform actions on your behalf.
          </p>
          <p>
            Do not share it or include it in screenshots, logs, or public repositories. If you
            believe it has been exposed, please get in touch with the Autosubmit administrator
            promptly.
          </p>
          <p>
            Once revealed, you will have {SECRET_AUTOHIDE_SECONDS} seconds to copy the secret key.
          </p>
          <div className="flex justify-center mt-4 gap-4">
            <button
              type="button"
              onClick={onReveal}
              disabled={!isCooldownComplete}
              className="border rounded px-4 py-2 disabled:opacity-50 bg-orange-400 text-white hover:bg-orange-500 transition"
            >
              Understood, reveal{!isCooldownComplete ? ` (${remainingSeconds})` : ""}
            </button>
            <button
              type="button"
              onClick={onHide}
              className="border rounded px-4 py-2 bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

const HideRevealButton = ({ isRevealed, iconSize }) => {
  return (
    isRevealed ? (
      <>
        <i className={`fa-solid fa-unlock group-hover:hidden ${iconSize}`}></i>
        <i className={`fa-solid fa-lock hidden group-hover:inline ${iconSize}`}></i>
        <span>Hide</span>
      </>
    ) : (
      <>
        <i className={`fa-solid fa-lock group-hover:hidden ${iconSize}`}></i>
        <i className={`fa-solid fa-unlock hidden group-hover:inline ${iconSize}`}></i>
        <span>Reveal</span>
      </>
    )
  );
};

const TokenBox = ({ token }) => {
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="flex border rounded grow overflow-hidden">
      <input
        className={cn("grow px-2 truncate min-w-0", !token ? "text-gray-500" : "")}
        type="text"
        value={token ? (isRevealed ? token : SECRET_MASK) : "Token not available"}
        readOnly
        disabled
      />
      {isRevealed && (
        <CopyButton
          text={token}
          copyText="Copy token"
          bgColorClass="bg-gray-50 border-l hover:bg-neutral-200 transition"
          iconSizeClass="text-sm"
          roundedClass=""
        />
      )}
      {token && (
        <button
          onClick={() => {
            if (isRevealed) {
              setIsRevealed(false);
              setShowSecretModal(false);
              return;
            }
            setShowSecretModal(true);
          }}
          className="group border-l px-2 bg-gray-100 hover:bg-neutral-200 transition flex items-center justify-center gap-1"
          title={isRevealed ? "Hide token" : "Reveal token"}
        >
          <HideRevealButton isRevealed={isRevealed} iconSize="text-sm" />
        </button>
      )}
      <RevealSecretModal
        show={showSecretModal}
        onHide={() => setShowSecretModal(false)}
        onReveal={() => {
          setIsRevealed(true);
          setShowSecretModal(false);
          setTimeout(() => setIsRevealed(false), SECRET_AUTOHIDE_SECONDS * 1000);
        }}
      />
    </div>
  );
};

const SSHKeyBox = ({ keyValue }) => {
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="border rounded p-3 bg-gray-50 dark:bg-gray-800 flex items-center justify-between gap-2">
      <div className="font-mono break-all text-xs flex-1">{isRevealed ? keyValue : SECRET_MASK}</div>
      {isRevealed && (
        <div>
          <CopyButton
            text={keyValue}
            copyText="Copy SSH key"
            bgSize={8}
            roundedClass="rounded"
            borderClass="border"
            iconSizeClass="text-sm"
          />
        </div>
      )}
      {keyValue && (
        <button
          onClick={() => {
            if (isRevealed) {
              setIsRevealed(false);
              setShowSecretModal(false);
              return;
            }
            setShowSecretModal(true);
          }}
          className="group h-8 border px-2 rounded hover:bg-neutral-200 transition flex items-center justify-center gap-1"
          title={isRevealed ? "Hide SSH Key" : "Reveal SSH Key"}
        >
          <HideRevealButton isRevealed={isRevealed} />
        </button>
      )}
      <RevealSecretModal
        show={showSecretModal}
        onHide={() => setShowSecretModal(false)}
        onReveal={() => {
          setIsRevealed(true);
          setShowSecretModal(false);
          setTimeout(() => setIsRevealed(false), SECRET_AUTOHIDE_SECONDS * 1000);
        }}
      />
    </div>
  );
};

const ConfigRow = ({ label, value, isUserProvided = false }) => (
  <div className="flex items-center gap-3">
    <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[140px]">
      {label}
    </span>
    <span
      className={cn(
        "text-sm font-mono",
        isUserProvided && "italic text-gray-500 dark:text-gray-500",
      )}
    >
      {isUserProvided ? `<${value}>` : value}
    </span>
  </div>
);

const RunnerProfileDetails = ({ profileName, profileConfig }) => {
  const isSSHRunner = profileConfig.RUNNER_TYPE === "SSH";
  const hasModules = profileConfig.MODULE_LOADER_TYPE !== "NO_MODULE";

  const renderModules = (modules) => {
    if (Array.isArray(modules)) {
      return modules.join(", ");
    }
    return String(modules);
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 overflow-auto">
      <h3 className="text-lg font-semibold mb-3">{profileName}</h3>
      <div className="space-y-2">
        <ConfigRow
          label="Runner Type"
          value={profileConfig.RUNNER_TYPE || "any runner type"}
          isUserProvided={!profileConfig.RUNNER_TYPE}
        />
        <ConfigRow
          label="Module Loader"
          value={profileConfig.MODULE_LOADER_TYPE || "any module loader"}
          isUserProvided={!profileConfig.MODULE_LOADER_TYPE}
        />
        {hasModules && (
          <ConfigRow
            label="Modules"
            value={
              profileConfig.MODULES
                ? renderModules(profileConfig.MODULES)
                : "modules to load"
            }
            isUserProvided={!profileConfig.MODULES}
          />
        )}
        {isSSHRunner && (
          <>
            <div className="pt-1 pb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                SSH:
              </span>
            </div>
            <div className="ml-4 space-y-2">
              <ConfigRow
                label="Host"
                value={
                  profileConfig.SSH?.HOST
                    ? profileConfig.SSH.HOST
                    : "your SSH host"
                }
                isUserProvided={!profileConfig.SSH?.HOST}
              />
              <ConfigRow
                label="Username"
                value={
                  profileConfig.SSH?.USERNAME
                    ? profileConfig.SSH.USERNAME
                    : "your SSH username"
                }
                isUserProvided={!profileConfig.SSH?.USERNAME}
              />
              {profileConfig.SSH?.PORT && (
                <ConfigRow label="Port" value={profileConfig.SSH.PORT} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const RunnerConfigSection = () => {
  const {
    data: runnerProfiles,
    error: runnerProfilesError,
    isLoading: runnerProfilesLoading,
  } = autosubmitApiV4.endpoints.getRunnersConfigProfiles.useQuery();

  const {
    data: publicSSHKeys,
    error: publicSSHKeysError,
    isLoading: publicSSHKeysLoading,
  } = autosubmitApiV4.endpoints.getPublicSSHKeys.useQuery();

  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="border rounded-2xl px-8 pt-8 pb-12">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-xl mb-2">
          <h2 className="text-3xl font-semibold">Runner configuration</h2>

          <button
            className="ml-1 w-6 h-6 rounded-full text-primary hover:bg-primary/10 transition-colors flex items-center justify-center"
            onClick={() => setShowHelp(true)}
            title="Runner profiles help"
          >
            <i className="fa-solid fa-circle-question"></i>
          </button>
          <RunnerHelpModal show={showHelp} onHide={() => setShowHelp(false)} />
        </div>

        <hr className="mt-2 mb-8" />

        {/* SSH Keys */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Public SSH Keys</h3>

          <div className="mb-4 text-sm ml-2 text-gray-700 dark:text-gray-300">
            Include these public SSH keys your authorized_keys file to allow SSH
            access to runners. Example command:{" "}
            <code className="border p-1 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs text-red-600">
              echo $API_PUBLIC_KEY &gt;&gt; ~/.ssh/authorized_keys
            </code>{" "}
            where{" "}
            <code className="border p-1 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs text-red-600">
              $API_PUBLIC_KEY
            </code>{" "}
            is any of the keys below. Note that by adding these keys, you are
            allowing the Autosubmit API to access your runner machines via SSH.
          </div>

          {publicSSHKeysLoading && (
            <div className="px-4 text-center py-8">
              <i className="fa-solid fa-spinner fa-spin me-2" />
              Loading public SSH keys...
            </div>
          )}

          {publicSSHKeysError && (
            <div className="px-4 text-center py-8 text-red-500">
              <i className="fa-solid fa-exclamation-triangle me-2" />
              Error loading public SSH keys
            </div>
          )}

          {publicSSHKeys && publicSSHKeys.length === 0 && (
            <div className="px-4 py-4 text-gray-500">
              No public SSH keys found
            </div>
          )}

          {publicSSHKeys && publicSSHKeys.length > 0 && (
            <div className="px-4 flex flex-col gap-4">
              {publicSSHKeys.map((key, idx) => {
                return <SSHKeyBox key={idx} keyValue={key} />;
              })}
            </div>
          )}
        </div>

        {/* Runner Profiles */}
        <h3 className="text-2xl font-semibold mb-4">Available profiles</h3>

        {runnerProfilesLoading && (
          <div className="px-4 text-center py-8">
            <i className="fa-solid fa-spinner fa-spin me-2" />
            Loading runner profiles...
          </div>
        )}

        {runnerProfilesError && (
          <div className="px-4 text-center py-8 text-red-500">
            <i className="fa-solid fa-exclamation-triangle me-2" />
            Error loading runner profiles
          </div>
        )}

        {runnerProfiles && Object.keys(runnerProfiles).length === 0 && (
          <div className="px-4 pt-4 pb-2 text-gray-500">
            No runner configuration profiles found
          </div>
        )}

        {runnerProfiles && (
          <div className="px-4 flex flex-col gap-8">
            {Object.entries(runnerProfiles).map(
              ([runnerProfileName, runnerProfileConfig]) => (
                <RunnerProfileDetails
                  key={runnerProfileName}
                  profileName={runnerProfileName}
                  profileConfig={runnerProfileConfig}
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const UserSettings = () => {
  useASTitle(`Settings`);
  useBreadcrumb([
    {
      name: `Settings`,
    },
  ]);

  const token = (localStorage.getItem("token") || "").replace("Bearer ", "");

  const authState = useSelector((state) => state.auth);

  useEffect(() => { });

  return (
    <div className="flex flex-col gap-4">
      <div className="border rounded-2xl px-8 pt-8 pb-12">
        <div className="flex flex-col">
          <h2 className="text-3xl font-semibold">User settings</h2>

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
              <span className="font-semibold me-4">
                Token{" "}
                <Tooltip.Provider>
                  <Tooltip.Root delayDuration={300}>
                    <Tooltip.Trigger>
                      <i className="fa-solid fa-info-circle opacity-70" />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="right"
                      align="center"
                      className="text-xs bg-black/85 text-white px-2 py-1 rounded max-w-[16rem] text-center font-normal"
                    >
                      This Bearer token is used to authenticate requests made to
                      the Autosubmit API. Add it to the Authorization header of
                      your HTTP requests with the format: <br />
                      <code className="font-mono text-xs p-1 text-red-600">
                        Authorization: Bearer &lt;token&gt;
                      </code>
                      <br />
                      Keep it secure and do not share it with unauthorized
                      parties.
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>{" "}
                :
              </span>

              <TokenBox token={token} />
            </div>
          </div>
        </div>
      </div>

      <RunnerConfigSection />
    </div>
  );
};

export default UserSettings;
