export class BookViewer {
  constructor(data, base) {
    this.base = base;
    this.search_base = "https://openlibrary.org/search.json?isbn=";
    this.data = data || [];
    this.index = 0;

    // Elements to display book data
    this.irudia = document.getElementById("irudia");
    this.egilea = document.getElementById("egilea");
    this.izenburua = document.getElementById("izenburua");
    this.dataElem = document.getElementById("data");
    this.isbn = document.getElementById("isbn");
    this.liburuKopuru = document.querySelector("#liburuKopuru");
    this.isbnValue = this.isbn.value.trim();

    this.initButtons();
    // Metodoa komentatu lehenengo iterazioan erabiltzen ez baita.
    this.updateView();
  }

  initButtons() {
    // aurrera, atzera eta bilatu botoiak hasieratu
    let aurrera = document.querySelector("#aurrera");
    let atzera = document.querySelector("#atzera");
    let bilatu = document.querySelector("#bilatu");

    // bilatu botoia sakatzean, erabiltzaileak sartu duen isbn-a duen liburua lortu
    // eta handleSearchData funtzioa exekutatu
    aurrera.onclick = () => this.nextBook();
    atzera.onclick = () => this.prevBook();
    bilatu.onclick = () => this.handleSearchData();
  }

  extractBookData = (isbn) => {
    console.log("extractBookData");
    // json objektu egoki bat bueltatu, zure webgunean erabili ahal izateko
    return fetch(`${this.search_base}${isbn}`)
      .then((resp) => resp.json())
      .then((bookData) => {
        console.log(bookData);

        if (bookData.docs && bookData.docs.length > 0) {
          const book = bookData.docs[0];
          return {
            izenburua: book.title,
            egilea: book.author_name ? book.author_name[0] : "Unknown Author",
            data: book.first_publish_year || "Unknown Date",
            isbn: isbn,
            filename: book.cover_i
              ? `${book.cover_i}-M.jpg`
              : "default-cover.jpg",
          };
        } else {
          console.warn("No book data found for the given ISBN.");
          return null;
        }
      })
      .catch((error) => {
        console.error("Error fetching book data:", error);
        return null;
      });
  };

  addBookToData = (book, data) => {
    console.log("addBookToData");
    // data array-ean sartu liburua, eta liburu berriaren posizioa bueltatu
    if (!book) return -1;
    data.push(book);
    return data.length - 1;
  };

  handleSearchData = () => {
    console.log("handleSearchData");
    // lortu liburua data objektutik
    const isbn = this.isbn.value.trim();

    if (isbn) {
      this.extractBookData(isbn).then((book) => {
        if (book) {
          if (!this.data.some((b) => b.isbn === book.isbn)) {
            this.index = this.addBookToData(book, this.data);
          }
          this.updateView();
        }
      });
    } else {
      console.warn("Sartu ISBN bat.");
    }
  };

  updateView() {
    console.log("updateView");
    // liburuaren datu guztiak bistaratu

    const currentBook = this.data[this.index];

    console.log(currentBook);

    this.irudia.src = currentBook.filename
      ? `${this.base}${currentBook.filename}`
      : "default-cover.jpg";
    this.egilea.value = currentBook.egilea;
    this.izenburua.value = currentBook.izenburua;
    this.dataElem.value = currentBook.data;
    this.isbn.value = currentBook.isbn;
    this.liburuKopuru.innerHTML = this.data.length;
  }

  nextBook() {
    // Hurrengo indizea lortu eta updateView funtzioa erabili bistaratzeko
    if (this.index < this.data.length - 1) {
      this.index++;

      //Kode hau liburuen array-a eskuinetikan bukatzen denean, lehenengo liburura itzultzeko erabiltzen da
      /*
    } else if (this.index === this.data.length - 1) {
      this.index = 0;
    */
    }
    this.updateView();
  }

  prevBook() {
    // Aurreko indizea lortu eta updateView funtzioa erabili bistaratzeko
    if (this.index > 0) {
      this.index--;
      //Kode hau liburuen array-a ezkerretara bukatzen denean, azkenengo liburura itzultzeko erabiltzen da
      /*
    } else if (this.index === 0) {
      this.index = this.data.length - 1;
      */
    }

    this.updateView();
  }
}
