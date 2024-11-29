import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { cn } from "../services/utils";

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
