Delta = require('../shared/Delta');

function LogSegment() {
    this.maxround = {}
    this.delta = new Delta();
}

LogSegment.prototype.append = function(round) {
    this.maxround[round.client] = round.number;
    this.delta.append(round.delta);
};

module.exports = LogSegment;
