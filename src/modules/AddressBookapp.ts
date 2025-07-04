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

    // printing all contact details
    displayContact(): void {
        console.log("-----  Contact Details  -----");
        console.log(`Name         : ${this.firstName} ${this.lastName}`);
        console.log(`Address      : ${this.address}, ${this.city}, ${this.state} - ${this.zip}`);
        console.log(`Phone Number : ${this.phoneNumber}`);
        console.log(`Email        : ${this.email}`);
    }
}

import * as readline from 'readline';

// UC2: Creating AddressBook class with ability to add and view contacts
class AddressBook {
    private contacts: Contact[] = [];

    // UC2: adding new contact to list
    addContact(contact: Contact) {
        this.contacts.push(contact);
        console.log('The contact added successfully.\n');
    }

    // displaying all saved contacts
    displayAllContact() {
        console.log('-----  All Contacts  -----');
        if (this.contacts.length === 0) {
            console.log("No contacts found.");
        }
        this.contacts.forEach((contact, index) => {
            console.log(` Contact ${index + 1}`);
            contact.displayContact();
        });
    }

    // UC3: finding the contact to edit using first name and updating the specific field
    editContact(firstName: string, updateField: string, newValue: string): boolean {
        const contact = this.contacts.find(c => c.firstName.toLowerCase() === firstName.toLowerCase());
        if (contact && updateField in contact) {
            (contact as any)[updateField] = newValue;
            return true;
        }
        return false;
    }

    // UC4: finding the contact to delete and removing it from the list
    deleteContact(firstName: string): boolean {
        const index = this.contacts.findIndex(c => c.firstName.toLowerCase() === firstName.toLowerCase());
        if (index !== -1) {
            this.contacts.splice(index, 1);
            return true;
        }
        return false;
    }


    getContacts(): Contact[] {
        return this.contacts;
    }
}

// UC6: Managing multiple AddressBooks by name using a Map
class AddressBookMain {
    private addressBooks: Map<string, AddressBook> = new Map(); // UC6 dictionary of books
    private currentBook: AddressBook | null = null;              // to selected AddressBook
    private r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // UC6: Asking user to create or select an AddressBook by name
    private selectAddressBook(callback: () => void): void {
        this.r1.question("Enter Address Book name: ", (bookName) => {
            if (!this.addressBooks.has(bookName)) {
                console.log(`Creating new Address Book: '${bookName}'`);
                this.addressBooks.set(bookName, new AddressBook());
            } else {
                console.log(`Switching to existing Address Book: '${bookName}'`);
            }
            this.currentBook = this.addressBooks.get(bookName)!; // assign selected book
            callback(); // continue to menu after selection
        });
    }

    // UC5: allowing user to add multiple contacts one by one using console
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

                                            this.currentBook!.addContact(newContact); // UC6: Using selected book

                                            // UC5: asking if user wants to add another contact
                                            this.r1.question("Do you want to add another contact? (y/n): ", (answer) => {
                                                if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
                                                    askDetails(); // repeat
                                                } else {
                                                    console.log("Final contact list:");
                                                    this.currentBook!.displayAllContact();
                                                    this.r1.close(); // finish adding
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

    // UC3: editing the contact by first name using console
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

    // UC4: deleting the contact by first name using console
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

    // UC6: start by choosing or creating Address Book, then present options
    start(): void {
        console.log("Welcome To Address Book System!");
        this.selectAddressBook(() => {
            this.r1.question(
                "Choose an option: \n1. Add new contact\n2. Edit contact\n3. Display all contacts\n4. Delete contact\nEnter 1, 2, 3 or 4: ",
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
                    } else {
                        console.log("Invalid choice. Exiting...");
                        this.r1.close();
                    }
                }
            );
        });
    }
}

// UC6: Launching the app with ability to handle multiple address books
const addressBook1 = new AddressBookMain();
addressBook1.start();
Multi