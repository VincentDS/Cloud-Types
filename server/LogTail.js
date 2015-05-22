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

LogTail.prototype.serializable = function() {
    return {
        maxround: this.maxround,
        state: this.state.serializable()
    }
};

LogTail.deserializable = function(json) {
    var logtail = new LogTail();
    var parsed = JSON.parse(json);
    logtail.maxround = parsed.maxround;
    //state expects json
    logtail.state = State.deserializable(JSON.stringify(parsed.state));
    return logtail;
}

module.exports = LogTail;
