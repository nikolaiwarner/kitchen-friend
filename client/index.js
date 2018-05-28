import React from 'react'
import { render } from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import Chalkboard from './components/chalkboard'
import Clock from './components/clock'
import ShoppingList from './components/itemList'
import Weather from './components/weather'

import style from './styles/style.css'

class Dashboard extends React.Component {
  _handleToggleFullscreen () {
    window.screenfull.toggle()
  }
  
  render () {
    return (
      <div className={'container'}>
        <div className={'navbar'}>
          <Clock />
          <Weather />
        </div>
        <div className={'activitiesContainer'}>
          <Chalkboard />
          <ShoppingList />
        </div>
        <button className={'fullscreen'} id='fullscreen' onClick={this._handleToggleFullscreen.bind(this)}>Fullscreen</button>
      </div>
    )
  }
}

const Home = () => (
  <div className={'container'}>
    <h1>kitchen friend</h1>
    <ul>
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li><Link to="/shoppinglist">Shopping List</Link></li>
      <li><Link to="/chalkboard">Chalkboard</Link></li>
    </ul>
  </div>
)

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home}/>
      <Route path="/dashboard" component={Dashboard}/>
      <Route path="/shoppinglist" component={ShoppingList}/>
      <Route path="/chalkboard" component={Chalkboard}/>
    </div>
  </Router>
)

render(<App />, document.getElementById('application'))