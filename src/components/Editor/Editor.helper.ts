import { countHeadingHashes } from "./Editor.utils";

export const handleTextContentHeading = (node: ChildNode) => {
  if (node.nodeType !== Node.TEXT_NODE) return;
  if (!node?.textContent) return;

  const hashesCount = countHeadingHashes(node.textContent);
  if (!hashesCount) return;

  const selection = window.getSelection();
  const selected = selection?.containsNode(node, true);
  const startOffset = selection?.getRangeAt?.(0)?.endOffset;

  const headingTag = `h${hashesCount}`;
  const containerSpan = document.createElement(headingTag);
  node.replaceWith(containerSpan);

  const textNode = document.createTextNode(node.textContent);
  containerSpan.appendChild(textNode);

  // if selected reselect
  if (!selected) return;

  const range = document.createRange();
  if (startOffset) range.setStart(textNode, startOffset);
  else range.setStartAfter(textNode);
  range.collapse(true);

  selection?.removeAllRanges();
  selection?.addRange(range);
};

export const handleUnwantedElement = (node: ChildNode): ChildNode => {
  if (node.nodeType !== Node.ELEMENT_NODE) return node;
  const element = node as Element;
  if (
    element.tagName === "BR" ||
    (element.firstChild as Element)?.tagName === "BR"
  )
    return node;

  const tagName = element.tagName.toLowerCase();
  if (tagName.match(/^h[1-6]$/)) {
    const headingNumber = parseInt(tagName.substring(1));
    if (
      node?.textContent &&
      countHeadingHashes(node.textContent) === headingNumber
    )
      return node;
  }

  // whenever text is not text node or br or contains br make it text node
  const textNode = document.createTextNode(node.textContent ?? "");

  const selection = window.getSelection();
  const selected = selection?.containsNode(node, true);
  const startOffset = selection?.getRangeAt?.(0)?.startOffset;

  node.replaceWith(textNode);

  // if selected reselect
  if (!selected) return textNode;

  const range = document.createRange();
  if (startOffset) range.setStart(textNode, startOffset);
  else range.setStartAfter(textNode);
  range.collapse(true);

  selection?.removeAllRanges();
  selection?.addRange(range);

  return textNode;
};
