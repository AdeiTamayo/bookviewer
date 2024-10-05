export class BookViewer {
    constructor(data, base) {
        this.base = base;
        this.search_base = 'https://openlibrary.org/search.json?isbn=';
        this.data = data || [];
        this.index = 0;

        // Elements to display book data
        this.irudia = document.getElementById("irudia");
        this.egilea = document.getElementById("egilea");
        this.izenburua = document.getElementById("izenburua");
        this.dataElem = document.getElementById("data");
        this.isbn = document.getElementById("isbn");
        this.liburuKopuru = document.querySelector("#liburuKopuru");

        this.initButtons();
        // Metodoa komentatu lehenengo iterazioan erabiltzen ez baita.
        // this.updateView(); 
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
            this.handleSearchData();
          
        };
    }

    extractBookData = (isbn) => {
        // json objektu egoki bat bueltatu, zure webgunean erabili ahal izateko
        return fetch(`${this.search_base}${isbn}`)
            .then(resp => resp.json())  // Convert the response to JSON
            .then(bookData => {
                console.log(bookData);
                
                if (bookData.docs && bookData.docs.length > 0) {
                    const book = bookData.docs[0];  
                    return {
                        title: book.title,
                        author: book.author_name ? book.author_name[0] : "Unknown Author",
                        publish_date: book.first_publish_year || "Unknown Date",
                        isbn: isbn,
                        cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : "default-cover.jpg"
                    };
                } else {
                    console.warn("No book data found for the given ISBN.");
                    return null;
                }
            })
            .catch(error => {
                console.error('Error fetching book data:', error);
                return null;
            });
    };

    addBookToData = (book, data) => {
        // data array-ean sartu liburua, eta liburu berriaren posizioa bueltatu
        if (!book) return -1;  // FIXME: Gehitu `book` ez bada baliozkoa, -1 itzultzeko (segurtasuna gehitzeko).
        data.push(book);  // Add book to the data array
        return data.length - 1;  // Return the index of the newly added book
    };

    handleSearchData = () => {
        // lortu liburua data objektutik
        const isbn = this.isbn.value.trim();
        if (isbn) {
            this.extractBookData(isbn).then(book => {
                if (book) {
                    if (!this.data.some(b => b.isbn === book.isbn)) {
                        this.index = this.addBookToData(book, this.data);
                    }
                    this.updateView();
                }
            });
        } else {
            console.log("Sartu ISBN bat.");
        }
    };

    updateView() {
        // liburuaren datu guztiak bistaratu
        if (this.data.length > 0 && this.data[this.index]) {
            const currentBook = this.data[this.index];
            
            console.log(currentBook);
            
            this.irudia.src = currentBook.filename ? `${this.base}${currentBook.filename}` : "default-cover.jpg";
            this.egilea.value = currentBook.egilea;
            this.izenburua.value = currentBook.izenburua;
            this.dataElem.value = currentBook.data;
            this.isbn.value = currentBook.isbn;
            this.liburuKopuru.innerHTML = this.data.length;
            
        } else {
            this.irudia.src = "";  
            this.egilea.value = "";
            this.izenburua.value = "";
            this.dataElem.value = "";
            this.isbn.value = "";
            this.liburuKopuru.innerHTML = this.data.length;
        }
    }

    nextBook() {
        // Hurrengo indizea lortu eta updateView funtzioa erabili bistaratzeko
        if (this.index < this.data.length - 1) {
            this.index++;
        } else if (this.index === this.data.length - 1) {
            this.index = 0;
        }
        this.updateView();
    }

    prevBook() {
        // Aurreko indizea lortu eta updateView funtzioa erabili bistaratzeko
        if (this.index > 0) {
            this.index--;
        } else if (this.index === 0) {
            this.index = this.data.length - 1;  
        }
        this.updateView();
    }
}
