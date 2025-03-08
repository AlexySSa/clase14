class User {
    constructor(public name: string, public age: number) {}

    public addUser(name: string, age: number, email: string, password: string): void {
        console.log(`usuario agregado: ${name}, ${age}, ${email}, ${password}`);
    }
}

