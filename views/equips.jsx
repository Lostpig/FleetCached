'use strict'
let React          = window.React,
    ReactBootstrap = window.ReactBootstrap,
    Table          = ReactBootstrap.Table;

let EquipRow = React.createClass({
    render: function() {
        let equip = this.props.equip,
            starText = [];
        for(let i = 1; i < equip.star; i++) {
            if(equip.star[i] > 0) {
                starText.push(<span>{i}★ × {equip.star[i]}</span>);
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
        for(let i = 0; i < equips.length; i++) {
            let equip = equips[i];
            rows.push(<EquipRow equip={equip} index={i+1} />);
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
                            <th>Count</th>
                            <th>Star</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </div>
        );
    }
});

module.exports = SnapshotEquips;
