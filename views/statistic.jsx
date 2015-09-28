let React          = window.React,
    ReactBootstrap = window.ReactBootstrap,
    Panel          = ReactBootstrap.Panel;

let StatisticArea = React.createClass({
    render: function() {
        let common = this.props.data.common;
        return (
            <ListGroup>
                <ListGroupItem>Tetikun Name: {common.name}</ListGroupItem>
            </ListGroup>
        );
    }
});
