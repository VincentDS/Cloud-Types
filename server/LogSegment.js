Delta = require('./Delta');

function LogSegment() {
    this.maxround = {}
    this.delta = new Delta();
}

LogSegment.prototype.append = function(round) {
    // body...
};

module.exports = LogSegment;
