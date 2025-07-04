"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// UC1: Creating Contact class
var Contact = /** @class */ (function () {
    function Contact(firstName, lastName, address, city, state, zip, phoneNumber, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }
    Contact.prototype.displayContact = function () {
        console.log("-----  Contact Details  -----");
        console.log("Name         : ".concat(this.firstName, " ").concat(this.lastName));
        console.log("Address      : ".concat(this.address, ", ").concat(this.city, ", ").concat(this.state, " - ").concat(this.zip)); // zip added to display
        console.log("Phone Number : ".concat(this.phoneNumber));
        console.log("Email        : ".concat(this.email));
    };
    return Contact;
}());
var readline = require("readline");
// UC2: Creating AddressBook class
var AddressBook = /** @class */ (function () {
    function AddressBook() {
        this.contacts = [];
    }
    AddressBook.prototype.addContact = function (contact) {
        this.contacts.push(contact);
        console.log('the Contact added Successfully \n'); // fixed spelling: Constact → Contact
    };
    AddressBook.prototype.displayAllContact = function () {
        console.log('-----  All Contact  -----');
        this.contacts.forEach(function (contact, index) {
            console.log(" Contact ".concat(index + 1));
            contact.displayContact();
        });
    };
    // UC3: finding the contact to edit using first name and updating field
    AddressBook.prototype.editContact = function (firstName, updateField, newValue) {
        var contact = this.contacts.find(function (c) { return c.firstName.toLowerCase() === firstName.toLowerCase(); });
        if (contact) {
            if (updateField in contact) {
                contact[updateField] = newValue; // dynamic update of property
                return true;
            }
        }
        return false;
    };
    // UC3: Getter to safely access contacts from AddressBookMain
    AddressBook.prototype.getContacts = function () {
        return this.contacts;
    };
    return AddressBook;
}());
// UC2: Using Console to add person details from AddressBookMain class
var AddressBookMain = /** @class */ (function () {
    function AddressBookMain() {
        this.addressBook = new AddressBook();
        this.r1 = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    AddressBookMain.prototype.addContactFlow = function () {
        var _this = this;
        var contactData = {};
        this.r1.question("First name: ", function (firstName) {
            contactData.firstName = firstName;
            _this.r1.question("Last name: ", function (lastName) {
                contactData.lastName = lastName;
                _this.r1.question("Address: ", function (address) {
                    contactData.address = address;
                    _this.r1.question("City: ", function (city) {
                        contactData.city = city;
                        _this.r1.question("State: ", function (state) {
                            contactData.state = state;
                            _this.r1.question("ZIP: ", function (zip) {
                                contactData.zip = zip;
                                _this.r1.question("Phone Number: ", function (phoneNumber) {
                                    contactData.phoneNumber = phoneNumber;
                                    _this.r1.question("Email: ", function (email) {
                                        contactData.email = email;
                                        var newContact = new Contact(contactData.firstName, contactData.lastName, contactData.address, contactData.city, contactData.state, contactData.zip, contactData.phoneNumber, contactData.email);
                                        _this.addressBook.addContact(newContact);
                                        _this.addressBook.displayAllContact();
                                        _this.r1.close();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    };
    // UC3: Updating the edit control flow using Console
    AddressBookMain.prototype.editContactFlow = function () {
        var _this = this;
        this.r1.question("Enter the first name of the contact to edit: ", function (firstName) {
            var contact = _this.addressBook.getContacts().find(function (c) { return c.firstName.toLowerCase() === firstName.toLowerCase(); }); // using getter
            if (!contact) {
                console.log("Contact not found.");
                _this.r1.close();
                return;
            }
            _this.r1.question("Which field do you want to edit? (lastName, address, city, state, zip, phoneNumber, email): ", function (field) {
                if (!(field in contact)) {
                    console.log("Invalid field.");
                    _this.r1.close();
                    return;
                }
                _this.r1.question("Enter new value for ".concat(field, ": "), function (newValue) {
                    var success = _this.addressBook.editContact(firstName, field, newValue);
                    if (success) {
                        console.log("Contact updated successfully.");
                        _this.addressBook.displayAllContact();
                    }
                    else {
                        console.log("Update failed.");
                    }
                    _this.r1.close();
                });
            });
        });
    };
    // UC2 & UC3: Updating start() to choose between add or edit
    AddressBookMain.prototype.start = function () {
        var _this = this;
        console.log("Welcome To Address Book!");
        this.r1.question("Choose an option: \n1. Add new contact\n2. Edit contact\nEnter 1 or 2: ", function (option) {
            if (option === "1") {
                _this.addContactFlow();
            }
            else if (option === "2") {
                _this.editContactFlow();
            }
            else {
                console.log("Invalid choice. Exiting...");
                _this.r1.close();
            }
        });
    };
    return AddressBookMain;
}());
// UC2: Running the main class
var addressBook1 = new AddressBookMain();
addressBook1.start();
