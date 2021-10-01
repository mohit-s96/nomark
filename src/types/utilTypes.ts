import ParseTree from '../core/parseTree';

export type HtmlAttributeType = {
  key: string;
  value: string;
};

export type ParseTreeInitializer = {
  type?: string;
  classes?: Array<string>;
  id?: string;
  attributes?: Array<HtmlAttributeType>;
  text?: string;
  isTextNode?: boolean;
  children?: Array<ParseTree>;
};

export type AttributeType = 'class' | 'attribute' | 'id' | 'type' | '';

export type ErrorLevel = 'warn' | 'throw' | 'ignore';
