'use strict';

let
    i18n = require('i18n'),
    path = require('path-extra'),
    util = require('./libs/util');

window.React          = require('../../node_modules/react');
window.ReactBootstrap = require('../../node_modules/react-bootstrap');
window.FontAwesome    = require('../../node_modules/react-fontawesome');

window.$  = (param) => { return document.querySelector(param); };
window.$$ = (param) => { return document.querySelectorAll(param); };

let remote       = window.remote,
    ROOT         = window.ROOT         = path.join(__dirname, '../..'),
    EXROOT       = window.EXROOT       = remote.getGlobal('EXROOT'),
    APPDATA_PATH = window.APPDATA_PATH = remote.getGlobal('APPDATA_PATH');

i18n.configure({
    locales      : ['en-US', 'ja-JP', 'zh-CN', 'zh-TW'],
    defaultLocale: 'zh-CN',
    directory    : path.join(__dirname, 'i18n'),
    updateFiles  : false,
    indent       : '\t',
    extension    : '.json'
});
window.__ = i18n.__;

let start = (event) => {
    let startInfo = event.detail;
    window.playerId = startInfo.playerId;
    window.language = startInfo.language;
    i18n.setLocale(window.language);

    let theme = window.theme = startInfo.theme || '__default__';
    if (window.theme === '__default__') {
        $('#bootstrap-css').setAttribute('href', `file://${ROOT}/components/bootstrap/dist/css/bootstrap.css`);
    }
    else {
        $('#bootstrap-css').setAttribute('href', `file://${ROOT}/assets/themes/${theme}/css/${theme}.css`);
    }

    window.removeEventListener('snapshot-start', start);
    require('./views/index');
};
window.addEventListener('snapshot-start', start);

util.start();
