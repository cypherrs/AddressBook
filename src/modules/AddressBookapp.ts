import * as fs from 'fs';
import * as readline from 'readline';

// UC1: Contact class
class Contact {
    public firstName: string;
    public lastName: string;
    public address: string;
    public city: string;
    public state: string;
    public zip: string;
    public phoneNumber: string;
    public email: string;

    constructor(firstName: string, lastName: string, address: string, city: string, state: string, zip: string, phoneNumber: string, email: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }

    displayContact(): void {
        console.log("----- Contact Details -----");
        console.log(`Name         : ${this.firstName} ${this.lastName}`);
        console.log(`Address      : ${this.address}, ${this.city}, ${this.state} - ${this.zip}`);
        console.log(`Phone Number : ${this.phoneNumber}`);
        console.log(`Email        : ${this.email}`);
    }

    equals(other: Contact): boolean {
        return this.firstName.toLowerCase() === other.firstName.toLowerCase() &&
            this.lastName.toLowerCase() === other.lastName.toLowerCase();
    }

    static fromJSON(obj: any): Contact {
        return new Contact(
            obj.firstName, obj.lastName, obj.address,
            obj.city, obj.state, obj.zip,
            obj.phoneNumber, obj.email
        );
    }
}

// UC2: AddressBook class
class AddressBook {
    private contacts: Contact[] = [];

    addContact(contact: Contact): void {
        const isDuplicate = this.contacts.some(existing => existing.equals(contact));
        if (isDuplicate) {
            console.log(" Duplicate contact not allowed.");
            return;
        }
        this.contacts.push(contact);
        console.log(" Contact added successfully.");
    }

    editContact(firstName: string, field: string, newValue: string): boolean {
        const contact = this.contacts.find(c => c.firstName.toLowerCase() === firstName.toLowerCase());
        if (contact && field in contact) {
            (contact as any)[field] = newValue;
            return true;
        }
        return false;
    }

    deleteContact(firstName: string): boolean {
        const index = this.contacts.findIndex(c => c.firstName.toLowerCase() === firstName.toLowerCase());
        if (index !== -1) {
            this.contacts.splice(index, 1);
            return true;
        }
        return false;
    }

    displayAllContact(): void {
        if (this.contacts.length === 0) {
            console.log(" No contacts to display.");
            return;
        }
        this.contacts.forEach((c, i) => {
            console.log(`\nContact ${i + 1}`);
            c.displayContact();
        });
    }

    sortContactsByName(): void {
        this.contacts.sort((a, b) => a.firstName.localeCompare(b.firstName));
        console.log(" Contacts sorted by name.");
    }

    sortContactsBy(field: "city" | "state" | "zip"): void {
        this.contacts.sort((a, b) => a[field].localeCompare(b[field]));
        console.log(` Contacts sorted by ${field}.`);
    }

    getContacts(): Contact[] {
        return this.contacts;
    }

    //  UC13: File I/O - Save contacts to file
    saveToFile(filename: string): void {
        fs.writeFileSync(filename, JSON.stringify(this.contacts, null, 2));
        console.log(` Address Book saved to ${filename}`);
    }

    //  UC13: Load contacts from file
    loadFromFile(filename: string): void {
        if (!fs.existsSync(filename)) {
            console.log(" File does not exist.");
            return;
        }
        const data = fs.readFileSync(filename, 'utf8');
        const json = JSON.parse(data);
        this.contacts = json.map((obj: any) => Contact.fromJSON(obj));
        console.log(` Loaded ${this.contacts.length} contacts from ${filename}`);
    }
}

// UC6: AddressBookMain class
class AddressBookMain {
    private addressBooks: Map<string, AddressBook> = new Map();
    private currentBook: AddressBook | null = null;
    private r1 = readline.createInterface({ input: process.stdin, output: process.stdout });

    private selectAddressBook(callback: () => void): void {
        this.r1.question("Enter Address Book name: ", (name) => {
            if (!this.addressBooks.has(name)) {
                this.addressBooks.set(name, new AddressBook());
                console.log(`Created new Address Book: ${name}`);
            } else {
                console.log(`Switched to Address Book: ${name}`);
            }
            this.currentBook = this.addressBooks.get(name)!;
            callback();
        });
    }

    private addContactFlow(): void {
        const ask = () => {
            const data: any = {};
            this.r1.question("First Name: ", (fn) => {
                data.firstName = fn;
                this.r1.question("Last Name: ", (ln) => {
                    data.lastName = ln;
                    this.r1.question("Address: ", (addr) => {
                        data.address = addr;
                        this.r1.question("City: ", (city) => {
                            data.city = city;
                            this.r1.question("State: ", (state) => {
                                data.state = state;
                                this.r1.question("Zip: ", (zip) => {
                                    data.zip = zip;
                                    this.r1.question("Phone: ", (phone) => {
                                        data.phoneNumber = phone;
                                        this.r1.question("Email: ", (email) => {
                                            data.email = email;
                                            const newContact = new Contact(
                                                data.firstName, data.lastName,
                                                data.address, data.city, data.state,
                                                data.zip, data.phoneNumber, data.email
                                            );
                                            this.currentBook!.addContact(newContact);

                                            this.r1.question("Add another? (y/n): ", (ans) => {
                                                if (ans.toLowerCase() === "y") ask();
                                                else {
                                                    this.currentBook!.displayAllContact();
                                                    this.r1.close();
                                                }
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        };
        ask();
    }

    private saveAddressBookToFile(): void {
        this.r1.question("Enter filename to save to (e.g. contacts.json): ", (filename) => {
            this.currentBook!.saveToFile(filename);
            this.r1.close();
        });
    }

    private loadAddressBookFromFile(): void {
        this.r1.question("Enter filename to load from (e.g. contacts.json): ", (filename) => {
            this.currentBook!.loadFromFile(filename);
            this.currentBook!.displayAllContact();
            this.r1.close();
        });
    }

    start(): void {
        console.log("📘 Welcome to Address Book System");
        this.selectAddressBook(() => {
            this.r1.question(
                "\nChoose an option:\n" +
                "1. Add new contact\n" +
                "2. Edit contact\n" +
                "3. Display all contacts\n" +
                "4. Delete contact\n" +
                "5. Sort contacts by name\n" +
                "6. Sort contacts by city/state/zip\n" +
                "7. Save address book to file (UC13)\n" +
                "8. Load address book from file (UC13)\n" +
                "Enter 1–8: ",
                (opt) => {
                    if (opt === "1") this.addContactFlow();
                    else if (opt === "2") { /* Add your edit flow */ this.r1.close(); }
                    else if (opt === "3") { this.currentBook!.displayAllContact(); this.r1.close(); }
                    else if (opt === "4") { /* Add delete flow */ this.r1.close(); }
                    else if (opt === "5") { this.currentBook!.sortContactsByName(); this.currentBook!.displayAllContact(); this.r1.close(); }
                    else if (opt === "6") {
                        this.r1.question("Sort by which field (city/state/zip)? ", (field) => {
                            if (field === 'city' || field === 'state' || field === 'zip') {
                                this.currentBook!.sortContactsBy(field);
                                this.currentBook!.displayAllContact();
                            } else {
                                console.log(" Invalid field.");
                            }
                            this.r1.close();
                        });
                    }
                    else if (opt === "7") this.saveAddressBookToFile();
                    else if (opt === "8") this.loadAddressBookFromFile();
                    else { console.log(" Invalid option."); this.r1.close(); }
                }
            );
        });
    }
}

const main = new AddressBookMain();
main.start();
