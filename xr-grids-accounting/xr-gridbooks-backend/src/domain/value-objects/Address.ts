export interface AddressProps {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
}

export class Address {
    private readonly _street?: string;
    private readonly _city?: string;
    private readonly _state?: string;
    private readonly _zip?: string;
    private readonly _country?: string;

    constructor(props: AddressProps) {
        this._street = props.street;
        this._city = props.city;
        this._state = props.state;
        this._zip = props.zip;
        this._country = props.country;
    }

    get street(): string | undefined {
        return this._street;
    }

    get city(): string | undefined {
        return this._city;
    }

    get state(): string | undefined {
        return this._state;
    }

    get zip(): string | undefined {
        return this._zip;
    }

    get country(): string | undefined {
        return this._country;
    }

    toString(): string {
        const parts = [this._street, this._city, this._state, this._zip, this._country].filter(Boolean);
        return parts.join(', ');
    }

    toJSON(): AddressProps {
        return {
            street: this._street,
            city: this._city,
            state: this._state,
            zip: this._zip,
            country: this._country,
        };
    }

    static fromJSON(json: AddressProps): Address {
        return new Address(json);
    }
}
