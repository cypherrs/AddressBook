// UC1: Creating Contact class to hold all contact details
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

    // displaying all details of a contact
    displayContact(): void {
        console.log("-----  Contact Details  -----");
        console.log(`Name         : ${this.firstName} ${this.lastName}`);
        console.log(`Address      : ${this.address}, ${this.city}, ${this.state} - ${this.zip}`);
        console.log(`Phone Number : ${this.phoneNumber}`);
        console.log(`Email        : ${this.email}`);
    }

    // UC7: Checking if two contacts are same (used for duplicate)
    equals(other: Contact): boolean {
        return this.firstName.toLowerCase() === other.firstName.toLowerCase() &&
            this.lastName.toLowerCase() === other.lastName.toLowerCase();
    }
}

import * as readline from 'readline';

// UC2: Creating AddressBook class with basic operations
class AddressBook {
    private contacts: Contact[] = [];

    // UC2 + UC7: Add new contact with duplicate check
    addContact(contact: Contact): void {
        const isDuplicate = this.contacts.some(existing =>
            existing.equals(contact)
        );

        if (isDuplicate) {
            console.log(" Duplicate contact. This person already exists in the Address Book.");
            return;
        }

        this.contacts.push(contact);
        console.log(' The contact added successfully.\n');
    }

    // displaying all contacts
    displayAllContact(): void {
        console.log('-----  All Contacts  -----');
        if (this.contacts.length === 0) {
            console.log("No contacts found.");
        }
        this.contacts.forEach((contact, index) => {
            console.log(` Contact ${index + 1}`);
            contact.displayContact();
        });
    }

    // UC3: Editing a field of a contact
    editContact(firstName: string, updateField: string, newValue: string): boolean {
        const contact = this.contacts.find(c => c.firstName.toLowerCase() === firstName.toLowerCase());
        if (contact && updateField in contact) {
            (contact as any)[updateField] = newValue;
            return true;
        }
        return false;
    }

    // UC4: Deleting a contact from address book
    deleteContact(firstName: string): boolean {
        const index = this.contacts.findIndex(c => c.firstName.toLowerCase() === firstName.toLowerCase());
        if (index !== -1) {
            this.contacts.splice(index, 1);
            return true;
        }
        return false;
    }

    // used by UC6/UC8 to get full contact list
    getContacts(): Contact[] {
        return this.contacts;
    }
}

// UC6: Managing multiple address books
class AddressBookMain {
    private addressBooks: Map<string, AddressBook> = new Map();
    private currentBook: AddressBook | null = null;
    private r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // UC6: Select or create an address book
    private selectAddressBook(callback: () => void): void {
        this.r1.question("Enter Address Book name: ", (bookName) => {
            if (!this.addressBooks.has(bookName)) {
                console.log(`Creating new Address Book: '${bookName}'`);
                this.addressBooks.set(bookName, new AddressBook());
            } else {
                console.log(`Switching to existing Address Book: '${bookName}'`);
            }
            this.currentBook = this.addressBooks.get(bookName)!;
            callback();
        });
    }

    // UC5: Add multiple persons one by one
    private addContactFlow(): void {
        const askDetails = () => {
            const contactData: any = {};

            this.r1.question("First name: ", (firstName) => {
                contactData.firstName = firstName;

                this.r1.question("Last name: ", (lastName) => {
                    contactData.lastName = lastName;

                    this.r1.question("Address: ", (address) => {
                        contactData.address = address;

                        this.r1.question("City: ", (city) => {
                            contactData.city = city;

                            this.r1.question("State: ", (state) => {
                                contactData.state = state;

                                this.r1.question("ZIP: ", (zip) => {
                                    contactData.zip = zip;

                                    this.r1.question("Phone Number: ", (phoneNumber) => {
                                        contactData.phoneNumber = phoneNumber;

                                        this.r1.question("Email: ", (email) => {
                                            contactData.email = email;

                                            const newContact = new Contact(
                                                contactData.firstName,
                                                contactData.lastName,
                                                contactData.address,
                                                contactData.city,
                                                contactData.state,
                                                contactData.zip,
                                                contactData.phoneNumber,
                                                contactData.email
                                            );

                                            this.currentBook!.addContact(newContact);

                                            this.r1.question("Do you want to add another contact? (y/n): ", (answer) => {
                                                if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
                                                    askDetails();
                                                } else {
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

        askDetails();
    }

    // UC3: Editing contact
    private editContactFlow(): void {
        this.r1.question("Enter the first name of the contact to edit: ", (firstName) => {
            const contact = this.currentBook!.getContacts().find(c => c.firstName.toLowerCase() === firstName.toLowerCase());

            if (!contact) {
                console.log("Contact not found.");
                this.r1.close();
                return;
            }

            this.r1.question("Which field do you want to edit? (lastName, address, city, state, zip, phoneNumber, email): ", (field) => {
                if (!(field in contact)) {
                    console.log("Invalid field.");
                    this.r1.close();
                    return;
                }

                this.r1.question(`Enter new value for ${field}: `, (newValue) => {
                    const success = this.currentBook!.editContact(firstName, field, newValue);
                    if (success) {
                        console.log("Contact updated successfully.");
                        this.currentBook!.displayAllContact();
                    } else {
                        console.log("Update failed.");
                    }
                    this.r1.close();
                });
            });
        });
    }

    // UC4: Deleting contact
    private deleteContactFlow(): void {
        this.r1.question("Enter the first name of the contact to delete: ", (firstName) => {
            const success = this.currentBook!.deleteContact(firstName);
            if (success) {
                console.log("Contact deleted successfully.");
                this.currentBook!.displayAllContact();
            } else {
                console.log("Contact not found.");
            }
            this.r1.close();
        });
    }

    // ✅ UC8: Searching contact across all Address Books by city or state
    private searchByCityOrState(): void {
        this.r1.question("Search by City or State? (enter 'city' or 'state'): ", (searchType) => {
            if (searchType !== "city" && searchType !== "state") {
                console.log("❌ Invalid input.");
                this.r1.close();
                return;
            }

            this.r1.question(`Enter the ${searchType} name to search: `, (location) => {
                let found = false;

                this.addressBooks.forEach((book, bookName) => {
                    const matches = book.getContacts().filter(contact =>
                        searchType === "city"
                            ? contact.city.toLowerCase() === location.toLowerCase()
                            : contact.state.toLowerCase() === location.toLowerCase()
                    );

                    if (matches.length > 0) {
                        found = true;
                        console.log(`\n📘 Matches in Address Book: ${bookName}`);
                        matches.forEach(c => c.displayContact());
                    }
                });

                if (!found) {
                    console.log(`❌ No person found in ${searchType}: ${location}`);
                }

                this.r1.close();
            });
        });
    }

    // UC6 + UC7 + UC8: Updated start() with all menu options
    start(): void {
        console.log("Welcome To Address Book System!");
        this.selectAddressBook(() => {
            this.r1.question(
                "Choose an option: \n1. Add new contact\n2. Edit contact\n3. Display all contacts\n4. Delete contact\n5. Search person by city/state\nEnter 1–5: ",
                (option) => {
                    if (option === "1") {
                        this.addContactFlow();
                    } else if (option === "2") {
                        this.editContactFlow();
                    } else if (option === "3") {
                        this.currentBook!.displayAllContact();
                        this.r1.close();
                    } else if (option === "4") {
                        this.deleteContactFlow();
                    } else if (option === "5") {
                        this.searchByCityOrState(); // ✅ UC8
                    } else {
                        console.log("Invalid choice. Exiting...");
                        this.r1.close();
                    }
                }
            );
        });
    }
}


const addressBook1 = new AddressBookMain();
addressBook1.start();
