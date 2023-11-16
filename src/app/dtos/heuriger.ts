export class Heuriger {
    constructor(
        public id: number,
        public name: string,
        public nameId: string,
        public favourite: boolean = false,
        public address: string,
        public city: string,
        public coordinates: coordinates,
        public playground: boolean,
        public wheelchairAccessible: boolean,
        public sale: boolean,
        public wineMachine: boolean,
        public link: string,
        public email: string,
        public phone: phone,
        public type: string,
        public daysRemain: number,
        public ausgsteckt: Array<ausgsteckt>
    ) {}
}

export class coordinates {
    constructor(
        public lat: number,
        public lng: number
    ) {}
}

export class phone {
    constructor(
        public main: string,
        public mobile: string
    ) {}
}

export class ausgsteckt {
    constructor(
        public from: string,
        public to: string,
        public note: string = ''
    ) {}
}