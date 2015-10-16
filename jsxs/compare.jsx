'use strict';
let React          = window.React,
    ReactBootstrap = window.ReactBootstrap,
    Table          = ReactBootstrap.Table,
    ButtonToolbar  = ReactBootstrap.ButtonToolbar,
    DropdownButton = ReactBootstrap.DropdownButton,
    MenuItem       = ReactBootstrap.MenuItem,
    Panel          = ReactBootstrap.Panel,
    Label          = ReactBootstrap.Label;

let util = require('../libs/util');
let shipStatistic = require('../libs/shipStatistic');
let shipFilterCondition = shipStatistic.FilterCondition,
    getShipsStatistic = shipStatistic.getShipsStatistic;
let stypes = util.getStypes();

let formatRecord = (timeStr) => {
        if(timeStr === 'now') { return __('Now'); }
        else if(timeStr === '') { return ''; }
        else {
            let time = new Date(parseInt(timeStr));
            return util.formatTime(time);
        }
    },
    styleIntCompare = (param) => {
        let className = param > 0 ? 'green' : (param < 0 ? 'red' : 'normal'),
            paramStr = param > 0 ? `+${param}` : param.toString();
        return (<span className={className}>{paramStr}</span>);
    },
    styleFloatCompare = (param, fix) => {
        fix = fix || 1;
        let className = param > 0 ? 'green' : (param < 0 ? 'red' : 'normal'),
            paramStr = param > 0 ? `+${param.toFixed(fix)}` : param.toFixed(fix);
        return (<span className={className}>{paramStr}</span>);
    },
    getPerDay = (count, from, to) => {
        let days = (to - from) / 86400000;
        return (count / days).toFixed(2);
    },
    getDays = (from, to) => {
        return ((to - from) / 86400000).toFixed(2);
    };

let
ColumnsGroup = React.createClass({
    render: function() {
        let length = this.props.length,
            columns = [];
        for (let i = 0; i < length; i++) {
            columns.push(<col key={i+1}></col>);
        }
        return (
            <colgroup>
                {columns}
            </colgroup>
        );
    }
}),
DispatchCompare = React.createClass({
    render: function() {
        let lData = this.props.leftdata.common,
            rData = this.props.rightdata.common;

        let tables = ['battle', 'practice', 'mission'].map((item) => {
            let win = item === 'mission' ? 'success' : 'win';
            return (
                <Table key={item} condensed className="compare-s6">
                    <ColumnsGroup length={6} />
                    <tbody>
                        <tr>
                            <td rowSpan="4">{__(item)}</td>
                            <td>{__('SuccessCount')}</td>
                            <td>{lData[item][win]}</td>
                            <td><FontAwesome name='arrow-right' /></td>
                            <td>{rData[item][win]}</td>
                            <td>{styleIntCompare(rData[item][win] - lData[item][win])}</td>
                        </tr>
                        <tr>
                            <td>{__('TotalCount')}</td>
                            <td>{lData[item].count}</td>
                            <td><FontAwesome name='arrow-right' /></td>
                            <td>{rData[item].count}</td>
                            <td>{styleIntCompare(rData[item].count - lData[item].count)}</td>
                        </tr>
                        <tr>
                            <td>{__('SuccessRate')}</td>
                            <td>{(lData[item][win]/lData[item].count*100).toFixed(1)}%</td>
                            <td><FontAwesome name='arrow-right' /></td>
                            <td>{(rData[item][win]/rData[item].count*100).toFixed(1)}%</td>
                            <td>{styleFloatCompare(((rData[item][win]/rData[item].count) - (lData[item][win]/lData[item].count)) * 100, 3)}%</td>
                        </tr>
                        <tr>
                            <td colSpan="2">{__('PerDay')}</td>
                            <td colSpan="3">{getPerDay(rData[item].count - lData[item].count, this.props.leftdata.saveTime, this.props.rightdata.saveTime)}</td>
                        </tr>
                    </tbody>
                </Table>
            );
        });

        return (
            <Panel collapsible defaultExpanded header={<Label className="snapshot-sstitle">{__('Dispatch')}</Label>}>
                {tables}
            </Panel>
        );
    }
}),
ShipCompare = React.createClass({
    render: function() {
        let condition = this.props.condition,
            lShip     = getShipsStatistic(this.props.leftdata.ship, condition.filter),
            rShip     = getShipsStatistic(this.props.rightdata.ship, condition.filter);

        return (
            <Panel collapsible defaultExpanded header={<Label className="snapshot-sstitle">{__('Ships Statistics') + ` (${condition.title})`}</Label>}>
                <Table condensed className="compare-s5">
                    <ColumnsGroup length={5} />
                    <tbody>
                        <tr>
                            <td>{__('ShipCount')}</td>
                            <td>{lShip.Count}</td>
                            <td><FontAwesome name='arrow-right' /></td>
                            <td>{rShip.Count}</td>
                            <td>{styleIntCompare(rShip.Count - lShip.Count)}</td>
                        </tr>
                        <tr>
                            <td>{__('AvgLevel')}</td>
                            <td>{lShip.AvgLevel.toFixed(1)}</td>
                            <td><FontAwesome name='arrow-right' /></td>
                            <td>{rShip.AvgLevel.toFixed(1)}</td>
                            <td>{styleFloatCompare(rShip.AvgLevel - lShip.AvgLevel)}</td>
                        </tr>
                        <tr>
                            <td>{__('Max Level Ship')}</td>
                            <td>{`${lShip.maxLvShip.name} (${lShip.maxLvShip.level})`}</td>
                            <td><FontAwesome name='arrow-right' /></td>
                            <td>{`${rShip.maxLvShip.name} (${rShip.maxLvShip.level})`}</td>
                            <td>{styleIntCompare(rShip.maxLvShip.level - lShip.maxLvShip.level)}</td>
                        </tr>
                    </tbody>
                </Table>
                <h5><Label>{__('Each ShipType Statistic')}</Label></h5>
                {
                    stypes.map((stype) => {
                        let lType = lShip.Ctypes.find((item) => item.Id === stype.id),
                            rType = rShip.Ctypes.find((item) => item.Id === stype.id);

                        return (
                            <Table key={stype.id} condensed className="compare-s6">
                                <ColumnsGroup length={6} />
                                <tbody>
                                    <tr>
                                        <td rowSpan="3">{__(stype.name)}</td>
                                        <td>{__('ShipCount')}</td>
                                        <td>{lType.Count}</td>
                                        <td><FontAwesome name='arrow-right' /></td>
                                        <td>{rType.Count}</td>
                                        <td>{styleIntCompare(rType.Count - lType.Count)}</td>
                                    </tr>
                                    <tr>
                                        <td>{__('AvgLevel')}</td>
                                        <td>{lType.AvgLevel.toFixed(1)}</td>
                                        <td><FontAwesome name='arrow-right' /></td>
                                        <td>{rType.AvgLevel.toFixed(1)}</td>
                                        <td>{styleFloatCompare(rType.AvgLevel - lType.AvgLevel)}</td>
                                    </tr>
                                    <tr>
                                        <td>{__('Max Level Ship')}</td>
                                        <td>{lType.maxLvShip ? `${lType.maxLvShip.name} (${lType.maxLvShip.level})` : ''}</td>
                                        <td><FontAwesome name='arrow-right' /></td>
                                        <td>{rType.maxLvShip ? `${rType.maxLvShip.name} (${rType.maxLvShip.level})` : ''}</td>
                                        <td>{styleIntCompare((rType.maxLvShip ? rType.maxLvShip.level : 0) - (lType.maxLvShip ? lType.maxLvShip.level : 0))}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        );
                    })
                }
            </Panel>
        );
    }
}),
CompareArea = React.createClass({
    render: function() {
        let lData = this.props.leftdata,
            rData = this.props.rightdata;

        if (!lData || !rData) { return (<div className="nodata-alert">{__('Please Select Compare Records')}</div>); }

        return (<div id="snapshot-comparearea">
            <div className="snapshot-tname">{lData.common.name}</div>
            <Table condensed className="compare-s5">
                <ColumnsGroup length={5} />
                <tbody>
                    <tr>
                        <td>{__('Date')}</td>
                        <td>{util.formatTime(lData.saveTime)}</td>
                        <td><FontAwesome name='arrow-right' /></td>
                        <td>{util.formatTime(rData.saveTime)}</td>
                        <td>{getDays(lData.saveTime, rData.saveTime) + ' ' + __('days')}</td>
                    </tr>
                    <tr>
                        <td>{__('Level')}</td>
                        <td>{lData.common.level}</td>
                        <td><FontAwesome name='arrow-right' /></td>
                        <td>{rData.common.level}</td>
                        <td>{styleIntCompare(rData.common.level - lData.common.level)}</td>
                    </tr>
                    <tr>
                        <td>{__('ShipCount')}</td>
                        <td>{lData.ship.length}</td>
                        <td><FontAwesome name='arrow-right' /></td>
                        <td>{rData.ship.length}</td>
                        <td>{styleIntCompare(rData.ship.length - lData.ship.length)}</td>
                    </tr>
                    <tr>
                        <td>{__('EquipCount')}</td>
                        <td>{lData.equip.length}</td>
                        <td><FontAwesome name='arrow-right' /></td>
                        <td>{rData.equip.length}</td>
                        <td>{styleIntCompare(rData.equip.length - lData.equip.length)}</td>
                    </tr>
                </tbody>
            </Table>

            <DispatchCompare leftdata={lData} rightdata={rData} />
            <ShipCompare leftdata={lData} rightdata={rData} condition={shipFilterCondition[0]} />
            <ShipCompare leftdata={lData} rightdata={rData} condition={shipFilterCondition[1]} />
        </div>);
    }
});

let SnapshotCompare = React.createClass({
    getInitialState: function() {
        return {
            'leftSelect' : '',
            'rightSelect': '',
            'leftRecord' : null,
            'rightRecord': null
        };
    },
    handleChange: function(pos, record) {
        let self = this;

        let stateObj = {};
        stateObj[`${pos}Select`] = record.filename;

        if(record.filename === 'now') {
            stateObj[`${pos}Record`] = window.nowRecord;
            self.setState(stateObj);
        }
        else {
            util.load(window.playerId, record.filename)
            .then((data, filename) => {
                stateObj[`${pos}Record`] = data;
                self.setState(stateObj);
            })
            .catch((err) => {
                console.log(err);
            });
        }
    },
    render: function() {
        let list = this.props.list;
        if (list === null) {
            return (<div className="nodata-alert">{__('Loading')}</div>);
        }

        return (<div className="snapshot-compare">
            <ButtonToolbar>
                <DropdownButton title={formatRecord(this.state.leftSelect)} className="record-select">
                {
                    this.state.rightSelect === 'now' ? ''
                    : <MenuItem key={'now'} onSelect={ () => { this.handleChange('left', {filename: 'now'}); } }>{__('Now')}</MenuItem>
                }
                {
                    list.filter(item => item.filename != this.state.rightSelect)
                        .map((item, index) => {
                            return (<MenuItem key={item.filename} onSelect={ () => { this.handleChange('left', item); } }>{item.time}</MenuItem>);
                        })
                }
                </DropdownButton>
                <DropdownButton title={formatRecord(this.state.rightSelect)} className="record-select">
                {
                    this.state.leftSelect === 'now' ? ''
                    : <MenuItem key={'now'} onSelect={ () => { this.handleChange('right', {filename: 'now'}); } }>{__('Now')}</MenuItem>
                }
                {
                    list.filter(item => item.filename != this.state.leftSelect)
                        .map((item, index) => {
                            return (<MenuItem key={item.filename} onSelect={ () => { this.handleChange('right', item); } }>{item.time}</MenuItem>);
                        })
                }
                </DropdownButton>
            </ButtonToolbar>
            <CompareArea leftdata={this.state.leftRecord} rightdata={this.state.rightRecord} />
        </div>);
    }
});

module.exports = SnapshotCompare;
