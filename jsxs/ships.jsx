'use strict';
let React          = window.React,
    ReactBootstrap = window.ReactBootstrap,
    Table          = ReactBootstrap.Table;

let ShipRow = React.createClass({
    render: function() {
        let ship = this.props.ship;
        return (
            <tr>
                <td>{this.props.index}</td>
                <td>{ship.id}</td>
                <td>{ship.name}</td>
                <td>{ship.type}</td>
                <td>{ship.level}</td>
                <td>{ship.health}</td>
                <td>{ship.firepower.now}({ship.firepower.max})</td>
                <td>{ship.torpedo.now}({ship.torpedo.max})</td>
                <td>{ship.antiair.now}({ship.antiair.max})</td>
                <td>{ship.armor.now}({ship.armor.max})</td>
                <td>{ship.lucky.now}({ship.lucky.max})</td>
                <td>{ship.locked}</td>
            </tr>
        );
    }
});

let SnapshotShips = React.createClass({
    render: function() {
        let ships = this.props.data,
            rows = [];
        for(let i = 0; i < ships.length; i++) {
            let ship = ships[i];
            rows.push(<ShipRow ship={ship} index={i+1} />);
        }
        return (
            <div class="snapshot-ships">
                <Table striped condensed hover>
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Level</th>
                            <th>Health</th>
                            <th>Fire</th>
                            <th>Torpedo</th>
                            <th>Antiair</th>
                            <th>Armor</th>
                            <th>Luck</th>
                            <th>Lock</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </div>
        );
    }
});

module.exports = SnapshotShips;
