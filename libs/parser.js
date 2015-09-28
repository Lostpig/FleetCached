let
parseShip = (ships, $ships, $shipTypes) => {
    let arr = [];
    arr = ships.map((ship) => {
        let shipinfo = $ships[ship.api_ship_id];
        return {
            id    : ship.id,
            type  : $shipTypes[shipinfo.api_stype].api_name,
            name  : shipinfo.api_name,
            level : ship.api_lv,
            health: ship.api_maxhp,

            firepower: {
                now: ship.api_houg[0] + ship.api_karyoku[0],
                max: ship.api_karyoku[1]
            },
            torpedo: {
                now: ship.api_raig[0] + ship.api_karyoku[1],
                max: ship.api_raisou[1]
            },
            antiair: {
                now: ship.api_tyku[0] + ship.api_karyoku[2],
                max: ship.api_taiku[1]
            },
            armor: {
                now: ship.api_souk[0] + ship.api_karyoku[3],
                max: ship.api_soukou[1]
            },
            lucky: {
                now: ship.api_luck[0] + ship.api_karyoku[4],
                max: ship.api_lucky[1]
            },

            locked: ship.api_locked === 1
        };
    });
    return arr;
},
parseEquips = (slotitems, $slotitems, $slotitemTypes) => {
    let equipMap = {};
    for(let i = 0, l = slotitems.length; i < l; i++) {
        let equip = slotitems[i],
            equipInfo = $slotitems[equip.api_slotitem_id]; equip.api_slotitem_id.toString();
        if (!equipMap[equipInfo.api_id.toString()]) {
            equipMap[equipId] = {
                id      : equipInfo.api_id,
                name    : equipInfo.api_name,
                type    : equipInfo.api_type[3],
                typename: slotitemTypes[equipInfo.api_type[3]].api_name,
                count   : 0,
                star    : [0,0,0,0,0,0,0,0,0,0,0]
            };
        }
        equipMap[equipId].count++;
        if(typeof equip.api_level === 'number' && equip.api_level > 0) {
            equipMap[equipId].star[equip.api_level]++;
        }
    }
    return equipMap;
},
parseCommon = (data) => {
    let common = data._common;
    common.shipCount = data._ships.length;
    common.equipCount = data._slotitems.length;

    return common;
};


module.exports = (data) => {
    return {
        ship  : parseShip(data._ships, data.$ships, data.$shipTypes),
        equip : parseEquips(data._slotitems, data.$slotitems, data.$slotitemTypes),
        common: data._common
    };
};
