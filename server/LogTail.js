State = require('../shared/State');

function LogTail() {
    this.maxround = {}
    this.state = new State();
}

LogTail.prototype.apply = function(logSegment) {
    // body...
};

module.exports = LogTail;
