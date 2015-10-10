'use strict';

let
parseShip = (ships, $ships, $shipTypes) => {
    let arr = [];
    let shipInfos = [], shipTypes = [];
    for (let index = 0; index < $ships.length; index++) {
        shipInfos[$ships[index].api_id] = $ships[index];
    }
    for (let index = 0; index < $shipTypes.length; index++) {
        shipTypes[$shipTypes[index].api_id] = $shipTypes[index];
    }

    for(let id in ships) {
        let ship = ships[id];
        let shipinfo = shipInfos[ship.api_ship_id];
        let s_item = {
            id    : ship.id,
            type  : shipTypes[shipinfo.api_stype].api_name,
            name  : shipinfo.api_name,
            level : ship.api_lv,
            health: ship.api_maxhp,

            firepower: {
                now: shipinfo.api_houg[0] + ship.api_kyouka[0],
                max: ship.api_karyoku[1]
            },
            torpedo: {
                now: shipinfo.api_raig[0] + ship.api_kyouka[1],
                max: ship.api_raisou[1]
            },
            antiair: {
                now: shipinfo.api_tyku[0] + ship.api_kyouka[2],
                max: ship.api_taiku[1]
            },
            armor: {
                now: shipinfo.api_souk[0] + ship.api_kyouka[3],
                max: ship.api_soukou[1]
            },
            lucky: {
                now: shipinfo.api_luck[0] + ship.api_kyouka[4],
                max: ship.api_lucky[1]
            },

            locked: ship.api_locked === 1
        };
        arr.push(s_item);
    }

    return arr;
},
parseEquips = (slotitems, $slotitems, $slotitemTypes) => {
    let equipMap = {},
        equipArr = [];
    let itemInfos = [],
        itemTypes = [];
    for (let index = 0; index < $slotitems.length; index++) {
        itemInfos[$slotitems[index].api_id] = $slotitems[index];
    }
    for (let index = 0; index < $slotitemTypes.length; index++) {
        itemTypes[$slotitemTypes[index].api_id] = $slotitemTypes[index];
    }

    for(let id in slotitems) {
        let equip = slotitems[id],
            equipInfo = itemInfos[equip.api_slotitem_id],
            apiId = equipInfo.api_id.toString();

        if(!equipMap[apiId]) {
            equipMap[apiId] = {
                id      : equipInfo.api_id,
                name    : equipInfo.api_name,
                type    : equipInfo.api_type[3],
                typename: itemTypes[equipInfo.api_type[3]].api_name,
                count   : 0,
                star    : [0,0,0,0,0,0,0,0,0,0,0]
            };
        }

        equipMap[apiId].count++;
        if(typeof equip.api_level === 'number' && equip.api_level > 0) {
            equipMap[apiId].star[equip.api_level]++;
        }
    }

    for(let id in equipMap) {
        equipArr.push(equipMap[id]);
    }

    return equipArr;
},
parseCommon = (data) => {
    let common = data._common;
    return common;
};

module.exports = (data) => {
    return {
        ship  : parseShip(data._ships, data.$ships, data.$shipTypes),
        equip : parseEquips(data._slotitems, data.$slotitems, data.$slotitemTypes),
        common: parseCommon(data)
    };
};
