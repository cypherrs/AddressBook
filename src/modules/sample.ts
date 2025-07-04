
class Contact{
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
        console.log("-----  Contact Details  -----");
        console.log(`Name         : ${this.firstName} ${this.lastName}`);
        console.log(`Address      : ${this.address}, ${this.city}, ${this.state}`);
        console.log(`Phone Number : ${this.phoneNumber}`);
        console.log(`Email        : ${this.email}`);
    }
}


import * as readline from 'readline';

class AddressBook {

    private contacts: Contact[] = [];

    addContact(contact: Contact){
        this.contacts.push(contact);
        console.log('the Constact added Successfuly \n');
    }

    displayAllContact(){
        console.log('-----  All Contact  -----');
        this.contacts.forEach((contact , index) => {
            console.log(` Contact ${index + 1}`);
            contact.displayContact();
        })
    }

    // UC3 finding ht e contact to edit
    editContact(firstName : string , updateField: string , newValue : string):boolean{
        const contact = this.contacts.find(c => c.firstName.toLowerCase() === firstName.toLowerCase());
        if (contact){
            if(updateField in contact){
                (contact as any )[updateField] = newValue;
                return true;
            }
        }
        return false;
    }
}

class AddressBookMain{
    private addressBook : AddressBook = new AddressBook();
    private r1 = readline .createInterface({
        input : process.stdin,
        output : process.stdout
    });

    private addContactFlow():void{
        const contactData:any ={};

        this.r1.question("First name: ", (firstName)=>{
            contactData.firstName = firstName;

            this.r1.question("Last name: ", (lastName) =>{
                contactData.lastName = lastName;

                this.r1.question("Address: ", (address)=> {
                    contactData.address = address;

                    this.r1.question("City: ", (city)=>{
                        contactData.city =city;

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
                                        this.addressBook.displayAllContact();

                                        this.r1.close();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    //UC3 uptading the making the editcontrol flow
    private editContactFlow(): void {
        this.r1.question("Enter the first name of the contact to edit: ", (firstName) => {
            const contact = this.addressBook['contacts'].find(c => c.firstName.toLowerCase() === firstName.toLowerCase());

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

//updating start() for the UC# fo chosee between the edit and see

}

const addressBook1 = new AddressBookMain();
addressBook1.start();