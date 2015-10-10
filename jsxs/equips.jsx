'use strict';
let React          = window.React,
    ReactBootstrap = window.ReactBootstrap,
    Table          = ReactBootstrap.Table;

let __ = window.__;

let EquipRow = React.createClass({
    render: function() {
        let equip = this.props.equip,
            starText = [];
        for(let i = 1; i < equip.star.length; i++) {
            if(equip.star[i] > 0) {
                starText.push(<span className="equip-star">{i}★ × {equip.star[i]}</span>);
            }
        }
        return (
            <tr>
                <td>{this.props.index}</td>
                <td>{equip.id}</td>
                <td>{equip.name}</td>
                <td>{equip.type}</td>
                <td>{equip.count}</td>
                <td>{starText}</td>
            </tr>
        );
    }
});

let SnapshotEquips = React.createClass({
    render: function() {
        let equips = this.props.data,
            rows = [];
        if (equips === null) {
            return (<div className="nodata-alert">{__('No data available')}</div>);
        }

        for(let i = 0; i < equips.length; i++) {
            let equip = equips[i];
            rows.push(<EquipRow key={i+1} equip={equip} index={i+1} />);
        }
        return (
            <div class="snapshot-ships">
                <Table striped bordered condensed>
                    <thead>
                        <tr>
                            <th>{__('NO')}</th>
                            <th>{__('ID')}</th>
                            <th>{__('Name')}</th>
                            <th>{__('Type')}</th>
                            <th>{__('Count')}</th>
                            <th>{__('Star')}</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </div>
        );
    }
});

module.exports = SnapshotEquips;
