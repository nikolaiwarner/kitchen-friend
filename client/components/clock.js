import React from 'react'
import {render} from 'react-dom'
import Moment from 'react-moment'

export default class Clock extends React.Component {
  constructor () {
    super()
    this.state = {
      date: new Date()
    }
  }
  
  componentDidMount () {
    setInterval(this._update, 60 * 1000)
  }

  _update = () => {
    this.setState({date: new Date()})
  }
  
  render () {
    return (
      <Moment format="h:mma">{this.state.date}</Moment>
    )
  }
}