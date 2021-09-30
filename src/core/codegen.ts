import { isSelfClosing } from "../types/tagTypes";
import ParseTree from "./parseTree";

function astToHtml(tree: ParseTree): string {
  return createElementFromAstNode(tree);
}

function createElementFromAstNode(node: ParseTree) {
  let html = "";

  if (node.isTextNode) {
    html += node.text;
    return " " + html + " ";
  }

  const type = node.type || "div";

  const classes = node.classes?.join(" ");

  const id = node.id;

  const attributes = node.attributes
    ?.map((attr) => `${attr.key}="${attr.value}"`)
    .join(" ");

  html = `<${type} class="${classes}" id="${id}" ${attributes}`;

  if (isSelfClosing(type)) {
    html += "/>";
    return html;
  }

  html += ">";
  node.children?.forEach((child) => {
    html += createElementFromAstNode(child);
  });

  html += `</${type}>`;

  return html;
}

export default astToHtml;
