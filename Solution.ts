/*Solution


Single Responsibility Principle: La clase LibraryManager se ocupa únicamente de la lógica de la biblioteca, mientras que el servicio EmailService se ocupa del envío de correos electrónicos.
 
Open/Closed Principle: Las clases están abiertas para extensión (por ejemplo, añadiendo más tipos de notificaciones) pero cerradas para modificación.

Liskov Substitution Principle: User implementa la interfaz IObserver, lo que significa que se puede sustituir por cualquier otro objeto que también implemente la interfaz.

Dependency Inversion Principle: Se inyecta IEmailService en LibraryManager, lo que significa que LibraryManager no depende de una implementación concreta.

Inyección de Dependencias:
Inyectar IEmailService en LibraryManager.

Lambda Expressions:
Usar expresiones lambda en funciones como find y forEach.

Singleton Pattern:
Garantizar que solo haya una instancia de LibraryManager con el método getInstance.

Observer Pattern:
Los usuarios (User) se registran como observadores y son notificados cuando se añade un nuevo libro.

Builder Pattern:
Se utiliza para construir instancias de Book de una manera más limpia y escalable.

Refactorización:
eliminar el uso de ANY mejorar el performance

Aspectos (Opcional)
Puedes anadir logs de info, warning y error en las llamadas, para un mejor control

Diseño por Contrato (Opcional):
Puedes anadir validaciones en precondiciones o postcondiciones como lo veas necesario*/



//Single Responsibility Principle: La clase LibraryManager se ocupa únicamente de la lógica de la biblioteca, mientras que el servicio EmailService se ocupa del envío de correos electrónicos.
 
class LibraryManager {
    //Singleton Pattern:
    //Garantizar que solo haya una instancia de LibraryManager con el método getInstance.

    //Refactorización:
    //eliminar el uso de ANY mejorar el performance

    private static instance: LibraryManager;
    private books: Book[] = [];
    private loans: Loan[] = [];
    private observers: IObserver[] = [];

    private constructor() {

    }

    static getInstance(): LibraryManager {
        if (!LibraryManager.instance) {
            LibraryManager.instance = new LibraryManager();
        }
        return LibraryManager.instance;
    }

    addObserver(observer: IObserver) {
        this.observers.push(observer);
    }

    removeObserver(observer: IObserver) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    

    //Open/Closed Principle: Las clases están abiertas para extensión (por ejemplo, añadiendo más tipos de notificaciones) pero cerradas para modificación.
    
    notifyObservers(message: string) {
        console.log('mensaje:  ${message}');
    }

    notifyininfo(message: string) {
        console.log('Info:  ${message}');
    }

    notifywarning(message: string) {
        console.log('Warning:  ${message}');
    }

    notifysucess(message: string) {
        console.log('Warning:  ${message}');
    }

    

    addBook(book: Book) {
        this.books.push(book);
        this.notifyObservers(`Se ha añadido un nuevo libro: ${book.title}`);
    }

    removeBook(ISBN: string) {

        //Lambda Expressions:
        //Usar expresiones lambda en funciones como find y forEach.
        const index = this.books.findIndex(book => book.ISBN === ISBN);
        if (index !== -1) {
            const removedBook = this.books.splice(index, 1)[0];
            this.notifyininfo(`Se ha eliminado el libro: ${removedBook.title}`);
        }
    }

    searchByTitle(query: string) {
        return this.books.filter(book => book.title.includes(query));
    }

    searchByAuthor(query: string) {
        return this.books.filter(book => book.author.includes(query));
    }

    searchByISBN(query: string) {
        return this.books.find(book => book.ISBN === query);
    }

    loanBook(ISBN: string, userID: string) {
        const book = this.books.find(b => b.ISBN === ISBN);
        if (book) {
            this.loans.push(new Loan(ISBN, userID, new Date()));
            this.notifyininfo(`El usuario ${userID} ha solicitado el libro: ${book.title}`);
        }
    }

    returnBook(ISBN: string, userID: string) {
        const index = this.loans.findIndex(loan => loan.ISBN === ISBN && loan.userID === userID);
        if (index !== -1) {
            const returnedBook = this.loans.splice(index, 1)[0];
            this.notifyininfo(`El usuario ${userID} ha devuelto el libro: ${returnedBook.title}`);
        }
    }
}

// Builder Pattern:
//Se utiliza para construir instancias de Book de una manera más limpia y escalable.

class Book {
    constructor(public title: string, public author: string, public ISBN: string) {}
}

//Single Responsibility Principle: La clase LibraryManager se ocupa únicamente de la lógica de la biblioteca, mientras que el servicio EmailService se ocupa del envío de correos electrónicos.
 
// Implementación ficticia de EmailService
class EmailService implements IObserver {
    update(message: string) {
        console.log(`Enviando correo electrónico: ${message}`);
    }
}

interface IObserver {
    update(message: string): void;
}

//Liskov Substitution Principle: User implementa la interfaz IObserver, lo que significa que se puede sustituir por cualquier otro objeto que también implemente la interfaz.
//Los usuarios (User) se registran como observadores y son notificados cuando se añade un nuevo libro.
class User implements IObserver {
    constructor(public userID: string) {}

    update(message: string) {
        console.log(`Usuario ${this.userID}: ${message}`);
    }
}

class InfoNotification implements IObserver {
    update(message: string) {
        console.log(`[INFO]: ${message}`);
    }
}

// Nueva implementación de notificación de advertencia (warning)
class WarningNotification implements IObserver {
    update(message: string) {
        console.log(`[WARNING]: ${message}`);
    }
}


// 
const library = LibraryManager.getInstance();
const emailService = new EmailService();
library.addObserver(emailService);

const user1 = new User("user01");
const user2 = new User("user02");
library.addObserver(user1);
library.addObserver(user2);

const book1 = new Book("El Gran Gatsby", "F. Scott Fitzgerald", "123456789");
const book2 = new Book("1984", "George Orwell", "987654321");

library.addBook(book1);
library.addBook(book2);
library.loanBook("123456789", "user01");
library.returnBook("123456789", "user01");
