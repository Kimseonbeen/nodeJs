class Human {
    constructor(type = 'human') {
        this.type = type;
    }

    static isHuman(human) {
        return human instanceof Human;
    }

    breathe() {
        console.log('h-a-a-a-m');
    }
}


class Zero extends Human {
    constructor(type, firesName, lastName) {
        super(type);
        this.firesName = firesName;
        this.lastName = lastName;
    }

    sayName() {
        super.breathe();
        console.log("g_g_g_g");
    }
}

const a = new Zero()
console.log("a :", a.sayName());