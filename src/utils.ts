export function escapeSpecialCharacters(string: string): string {
  return string.replace(
    /"value"\s*:\s*"([\s\S]*?)"\s*,\s*("(?:type|schema)")/g,
    (_match, value, nextKey) => {
      const escapedValue = value
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');

      return `"value": "${escapedValue}", ${nextKey}`;
    },
  );
}

export function unescapeSpecialCharacters(string: string): string {
  return string.replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
}
