'use strict';
require('../libs/lambdaplus');
let util = require('./util');

const MAX = 9999;
let getStypes     = util.getStypes,
    categoryStype = util.categoryStype;

class List {
    constructor(array) {
        this.index = 0;
        this.list = array;
    }
    add(item) {
        this.list.push(item);
    }
    get length() {
        return this.list.length;
    }
    get current() {
        if(this.index < this.length && this.index >= 0) {
            return this.list[this.index];
        }
        else {
            return null;
        }
    }
    get hasNext() {
        return this.index < this.length;
    }
    next() {
        if(this.index < this.length) this.index++;
        return this.current;
    }
    get hasPrevious() {
        return this.index > 0;
    }
    previous() {
        if(this.index >= 0) this.index--;
        return this.current;
    }
    first() {
        this.index = 0;
        return this.current;
    }
    last() {
        this.index = this.length - 1;
        return this.current;
    }
}

let BaseLevel = 70,
    ShipRule = {
        'DD': {
            baseCount: 4,
            baseScore: -1,
            diminish : new List([
                {count: 8, scale: 1},
                {count: 12, scale: 0.5},
                {count: 18, scale: 0.1}
            ]),
            special: (ship) => {
                let singleScore = ship.level / 100;
                if (ship.lucky > 40) { singleScore += (ship.lucky - 40) / 100; }
                return singleScore;
            }
        },
        'CL': {
            baseCount: 3,
            baseScore: -1,
            diminish : new List([
                {count: 6, scale: 1},
                {count: 10, scale: 0.5},
                {count: 15, scale: 0.1}
            ]),
            special: (ship) => {
                let singleScore = ship.level / 100;
                if (ship.lucky > 40) { singleScore += (ship.lucky - 40) / 100; }
                return singleScore;
            }
        },
        'CA': {
            baseCount: 4,
            baseScore: -1,
            diminish : new List([
                {count: 8, scale: 1},
                {count: 12, scale: 0.5},
                {count: 18, scale: 0.1}
            ]),
            special: (ship) => {
                let singleScore = ship.level / 100;
                if (ship.lucky > 40) { singleScore += (ship.lucky - 40) / 100; }
                return singleScore;
            }
        },
        'BB': {
            baseCount: 4,
            baseScore: -1,
            diminish : new List([
                {count: 8, scale: 1},
                {count: 12, scale: 0.5},
                {count: 18, scale: 0.1}
            ]),
            special: null
        },
        'CV': {
            baseCount: 6,
            baseScore: -1,
            diminish : new List([
                {count: 10, scale: 1},
                {count: 15, scale: 0.5},
                {count: 20, scale: 0.1}
            ]),
            special: null
        },
        'SS': {
            baseCount: 2,
            baseScore: -1,
            diminish : new List([
                {count: 3, scale: 1},
                {count: 6, scale: 0.5},
                {count: 8, scale: 0.1}
            ]),
            special: null
        },
        'Other': {
            baseCount: 0,
            baseScore: 0,
            diminish : new List([
                {count: 0, scale: 0}
            ]),
            special: null
        }
    };

let StypePower = (ships, ctype) => {
        let score = 0;
        let rule = ShipRule[ctype.name];

        if(rule) {
            let diminish = rule.diminish.current;
            let special = rule.special;
            if (ships.length < rule.baseCount) {
                score += (rule.baseCount - ships.length) * rule.baseScore;
            }

            for (let i = 0, len = ships.length; i < len; i++) {
                let ship = ships[i],
                    singleScore = ship.level / 100;
                if (i >= diminish.count) { diminish = rule.diminish.next(); }
                if (!diminish) { break; }

                if (rule.special) {
                    singleScore = special(ship);
                }

                score += singleScore * diminish.scale;
            }
        }
        return {ctype: ctype, score: score};
    },
    FleetPower = (data) => {
        let ctypes = getStypes();
        let powers = ctypes.map((ctype) => {
            let ctypeShips = data
                            .filter(ship => categoryStype(ship.stype).id === ctype.id && ship.level >= BaseLevel)
                            .sort((a,b) => b.level - a.level);
            return StypePower(ctypeShips, ctype);
        });
        return powers;
    };

module.exports = {
    FleetPower: FleetPower
};
