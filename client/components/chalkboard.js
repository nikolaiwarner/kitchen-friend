import React from 'react'
import { render } from 'react-dom'

export default class Chalkboard extends React.Component {
  constructor () {
    super()
    this.clickX = []
    this.clickY = []
    this.clickDrag = []
    this.drawing = false
    this.offsetLeft = 0
    this.offsetTop = 0
    this.state = {
    }
  }
  
  componentDidMount () {
    let container = this.refs.container
    let canvas = this.refs.chalkboard
    canvas.addEventListener('mousedown', this._onCanvasMouseDown)
    canvas.addEventListener('mousemove', this._onCanvasMouseMove)
    canvas.addEventListener('mouseup', this._onCanvasMouseUp)
    canvas.addEventListener('mouseleave', this._onCanvasMouseLeave)
    canvas.addEventListener('touchstart', this._onCanvasTouchStart)
    canvas.addEventListener('touchmove', this._onCanvasTouchMove)
    canvas.addEventListener('touchend', this._onCanvasTouchEnd)
    canvas.addEventListener('touchcancel', this._onCanvasTouchCancel)
    canvas.setAttribute('width', 512) //container.offsetWidth)
    canvas.setAttribute('height', 600) //window.innerHeight)
  }
  
  _onClickClear = () => {
    this.clickX = []
    this.clickY = []
    this.clickDrag = []
    this._redraw()
  }
  
  _onCanvasMouseDown = (e) => {
    let canvas = this.refs.chalkboard
    var mouseX = e.pageX - canvas.offsetLeft
    var mouseY = e.pageY - canvas.offsetTop
    this.drawing = true
    this._paint(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop)
    this._redraw()
  }

  _onCanvasMouseMove = (e) => {
    if (this.drawing) {
      let canvas = this.refs.chalkboard
      this._paint(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, true)
      this._redraw()
    }
  }

  _onCanvasMouseUp = () => {
    this.drawing = false
  }
  
  _onCanvasMouseLeave = () => {
    this.drawing = false
  }
  
	_onCanvasTouchStart = (e) => {
    let canvas = this.refs.chalkboard
		let mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - canvas.offsetLeft
		let	mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - canvas.offsetTop
		this.drawing = true
		this._paint(mouseX, mouseY)
    this._redraw()
	}

	_onCanvasTouchMove = (e) => {
		e.preventDefault()
    if (this.drawing) {
      let canvas = this.refs.chalkboard
      let mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - canvas.offsetLeft
      let	mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - canvas.offsetTop
      this._paint(mouseX, mouseY, true)
      this._redraw()
    }
	}
  
	_onCanvasTouchEnd = (e) => {
		this.drawing = false
    this._redraw()
  }
  
  _onCanvasTouchCancel = (e) => {
		this.drawing = false
  }

  _paint = (x, y, dragging) => {
    this.clickX.push(x)
    this.clickY.push(y)
    this.clickDrag.push(dragging)
  }

  _redraw = () => {
    let canvas = this.refs.chalkboard
    let context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.strokeStyle = "#ffffff"
    context.lineJoin = "round"
    context.lineWidth = 5
    this.clickX.forEach((clickX, i) => {
      context.beginPath()
      if (this.clickDrag[i] && i){
        context.moveTo(this.clickX[i-1], this.clickY[i-1])
      } else {
        context.moveTo(this.clickX[i]-1, this.clickY[i])
      }
      context.lineTo(this.clickX[i], this.clickY[i])
      context.closePath()
      context.stroke()
    })
  }
  
  render () {
    return (
      <div ref={'container'} className={'chalkboard-container'}>
        <button className={'clearButton'} onClick={this._onClickClear}>clear</button>
        <canvas 
          ref="chalkboard" 
          id="chalkboard" 
          width="100%" 
          height="100%"
        ></canvas>
      </div>
    )
  }
}