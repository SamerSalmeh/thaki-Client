import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, HashRouter } from 'react-router-dom';


// import $ from 'jquery';
import './style.css'
import MainScreen from './components/MainScreen.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
  }

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/" component={MainScreen} />
          <Route path="/MainScreen" component={MainScreen} />
        </Switch>
      </HashRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));