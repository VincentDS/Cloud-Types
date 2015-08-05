var React = require('react');
var CClient = require('./../../../../client/Client');
var injectTapEventPlugin = require('react-tap-event-plugin');
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

var Client = new CClient.Client(false);

var State;

Client.connect('http://localhost:8080', function(state) {
    State = state;
    var app = new Application(state);

    start(app, 500);
});

function Application (state) {
    this.client = Client
    this.state = state;
    this.groceries = state.get('groceries');
}

Application.prototype.toBuy = function (name, count) {
  console.log("have to buy " + count + " more of " + name);
  this.groceries.get(name).get('toBuy').add(count);
  this.client.yield();
};

Application.prototype.bought = function (name, count) {
  console.log("bought " + count + " of " + name);
  this.groceries.get(name).get('toBuy').add(-count);
  this.client.yield();
};

var stop = function stop() { };

function start(app, ms) {
    var yielding = setInterval(function () {
        app.client.yield();
        //app.update();
    }, ms);
    stop = function () { clearInterval(yielding); };
}


var GroceryList = React.createClass({
    getInitialState: function(){
      return {
        groceries: [['apples', 2], ['bananas', 5], ['melons', 3]],
      }
    },
    addGrocery: function(item, quantity){
      this.state.groceries.push([item, quantity]);
      this.setState({
        groceries: this.state.groceries
      });
    },

    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    render: function(){
      return (
        <div>
            <h1>CloudTypes Example: Grocery list</h1>
            <p>This is a shared grocery list. Add new groceries using the form at the bottom and mark the amount you bought of an item by clicking it in the list. </p>
            <GroceryItems groceries={this.state.groceries}/>
            <AddGrocery addNew={this.addGrocery}/>
        </div>
      )
    }
});

var GroceryItems = React.createClass({
  render: function(){
    var listItems = this.props.groceries.map(function(grocery){
      return <Grocery grocery={grocery}/>;
    });
    return (
        <div>
          <h2> Groceries </h2>
          <mui.List>
            {listItems}
          </mui.List>
        </div>
    )
  }
});

var Grocery = React.createClass({
  render: function(){
    return (
        <mui.ListItem primaryText={this.props.grocery[1] + ' ' + this.props.grocery[0]} />
    )
  }
});


var AddGrocery = React.createClass({
  getInitialState: function(){
    return {
      newGrocery: '',
      quantity: ''
    }
  },
  updateNewGrocery: function(e){
    this.setState({
      newGrocery: e.target.value
    });
  },
  updateNewQuantity: function(e){
    this.setState({
      quantity: e.target.value
    });
  },
  handleAddNew: function(){
    this.props.addNew(this.state.newGrocery, this.state.quantity);
    this.setState({
      newGrocery: '',
      quantity: ''
    });
  },
  render: function(){
    return (
        <form id="form">
          <mui.TextField value={this.state.newGrocery} hintText='grocery' onChange={this.updateNewGrocery} />
          <mui.TextField value={this.state.quantity} hintText='quantity' onChange={this.updateNewQuantity} />
          <mui.FlatButton label="Primary" secondary={true} onClick={this.handleAddNew} label="add"/>
        </form>
    );
  }
});

injectTapEventPlugin();
React.render(<GroceryList/>, document.getElementById('app'));

