let React          = window.React,
    ReactBootstrap = window.ReactBootstrap,
    TabbedArea     = ReactBootstrap.TabbedArea,
    TabPane        = ReactBootstrap.TabPane,
    DropdownButton = ReactBootstrap.DropdownButton;

let util = require('../libs/util');
let SnapshotShips = require('./ships'),
    SnapshotEquips = require('./equips'),
    StatisticsArea = require('./statistic');

let records = [];
let SnapShot = React.createClass({
    getInitialState: function() {
        return {
            'selectRecord': 'now',
            'selectTab'   : 'fleet',
            'records'     : [],
            'data'        : null
        };
    },
    handleSelect: function(key) {
        if(key !== this.state.selectTab) {
            this.setState({'selectTab': key});
        }
    },
    handleChange: function(key) {
        if(key !== this.state.selectRecord) {
            this.setState({'selectRecord': key});
        }
    },
    handleScan: function() {
        let self = this;
        util.scan(window.playerId)
        .then((items) => {
            records = items;
            self.setState({'records': records});
        })
        .catch((err) => {
            console.log(err);
        });
    },
    handleLoad: function(key) {
        let self = this;
        if(self.state.selectRecord === 'now') {
            util.getNow();
        }
        else {
            util.load(window.playerId, key)
            .then((data) => {
                this.setState({'data': data});
            })
            .catch((err) => {
                console.log(err);
            });
        }
    },
    handleLoaded: function(event) {
        this.setState({'data': event.detail.data});
    },
    handleSave: function(event) {
        if(this.state.data && this.state.selectRecord === 'now') {
            util.save(window.playedId, this.state.data)
            .then((filename) => {
                console.log(`${filename} save success`);
            })
            .catch((err) => {
                console.log(err);
            });
        }
    },
    componentDidMount: function() {
        window.addEventListener('Shoted', this.handleLoaded);
    },
    componentWillUnmount: function() {
        window.removeEventListener('game.response', this.handleLoaded);
    },
    render: function() {
        return (
            <div>
                <div>
                    <DropdownButton tab={this.state.selectRecord}>
                        <div key={'now'} eventKey={0} tab={'NOW'} id={'now'} onClick={this.handleChange} />
                        {
                            this.state.records.map((record, index) => {
                                return (
                                    <div key={record.filename} eventKey={index+1} tab={record.time} id={record.filename} onClick={this.handleChange} />
                                );
                            })
                        }
                    </DropdownButton>
                    <ButtonGroup>
                        <Button onClick={this.handleLoad}>Load</Button>
                        <Button onClick={this.handleSave} disabled={this.state.selectRecord !== 'now'}>Save</Button>
                        <Button onClick={this.handleScan}>Scan</Button>
                    </ButtonGroup>
                </div>
                <TabbedArea activeKey={this.state.selectTab} onSelect={this.handleSelect} animation={false}>
                    <TabPane key={'common'} eventKey={0} tab={'Common'} id={'Common'} className='poi-app-tabpane'>
                    </TabPane>
                    <TabPane key={'ship'} eventKey={1} tab={'Ships'} id={'Ships'} className='poi-app-tabpane'>
                        <SnapshotShips data={this.state.data.ship} />
                    </TabPane>
                    <TabPane key={'equip'} eventKey={2} tab={'Equips'} id={'Equips'} className='poi-app-tabpane'>
                        <SnapshotEquips data={this.state.data.equip} />
                    </TabPane>
                    <TabPane key={'statistics'} eventKey={3} tab={'Statistics'} id={'Statistics'} className='poi-app-tabpane'>
                        <StatisticArea data={this.state.data} />
                    </TabPane>
                </TabbedArea>
            </div>
        );
    }
});

React.render(<SnapShot />, $('kan-snapshot'));
