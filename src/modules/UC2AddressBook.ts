//uc1 : contact.ts
import readline from "readline";

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

// const contact1 = new Contact("Rupesh","Roshan","Q-123","Angul","Odisha","795145","8658684467","rupeshroshansahoo@gmail.com");
//
// contact1.displayContact();

//uc2 : AddressBook class to manage contact list

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

    start() : void{
        console.log("Welcome To Address Book!");
        this.r1.question("Do u want to add an new contact? (y/n) : " ,(answer) =>{
            if ( answer.toLowerCase() === "yes"|| "y"){
                this.addContactFlow();
            } else {
                console.log("exiting Address book");
                this.r1.close();
            }

        });


    }
}

const addressBook1 = new AddressBookMain();
addressBook1.start();