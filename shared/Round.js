Delta = require('./Delta');

function Round(client, number) {
    this.tag = 'round';
    this.client = client;
    this.number = number;
    this.delta = new Delta();
}

Round.prototype.serializable = function() {
    return {
        client: this.client,
        number: this.number,
        delta: this.delta.serializable()
    }
};

Round.deserializable = function(json) {
    var round = new Round();
    var parsed = JSON.parse(json);
    round.client = parsed.client;
    round.number = parsed.number;
    round.delta = Delta.deserializable(parsed.delta);
    return round;
}

module.exports = Round;
