'use strict';
require('../libs/lambdaplus');
let React          = window.React,
    ReactBootstrap = window.ReactBootstrap,
    Table          = ReactBootstrap.Table;

let getShipsStatistic = (shipdata) => {
        let lockedShips = shipdata.filter(item => item.locked),
            forceShips = lockedShips.filter(item => item.level >= 70);

        let types = lockedShips
            .distinct(item => item.type)
            .map((typeitem) => {
                let _lockeds = lockedShips.filter(item => item.type === typeitem),
                    _forces = forceShips.filter(item => item.type === typeitem);
                return {
                    'name'       : typeitem,
                    'lockedCount': _lockeds.length,
                    'forceCount' : _forces.length,
                    'lockedAvgLv': _lockeds.avg(item => item.level),
                    'forceAvgLv' : _forces.avg(item => item.level),
                    'maxLvShip'  : _lockeds.max(item => item.level)
                };
        });

        let shipStatistic = {
            'lockedAvgLv': lockedShips.avg(item => item.level),
            'lockedCount': lockedShips.length,
            'forceAvgLv' : forceShips.avg(item => item.level),
            'forceCount' : forceShips.length,
            'maxLvShip'  : lockedShips.max(item => item.level),
            'types'      : types
        };
        return shipStatistic;
    };

let StatisticArea = React.createClass({
    render: function() {
        if (this.props.data === null) {
            return (<div className="nodata-alert">{__('No data available')}</div>);
        }

        let common = this.props.data.common;
        let shipCount  = this.props.data.ship.length,
            equipCount = 0;
        this.props.data.equip.forEach(item => equipCount += item.count);

        let sShip = getShipsStatistic(this.props.data.ship);

        return (<div>
            <Table striped bordered condensed>
                <caption>{__('Teitokun Common Info')}</caption>
                <tbody>
                    <tr>
                        <td colSpan="2">{common.name}</td>
                        <td colSpan="2">{__('Level')}.{common.level}</td>
                    </tr>
                    <tr>
                        <td>{__('ShipCount')}:</td>
                        <td>{shipCount}/{common.shipMax}</td>
                        <td>{__('EquipCount')}:</td>
                        <td>{equipCount}/{common.equipMax}</td>
                    </tr>
                    <tr>
                        <td>{__('Battle')}:</td>
                        <td colSpan="3">{common.battle.win}/{common.battle.count}({(common.battle.win/common.battle.count*100).toFixed(1)}%)</td>
                    </tr>
                    <tr>
                        <td>{__('Practice')}:</td>
                        <td colSpan="3">{common.practice.win}/{common.practice.count}({(common.practice.win/common.practice.count*100).toFixed(1)}%)</td>
                    </tr>
                    <tr>
                        <td>{__('Mission')}:</td>
                        <td colSpan="3">{common.mission.success}/{common.mission.count}({(common.mission.success/common.mission.count*100).toFixed(1)}%)</td>
                    </tr>
                    <tr>
                        <td colSpan="4">{__('Materials')}:</td>
                    </tr>
                    <tr>
                        <td>
                            <img src={`file://${ROOT}/assets/img/material/01.png`} />
                            <span>{common.material.fuel}</span>
                        </td>
                        <td>
                            <img src={`file://${ROOT}/assets/img/material/02.png`} />
                            <span>{common.material.bullet}</span>
                        </td>
                        <td>
                            <img src={`file://${ROOT}/assets/img/material/03.png`} />
                            <span>{common.material.steel}</span>
                        </td>
                        <td>
                            <img src={`file://${ROOT}/assets/img/material/04.png`} />
                            <span>{common.material.bauxite}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img src={`file://${ROOT}/assets/img/material/05.png`} />
                            <span>{common.material.construct}</span>
                        </td>
                        <td>
                            <img src={`file://${ROOT}/assets/img/material/06.png`} />
                            <span>{common.material.repair}</span>
                        </td>
                        <td>
                            <img src={`file://${ROOT}/assets/img/material/07.png`} />
                            <span>{common.material.material}</span>
                        </td>
                        <td>
                            <img src={`file://${ROOT}/assets/img/material/08.png`} />
                            <span>{common.material.remodel}</span>
                        </td>
                    </tr>
                </tbody>
            </Table>

            <Table striped bordered condensed>
                <caption>{__('Ships Statistics')}({__('Locked')})</caption>
                <tbody>
                    <tr>
                        <td>{__('ShipCount')}</td>
                        <td colSpan="3">{sShip.lockedCount}</td>
                    </tr>
                    <tr>
                        <td>{__('AvgLevel')}</td>
                        <td colSpan="3">{sShip.lockedAvgLv.toFixed(1)}</td>
                    </tr>
                    <tr>
                        <td>{__('Max Level Ship')}</td>
                        <td colSpan="3">{sShip.maxLvShip.name} ({sShip.maxLvShip.level})</td>
                    </tr>
                    <tr>
                        <td colSpan="4">{__('Each ShipType Statistic')}</td>
                    </tr>
                    <tr>
                        <td>{__('Type')}</td>
                        <td>{__('ShipCount')}</td>
                        <td>{__('AvgLevel')}</td>
                        <td>{__('Max Level Ship')}</td>
                    </tr>
                    {
                        sShip.types.map((item) => {
                            return (<tr>
                                <td>{item.name}</td>
                                <td>{item.lockedCount}</td>
                                <td>{item.lockedAvgLv.toFixed(1)}</td>
                                <td>{item.maxLvShip.name} ({item.maxLvShip.level})</td>
                            </tr>);
                        })
                    }
                </tbody>
            </Table>

            <Table striped bordered condensed>
                <caption>{__('Ships Statistics')}({__('MainForce')} lv.70+)</caption>
                <tbody>
                    <tr>
                        <td>{__('ShipCount')}</td>
                        <td colSpan="3">{sShip.forceCount}</td>
                    </tr>
                    <tr>
                        <td>{__('AvgLevel')}</td>
                        <td colSpan="3">{sShip.forceAvgLv.toFixed(1)}</td>
                    </tr>
                    <tr>
                        <td>{__('Max Level Ship')}</td>
                        <td colSpan="3">{sShip.maxLvShip.name} ({sShip.maxLvShip.level})</td>
                    </tr>
                    <tr>
                        <td colSpan="4">{__('Each ShipType Statistic')}</td>
                    </tr>
                    <tr>
                        <td>{__('Type')}</td>
                        <td>{__('ShipCount')}</td>
                        <td>{__('AvgLevel')}</td>
                        <td>{__('Max Level Ship')}</td>
                    </tr>
                    {
                        sShip.types.map((item) => {
                            return (<tr>
                                <td>{item.name}</td>
                                <td>{item.forceCount}</td>
                                <td>{item.forceAvgLv.toFixed(1)}</td>
                                <td>{item.maxLvShip.name} ({item.maxLvShip.level})</td>
                            </tr>);
                        })
                    }
                </tbody>
            </Table>
         </div>);
    }
});

module.exports = StatisticArea;
