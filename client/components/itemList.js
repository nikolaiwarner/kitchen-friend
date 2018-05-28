
import React from 'react'
import { render } from 'react-dom'

import Item from './item'

export default class ItemList extends React.Component {
  constructor () {
    super()
    this.state = {
      itemsNeeded: [],
      itemsNotNeeded: [],
      newItemText: ''
    }
  }

  componentDidMount () {
    this._fetchData()
    setInterval(this._fetchData, 15 * 60 * 1000)
  }
  
  _onChangeItem = (item) => {
    this._toggleItem(item)
  }
  
  _onNewItemInputKeyPress = (event) => {
    this.setState({newItemText: 'asdf'})
  }
  
  _addItem = () => {
    let newItem = document.getElementById('newItem')
    return fetch('/api/shoppinglist/items/', {
      body: JSON.stringify({name: newItem.value}),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    }).then(response => response.json()).then((data) => {
      console.log('post response', data)
      newItem.value = ''
      this.setState({
        newItemText: ''
      })
      this._fetchData()
    })
  }
  
  _fetchData = () => {
    return fetch('/api/shoppinglist').then(response => response.json()).then((data) => {
      console.log(data)
      this.setState({
        itemsNeeded: this._sortItemsAlphabetically(data.items.filter((item) => item.needed)),
        itemsNotNeeded: this._sortItemsAlphabetically(data.items.filter((item) => !item.needed))
      })
    })
  }
  
  _sortItemsAlphabetically = (items) => {
    return items.sort(function (a, b) {
      return a.name.toLowerCase() > b.name.toLowerCase()
    })
  }
  
  _toggleItem = (item) => {
    return fetch('/api/shoppinglist/items/' + item.id, {
      body: JSON.stringify({needed: !item.needed}),
      headers: {
        'content-type': 'application/json'
      },
      method: 'PATCH'
    }).then(response => response.json()).then((data) => {
      this._fetchData()
    })
  }
  
  render () {
    return (
      <div className={'shoppinglist'}>
        <div className={'activity-title'}>Shopping List</div>
        <div className={'shoppinglist-item input-container'}>
          <input type="checkbox" checked={false} />
          <input type="text" id="newItem" onKeyPress={this._onNewItemInputKeyPress} placeholder='New item...' />
          <button onClick={this._addItem}>Add</button>
        </div>
        {this.state.itemsNeeded.map((item, i) => 
          <Item {...item} key={item.id} onChange={this._onChangeItem.bind(this, item)} />
        )}
        {this.state.itemsNotNeeded.map((item, i) => 
          <Item {...item} key={item.id} onChange={this._onChangeItem.bind(this, item)} />
        )}
      </div>
    )
  }
}