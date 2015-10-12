'use strict';
let React          = window.React,
    ReactBootstrap = window.ReactBootstrap,
    Table          = ReactBootstrap.Table;

let __ = window.__;

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
        if (ships === null) {
            return (<div className="nodata-alert">{__('No data available')}</div>);
        }

        for(let i = 0; i < ships.length; i++) {
            let ship = ships[i];
            rows.push(<ShipRow key={i+1} ship={ship} index={i+1} />);
        }
        return (
            <div class="snapshot-ships">
                <Table striped bordered condensed>
                    <caption>{__('Ships Info')}</caption>
                    <thead>
                        <tr>
                            <th>{__('NO')}</th>
                            <th>{__('ID')}</th>
                            <th>{__('Name')}</th>
                            <th>{__('Type')}</th>
                            <th>{__('Level')}</th>
                            <th>{__('Health')}</th>
                            <th>{__('Fire')}</th>
                            <th>{__('Torpedo')}</th>
                            <th>{__('Antiair')}</th>
                            <th>{__('Armor')}</th>
                            <th>{__('Luck')}</th>
                            <th>{__('Lock')}</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </div>
        );
    }
});

module.exports = SnapshotShips;
