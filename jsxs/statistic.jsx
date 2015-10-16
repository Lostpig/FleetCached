'use strict';
require('../libs/lambdaplus');
let React          = window.React,
    ReactBootstrap = window.ReactBootstrap,
    ListGroup      = ReactBootstrap.ListGroup,
    ListGroupItem  = ReactBootstrap.ListGroupItem,
    Table          = ReactBootstrap.Table,
    Label          = ReactBootstrap.Label,
    Panel          = ReactBootstrap.Panel;

let shipStatistic = require('../libs/shipStatistic');
let shipFilterCondition = shipStatistic.FilterCondition,
    getShipsStatistic = shipStatistic.getShipsStatistic;

let ShipStatisticArea = React.createClass({
    render: function() {
        if (this.props.data === null) { return ''; }
        let title = this.props.title,
            sShip = this.props.data;

        return (
            <Panel collapsible defaultExpanded header={<Label className="snapshot-sstitle">{__('Ships Statistics') + ` (${title})`}</Label>}>
                <ListGroup>
                    <ListGroupItem>{`${__('ShipCount')} : ${sShip.Count}`}</ListGroupItem>
                    <ListGroupItem>{`${__('AvgLevel')} : ${sShip.AvgLevel.toFixed(1)}`}</ListGroupItem>
                    <ListGroupItem>{`${__('Max Level Ship')} : ${sShip.maxLvShip.name} (${sShip.maxLvShip.level})`}</ListGroupItem>
                </ListGroup>
                <h5><Label>{__('Each ShipType Statistic')}</Label></h5>
                <Table striped condensed>
                    <thead>
                        <tr>
                            <td>{__('SType')}</td>
                            <td>{__('ShipCount')}</td>
                            <td>{__('AvgLevel')}</td>
                            <td>{__('Max Level Ship')}</td>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        sShip.Ctypes.map((item) => {
                            return (<tr key={item.Id}>
                                <td>{item.Name}</td>
                                <td>{item.Count}</td>
                                <td>{item.AvgLevel.toFixed(1)}</td>
                                <td>{item.maxLvShip ? `${item.maxLvShip.name} (${item.maxLvShip.level})` : ''})</td>
                            </tr>);
                        })
                    }
                    </tbody>
                </Table>
            </Panel>
        );
    }
});

let StatisticArea = React.createClass({
    render: function() {
        if (this.props.data === null) {
            return (<div className="nodata-alert">{__('No data available')}</div>);
        }

        let common = this.props.data.common;
        let shipCount  = this.props.data.ship.length,
            equipCount = 0;
        this.props.data.equip.forEach(item => equipCount += item.count);

        let sShips = shipFilterCondition.map((item, index) => {
            let data = getShipsStatistic(this.props.data.ship, item.filter);
            return (<ShipStatisticArea key={index + 1} data={data} title={item.title} />);
        });

        return (<div className="snapshot-statisticarea">
            <h4><Label>{__('Teitokun Common Info')}</Label></h4>
            <ListGroup>
                <ListGroupItem>{common.name + ' ' + __('Level') + '.' + common.level}</ListGroupItem>
                <ListGroupItem>{__('ShipCount') + ': ' + shipCount + ' / ' + common.shipMax}</ListGroupItem>
                <ListGroupItem>{__('EquipCount') + ': ' + equipCount + ' / ' + common.equipMax}</ListGroupItem>
            </ListGroup>

            <h4><Label>{__('Dispatch')}:</Label></h4>
            <Table condensed>
                <thead>
                    <tr>
                        <td></td>
                        <td>{__('Battle')}</td>
                        <td>{__('Practice')}</td>
                        <td>{__('Mission')}</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{__('SuccessCount')}</td>
                        <td>{common.battle.win}</td>
                        <td>{common.practice.win}</td>
                        <td>{common.mission.success}</td>
                    </tr>
                    <tr>
                        <td>{__('TotalCount')}</td>
                        <td>{common.battle.count}</td>
                        <td>{common.practice.count}</td>
                        <td>{common.mission.count}</td>
                    </tr>
                    <tr>
                        <td>{__('SuccessRate')}</td>
                        <td>{(common.battle.win/common.battle.count*100).toFixed(1)}%</td>
                        <td>{(common.practice.win/common.practice.count*100).toFixed(1)}%</td>
                        <td>{(common.mission.success/common.mission.count*100).toFixed(1)}%</td>
                    </tr>
                </tbody>
            </Table>

            <h4><Label>{__('Materials')}:</Label></h4>
            <Table condensed>
                <tbody>
                    <tr>
                        <td colSpan="4"></td>
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

            {sShips}
         </div>);
    }
});

module.exports = StatisticArea;
