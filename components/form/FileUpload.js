"use client";

import React, { useState } from "react";

export default function FileUpload({ accept, multiple, ...props }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles));
    }
  };

  const removeFile = (fileName) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  return (
    <div className="w-full">
      <div className="relative w-full">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          {...props}
        />
        <label
          htmlFor="file-upload"
          className="flex items-center justify-between cursor-pointer field-base px-2"
        >
          <div className="flex items-center gap-2">
            {files.length > 0 ? (
              <div>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 mr-2 bg-purple-100 rounded-md"
                  >
                    <span className="font-14 text-purple-800">{file.name}</span>
                    <button
                      type="button"
                      className="ml-1 text-purple-700 hover:text-purple-900 focus:outline-none"
                      onClick={() => removeFile(file.name)}
                    >
                      <svg
                        className="w-3 2xl:w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <span className="font-14 text-gray-400">Upload file</span>
            )}
          </div>
          <svg
            className="shrink-0 size-4 2xl:size-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </label>
      </div>
    </div>
  );
}
