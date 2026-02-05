import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Modal, ModalContent, ModalHeader } from "./Modal";
import CommandPreview from "./CommandPreview";

const NewExperimentGuideModal = () => {
  const [show, setShow] = useState(false);
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setShow(true);
    }
  }, []);

  const closeModal = () => {
    setShow(false);
    searchParams.delete("new");
    setSearchParams(searchParams);
  };

  return (
    <>
      <Modal show={show} onClose={closeModal}>
        <ModalHeader className="bg-green-600">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-circle-check text-3xl"></i>
            <span>Experiment {params.expid} Created Successfully!</span>
          </div>
        </ModalHeader>
        <ModalContent className="space-y-4">
          <div className="text-lg">
            <p className="text-gray-700 leading-relaxed">
              Congratulations! Your experiment{" "}
              <span className="font-semibold">{params.expid}</span> has been
              created successfully. To get started, you'll need to set up the
              experiment structure on the command line:
            </p>
          </div>

          <CommandPreview command={`autosubmit create -np ${params.expid}`} />
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p className="flex items-start gap-2">
              <i className="fa-solid fa-info-circle mt-0.5"></i>
              <span>
                This will set up all necessary directories and configuration
                files for your experiment. Once complete, you'll be ready to
                monitor and run your workflows!
              </span>
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-lg">
              Everything done? Let's go to the{" "}
              <Link
                to={`/experiment/${params.expid}/quick`}
                className="font-semibold btn bg-primary text-white hover:bg-primary/90 ms-1"
                reloadDocument
              >
                Quick view <i className="fa-solid fa-arrow-right ms-1"></i>
              </Link>
            </p>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewExperimentGuideModal;
