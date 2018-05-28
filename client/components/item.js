import React from 'react'
import { render } from 'react-dom'

export default class Item extends React.Component {
  render () {
    return (
      <div className={'shoppinglist-item ' + (this.props.needed ? '' : 'not-needed')} onClick={this.props.onChange}>
        <input type="checkbox" checked={!!this.props.needed} />
        <label>{this.props.name}</label>
      </div>
    )
  }
}
