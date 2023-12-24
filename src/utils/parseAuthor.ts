type Author = { firstName: string; lastName: string };

export const parseAuthors = (author: string | undefined): Author[] => {
  if (author == null) {
    return [{ firstName: undefined, lastName: undefined }];
  }

  if (new RegExp(/\b(and)+/, 'i').exec(author)) {
    return author
      .split(new RegExp(/\b(and|,)+/, 'i'))
      .map((a) => a.trim())
      .filter((a) => ['and', ',', ''].indexOf(a.toLowerCase()) === -1)
      .map(parseSingleAuthor);
  }

  if (author.includes(';')) {
    return author.split(';').map((a) => a.trim()).map(parseSingleAuthor);
  }

  return [parseSingleAuthor(author)];
};

const commonGenerationalSuffixes = ['I', 'II', 'III', 'IV', 'V', 'Jr[.]?', 'Sr[.]?'];
const commonHonorificPrefixes = ['Dr[.]?', 'Miss', 'Mr[.]?', 'Mrs[.]?', 'Ms[.]?'];
const commonHonorificSuffixes = ['M[.]?D[.]?', 'Ph[.]?D[.]?'];

const parseSingleAuthor = (author: string): Author => {
  // parse a "western-tradition" name (or names) with possible honorifics and suffixes
  // ref: https://stackoverflow.com/questions/17455658/human-name-parsing
  // ref: https://www.humangraphics.io/blog/whats-in-a-name-part-1-introduction
  // note: due to the complexity and ambiguity in parsing names, this is a best-effort attempt

  const modifiedAuthor = author
    // * normalize any comma-separated suffixes
    .replace(
      new RegExp(
        `(?:,\s*)?\b(${
          [...commonGenerationalSuffixes, ...commonHonorificSuffixes].join('|')
        })(?:\b|$)`,
        'gim',
      ),
      (_match, substr) => (substr as string).replace('.', ''),
    )
    // * remove generational suffixes
    .replace(new RegExp(`\b(${commonGenerationalSuffixes.join('|')})\b`, 'gim'), '')
    // * remove honorific prefixes
    .replace(new RegExp(`\b(${commonHonorificPrefixes.join('|')})\b`, 'gim'), '')
    // * remove honorific suffixes
    .replace(new RegExp(`\b(${commonHonorificSuffixes.join('|')})\b`, 'gim'), '');

  const hasComma = modifiedAuthor.includes(',');

  if (hasComma) {
    const names = splitAndTrim(',', modifiedAuthor);
    return {
      firstName: names.length == 1 ? undefined : splitAndTrim(' ', names[names.length - 1])[0],
      lastName: names[0],
    };
  }

  const names = splitAndTrim(' ', author);
  return { firstName: names.length == 1 ? undefined : names[0], lastName: names[names.length - 1] };
};

const splitAndTrim = (needle: string, author: string): string[] => {
  return author
    .split(needle)
    .map((a) => a.trim())
    .map((a) => a.replace(/\.$/, ''))
    .filter((a) => a !== '');
};
