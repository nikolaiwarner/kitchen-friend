import React from 'react'
import {render} from 'react-dom'

export default class Weather extends React.Component {
  constructor () {
    super()
    this.state = {
    }
  }
  
  componentDidMount () {
    this._fetchData()
    setInterval(this._fetchData, 15 * 60 * 1000)
  }

  _fetchData = () => {
    return fetch('/api/weather').then(response => response.json()).then((data) => {
      console.log(data)
      this.setState(data)
    })
  }
  
  render () {
    if (this.state.temperature) {
      return (
        <span className={'weather'}>
          {Math.floor(this.state.temperature)}° - {this.state.summary}
        </span>
      )
    } else {
      return null
    }
  }
}