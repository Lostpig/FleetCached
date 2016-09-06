'use strict';
let React          = window.React,
    ReactBootstrap = window.ReactBootstrap,
    Table          = ReactBootstrap.Table,
    Panel          = ReactBootstrap.Panel,
    Label          = ReactBootstrap.Label;

let __ = window.__;

let categoryStype = require('../libs/util').categoryStype;

let
    ShipRow = React.createClass({
        render: function() {
            let ship = this.props.ship;

            let fpMax = ship.firepower.now === ship.firepower.max,
                tdMax = ship.torpedo.now === ship.torpedo.max,
                aaMax = ship.antiair.now === ship.antiair.max,
                arMax = ship.armor.now === ship.armor.max,
                lkMax = ship.lucky.now === ship.lucky.max;

            return (
                <tr>
                    <td>{this.props.index}</td>
                    <td>{ship.id}</td>
                    <td>{ship.name}</td>
                    <td>{ship.type}</td>
                    <td>{ship.level}</td>
                    <td className={fpMax ? 'firepower' : ''}>{ship.firepower.now}({fpMax ? 'MAX' : ship.firepower.max})</td>
                    <td className={tdMax ? 'torpedo' : ''}>{ship.torpedo.now}({tdMax ? 'MAX' : ship.torpedo.max})</td>
                    <td className={aaMax ? 'antiair' : ''}>{ship.antiair.now}({aaMax ? 'MAX' : ship.antiair.max})</td>
                    <td className={arMax ? 'armor' : ''}>{ship.armor.now}({arMax ? 'MAX' : ship.armor.max})</td>
                    <td className={lkMax ? 'lucky' : ''}>{ship.lucky.now}({lkMax ? 'MAX' : ship.lucky.max})</td>
                    <td>{ship.locked ? (<FontAwesome name='lock' />) : ' '}</td>
                </tr>
            );
        }
    }),
    ShipTable = React.createClass({
        render: function() {
            let ships = this.props.ships.sort((a,b) => b.level - a.level),
                ctype = this.props.ctype,
                rows = [];
            for(let i = 0; i < ships.length; i++) {
                let ship = ships[i];
                rows.push(<ShipRow key={ctype + (i+1)} ship={ship} index={i+1} />);
            }

            return (<div>
                <Panel collapsible defaultExpanded header={(<span>{__(ctype) + ' '} <Label>{ships.length}</Label></span>)}>
                    <Table striped condensed className="snapshot-shiptable">
                        <thead>
                            <tr>
                                <th>{__('NO')}</th>
                                <th>{__('ID')}</th>
                                <th>{__('Name')}</th>
                                <th>{__('SType')}</th>
                                <th>{__('Level')}</th>
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
                </Panel>
            </div>);
        }
    });

let SnapshotShips = React.createClass({
    render: function() {
        let ships = this.props.data;
        if (ships === null) {
            return (<div className="nodata-alert">{__('No data available')}</div>);
        }

        let tables = ships
            .distinct(item => categoryStype(item.stype))
            .sort((a,b) => a.id - b.id)
            .map((ctype) => {
                let shipOfType = ships.filter(item => categoryStype(item.stype) === ctype);
                return (<ShipTable key={ctype.id} ctype={ctype.name} ships={shipOfType} />);
            });

        return (
            <div class="snapshot-ships">
                {tables}
            </div>
        );
    }
});

module.exports = SnapshotShips;
