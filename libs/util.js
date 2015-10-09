'use strict'
let fs   = require('fs-extra'),
    path = require('path'),
    glob = require('glob'),
    ipc  = require('ipc'),
    parser = require('./parser'),
    remote = require('remote'),
    borwserWindow = remote.require('browser-window');

let mainWindow = borwserWindow.getAllWindows()[0];
let formatTime = (time) => {
    return `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}`;
};

ipc.on('set-snapshot', (snapData) => {


    let event = new CustomEvent('Shoted', {
        bubbles   : true,
        cancelable: true,
        detail    : {
            data: parser(snapData)
        }
    });
    window.dispatchEvent(event);
});
ipc.on('start-snapshot', (playerId) => {
    window.playerId = playerId;
    window.dispatchEvent(new CustomEvent('snapshot-start', {
        bubbles   : true,
        cancelable: true
    }));
});

module.exports = {
    save: (playerId, data) => {
        let time = new Date().getTime();

        data.saveTime = time;
        let saveDir = path.join(APPDATA_PATH, 'KanSanpshot', playerId);
        let savePath = path.join(saveDir, data.saveTime + '.json');
        return new Promise((resolve, reject) => {
            try {
                fs.ensureDirSync(savePath);

                fs.writeJsonSync(filename, data);
                resolve(`${time}.json`);
            }
            catch(err) {
                reject(err);
            }
        });
    },
    load: (playerId, fileName) => {
        let loadPath = path.join(APPDATA_PATH, 'KanSanpshot', playerId, fileName);
        return new Promise((resolve, reject) => {
            try {
                let data = null;
                if (fs.existsSync(loadPath)) {
                    data = fs.readJsonSync(loadPath);
                }
                resolve(data);
            }
            catch(err) {
                reject(err);
            }
        });
    },
    scan: (playerId) => {
        let saveDir = path.join(APPDATA_PATH, 'KanSanpshot', playerId, '*.json');
        return new Promise((resolve, reject) => {
            try {
                let files = glob.sync(saveDir);
                let records = files.map((file) => {
                    let time = file.split('.')[0];
                    return { filename: file, time: formatTime(new Date(time)) };
                });
                return records;
            }
            catch(err) {
                reject(err);
            }
        });
    },
    getNow: () => {
        mainWindow.send('get-snapshot');
    },
    start: () => {
        mainWindow.send('start-snapshot');
    }
};
