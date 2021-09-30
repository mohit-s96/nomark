export function createError(token?: string, line?: number) {
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
