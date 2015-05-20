Delta = require('./Delta');

function Round(client, number) {
    this.tag = 'round';
    this.client = client;
    this.number = number;
    this.delta = new Delta();
}

module.exports = Round;
