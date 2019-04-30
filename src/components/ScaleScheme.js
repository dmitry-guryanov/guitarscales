import React, {Component} from 'react'
import {observer} from 'mobx-react'
import { Button } from 'react-bootstrap';
import stateStore from "../stores"
import ScalePlayer from "../models/ScalePlayer"
import * as Interval from "tonal-interval"
import * as Scale from "tonal-scale"
import {noteNameJs} from "../models/Note"

var SS_STEP_WIDTH = 40;
var SS_MARGIN_LEFT = 40;

function _drawLabel(ctx, txt, posx, posy, font, color) {
    ctx.fillStyle = color;
    ctx.font = font;
    let w = ctx.measureText(txt).width;
    ctx.fillText(txt, posx - w * 0.5, posy);
}


export const ScaleScheme = observer(class ScaleScheme extends Component {
  constructor(props) {
    super(props)
    this.state = {
      enabledSteps : stateStore.enabledSteps,
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePlayPressed = this.handlePlayPressed.bind(this);

    this.devicePixelRatio = window.devicePixelRatio || 1
    //SS_STEP_WIDTH *= this.devicePixelRatio
    //SS_MARGIN_LEFT *= this.devicePixelRatio
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.checked
    const name = target.name

  	let enabledSteps = this.state.enabledSteps.slice()
  	enabledSteps[Number.parseInt(name.slice(2), 10) % this.scaleNotes.length] = value

    stateStore.setEnabledSteps(enabledSteps)

    this.setState({
      enabledSteps: enabledSteps,
    })
  }

  handlePlayPressed(event) {
    let player = new ScalePlayer(stateStore.scale)
    player.play()
  }

  resize = () => this.forceUpdate()

  componentDidMount() {
    window.addEventListener('resize', this.resize)
    this.updateCanvas()
  }

  componentDidUpdate() {
    this.updateCanvas()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d')
    var c = this.refs.canvas

    c.style.width = c.width / devicePixelRatio + "px"
    c.style.height = c.height / devicePixelRatio + "px"

    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, c.width, c.height);

    let posx = SS_MARGIN_LEFT * this.devicePixelRatio;
    for (let i = 0; i <= this.len; i++) {
        let j = i % this.len;
        _drawLabel(ctx, noteNameJs(this.scaleNotes[j]), posx, 60 * this.devicePixelRatio, 20 * this.devicePixelRatio + "px Arial", "#000");

        posx += SS_STEP_WIDTH * this.intervals[j] * this.devicePixelRatio;
    }

    posx = SS_MARGIN_LEFT * this.devicePixelRatio;
    ctx.beginPath();
    for (let i = 0; i < this.len; i++) {
        let interval = this.intervals[i];
	let label = ''
        if (interval === 1) {
            label = '\u00BD';
        } else if (interval === 2) {
            label = "1";
        } else if (interval === 3) {
            label = '1\u00BD';
        } else {
            label = interval + "/2";
        }

        _drawLabel(ctx, label, posx + interval * SS_STEP_WIDTH / 2 * this.devicePixelRatio, 17,
                   10 * this.devicePixelRatio + "px Arial", "#000");

        ctx.strokeStyle = "#999";
        ctx.moveTo(posx + 3 * this.devicePixelRatio, 40 * this.devicePixelRatio);
      ctx.lineTo(posx + (interval * SS_STEP_WIDTH / 2 - 3) * this.devicePixelRatio, 20 * this.devicePixelRatio);
      ctx.moveTo(posx + (interval * SS_STEP_WIDTH / 2 + 3) * this.devicePixelRatio, 20 * this.devicePixelRatio);
      ctx.lineTo(posx + (interval * SS_STEP_WIDTH - 3) * this.devicePixelRatio, 40 * this.devicePixelRatio);

        posx += SS_STEP_WIDTH * interval * this.devicePixelRatio;
    }
    ctx.stroke();
  }

  render() {
    let positions = []
    let checkboxes = []

    this.scaleNotes = Scale.notes(stateStore.scale)
    this.scaleIntervals = Scale.intervals(stateStore.scale)
    this.len = this.scaleIntervals.length

    this.intervals = Array(this.len)

    for (let i = 0; i < this.len - 1; i++) {
      this.intervals[i] = Interval.semitones(this.scaleIntervals[i + 1]) - Interval.semitones(this.scaleIntervals[i])
    }

    this.intervals[this.len - 1] = 12 - Interval.semitones(this.scaleIntervals[this.len - 1])

    let posx = SS_MARGIN_LEFT - 4;
    for (let i = 0; i <= this.scaleNotes.length; i++) {
        let j = i % this.scaleNotes.length

        checkboxes.push((
          <input key={`c-${i}`} name={`c-${i}`} type="checkbox" style={{position: "absolute", left: posx + "px"}} checked={this.state.enabledSteps[j]} onChange={this.handleInputChange} />
        ))
        positions.push(posx)

        posx += SS_STEP_WIDTH * this.intervals[j];
    }

    return (
      <div style={{paddingBottom: 20}}>
        <div style={{display: "inline-block"}}>
        <div style={{ display: "none" }}>fretboard {stateStore.note} {stateStore.scaleType} {stateStore.scale} {stateStore.tuning.name}</div>
        <div>
          <canvas ref="canvas" width={1200} height={60} style={{ border: "0px solid #000000" }}></canvas>
        </div>
        <div>
          {checkboxes}
        </div>
        </div>
        <Button onClick={this.handlePlayPressed}>play</Button>
      </div>
    )
  }
})
