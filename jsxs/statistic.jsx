'use strict';
let React          = window.React,
    ReactBootstrap = window.ReactBootstrap,
    Table          = ReactBootstrap.Table;

let StatisticArea = React.createClass({
    render: function() {
        if (this.props.data === null) {
            return (<div className="nodata-alert">{__('No data available')}</div>);
        }

        let common = this.props.data.common;
        let lockedShips = this.props.data.ship
                            .filter(item => item.locked)
                            .sort((a,b) => { return b.level - a.level; }),
            sumLevel  = 0,
            avgLevel  = 0,
            maxLevel  = 0,
            maxLvShip = '';

        lockedShips.forEach((item) => {
            sumLevel += item.level;
            if(item.level > maxLevel) {
                maxLevel  = item.level;
                maxLvShip = item.name;
            }
        });
        avgLevel = sumLevel > 0 ? (sumLevel/lockedShips.length).toFixed(1) : '0.0';

        let shipCount  = this.props.data.ship.length,
            equipCount = 0;
        this.props.data.equip.forEach(item => equipCount += item.count);

        return (<div>
            <Table striped bordered condensed>
                <caption>Tetokun Common Info</caption>
                <tbody>
                    <tr>
                        <td colSpan="2">{common.name}</td>
                        <td colSpan="2">{common.level}</td>
                    </tr>
                    <tr>
                        <td>ShipCount:</td>
                        <td>{shipCount}({lockedShips.length})/{common.shipMax}</td>
                        <td>EquipCount:</td>
                        <td>{equipCount}/{common.equipMax}</td>
                    </tr>
                    <tr>
                        <td>Battle:</td>
                        <td colSpan="3">{common.battle.win}/{common.battle.count}({(common.battle.win/common.battle.count*100).toFixed(1)}%)</td>
                    </tr>
                    <tr>
                        <td>Practice:</td>
                        <td colSpan="3">{common.practice.win}/{common.practice.count}({(common.practice.win/common.practice.count*100).toFixed(1)}%)</td>
                    </tr>
                    <tr>
                        <td>Mission:</td>
                        <td colSpan="3">{common.mission.success}/{common.mission.count}({(common.mission.success/common.mission.count*100).toFixed(1)}%)</td>
                    </tr>
                    <tr>
                        <td colSpan="4">Materials:</td>
                    </tr>
                    <tr>
                        <td>{common.material.fuel}</td>
                        <td>{common.material.bullet}</td>
                        <td>{common.material.steel}</td>
                        <td>{common.material.bauxite}</td>
                    </tr>
                    <tr>
                        <td>{common.material.construct}</td>
                        <td>{common.material.repair}</td>
                        <td>{common.material.material}</td>
                        <td>{common.material.remodel}</td>
                    </tr>
                </tbody>
            </Table>

            <Table striped bordered condensed>
                <caption>Ships Level Statistics(Locked)</caption>
                <thead>
                    <tr>
                        <th>Level Range</th>
                        <th>Count</th>
                        <th>Level Range</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>100+</td>
                        <td>{lockedShips.filter(item => item.level >= 100).length}</td>
                        <td>80~99</td>
                        <td>{lockedShips.filter(item => item.level >= 80 && item.level < 100).length}</td>
                    </tr>
                    <tr>
                        <td>50~79</td>
                        <td>{lockedShips.filter(item => item.level >= 50 && item.level < 80).length}</td>
                        <td>49-</td>
                        <td>{lockedShips.filter(item => item.level < 50).length}</td>
                    </tr>
                    <tr>
                        <td colSpan="2">Ship Avg Level:</td>
                        <td colSpan="2">{avgLevel}</td>
                    </tr>
                    <tr>
                        <td colSpan="2">Ship Max Level:</td>
                        <td colSpan="2">{maxLevel}({maxLvShip})</td>
                    </tr>
                </tbody>
            </Table>
         </div>);
    }
});

module.exports = StatisticArea;
