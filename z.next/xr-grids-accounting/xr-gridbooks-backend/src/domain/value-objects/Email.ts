export class Email {
    private readonly _value: string;

    constructor(email: string) {
        this._value = email;
        this.validate();
    }

    private validate(): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this._value)) {
            throw new Error(`Invalid email address: ${this._value}`);
        }
    }

    get value(): string {
        return this._value;
    }

    equals(other: Email): boolean {
        return this._value.toLowerCase() === other._value.toLowerCase();
    }

    toString(): string {
        return this._value;
    }
}
