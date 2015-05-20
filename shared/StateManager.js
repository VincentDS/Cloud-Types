Round = require('./Round'),
State = require('./State');

function StateManager() {
    this.state = new State(this);
    this.unconfirmed = [];
    this.current =  new Round(this, 1);
}

module.exports = StateManager;
