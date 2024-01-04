// ref: <https://github.com/rivy-t/Kindle-Book-List/blob/main/ExportKindleTSV.js>
// ref: <https://github.com/rivy-t/Kindle-Book-List> from <https://github.com/MrMikey59/Kindle-Book-List>

// refs
// <https://gist.github.com/MTco/a3d42a5160a81b120d451a4bc680508e>
// <https://stackoverflow.com/questions/75156869/login-to-amazon-with-cookies-and-scrape-kindle-highlights> @@ <https://archive.is/EmSXK>
// <https://github.com/speric/kindle-highlights>
// <https://readwise.io/bookcision>
// <https://github.com/hadynz/obsidian-kindle-plugin>
// <https://medium.com/nerd-for-tech/scrapping-amazon-website-for-book-information-7ed494197acd> @@ <https://archive.is/0gMcj>
// <https://www.reddit.com/r/kindle/comments/ngw70o/to_get_easily_a_list_of_kindle_books_and_export> @@ <https://archive.is/ZX27X>

// ref: <https://stackoverflow.com/questions/7191429/get-kindle-library-book-list> @@ <https://archive.is/CADyz>
// ref: <https://gist.github.com/usayamadx/9c638d9b70bc714d6dd6043fcd54085f> @@ <https://archive.is/JKMPN>
// ref: <https://gist.github.com/jkubecki/d61d3e953ed5c8379075b5ddd8a95f22> @@ <https://archive.is/2Pp6D>
// ref: [AmazonForums] <https://www.amazonforum.com/s/question/0D54P00007TlcdoSAB/solved-heres-how-to-export-a-list-of-kindle-books-to-excel>

// spell-checker:ignore () booklist
// from <https://gist.github.com/rivy/54d86297cc65bd21a25476d4d2da7d31>
// ToDO: [2022-03-10; rivy] change to use `fetch()` and `async/await`
//   ... available since early 2017 ... <https://caniuse.com/?search=fetch> , <https://caniuse.com/async-functions>

// 1 - login to "https://read.amazon.com"
// 2 - use "F12" to open developer window with "Console"
// 3 - from the "Console" prompt, enter ...

// init
// let xhr = new XMLHttpRequest()
let domain = 'https://read.amazon.com/';
let items = [];
let tsvData = 'ASIN\tTitle\tAuthor(s)\tCover Link\tPercent Read \n';
let booklist;

// ** xhr version crashes with a stack overflow

// // function
// function getItemsList(paginationToken = null) {
//   let url = domain + 'kindle-library/search?query=&libraryType=BOOKS' + ( paginationToken ? '&paginationToken=' + paginationToken : '' ) + '&sortType=recency&querySize=50'
//   xhr.open('GET', url, false)
//   xhr.send()
// }

// // request result
// xhr.onreadystatechange = function() {
//   switch ( xhr.readyState ) {
//     case 0:
//       console.log('uninitialized')
//       break
//     case 1:
//       console.log('loading...')
//       break
//     case 4:
//       if(xhr.status == 200) {
//         let data = xhr.responseText
//         data = JSON.parse(data)
//         if(data.itemsList) {
//           items.push(...data.itemsList)
//         }
//         if(data.paginationToken) {
//           getItemsList(data.paginationToken)
//         }
//       } else {
//         console.log('Failed')
//       }
//       break
//   }
// }

async function getItemsListNEW(paginationToken = null) {
  let url =
    domain +
    'kindle-library/search?query=&libraryType=BOOKS' +
    (paginationToken ? '&paginationToken=' + paginationToken : '') +
    '&sortType=recency&querySize=50';
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.itemsList) {
        items.push(...data.itemsList);
      }
      if (data.paginationToken) {
        await getItemsListNEW(data.paginationToken);
      }
    } else {
      console.log('Failed');
    }
  } catch (error) {
    console.log('Error:', error);
  }
}

// action
//# getItemsList()
await getItemsListNEW()
  .then(() => {
    // to tsv
    items.forEach((item) => {
      // {
      //   "item": {
      //       "asin": "B01F7T7R5O",
      //       "webReaderUrl": "https://read.amazon.com/?asin=B01F7T7R5O",
      //       "productUrl": "https://m.media-amazon.com/images/I/41kILsk+exL._SY400_.jpg",
      //       "title": "Jack of Shadows (Rediscovered Classics Book 23)",
      //       "percentageRead": 0,
      //       "authors": [
      //           "Zelazny, Roger:Haldeman, Joe:"
      //       ],
      //       "resourceType": "EBOOK",
      //       "originType": "PURCHASE",
      //       "mangaOrComicAsin": false
      //   }
      // }
      // {
      //   "item": {
      //       "asin": "B0CJMV9MNR",
      //       "webReaderUrl": "https://read.amazon.com/?asin=B0CJMV9MNR",
      //       "productUrl": "https://m.media-amazon.com/images/I/51gRE89L66L._SY400_.jpg",
      //       "title": "The Healer’s Way (Book 1): A Portal Progression Fantasy Series (The Healer's Way)",
      //       "percentageRead": 0,
      //       "authors": [
      //           "Sapphire, Oleg:Kovtunov, Alexey:"
      //       ],
      //       "resourceType": "EBOOK",
      //       "originType": "PURCHASE",
      //       "mangaOrComicAsin": false
      //   }
      // }
      // {
      //   "item": {
      //       "asin": "B002EWUKPW",
      //       "webReaderUrl": "https://read.amazon.com/?asin=B002EWUKPW",
      //       "productUrl": "https://m.media-amazon.com/images/I/51Sf8UobJKL._SY400_.jpg",
      //       "title": "Paranoia: A Novel",
      //       "percentageRead": 0,
      //       "authors": [
      //           "Finder, Joseph:"
      //       ],
      //       "resourceType": "EBOOK",
      //       "originType": "PURCHASE",
      //       "mangaOrComicAsin": false
      //   }
      // }
      // console.log({ item });
      tsvData +=
        item.asin +
        '"\t"' +
        item.title +
        '"\t"' +
        item.authors +
        '"\t"' +
        item.productUrl +
        '"\t"' +
        item.percentageRead +
        '" \n"';
    });
  })
  .then(() => {
    booklist = 'data:text/tsv;charset=utf8,' + encodeURIComponent(tsvData);
  })
  .then(() => console.log('DONE with booklist construction'));

//// This fails in Chrome
//window.location = 'data:text/csv;charset=utf8,' + encodeURIComponent(tsvData)
//window.location = booklist

// * note: un-synchronized ... use this later code after items is fully populated

// Try this code  instead with Chrome:
var win = window.open();
win.document.write(
  '<iframe src="' +
    booklist +
    '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
);
