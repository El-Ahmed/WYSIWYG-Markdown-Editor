import { useState } from "react";
import "./App.css";
import Editor from "./components/Editor/Editor";

function App() {
  const [content, setContent] = useState("");
  return (
    <>
      <Editor initialContent={content} onContentChange={setContent}></Editor>

      <textarea
        style={{ whiteSpace: "pre-line" }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
    </>
  );
}

export default App;
