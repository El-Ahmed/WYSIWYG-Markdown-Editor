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
    if (startOffset !== undefined && startNode) {
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
  spanNode.className = "to-hide";
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

export const handleHiddenText = (node: ChildNode, hideEverything?: boolean) => {
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const element = node as Element;
  if (
    !Array.from(element.children).some((child) =>
      child?.classList?.contains?.("to-hide")
    )
  )
    return;
  const selection = window.getSelection();
  if (selection?.containsNode(element, true) && !hideEverything) {
    Array.from(element.children).forEach((child) =>
      child.classList.remove("hidden-text")
    );
  } else {
    Array.from(element.children)
      .filter((child) => child.classList.contains("to-hide"))
      .forEach((child) => child.classList.add("hidden-text"));
  }
};

export const handleBold = (node: ChildNode) => {
  const element = node as Element;
  if (element.className.length) return;
  if (!element.textContent?.length) return;
  if (!element.textContent.includes("*")) return;

  const selection = window.getSelection();

  const range =
    selection && selection?.rangeCount > 0
      ? selection?.getRangeAt?.(0)
      : undefined;
  const startOffset = range?.startOffset;
  const selected = selection?.containsNode(element, true);

  const textContent = element.textContent.toString();

  const splitWithAsterisks = (
    asterisksCount: number,
    allText: string
  ): { text: string; bold: boolean; italic: boolean; toHide: boolean }[] => {
    if (asterisksCount < 1) {
      return [{ text: allText, bold: false, italic: false, toHide: false }];
    }
    const delimiter = new Array(asterisksCount).fill("*").join("");

    const textList = allText.split(delimiter);

    return textList.flatMap((text, index) => {
      const addedText = [];
      if (index % 2) {
        if (index < textList.length - 1)
          return [
            { text: delimiter, bold: false, italic: false, toHide: true },
            {
              text,
              bold: asterisksCount > 1,
              italic: asterisksCount !== 2,
              toHide: false,
            },
            { text: delimiter, bold: false, italic: false, toHide: true },
          ];
        else {
          addedText.push({
            text: delimiter,
            bold: false,
            italic: false,
            toHide: true,
          });
        }
      }
      return [...addedText, ...splitWithAsterisks(asterisksCount - 1, text)];
    });
  };

  const styledTexts = splitWithAsterisks(3, textContent);

  element.textContent = "";
  styledTexts.forEach((textObject) => {
    const span = document.createElement("span");
    span.textContent = textObject.text;
    if (textObject.italic && textObject.bold) {
      span.className = "italic bold";
      element.appendChild(span);
      return;
    }
    if (textObject.bold) {
      span.className = "bold";
      element.appendChild(span);
      return;
    }
    if (textObject.italic) {
      span.className = "italic";
      element.appendChild(span);
      return;
    }
    if (textObject.toHide) {
      span.className = "to-hide";
      element.appendChild(span);
      return;
    }
    element.appendChild(span);
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
      }
      return false;
    }
    return true;
  });
};
