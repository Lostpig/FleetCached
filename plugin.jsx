let ipc = require('ipc');

let React          = window.React,
    ReactBootstrap = React.ReactBootstrap,
    FontAwesome    = React.FontAwesome;

let Button = ReactBootstrap.Button;
let remote = require('remote');
let windowManager = remote.require('./lib/window');

let i18n = require('./node_modules/i18n');
let path = require('path-extra');
let __   = i18n.__;

i18n.configure({
    'locales'      : ['en-US', 'ja-JP', 'zh-CN', 'zh-TW'],
    'defaultLocale': 'zh-CN',
    'directory'    : path.join(__dirname, 'i18n'),
    'updateFiles'  : false,
    'indent'       : '\t',
    'extension'    : '.json'
});
i18n.setLocale(window.language);

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
    SnapShotWindow.webContents.on( 'dom-ready', (e) => {
        SnapShotWindow.show();
    });
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
            barek;
        case '/kcsapi/api_get_member/material':
            for(let m in body) {
                let val = body[m];
                if(typeof m === 'string') { m = parseInt(m.slice(1,2)); }
                tempCommon.material[materials[m]] = val;
            }
            break;
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
        let playerId = window._nickNameId;
        SnapShotWindow.webContents.send('start-snapshot', playerId);
    });
    window.addEventListener('game.response', watchCommon);
}

module.exports = {
    'name'       : 'SnapShot',
    'priority'   : 50,
    'realClose'  : true,
    'displayName': <span><FontAwesome name='ship' key={0} />{' ' + __('Ship Girls Info')}</span>,
    'author'     : 'Lostpig',
    'link'       : 'https://github.com/Lostpig',
    'version'    : '0.1.0',
    'description': __('Show detailed information of all owned ship girls'),
    'handleClick': function() {
        boot();
    }
};
