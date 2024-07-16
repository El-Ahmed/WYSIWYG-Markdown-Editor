import { countHeadingHashes } from "./Editor.utils";

const clearElement = (element: Element) => {
  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);
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
    if (
      ["h1", "h2", "h3", "h4", "h5", "h6"].some((className) =>
        element.classList?.contains(className)
      )
    )
      clearElement(element);
    return;
  }
  if (
    element.classList?.contains(`h${headingsCount}`) &&
    element.textContent?.slice(0, headingsCount + 1) ===
      `${Array(headingsCount).fill("#").join("")} `
  )
    return;

  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);
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
