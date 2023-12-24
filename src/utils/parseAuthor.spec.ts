import { parseAuthors } from './parseAuthor';

describe('parseAuthor', () => {
  it.each([
    ['Michael Port', 'Michael', 'Port', 'Michael Port'],
    ['Strunk Jr., William', 'William', 'Strunk Jr', 'William Strunk Jr'],
    ['Yuval Noah Harari', 'Yuval Noah', 'Harari', 'Yuval Noah Harari'],
    ['P2K', undefined, 'P2K', 'P2K'],
    ['Toole, John Kennedy', 'John Kennedy', 'Toole', 'John Kennedy Toole'],
    [null, undefined, undefined, undefined],
    ['Schwab, V. E.', 'V E', 'Schwab', 'V E Schwab'],
    ['Brandon Sanderson', 'Brandon', 'Sanderson', 'Brandon Sanderson'],
    ['Sanderson, Brandon', 'Brandon', 'Sanderson', 'Brandon Sanderson'],
  ])('Parse "%s" evaluated as firstName: "%s" and lastName: "%s', (author, firstName, lastName, fullName) => {
    const authors = parseAuthors(author);
    expect(authors).toHaveLength(1);
    expect(authors[0]).toEqual({ firstName, lastName, fullName });
  });

  it.each([
    ['Michael Port', 1],
    ['Vicki Robin, Joe Dominguez, And Mr. Money Mustache', 3],
    ['Robert Kegan aNd Lisa Laskow Lahey', 2],
    ['Chan, Francis;Sprinkle, Preston', 2],
  ])('"%s" is parsed as %s author(s)', (author, expectedAuthorCount) => {
    const authors = parseAuthors(author);
    expect(authors).toHaveLength(expectedAuthorCount);
  });
});
