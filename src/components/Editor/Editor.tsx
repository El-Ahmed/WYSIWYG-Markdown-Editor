import {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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

  const handleInput = useCallback(() => {
    const container = editorRef.current;
    if (!container) return;
    if (!container.innerText?.length) {
      resetEditor();
      return;
    }
    const lines = content?.split("\n") ?? [];
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

    const text = Array.from(container.children)
      .map((node) => node.textContent)
      .join("\n");
    onContentChange(text);
    setContent(text);
  }, [content, onContentChange]);

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

  const applyContent = useCallback(() => {
    if (!editorRef.current) return;
    if (content.length && content === initialContent) return;
    editorRef.current.innerText = "";
    initialContent.split(/\r?\n/).forEach((text) => {
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
  }, [content, handleInput, initialContent]);

  useEffect(() => {
    applyContent();
  }, [applyContent, initialContent]);

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
    </>
  );
};

export default Editor;
