'use strict';
//require('react');
let i18n = require('i18n'),
    path = require('path-extra'),
    util = require('./libs/util');

i18n.configure({
    locales      : ['en-US', 'ja-JP', 'zh-CN', 'zh-TW'],
    defaultLocale: 'zh-CN',
    directory    : path.join(__dirname, 'i18n'),
    updateFiles  : false,
    indent       : '\t',
    extension    : '.json'
});

window.language = 'zhCN'; //config.get('poi.language', navigator.language);
i18n.setLocale(window.language);
window.__ = i18n.__;

window.React = require('../../node_modules/react');
window.ReactBootstrap = require('../../node_modules/react-bootstrap');
window.FontAwesome = require('../../node_modules/react-fontawesome');

window.$ = (param) => { return document.querySelector(param); };
window.$$ = (param) => { return document.querySelectorAll(param); };

let start = () => {
    window.removeEventListener('snapshot-start', start);
    require('./views/index');
};
window.addEventListener('snapshot-start', start);

util.start();
