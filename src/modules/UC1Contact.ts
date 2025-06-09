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

const contact1 = new Contact("Rupesh","Roshan","Q-123","Angul","Odisha","795145","8658684467","rupeshroshansahoo@gmail.com");

contact1.displayContact();

