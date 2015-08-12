var React = require('react');
var CClient = require('./../../../../client/Client');
var injectTapEventPlugin = require('react-tap-event-plugin');
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();


var Client = new CClient.Client(false);

Client.connect('http://localhost:8080', function(state) {
    var app = new Application(state);
    start(app, 500);
});

function Application (state) {
    this.client = Client
    this.state = state;
}

Application.prototype.toBuy = function (name, count) {
  //console.log("have to buy " + count + " more of " + name);
  this.state.get('groceries').get(name).get('toBuy').add(count);
  this.client.yield();
};

Application.prototype.get = function (name) {
  return this.state.get('groceries').get(name).get('toBuy').get();
};

var stop = function stop() {};

function start(app, ms) {

  var GroceryList = React.createClass({

    getInitialState: function() {
      return {
        app: app,
        status: 'online',
      }
    },

    componentDidMount: function () {
      var self = this;
      var yielding = setInterval(function () {
            self.state.app.client.yield();
            self.setState({
              app: self.state.app,
            });
            //console.log('yielding..');
        }, ms);
      stop = function () { clearInterval(yielding); };
    },

    addGrocery: function(item, quantity){
      this.state.app.toBuy(item, parseInt(quantity));
      this.setState({
        app: this.state.app,
      });
    },

    changeConnection: function(e, toggled) {
      if (toggled) {
          var self = this
          app.client.connect('http://localhost:8080', function(state) {
              self.state.app.state = state;
              self.setState({
                app: self.state.app,
                status: 'online'
              });
          });
      } else {
          app.client.disconnect();
          this.setState({
            status: 'offline'
          });
      }
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
              <span id='toggle'>
                <mui.Toggle name="connectivity" label={this.state.status} onToggle={this.changeConnection} labelPosition="right" defaultToggled={true} />
              </span>
              <h1>CloudTypes Example: Grocery list</h1> 
              <p>This is a shared grocery list. Add new groceries using the form at the bottom and mark the amount you bought of an item by using negative numbers. </p>
              <GroceryItems app={this.state.app}/>
              <AddGrocery addNew={this.addGrocery}/>
        </div>
      )
    }
  });

  var GroceryItems = React.createClass({

    render: function() {

      var groceries = [];

      for (var key in this.props.app.state.fields) {
        if (key.indexOf('groceries') == 0) {
          var name = key.substring(key.indexOf("<")+1,key.indexOf(">"));
          var value = this.props.app.get(name);
          if (value != 0) {
            groceries.push(<Grocery name={name} value={value}/>);
          }
        }
      }

      return (
          <div>
            <h2> Groceries </h2>
            <mui.List>
              {groceries}
            </mui.List>
          </div>
      )
    }
  });

  var Grocery = React.createClass({
    render: function(){
      return (
          <mui.ListItem primaryText={this.props.value + ' ' + this.props.name} />
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
      if (this.state.newGrocery == '' || this.state.quantity == '') {
        //
      } else {
        this.props.addNew(this.state.newGrocery, this.state.quantity);
        this.setState({
          newGrocery: '',
          quantity: ''
        });
      }
    },
    render: function(){
      return (
          <form id="form">
            <mui.TextField id='quantity' value={this.state.quantity} hintText='quantity' onChange={this.updateNewQuantity}/>
            <mui.TextField ref='grocery' value={this.state.newGrocery} hintText='grocery' onChange={this.updateNewGrocery}/>
            <mui.FlatButton label="Primary" secondary={true} onClick={this.handleAddNew} label="add"/>
          </form>
      );
    }
  });

  injectTapEventPlugin();
  React.render(<GroceryList/>, document.getElementById('app'));

}



