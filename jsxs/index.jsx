'use strict';
let React          = window.React,
    ReactBootstrap = window.ReactBootstrap,
    TabbedArea     = ReactBootstrap.TabbedArea,
    TabPane        = ReactBootstrap.TabPane,
    DropdownButton = ReactBootstrap.DropdownButton,
    MenuItem       = ReactBootstrap.MenuItem,
    Button         = ReactBootstrap.Button,
    ButtonGroup    = ReactBootstrap.ButtonGroup,
    ButtonToolbar  = ReactBootstrap.ButtonToolbar;

let __ = window.__;
let util = require('../libs/util');
let SnapshotShips   = require('./ships'),
    SnapshotEquips  = require('./equips'),
    StatisticsArea  = require('./statistic'),
    SnapshotCompare = require('./compare');

let formatRecord = (timeStr) => {
    if(timeStr === 'now') { return __('Now'); }
    else {
        let time = new Date(parseInt(timeStr));
        return util.formatTime(time);
    }
};

window.nowRecord = {};
let SnapShot = React.createClass({
    getInitialState: function() {
        return {
            'selectRecord': 'now',
            'selectTab'   : 3,
            'records'     : []
        };
    },
    handleSelect: function(key) {
        if(key !== this.state.selectTab) {
            this.setState({'selectTab': key});
        }
    },
    handleChange: function(key) {
        let self = this;
        if (key !== self.state.selectRecord) {
            self.setState({'selectRecord': key});
            if (key === 'now') {
                self.setState({'data': window.nowRecord});
            }
            else {
                util.load(window.playerId, key)
                    .then((data, recordId) => {
                        self.setState({'data': data});
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    },
    handleScan: function() {
        let self = this;
        util.scan(window.playerId)
        .then((items) => {
            let records = items;
            self.setState({'records': records});
        })
        .catch((err) => {
            console.log(err);
        });
    },
    handleLoad: function() {
        console.log('go load');
        util.getNow();
    },
    handleLoaded: function(event) {
        window.nowRecord = event.detail.data;
        if (this.state.selectRecord === 'now') {
            this.setState({'data': window.nowRecord});
        }
    },
    handleSave: function(event) {
        let self = this;
        util.save(window.playerId, window.nowRecord)
            .then((filename) => {
                console.log(`${filename} save success`);
                self.handleScan();
            })
            .catch((err) => {
                console.log(err);
            });
    },
    componentDidMount: function() {
        window.addEventListener('Shoted', this.handleLoaded);
        this.handleScan();
        this.handleLoad();
    },
    componentWillUnmount: function() {
        window.removeEventListener('game.response', this.handleLoaded);
    },
    render: function() {
        return (
            <div id="snapshot-content">
                <ButtonToolbar>
                    <DropdownButton title={formatRecord(this.state.selectRecord)} className="record-select">
                        <MenuItem key={0} eventKey={'now'} onSelect={this.handleChange} bsSize='lg'>{__('Now')}</MenuItem>
                        {
                            this.state.records.map((record, index) => {
                                return (
                                    <MenuItem key={index+1} eventKey={record.filename} onSelect={this.handleChange}>{record.time}</MenuItem>
                                );
                            })
                        }
                    </DropdownButton>
                    <Button onClick={this.handleLoad}>{__('Load')}</Button>
                    <Button onClick={this.handleSave}>{__('Save')}</Button>
                    <Button onClick={this.handleScan}>{__('Scan')}</Button>
                </ButtonToolbar>
                <TabbedArea id="snapshot-tabarea" activeKey={this.state.selectTab} onSelect={this.handleSelect} animation={false}>
                    <TabPane key={'ship'} eventKey={1} tab={__('Ships')} id={'Ships'} className='poi-app-tabpane'>
                        <SnapshotShips data={this.state.data ? this.state.data.ship : null} />
                    </TabPane>
                    <TabPane key={'equip'} eventKey={2} tab={__('Equips')} id={'Equips'} className='poi-app-tabpane'>
                        <SnapshotEquips data={this.state.data ? this.state.data.equip : null} />
                    </TabPane>
                    <TabPane key={'statistics'} eventKey={3} tab={__('Statistics')} id={'Statistics'} className='poi-app-tabpane'>
                        <StatisticsArea data={this.state.data || null} />
                    </TabPane>
                    <TabPane key={'compare'} eventKey={4} tab={__('Compare')} id={'Compare'} className='poi-app-tabpane'>
                        <SnapshotCompare list={this.state.records || null} />
                    </TabPane>
                </TabbedArea>
            </div>
        );
    }
});

React.render(<SnapShot />, $('kan-snapshot'));
