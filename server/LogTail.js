State = require('../shared/State');

function LogTail() {
    this.maxround = {}
    this.state = new State();
}

LogTail.prototype.apply = function(logSegment) {
    for (var key in logSegment.maxround) {
        this.maxround[key] = logSegment.maxround[key];
    }
    this.state.apply(logSegment.delta);
};

module.exports = LogTail;
