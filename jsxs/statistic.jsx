'use strict';
let React          = window.React,
    ReactBootstrap = window.ReactBootstrap,
    Panel          = ReactBootstrap.Panel,
    Table          = ReactBootstrap.Table,
    ListGroup      = ReactBootstrap.ListGroup,
    ListGroupItem  = ReactBootstrap.ListGroupItem;

let StatisticArea = React.createClass({
    render: function() {
        let common = this.props.data.common;
        let lockedShips = this.props.data.ship
                            .filter(item => item.locked)
                            .sort((a,b) => { return b.level - a.level; }),
            sumLevel = 0, avgLevel = 0;
        lockedShips.forEach(item => sumLevel += item.level);
        avgLevel = sumLevel > 0 ? (sumLevel/lockedShips.length).toFixed(1) : '0.0';

        return (<div>
            <ListGroup>
                <ListGroupItem>Tetikun Name: {common.name}</ListGroupItem>
                <ListGroupItem>Tetikun Level: {common.name}</ListGroupItem>
                <ListGroupItem>Ship: {common.shipCount}/{common.shipMax}</ListGroupItem>
                <ListGroupItem>Equip: {common.equipCount}/{common.equipMax}</ListGroupItem>

                <ListGroupItem>Battle: {common.battle.win}/{common.battle.count}({(common.battle.win/common.battle.count*100).toFixed(1)}%)</ListGroupItem>
                <ListGroupItem>Practice: {common.practice.win}/{common.practice.count}({(common.practice.win/common.practice.count*100).toFixed(1)}%)</ListGroupItem>
                <ListGroupItem>Mission: {common.mission.success}/{common.mission.count}({(common.mission.win/common.mission.count*100).toFixed(1)}%)</ListGroupItem>

                <ListGroupItem>Ship Avg Level(locked): {avgLevel}</ListGroupItem>
            </ListGroup>
             <Table striped bordered condensed>
                <thead>
                    <th>Level Range</th>
                    <th>Ship Count(Locked)</th>
                </thead>
                <tbody>
                    <tr>
                        <td>100+</td>
                        <td>{lockedShips.filter(item => item.level >= 100).length}</td>
                    </tr>
                    <tr>
                        <td>80~99</td>
                        <td>{lockedShips.filter(item => item.level >= 80 && item.level < 100).length}</td>
                    </tr>
                    <tr>
                        <td>60~79</td>
                        <td>{lockedShips.filter(item => item.level >= 60 && item.level < 80).length}</td>
                    </tr>
                    <tr>
                        <td>40~59</td>
                        <td>{lockedShips.filter(item => item.level >= 40 && item.level < 60).length}</td>
                    </tr>
                    <tr>
                        <td>39-</td>
                        <td>{lockedShips.filter(item => item.level < 40).length}</td>
                    </tr>
                </tbody>
             </Table>
         </div>);
    }
});

module.exports = StatisticArea;
