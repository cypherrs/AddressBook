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
        this.contacts.forEach((contact, index) => {
            console.log(` Contact ${index + 1}`);
            contact.displayContact();
        });
    }

    // UC3: finding the contact to edit using first name and updating the specific field
    editContact(firstName: string, updateField: string, newValue: string): boolean {
        const contact = this.contacts.find(c => c.firstName.toLowerCase() === firstName.toLowerCase());
        if (contact) {
            if (updateField in contact) {
                (contact as any)[updateField] = newValue; // dynamic field update
                return true;
            }
        }
        return false;
    }

    // UC4: finding the contact to delete and removing it from the list
    deleteContact(firstName: string): boolean {
        const index = this.contacts.findIndex(c => c.firstName.toLowerCase() === firstName.toLowerCase());
        if (index !== -1) {
            this.contacts.splice(index, 1); // delete 1 item at index
            return true;
        }
        return false;
    }

    // UC3 & UC4: getter to allow safe contact access from AddressBookMain
    getContacts(): Contact[] {
        return this.contacts;
    }
}

// UC2: Using Console to manage AddressBook from main class
class AddressBookMain {
    private addressBook: AddressBook = new AddressBook();
    private r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

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

                                            this.addressBook.addContact(newContact);

                                            // UC5: asking if user wants to add another contact
                                            this.r1.question("Do you want to add another contact? (y/n): ", (answer) => {
                                                if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
                                                    askDetails(); // repeat
                                                } else {
                                                    console.log("Final contact list:");
                                                    this.addressBook.displayAllContact();
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

        // UC5: calling the inner function to begin adding contacts
        askDetails();
    }

    // UC3: editing the contact by first name using console
    private editContactFlow(): void {
        this.r1.question("Enter the first name of the contact to edit: ", (firstName) => {
            const contact = this.addressBook.getContacts().find(c => c.firstName.toLowerCase() === firstName.toLowerCase());

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
                    const success = this.addressBook.editContact(firstName, field, newValue);
                    if (success) {
                        console.log("Contact updated successfully.");
                        this.addressBook.displayAllContact();
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
            const success = this.addressBook.deleteContact(firstName);
            if (success) {
                console.log("Contact deleted successfully.");
                this.addressBook.displayAllContact();
            } else {
                console.log("Contact not found.");
            }
            this.r1.close(); // close readline after operation
        });
    }

    // UC2, UC3, UC4, UC5: Updated start() to support add, edit, display, delete contacts
    start(): void {
        console.log("Welcome To Address Book!");
        this.r1.question("Choose an option: \n1. Add new contact\n2. Edit contact\n3. Display all contacts\n4. Delete contact\nEnter 1, 2, 3 or 4: ", (option) => {
            if (option === "1") {
                this.addContactFlow();
            } else if (option === "2") {
                this.editContactFlow();
            } else if (option === "3") {
                this.addressBook.displayAllContact();
                this.r1.close();
            } else if (option === "4") {
                this.deleteContactFlow();
            } else {
                console.log("Invalid choice. Exiting...");
                this.r1.close();
            }
        });
    }
}

// UC2: Starting the app
const addressBook1 = new AddressBookMain();
addressBook1.start();
