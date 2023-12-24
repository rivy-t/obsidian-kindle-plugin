export type Author = {
  firstName?: string;
  lastName?: string;
  fullName?: string;
};

export const parseAuthors = (author: string | undefined): Author[] => {
  if (author == null) {
    return [{ firstName: undefined, lastName: undefined, fullName: undefined }];
  }

  if (new RegExp(/\b(and)+/, 'i').exec(author)) {
    return author
      .split(new RegExp(/\b(and|,)+/, 'i'))
      .map((a) => a.trim())
      .filter((a) => ['and', ',', ''].indexOf(a.toLowerCase()) === -1)
      .map(parseSingleAuthor);
  }

  if (author.includes(';')) {
    return author
      .split(';')
      .map((a) => a.trim())
      .map(parseSingleAuthor);
  }

  return [parseSingleAuthor(author)];
};

const parseSingleAuthor = (author: string): Author => {
  const hasComma = author.includes(',');

  if (hasComma) {
    const names = splitAndTrim(',', author);
    const firstName = names.length == 1 ? undefined : splitAndTrim(' ', names[1]).join(' ');
    const lastName = names[0];
    const fullName = [firstName, lastName].filter((s) => s != null).join(' ');
    return {
      firstName,
      lastName,
      fullName,
    };
  }

  const names = splitAndTrim(' ', author);
  const firstName = names.length == 1 ? undefined : names.slice(0, -1).join(' ');
  const lastName = names[names.length - 1];
  const fullName = [firstName, lastName].filter((s) => s != null).join(' ');
  return {
    firstName,
    lastName,
    fullName,
  };
};

const splitAndTrim = (needle: string, author: string): string[] => {
  return author
    .split(needle)
    .map((a) => a.trim())
    .map((a) => a.replace(/\.$/, ''));
};
