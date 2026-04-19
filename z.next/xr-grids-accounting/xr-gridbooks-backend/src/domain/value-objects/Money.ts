export class Money {
    private readonly _amount: number;
    private readonly _currency: string;

    constructor(amount: number, currency: string = 'USD') {
        this._amount = Math.round(amount * 100) / 100; // Round to 2 decimal places
        this._currency = currency.toUpperCase();
        this.validate();
    }

    private validate(): void {
        if (isNaN(this._amount)) {
            throw new Error('Amount must be a valid number');
        }

        if (this._amount < 0) {
            throw new Error('Amount cannot be negative');
        }

        if (!this._currency || this._currency.length !== 3) {
            throw new Error('Currency must be a 3-letter code (e.g., USD, CAD, EUR)');
        }
    }

    get amount(): number {
        return this._amount;
    }

    get currency(): string {
        return this._currency;
    }

    add(other: Money): Money {
        this.ensureSameCurrency(other);
        return new Money(this._amount + other._amount, this._currency);
    }

    subtract(other: Money): Money {
        this.ensureSameCurrency(other);
        const result = this._amount - other._amount;
        if (result < 0) {
            throw new Error('Subtraction would result in negative amount');
        }
        return new Money(result, this._currency);
    }

    multiply(factor: number): Money {
        return new Money(this._amount * factor, this._currency);
    }

    divide(divisor: number): Money {
        if (divisor === 0) {
            throw new Error('Cannot divide by zero');
        }
        return new Money(this._amount / divisor, this._currency);
    }

    equals(other: Money): boolean {
        return this._amount === other._amount && this._currency === other._currency;
    }

    greaterThan(other: Money): boolean {
        this.ensureSameCurrency(other);
        return this._amount > other._amount;
    }

    lessThan(other: Money): boolean {
        this.ensureSameCurrency(other);
        return this._amount < other._amount;
    }

    private ensureSameCurrency(other: Money): void {
        if (this._currency !== other._currency) {
            throw new Error(`Cannot operate on different currencies: ${this._currency} and ${other._currency}`);
        }
    }

    toString(): string {
        return `${this._currency} ${this._amount.toFixed(2)}`;
    }

    toJSON(): { amount: number; currency: string } {
        return {
            amount: this._amount,
            currency: this._currency,
        };
    }

    static fromJSON(json: { amount: number; currency: string }): Money {
        return new Money(json.amount, json.currency);
    }
}
