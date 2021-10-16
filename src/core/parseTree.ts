import { HtmlAttributeType, ParseTreeInitializer } from '../types/utilTypes';

class ParseTree {
  type: string | undefined;
  classes: Array<string> | undefined;
  id: string | undefined;
  attributes: Array<HtmlAttributeType> | undefined;
  text: string | undefined;
  children: Array<ParseTree> | undefined;
  isTextNode?: boolean | undefined;

  constructor(init?: ParseTreeInitializer) {
    init = init || {};
    this.type = init.type || '';
    this.classes = init.classes || [];
    this.id = init.id || '';
    this.attributes = init.attributes || [];
    this.text = init.text || '';
    this.children = init.children || [];
    this.isTextNode = init.isTextNode || false;
  }
}

export function generateParseTree(options?: ParseTreeInitializer) {
  return new ParseTree(options);
}

export default ParseTree;
