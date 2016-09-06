'use strict';
let ipc = require('ipc');

let remote = require('remote');
let windowManager = remote.require('./lib/window');
let path = require('path-extra');

let React = window.React,
    FontAwesome = window.FontAwesome;

let getTitle = (language) => {
    return ({
        'zh-CN': '舰队快照',
        'zh-TW': '艦隊存檔',
        'en-US': 'Fleets Cached',
        'js-JP': '艦隊キャッシュ'
    })[language];
};

let SnapShotWindow = null;
let boot = () => {
    SnapShotWindow = windowManager.createWindow({
        realClose: true,
        x        : config.get('poi.window.x', 0),
        y        : config.get('poi.window.y', 0),
        width    : 1020,
        height   : 650
    });
    SnapShotWindow.loadUrl('file://' + __dirname + '/index.html');
    SnapShotWindow.webContents.on('dom-ready', (e) => {
        SnapShotWindow.show();
    });
    if(process.env.DEBUG) {
        SnapShotWindow.openDevTools({ detach: true });
    }
};

let materials = ['fuel', 'bullet','steel','bauxite',
        'construct','repair','material','remodel'];
let tempCommon = {
    material: {},
    battle  : {},
    practice: {},
    mission : {}
};
let watchCommon = (e) => {
    let path = e.detail.path,
        body = e.detail.body;

    switch(path) {
        case '/kcsapi/api_get_member/basic':
            tempCommon.name     = body.api_nickname;
            tempCommon.rank     = body.api_rank;
            tempCommon.level    = body.api_level;
            tempCommon.shipMax  = body.api_max_chara;
            tempCommon.equipMax = body.api_max_slotitem;

            tempCommon.battle.win      = body.api_st_win;
            tempCommon.battle.count    = body.api_st_win + body.api_st_lose;
            tempCommon.practice.win    = body.api_pt_win;
            tempCommon.practice.count  = body.api_pt_win + body.api_pt_lose;
            tempCommon.mission.success = body.api_ms_success;
            tempCommon.mission.count   = body.api_ms_count;
            break;
        case '/kcsapi/api_get_member/material':
            for(let e in body) {
                let id = body[e].api_id - 1;
                tempCommon.material[materials[id]] = body[e].api_value;
            }
            break;
        case '/kcsapi/api_port/port':
            for(let e in body.api_material) {
                let id = body.api_material[e].api_id - 1;
                tempCommon.material[materials[id]] = body.api_material[e].api_value;
            }
            break;
        case '/kcsapi/api_req_hokyu/charge':
        case '/kcsapi/api_req_kousyou/destroyship':
            for(let i = 0; i < 4; i++) {
                tempCommon.material[materials[i]] = body.api_material[i];
            }
            break;
        case '/kcsapi/api_req_kousyou/createitem':
            for(let i = 0; i < 8; i++) {
                tempCommon.material[materials[i]] = body.api_material[i];
            }
        case '/kcsapi/api_req_kousyou/createship_speedchange':
            if (body.api_result === 1) {
                tempCommon.material[materials[4]] -= 1;
            }
            break;
        case '/kcsapi/api_req_kousyou/destroyitem2':
            for(let i = 0; i < 4; i++) {
                tempCommon.material[materials[i]] = body.api_get_material[i];
            }
            break;
        case '/kcsapi/api_req_kousyou/remodel_slot':
            for(let i = 0; i < 8; i++) {
                tempCommon.material[materials[i]] = body.api_after_material[i];
            }
            break;
        case '/kcsapi/api_req_nyukyo/speedchange':
            if (body.api_result === 1) {
                tempCommon.material[5] -= 1;
            }
            break;
        case '/kcsapi/api_req_nyukyo/start':
            if (body.api_highspeed === 1) {
                tempCommon.material[5] -= 1;
            }
            break;
        default: break;
    }
};

if (config.get('plugin.SnapShot.enable', true)) {
    ipc.on('get-snapshot', () => {
        if(!SnapShotWindow) { return; }
        let snapData = {
            $ships        : window.$ships,
            $shipTypes    : window.$shipTypes,
            $slotitems    : window.$slotitems,
            $slotitemTypes: window.$slotitemTypes,
            _ships        : window._ships,
            _slotitems    : window._slotitems,
            _common       : tempCommon
        };
        SnapShotWindow.webContents.send('set-snapshot', snapData);
    });
    ipc.on('start-snapshot', () => {
        if(!SnapShotWindow) { return; }
        let startInfo = {
            playerId: window._nickNameId,
            language: window.config.get('poi.language', 'zh-CN'),
            theme   : window.config.get('poi.theme', '__default__')
        };
        SnapShotWindow.webContents.send('start-snapshot', startInfo);
    });
    window.addEventListener('game.response', watchCommon);
}

module.exports = {
    'name'       : 'SnapShot',
    'priority'   : 50,
    'realClose'  : true,
    'displayName': React.createElement('span', null, React.createElement(FontAwesome, { 'name': 'tags', 'key': 0. }), ' ' + getTitle(window.language)),
    'author'     : 'Lostpig',
    'link'       : 'https://github.com/Lostpig',
    'version'    : '0.1.14',
    'description': 'SnapShot',
    'handleClick': function() {
        boot();
    }
};
