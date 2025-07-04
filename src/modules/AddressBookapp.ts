// UC1: Contact class to store individual contact information
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

    // display contact details
    displayContact(): void {
        console.log("-----  Contact Details  -----");
        console.log(`Name         : ${this.firstName} ${this.lastName}`);
        console.log(`Address      : ${this.address}, ${this.city}, ${this.state} - ${this.zip}`);
        console.log(`Phone Number : ${this.phoneNumber}`);
        console.log(`Email        : ${this.email}`);
    }

    // UC7: Equals method for duplicate detection
    equals(other: Contact): boolean {
        return this.firstName.toLowerCase() === other.firstName.toLowerCase() &&
            this.lastName.toLowerCase() === other.lastName.toLowerCase();
    }
}

import * as readline from 'readline';

// UC2: AddressBook class to manage list of contacts
class AddressBook {
    private contacts: Contact[] = [];

    // UC2 + UC7: Add with duplicate check
    addContact(contact: Contact): void {
        const isDuplicate = this.contacts.some(existing => existing.equals(contact));
        if (isDuplicate) {
            console.log(" Duplicate contact not allowed.");
            return;
        }
        this.contacts.push(contact);
        console.log(" Contact added successfully.");
    }

    // UC3: Edit a contact's property
    editContact(firstName: string, field: string, newValue: string): boolean {
        const contact = this.contacts.find(c => c.firstName.toLowerCase() === firstName.toLowerCase());
        if (contact && field in contact) {
            (contact as any)[field] = newValue;
            return true;
        }
        return false;
    }

    // UC4: Delete a contact
    deleteContact(firstName: string): boolean {
        const index = this.contacts.findIndex(c => c.firstName.toLowerCase() === firstName.toLowerCase());
        if (index !== -1) {
            this.contacts.splice(index, 1);
            return true;
        }
        return false;
    }

    // UC5: Display all contacts
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

    // UC11: Sort contact alphabetically by first name
    sortContactsByName(): void {
        this.contacts.sort((a, b) => a.firstName.localeCompare(b.firstName));
        console.log(" Contacts sorted alphabetically by name.");
    }

    // UC12: Sort contact by city/state/zip
    sortContactsBy(field: "city" | "state" | "zip"): void {
        this.contacts.sort((a, b) => a[field].localeCompare(b[field]));
        console.log(` Contacts sorted by ${field}.`);
    }

    // helper to return contact list
    getContacts(): Contact[] {
        return this.contacts;
    }
}

// UC6: AddressBookMain class to manage multiple address books
class AddressBookMain {
    private addressBooks: Map<string, AddressBook> = new Map();
    private currentBook: AddressBook | null = null;
    private r1 = readline.createInterface({ input: process.stdin, output: process.stdout });

    // UC6: Select or create address book
    private selectAddressBook(callback: () => void): void {
        this.r1.question("Enter Address Book name: ", (name) => {
            if (!this.addressBooks.has(name)) {
                this.addressBooks.set(name, new AddressBook());
                console.log(`Created new Address Book: ${name}`);
            } else {
                console.log(` Switched to Address Book: ${name}`);
            }
            this.currentBook = this.addressBooks.get(name)!;
            callback();
        });
    }

    // UC5: Add contact(s)
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

                                            const newContact = new Contact(data.firstName, data.lastName, data.address, data.city, data.state, data.zip, data.phoneNumber, data.email);
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

    // UC3: Edit contact
    private editContactFlow(): void {
        this.r1.question("Enter contact's First Name to edit: ", (name) => {
            const contact = this.currentBook!.getContacts().find(c => c.firstName.toLowerCase() === name.toLowerCase());
            if (!contact) {
                console.log(" Contact not found.");
                this.r1.close();
                return;
            }

            this.r1.question("Enter field to edit (lastName, address, city, state, zip, phoneNumber, email): ", (field) => {
                this.r1.question("Enter new value: ", (value) => {
                    const success = this.currentBook!.editContact(name, field, value);
                    console.log(success ? " Contact updated." : " Update failed.");
                    this.r1.close();
                });
            });
        });
    }

    // UC4: Delete contact
    private deleteContactFlow(): void {
        this.r1.question("Enter contact's First Name to delete: ", (name) => {
            const success = this.currentBook!.deleteContact(name);
            console.log(success ? "🗑️ Contact deleted." : " Contact not found.");
            this.currentBook!.displayAllContact();
            this.r1.close();
        });
    }

    // UC8: Search contact by City or State across address books
    private searchByCityOrState(): void {
        this.r1.question("Search by city or state? ", (type) => {
            if (type !== 'city' && type !== 'state') {
                console.log(" Invalid input.");
                this.r1.close();
                return;
            }

            this.r1.question(`Enter ${type} name to search: `, (value) => {
                let found = false;
                this.addressBooks.forEach((book, name) => {
                    const results = book.getContacts().filter(c =>
                        type === 'city'
                            ? c.city.toLowerCase() === value.toLowerCase()
                            : c.state.toLowerCase() === value.toLowerCase()
                    );
                    if (results.length) {
                        found = true;
                        console.log(`\n Address Book: ${name}`);
                        results.forEach(c => c.displayContact());
                    }
                });

                if (!found) console.log(" No match found.");
                this.r1.close();
            });
        });
    }

    // UC9: View persons grouped by City or State
    private viewPersonsByCityOrState(): void {
        this.r1.question("View by city or state? ", (type) => {
            if (type !== 'city' && type !== 'state') {
                console.log(" Invalid choice.");
                this.r1.close();
                return;
            }

            const map = new Map<string, Contact[]>();
            this.addressBooks.forEach((book) => {
                book.getContacts().forEach((c) => {
                    const key = type === 'city' ? c.city : c.state;
                    if (!map.has(key)) {
                        map.set(key, []);
                    }
                    map.get(key)!.push(c);
                });
            });

            if (map.size === 0) {
                console.log(" No contacts.");
            } else {
                console.log(`\n👥 Grouped view by ${type.toUpperCase()}`);
                map.forEach((contacts, key) => {
                    console.log(`\n${key}`);
                    contacts.forEach((c, i) => {
                        console.log(` ${i + 1}. ${c.firstName} ${c.lastName}`);
                    });
                });
            }
            this.r1.close();
        });
    }

    // UC10: Count of persons by City or State
    private countPersonsByCityOrState(): void {
        this.r1.question("Count by city or state? ", (type) => {
            if (type !== 'city' && type !== 'state') {
                console.log(" Invalid input.");
                this.r1.close();
                return;
            }

            const map = new Map<string, number>();
            this.addressBooks.forEach(book => {
                book.getContacts().forEach(contact => {
                    const key = type === 'city' ? contact.city : contact.state;
                    map.set(key, (map.get(key) || 0) + 1);
                });
            });

            console.log(`\n Count by ${type.toUpperCase()}`);
            map.forEach((count, key) => {
                console.log(` ${key}: ${count} contact(s)`);
            });
            this.r1.close();
        });
    }

    // UC11: Sort contacts by Name
    private sortContactsByName(): void {
        this.currentBook!.sortContactsByName();
        this.currentBook!.displayAllContact();
        this.r1.close();
    }

    // UC12: Sort contacts by City/State/Zip
    private sortContactsByField(): void {
        this.r1.question("Sort by which field? (city/state/zip): ", (field) => {
            if (field !== "city" && field !== "state" && field !== "zip") {
                console.log("❌ Invalid field.");
                this.r1.close();
                return;
            }
            this.currentBook!.sortContactsBy(field as "city" | "state" | "zip");
            this.currentBook!.displayAllContact();
            this.r1.close();
        });
    }

    // Entry point – UC1 to UC12
    start(): void {
        console.log(" Welcome to Address Book System");
        this.selectAddressBook(() => {
            this.r1.question(
                "\nChoose an option:\n" +
                "1. Add new contact\n" +
                "2. Edit contact\n" +
                "3. Display all contacts\n" +
                "4. Delete contact\n" +
                "5. Search person by city/state\n" +
                "6. View persons grouped by city/state\n" +
                "7. View contact count by city/state\n" +
                "8. Sort contacts by name\n" +
                "9. Sort contacts by city/state/zip\n" +
                "Enter 1–9: ",
                (opt) => {
                    if (opt === "1") this.addContactFlow();
                    else if (opt === "2") this.editContactFlow();
                    else if (opt === "3") { this.currentBook!.displayAllContact(); this.r1.close(); }
                    else if (opt === "4") this.deleteContactFlow();
                    else if (opt === "5") this.searchByCityOrState();
                    else if (opt === "6") this.viewPersonsByCityOrState();
                    else if (opt === "7") this.countPersonsByCityOrState();
                    else if (opt === "8") this.sortContactsByName();
                    else if (opt === "9") this.sortContactsByField();
                    else { console.log(" Invalid option."); this.r1.close(); }
                }
            );
        });
    }
}

// 🔃 Launch the app
const main = new AddressBookMain();
main.start();
