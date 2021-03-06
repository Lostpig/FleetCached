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
                starText.push(<span key={i} className="equip-star">{i}★ × {equip.star[i]}</span>);
            }
        }
        return (
            <tr>
                <td>{this.props.index}</td>
                <td>{equip.id}</td>
                <td><img src={`file://${ROOT}/assets/img/slotitem/${equip.type + 100}.png`} />{equip.name}</td>
                <td>{equip.count}</td>
                <td>{starText}</td>
            </tr>
        );
    }
});

let SnapshotEquips = React.createClass({
    render: function() {
        let equips = this.props.data;
        if (equips === null) {
            return (<div className="nodata-alert">{__('No data available')}</div>);
        }

        let rows = equips.sort((a,b) => a.type - b.type)
            .map((item, index) => {
                return (<EquipRow key={index+1} equip={item} index={index+1} />);
            });

        return (
            <div class="snapshot-ships">
                <Table striped condensed>
                    <caption>{__('Equips Info')}</caption>
                    <thead>
                        <tr>
                            <th>{__('NO')}</th>
                            <th>{__('ID')}</th>
                            <th>{__('Name')}</th>
                            <th>{__('Count')}</th>
                            <th>{__('Stars')}</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </div>
        );
    }
});

module.exports = SnapshotEquips;
