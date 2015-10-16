'use strict';
require('../libs/lambdaplus');
let util = require('./util');

let getStypes     = util.getStypes,
    categoryStype = util.categoryStype;

let shipFilterCondition = [
    {
        title : __('Locked'),
        filter: (ship) => { return ship.locked; }
    },
    {
        title : __('MainForce') + ' level.70+',
        filter: (ship) => { return ship.locked && ship.level >= 70; }
    }
];
let getShipsStatistic = (shipdata, filter) => {
    let filterShips = shipdata.filter(filter);

    let ctypes = getStypes().map((ctype) => {
            let shipOfType = filterShips.filter(ship => categoryStype(ship.stype).id === ctype.id);
            return {
                'Name'     : ctype.name,
                'Id'       : ctype.id,
                'Count'    : shipOfType.length,
                'AvgLevel' : shipOfType.avg(ship => ship.level),
                'maxLvShip': shipOfType.max(ship => ship.level)
            };
        })
        .sort((a,b) => a.Id - b.Id);

    let shipStatistic = {
        'AvgLevel' : filterShips.avg(item => item.level),
        'Count'    : filterShips.length,
        'maxLvShip': filterShips.max(item => item.level),
        'Ctypes'   : ctypes
    };
    return shipStatistic;
};

module.exports = {
    getShipsStatistic: getShipsStatistic,
    FilterCondition  : shipFilterCondition
};
