import { useState } from "react";
import "./App.css";
import Editor from "./components/Editor/Editor";

function App() {
  const [content, setContent] = useState("\n");
  return (
    <>
      <Editor initialContent={content} onContentChange={setContent}></Editor>
      {/* <div
        contentEditable
        style={{ height: 500, width: 500, backgroundColor: "#1a1a1a" }}
      ></div> */}
    </>
  );
}

export default App;
