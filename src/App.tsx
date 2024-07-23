import React, { useRef, useState } from "react";
import "./App.css";
import Editor from "./components/Editor/Editor";

function App() {
  const [content, setContent] = useState("");
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const download = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "markdownText.txt";
    link.click();

    window.URL.revokeObjectURL(url);
  };

  const upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event?.target?.files?.[0];
    if (!selectedFile) return;
    selectedFile.text().then((value) => {
      setContent(value);
      if (hiddenFileInput.current) hiddenFileInput.current.value = "";
    });
  };

  return (
    <>
      <div className="load">
        <button
          onClick={() => hiddenFileInput.current?.click()}
          title="upload text"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
          </svg>
        </button>
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={upload}
          style={{ display: "none" }}
        />
        <button onClick={download} title="download text">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
          </svg>
        </button>
      </div>
      <Editor initialContent={content} onContentChange={setContent}></Editor>
    </>
  );
}

export default App;
