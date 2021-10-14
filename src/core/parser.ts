import {
  AttributeType,
  ErrorLevel,
  HtmlAttributeType,
} from '../types/utilTypes';
import { createError } from './errors';
import ParseTree from './parseTree';
import Stack from './stack';

function getNode(): ParseTree {
  return new ParseTree();
}

function parseAttributes(
  buffer: string,
  index: number,
  line: number,
  errorLevel: ErrorLevel
) {
  const classes: string[] = [];
  let id = '';
  let type = '';
  const attributes: HtmlAttributeType[] = [];

  let i = index;

  const len = buffer.length;

  let currentBuffer = '';

  let currentType: AttributeType = '';

  function updateBuffers() {
    switch (currentType) {
      case 'attribute':
        const arr = currentBuffer.split('=');
        const key = arr[0];
        const value = arr[1];
        attributes.push({ key, value });
        break;
      case 'class':
        classes.push(currentBuffer);
        break;
      case 'id':
        id = currentBuffer;
        break;
      case 'type':
        type = currentBuffer;
        break;
      default:
        break;
    }
    currentBuffer = '';
    currentType = '';
  }

  while (buffer[i] !== '*') {
    if (buffer[i] === '.' && currentType! === '') currentType = 'class';
    else if (buffer[i] === '#' && currentType! === '') currentType = 'id';
    else if (buffer[i] === '@' && currentType! === '') currentType = 'type';
    else if (buffer[i] === '`' && currentType! === '')
      currentType = 'attribute';
    else if (buffer[i] === ' ') {
      updateBuffers();
    } else {
      currentBuffer += buffer[i];
    }
    i++;
    if (i === len) {
      createError('fatal', line, errorLevel);
      if (errorLevel !== 'warn') {
        console.error(
          'Infinite loop detected at line' +
            line +
            " this isn't an issue as it will always be detected and resolved but your nomark text might not be following the specs"
        );
      }
      break;
    }
  }

  updateBuffers();

  i = i - 1;

  const returnVal = {
    id,
    type,
    classes,
    attributes,
    index: i,
  };

  return returnVal;
}

function createTextNode(currentNode: ParseTree, buffer: string) {
  const node = getNode();
  node.isTextNode = true;
  let rg = /\n[ \t]*/gi;
  let str = buffer;

  if (currentNode.type !== 'pre' && currentNode.type !== 'code') {
    str = str!.replace(rg, ' ');
    str = str.trim();
  }
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/\\/g, '');

  if (currentNode.type === 'code') {
    // debugger;
    let len = str.length;
    let idx = 0;
    let temp = '';
    while (idx < len) {
      if (str[idx] === ' ' && str[idx + 1] === ' ' && str[idx - 1] === '\n') {
        idx += 5;
        continue;
      }
      temp = temp.concat(str[idx]);
      idx++;
    }
    str = temp;
  }

  node.text = str;
  currentNode!.children?.push(node);
  buffer = '';
  return '';
}

function parser(rawData: string, errorLevel?: ErrorLevel): ParseTree {
  const length = rawData.length;

  if (length < 2) {
    return new ParseTree({
      type: 'null',
    });
  }
  //{\n  *.flex .flex-col*\n  {\n    \n      *@pre*\n      {\n        *@code .language-javascript*\n        function(x)\\{\n          \n        \n      \\}\n      }\n      \n    \n  }\n}
  const stack = new Stack<string>();

  let nodes = new Stack<ParseTree>();

  let nestingLevel = -1;

  let currentNode: ParseTree | any = {};

  let lineCount = 1;

  let isTextActive = false;

  let activeTextBuffer = '';

  let codeEditing = false;

  function addToTextBuffer(char: string) {
    if (char === '\n') {
      lineCount++;
    }
    if (!isTextActive && char !== ' ' && char !== '\n') {
      isTextActive = true;
      activeTextBuffer += char;
    } else if (isTextActive) {
      activeTextBuffer += char;
    }
  }

  for (let i = 0; i < length; i++) {
    const char = rawData[i];
    if (char === '{') {
      if (codeEditing) {
        addToTextBuffer(char);
        continue;
      }
      if (rawData[i - 1] === '\\') {
        addToTextBuffer(char);
        continue;
      }
      if (activeTextBuffer.length > 0) {
        activeTextBuffer = createTextNode(currentNode!, activeTextBuffer);
      }
      stack.push(char);
      isTextActive = false;
      if (nestingLevel === -1) {
        nodes.push(getNode());
        currentNode = nodes.top();
        nestingLevel++;
      } else {
        const newNode = getNode();
        currentNode!.children?.push(newNode);
        nodes.push(newNode);
        currentNode = newNode;
        nestingLevel++;
      }
    } else if (char === '}') {
      if (codeEditing) {
        addToTextBuffer(char);
        continue;
      }
      if (rawData[i - 1] === '\\') {
        addToTextBuffer(char);
        continue;
      }
      if (stack.top() !== '{') {
        createError(char, lineCount, errorLevel);
      } else if (nestingLevel === -1) {
        createError(char, lineCount, errorLevel);
      } else if (nestingLevel === 0) {
        stack.pop();
        continue;
      } else {
        if (activeTextBuffer.length > 0) {
          activeTextBuffer = createTextNode(currentNode!, activeTextBuffer);
        }
        nodes.pop();
        stack.pop();
        currentNode = nodes.top();
        nestingLevel--;
        isTextActive = false;
      }
    } else if (char === '*') {
      if (codeEditing) {
        addToTextBuffer(char);
        continue;
      }
      if (rawData[i - 1] === '\\') {
        continue;
      }
      if (stack.top() === '*') {
        stack.pop();
      } else {
        stack.push(char);

        const parseResults = parseAttributes(
          rawData,
          i + 1,
          lineCount,
          errorLevel!
        );

        i = parseResults.index;

        currentNode!.attributes = parseResults.attributes;

        currentNode!.classes = parseResults.classes;

        currentNode!.id = parseResults.id;

        currentNode!.type = parseResults.type;
      }
    } else {
      if (char === '`') {
        if (currentNode?.type === 'code') {
          if (rawData[i - 1] !== '\\') {
            if (stack.top() === char) {
              codeEditing = false;
              stack.pop();
            } else {
              stack.push(char);
              codeEditing = true;
            }
            continue;
          }
        }
      }
      addToTextBuffer(char);
    }
  }

  if (stack.top()) {
    createError('', 0, errorLevel);
  }

  return nodes.top();
}
export default parser;
