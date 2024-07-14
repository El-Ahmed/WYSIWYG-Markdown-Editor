import { useState } from "react";
import "./App.css";
import Editor from "./components/Editor/Editor";

function App() {
  const [content, setContent] = useState("\n");
  return (
    <>
      <Editor initialContent={content} onContentChange={setContent}></Editor>
    </>
  );
}

export default App;
