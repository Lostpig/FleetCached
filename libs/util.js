'use strict';
let fs            = require('fs-extra'),
    path          = require('path'),
    glob          = require('glob'),
    ipc           = require('ipc'),
    parser        = require('./parser'),
    remote        = require('remote'),
    borwserWindow = remote.require('browser-window');

let mainWindow = borwserWindow.getAllWindows()[0];

window.remote = remote;

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
ipc.on('start-snapshot', (startInfo) => {
    window.dispatchEvent(new CustomEvent('snapshot-start', {
        bubbles   : true,
        cancelable: true,
        detail    : startInfo
    }));
});

let stypeMap = {
    'DD'   : {name: 'DD', id: 1},
    'CL'   : {name: 'CL', id: 2},
    'CA'   : {name: 'CA', id: 3},
    'BB'   : {name: 'BB', id: 4},
    'CV'   : {name: 'CV', id: 5},
    'SS'   : {name: 'SS', id: 6},
    'Other': {name: 'Other', id: 99}
};

let formatTime = (time) => {
    if (typeof time === 'number') { time = new Date(time); }
    let year  = time.getFullYear(),
        month = ('0' + (time.getMonth() + 1)).slice(-2),
        date  = ('0' + time.getDate()).slice(-2),
        hour  = ('0' + time.getHours()).slice(-2),
        min   = ('0' + time.getMinutes()).slice(-2),
        sec   = ('0' + time.getSeconds()).slice(-2);

    return `${year}-${month}-${date} ${hour}:${min}:${sec}`;
};

module.exports = {
    save: (playerId, data) => {
        let saveDir = path.join(APPDATA_PATH, 'KanSanpshot', playerId);
        let savePath = path.join(saveDir, data.saveTime + '.json');
        return new Promise((resolve, reject) => {
            try {
                fs.ensureDirSync(saveDir);
                fs.writeJsonSync(savePath, data);
                resolve(`${data.saveTime}.json`);
            }
            catch(err) {
                reject(err);
            }
        });
    },
    load: (playerId, recordId) => {
        let fileName = recordId + '.json';
        let loadPath = path.join(APPDATA_PATH, 'KanSanpshot', playerId, fileName);
        return new Promise((resolve, reject) => {
            try {
                let data = null;
                if (fs.existsSync(loadPath)) {
                    data = fs.readJsonSync(loadPath);
                }
                resolve(data, recordId);
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
                    let time = parseInt(path.parse(file).name);
                    return { filename: time, time: formatTime(new Date(time)) };
                });
                resolve(records);
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
    },
    formatTime: formatTime,
    getStypes : () => {
        let stypes = [];
        for(let s in stypeMap) {
            stypes.push(stypeMap[s]);
        }
        return stypes.sort((a,b) => a.id - b.id);
    },
    categoryStype: (stype) => {
        let result;
        switch(stype) {
            case 2:
                result = stypeMap.DD; break;
            case 3: case 4:
                result = stypeMap.CL; break;
            case 5: case 6:
                result = stypeMap.CA; break;
            case 8: case 9: case 10: case 12:
                result = stypeMap.BB; break;
            case 7: case 11: case 18:
                result = stypeMap.CV; break;
            case 13: case 14:
                result = stypeMap.SS; break;
            default:
                result = stypeMap.Other; break;
        }
        return result;
    }
};
