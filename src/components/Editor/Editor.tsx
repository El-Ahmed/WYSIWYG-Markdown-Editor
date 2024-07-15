import {
  KeyboardEvent,
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./Editor.module.scss";

import {
  handleTextContentHeading,
  handleUnwantedElement,
} from "./Editor.helper";
import { EditorProps } from "./Editor.types";

const Editor: FC<EditorProps> = ({ initialContent, onContentChange }) => {
  const editorRef: MutableRefObject<null | HTMLDivElement> = useRef(null);
  const [content, setContent] = useState("");

  const handleInput = useCallback(() => {
    if (!editorRef.current?.innerText) return;

    onContentChange(editorRef.current.innerText);
    setContent(editorRef.current.innerText);
    const childNodes = editorRef.current?.childNodes;
    childNodes?.forEach((node) => {
      const newNode = handleUnwantedElement(node);
      handleTextContentHeading(newNode);
    });
  }, [onContentChange]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const selection = window.getSelection();

    const containerElement = editorRef.current as HTMLElement;
    if (!selection?.containsNode(containerElement, true)) return;

    let focusElement = selection.focusNode as HTMLElement | null;
    const currentRange = selection?.getRangeAt(0);

    while (focusElement && focusElement.parentElement !== containerElement) {
      focusElement = focusElement?.parentElement;
    }
    const brElement = document.createElement("br");
    if (focusElement) {
      focusElement?.after(brElement);
    } else {
      currentRange.insertNode(brElement);
    }
    const range = document.createRange();
    range.setStartAfter(brElement);
    range.collapse(true);

    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const handleSelect = () => {
    const containerElement = editorRef.current as HTMLElement;
    containerElement.childNodes.forEach((element) => {
      const firstChild = element.firstChild as Element;
      if (
        firstChild?.classList?.contains?.("hashes") &&
        !firstChild?.classList?.contains?.("hidden-text")
      ) {
        firstChild.classList.add("hidden-text");
      }
    });

    const selection = window.getSelection();

    containerElement.childNodes.forEach((element) => {
      const firstChild = element.firstChild as Element;
      if (
        firstChild?.classList?.contains?.("hashes") &&
        firstChild?.classList?.contains?.("hidden-text")
      ) {
        if (selection?.containsNode(element, true)) {
          firstChild.classList.remove("hidden-text");
        }
      }
    });
  };

  useEffect(() => {
    if (!editorRef.current) return;
    if (content === initialContent) return;
    editorRef.current.innerText = initialContent.endsWith("\n")
      ? initialContent
      : `${initialContent}\n`;
    handleInput();
  }, [content, editorRef, handleInput, initialContent]);

  return (
    <>
      <div
        ref={editorRef}
        contentEditable
        className={styles.editor}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onSelect={handleSelect}
      ></div>
      <div style={{ whiteSpace: "pre-line" }}>{content}</div>
    </>
  );
};

export default Editor;
