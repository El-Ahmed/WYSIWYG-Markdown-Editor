import { FC, MutableRefObject, useEffect, useRef, useState } from "react";

import styles from "./Editor.module.scss";

import { EditorProps } from "./Editor.types";
import { handleBreakNode, handleHeadingNode } from "./Editor.helper";

const Editor: FC<EditorProps> = ({ initialContent, onContentChange }) => {
  const editorRef: MutableRefObject<null | HTMLDivElement> = useRef(null);
  const [content, setContent] = useState("");

  const handleInput = () => {
    const container = editorRef.current;
    if (!container) return;
    if (!container.innerText?.length) {
      resetEditor();
      return;
    }
    container.childNodes.forEach((childNode) => {
      handleHeadingNode(childNode);
    });
    container.childNodes.forEach((childNode) => {
      handleBreakNode(childNode);
    });
    setContent(
      Array.from(container.children)
        .map((node) => node.textContent)
        .join("\n")
    );
  };

  const resetEditor = () => {
    if (!editorRef.current) return;
    editorRef.current.innerText = "";
    const div = document.createElement("div");
    div.appendChild(document.createElement("br"));
    editorRef.current.appendChild(div);
  };
  useEffect(() => {
    resetEditor();
  }, [editorRef]);

  const applyContent = () => {
    if (!editorRef.current) return;
    editorRef.current.innerText = "";
    content.split(/\r?\n/).forEach((text) => {
      const div = document.createElement("div");
      if (text.length) {
        div.textContent = text;
      } else {
        div.appendChild(document.createElement("br"));
      }
      editorRef.current?.appendChild(div);
    });
    handleInput();
  };

  return (
    <>
      <div
        ref={editorRef}
        contentEditable
        className={styles.editor}
        onInput={handleInput}
      ></div>
      <div style={{ whiteSpace: "pre-line" }}>{content}</div>
      <button onClick={applyContent}>set Content</button>
    </>
  );
};

export default Editor;
