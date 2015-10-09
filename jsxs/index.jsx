'use strict';
let React          = window.React,
    ReactBootstrap = window.ReactBootstrap,
    TabbedArea     = ReactBootstrap.TabbedArea,
    TabPane        = ReactBootstrap.TabPane,
    DropdownButton = ReactBootstrap.DropdownButton,
    MenuItem       = ReactBootstrap.MenuItem,
    Button         = ReactBootstrap.Button,
    ButtonGroup    = ReactBootstrap.ButtonGroup;

let util = require('../libs/util');
let SnapshotShips = require('./ships'),
    SnapshotEquips = require('./equips'),
    StatisticsArea = require('./statistic');

let records = [];

let formatRecord = (timeStr) => {
    if(timeStr === 'now') { return 'NOW'; }
    else {
        let time = new Date(parseInt(timeStr));
        return `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}`;
    }
};

let SnapShot = React.createClass({
    getInitialState: function() {
        return {
            'selectRecord': 'now',
            'selectTab'   : 'fleet',
            'records'     : [],
            'data'        : {
                'ship'  : [],
                'equip' : {},
                'common': {
                    'battle'  : { },
                    'practice': { },
                    'mission' : { },
                }
            }
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
            util.load(window.playerId, self.state.selectRecord)
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
        let self = this;
        if(self.state.data && self.state.selectRecord === 'now') {
            util.save(window.playerId, self.state.data)
            .then((filename) => {
                console.log(`${filename} save success`);
                self.handleScan();
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
            <div id="snapshot-content">
                <div>
                    <DropdownButton title={formatRecord(this.state.selectRecord)}>
                        <MenuItem key={0} eventKey={'now'} onSelect={this.handleChange}>Now</MenuItem>
                        {
                            this.state.records.map((record, index) => {
                                return (
                                    <MenuItem key={index+1} eventKey={record.filename} onSelect={this.handleChange}>{record.time}</MenuItem>
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
                        <StatisticsArea data={this.state.data} />
                    </TabPane>
                </TabbedArea>
            </div>
        );
    }
});

React.render(<SnapShot />, $('kan-snapshot'));
