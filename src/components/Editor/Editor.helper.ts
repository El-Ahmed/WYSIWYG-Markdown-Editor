import { countHeadingHashes } from "./Editor.utils";

const clearElement = (element: Element) => {
  const selection = window.getSelection();

  const range =
    selection && selection?.rangeCount > 0
      ? selection?.getRangeAt?.(0)
      : undefined;
  const startOffset = range?.startOffset;

  if (element.childElementCount > 0)
    element.textContent = element.textContent?.toString() ?? null;
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
    element.childNodes.length === 1 &&
    element.firstElementChild?.tagName === "BR"
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
    element.childNodes.length === 1 &&
    element.firstElementChild?.tagName === "BR"
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
