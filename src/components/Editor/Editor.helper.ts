import { countHeadingHashes } from "./Editor.utils";

const clearElement = (element: Element) => {
  const selection = window.getSelection();

  const range =
    selection && selection?.rangeCount > 0
      ? selection?.getRangeAt?.(0)
      : undefined;
  let startOffset = range?.startOffset;

  if (element.childElementCount > 0) {
    const startNode = range?.startContainer;
    if (startOffset && startNode) {
      Array.from(element.childNodes).every((childElement) => {
        if (childElement.firstChild?.isSameNode(startNode)) return false;
        startOffset += childElement.textContent?.length ?? 0;
        return true;
      });
    }
    element.textContent = element.textContent?.toString() ?? null;
  }
  element.className = "";
  if (
    selection?.containsNode(element, true) &&
    range &&
    startOffset &&
    element.firstChild
  ) {
    range?.setStart(element.firstChild, startOffset);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

export const handleHeadingNode = (node: ChildNode) => {
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const element = node as Element;
  if (
    (element.childNodes.length === 1 &&
      element.firstElementChild?.tagName === "BR") ||
    (element.childNodes.length === 1 &&
      element.firstElementChild?.firstElementChild?.tagName === "BR")
  ) {
    element.className = "";
    return;
  }
  if (!element.textContent) {
    clearElement(element);
    return;
  }
  const headingsCount = countHeadingHashes(element.textContent);
  if (!headingsCount) {
    clearElement(element);
    return;
  }
  if (
    element.className === `h${headingsCount}` &&
    element.textContent?.slice(0, headingsCount + 1) ===
      `${Array(headingsCount).fill("#").join("")} `
  ) {
    return;
  }

  const selection = window.getSelection();
  const range =
    selection && selection?.rangeCount > 0
      ? selection?.getRangeAt?.(0)
      : undefined;
  const startOffset = range?.startOffset;

  element.textContent = element.textContent.slice(headingsCount + 1);

  const spanNode = document.createElement("span");
  spanNode.className = "hashes";
  spanNode.textContent = `${Array(headingsCount).fill("#").join("")} `;
  element.insertAdjacentElement("afterbegin", spanNode);
  element.className = `h${headingsCount}`;

  if (
    selection?.containsNode(element, true) &&
    range &&
    startOffset &&
    element.lastChild
  ) {
    const offset = startOffset - headingsCount - 1;
    if (offset > 0) {
      range?.setStart(element.lastChild, startOffset - headingsCount - 1);
    } else if (element.firstChild?.firstChild) {
      range?.setStart(element.firstChild.firstChild, startOffset);
    }
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

export const handleBreakNode = (node: ChildNode) => {
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const element = node as Element;
  if (
    (element.childNodes.length === 1 &&
      element.firstElementChild?.tagName === "BR") ||
    (element.childNodes.length === 1 &&
      element.firstElementChild?.firstElementChild?.tagName === "BR")
  ) {
    element.className = "break";
    return;
  }
};

export const handleHiddenHashes = (
  node: ChildNode,
  hideEverything?: boolean
) => {
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const element = node as Element;
  if (!element.firstElementChild?.classList?.contains?.("hashes")) return;
  const selection = window.getSelection();
  if (selection?.containsNode(element, true) && !hideEverything) {
    element.firstElementChild.classList.remove("hidden-text");
  } else {
    element.firstElementChild.classList.add("hidden-text");
  }
};

// combine all text nodes after first hashes
// then tokenize it with *** *** and put them in span
export const handleBold = (node: ChildNode) => {
  const element = node as Element;
  if (element.className.length) return;
  if (!element.textContent?.length) return;
  if (!element.textContent.includes("**")) return;

  const selection = window.getSelection();

  const range =
    selection && selection?.rangeCount > 0
      ? selection?.getRangeAt?.(0)
      : undefined;
  const startOffset = range?.startOffset;
  const selected = selection?.containsNode(element, true);

  const textContent = element.textContent.toString();

  const textList = textContent.split("**");
  if (textList.length < 3) return;

  element.textContent = "";
  if (textList.length % 2 === 0) {
    const lastTwo = textList.slice(-2);

    const joinedString = lastTwo.join("**");

    textList.splice(-2, 2, joinedString);
  }

  textList.forEach((text, index) => {
    const span = document.createElement("span");
    span.textContent = text;
    if (index % 2 && index < textList.length - 1) {
      span.className = "bold";
    }
    element.appendChild(span);
    if (index < textList.length - 1) {
      const asteriskSpan = document.createElement("span");
      asteriskSpan.textContent = "**";
      element.appendChild(asteriskSpan);
    }
  });

  let charCount = 0;
  if (!startOffset || !range || !selection || !selected) return;
  Array.from(element.children).every((childElement) => {
    if (!childElement.textContent) return true;
    charCount += childElement.textContent.length;
    if (charCount >= startOffset) {
      const newOffset =
        startOffset - (charCount - childElement.textContent?.length);
      if (childElement.firstChild) {
        range.setStart(childElement.firstChild, newOffset);
        selection.removeAllRanges();
        selection.addRange(range); //
        // console.log("bold", range.startContainer, range.startOffset);
      }
      return false;
    }
    return true;
  });
};
