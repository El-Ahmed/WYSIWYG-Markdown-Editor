import { FC, MutableRefObject, useEffect, useRef, useState } from "react";

import styles from "./Editor.module.scss";

import { EditorProps } from "./Editor.types";
import {
  handleBold,
  handleBreakNode,
  handleHeadingNode,
  handleHiddenText,
} from "./Editor.helper";

const Editor: FC<EditorProps> = ({ initialContent, onContentChange }) => {
  const editorRef: MutableRefObject<null | HTMLDivElement> = useRef(null);
  const [content, setContent] = useState("");
  const [lines, setLines] = useState<(string | null)[]>([]);

  const handleInput = () => {
    const container = editorRef.current;
    if (!container) return;
    if (!container.innerText?.length) {
      resetEditor();
      return;
    }
    const editedChildNodes = Array.from(container.childNodes).filter(
      (node, index) => {
        return node.textContent !== lines[index];
      }
    );
    editedChildNodes.forEach((childNode) => {
      handleHeadingNode(childNode);
    });
    editedChildNodes.forEach((childNode) => {
      handleBreakNode(childNode);
    });
    editedChildNodes.forEach((childNode) => {
      handleBold(childNode);
    });

    setContent(
      Array.from(container.children)
        .map((node) => node.textContent)
        .join("\n")
    );

    setLines(
      Array.from(container.childNodes).map((node) => {
        return node.textContent;
      })
    );
  };

  const handleSelect = () => {
    const container = editorRef.current;
    if (!container) return;

    container.childNodes.forEach((childNode) => {
      handleHiddenText(childNode);
    });
  };

  const handleBlur = () => {
    const container = editorRef.current;
    if (!container) return;

    container.childNodes.forEach((childNode) => {
      handleHiddenText(childNode, true);
    });
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
    handleSelect();
  };

  return (
    <>
      <div
        ref={editorRef}
        contentEditable
        className={styles.editor}
        onInput={handleInput}
        onSelect={handleSelect}
        onBlur={handleBlur}
      ></div>
      <div style={{ whiteSpace: "pre-line" }}>{content}</div>
      <button onClick={applyContent}>set Content</button>
    </>
  );
};

export default Editor;
