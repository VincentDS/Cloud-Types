Delta = require('../shared/Delta');

function LogSegment() {
    this.maxround = {}
    this.delta = new Delta();
}

LogSegment.prototype.append = function(round) {
    this.maxround[round.client] = round.number;
    this.delta.append(round.delta);
};

LogSegment.prototype.isEmpty = function() {
    for (var key in this.maxround) {
        return false;
    }
    return true;
};

LogSegment.prototype.serializable = function() {
    return {
        maxround: this.maxround,
        delta: this.delta.serializable()
    }
};

LogSegment.deserializable = function(json) {
    var logsegment = new LogSegment();
    var parsed = JSON.parse(json);
    logsegment.maxround = parsed.maxround;
    logsegment.delta = Delta.deserializable(parsed.delta);
    return logsegment;
}

module.exports = LogSegment;
