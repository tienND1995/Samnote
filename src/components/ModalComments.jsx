import { useState } from "react";
import api from "../api";

function ModalComments(props) {
  const [info, setInfo] = useState(props.data);
  console.log(info);
  console.log(props.userInfomations);
  return (
    <div className="fixed z-10 inset-0 w-full overflow-y-auto">
      <div className="flex items-center justify-center w-full h-full min-h-screen">
        <div className="bg-white flex justify-between flex-col rounded-lg shadow-lg w-full max-w-4xl h-[95%] max-h-screen p-6 relative z-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Detail Note</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={props.toggleModal}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <p className="text-gray-700 mb-4 ">
            This is the content of the modal.
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={props.toggleModal}
          >
            Close
          </button>
        </div>
      </div>
      <div
        className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${
          props.isModalNote ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>
    </div>
  );
}

export default ModalComments;
