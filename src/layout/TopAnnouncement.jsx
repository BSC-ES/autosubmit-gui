import { TOP_ANNOUNCEMENT } from "../consts";

function TopAnnouncement() {
  return (
    <>
      {TOP_ANNOUNCEMENT && (
        <div
          className="w-full text-center py-2 px-6 bg-neutral-950 text-white text-sm"
          dangerouslySetInnerHTML={{ __html: TOP_ANNOUNCEMENT }}
        ></div>
      )}
    </>
  );
}

export default TopAnnouncement;
