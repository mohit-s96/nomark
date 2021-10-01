import { ErrorLevel } from '../types/utilTypes';

export function createError(
  token?: string,
  line?: number,
  errorLevel: ErrorLevel = 'ignore'
) {
  switch (errorLevel) {
    case 'warn':
      console.warn(getErrorMessage(token || '', line || 0));
      break;
    case 'throw':
      throw new Error(getErrorMessage(token || '', line || 0));
    default:
      break;
  }
}

function getErrorMessage(token: string, line: number) {
  if (token === 'fatal' && line) {
    return `a fatal error was detected at line ${line}. this could arise due to a possible infinite loop.`;
  }
  if (token && line) {
    return `compile error at the symbol "${token}" at line ${line}:`;
  }
  if (!line && token) {
    return `compile error at the symbol "${token}"`;
  }
  if (!line && !token) {
    return 'an error occured while parsing';
  }
  return 'something went wrong while compiling the nm source';
}
