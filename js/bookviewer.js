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
    bilatu.onclick = () => {
      let isbn = this.isbn.value.trim();
      console.log("bilatu");
      console.log("isbn " + isbn);
      console.log("Helbidea " + this.search_base + isbn);
      fetch(`${this.search_base}${isbn}`)
        .then((resp) => resp.json())
        .then((datos) => {
          console.log(datos);
          this.handleSearchData(datos);
        

        });
    };
  }

  extractBookData = (data) => {
    console.log("extractBookData");
    // json objektu egoki bat bueltatu, zure webgunean erabili ahal izateko

    //Fetch ez da erabiltzen.
    /*
    return fetch(`${this.search_base}${isbn}`)
      .then((resp) => resp.json())
      .then((bookData) => {
        console.log(bookData);
        */

    let bookData = data;

    if (bookData.docs && bookData.docs.length > 0) {
      const book = bookData.docs[0];
      return {
        izenburua: book.title,
        egilea: book.author_name ? book.author_name[0] : "Unknown Author",
        data: book.first_publish_year || "Unknown Date",
        isbn: book.isbn ? book.isbn[0] : "Unknown ISBN",
        filename: book.cover_i ? `${book.cover_i}-M.jpg` : "default-cover.jpg",
      };
      
    } else {
      console.warn("No book data found for the given ISBN.");
      return null;
    }
  };



  handleSearchData = (data) => {
    console.log("handleSearchData");
    // lortu liburua data objektutik
    //const isbn = this.isbn.value.trim();

    if (data) {
      let book = this.extractBookData(data);
      console.log(book);
        if (book) {
          if (!this.data.some((b) => b.isbn === book.isbn)) {
            this.index = this.addBookToData(book, this.data);
          }
          console.log("udpate view from method handleSearchData");
          this.updateView(book);
          
        }
    } else {
      console.warn("Sartu ISBN bat.");
    }
  };

  addBookToData = (book, data) => {
    console.log("addBookToData");
    // data array-ean sartu liburua, eta liburu berriaren posizioa bueltatu
    if (!book) return -1;
    data.push(book);
    return data.length - 1;
  };

  //Oharra: Orrialdea lehenengo aldiz kargatzerakoan, libururik agertu ez dadin index = -1 jartzea okurritu zait baina horrela ez du test bat pasatzen.
  updateView(book) {
    console.log("updateView");
    // liburuaren datu guztiak bistaratu

    //FIXME
    const currentBook = book || this.data[this.index];

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
