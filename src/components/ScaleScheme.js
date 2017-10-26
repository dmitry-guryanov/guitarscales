import React, {Component} from 'react'
import {observer} from 'mobx-react'
import { Button } from 'react-bootstrap';
import stateStore from "../stores"
import ScalePlayer from "../models/ScalePlayer"
const SS_STEP_WIDTH = 40;
const SS_MARGIN_LEFT = 40;

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

	  this.notes = {}

    this.player = new ScalePlayer(stateStore.scale)
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.checked
    const name = target.name

  	let enabledSteps = this.state.enabledSteps.slice()
  	enabledSteps[Number.parseInt(name.slice(2), 10) % stateStore.scale.notes.length] = value

    stateStore.setEnabledSteps(enabledSteps)

    this.setState({
      enabledSteps: enabledSteps,
    })
  }

  handlePlayPressed(event) {
//    new ScalePlayer(stateStore.scale)
    this.player.play()
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
    var m = stateStore.scale

    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, c.width, c.height);

    let posx = SS_MARGIN_LEFT;
    for (let i = 0; i <= m.notes.length; i++) {
        let j = i % m.notes.length;
        _drawLabel(ctx, m.notes[j].displayNameJs(), posx, 60, "20px Arial", "#000");
        _drawLabel(ctx, m.mode_type.stepNames[j], posx, 80, "20px Arial", "#000");

        posx += SS_STEP_WIDTH * m.mode_type.intervals[j];
    }

    posx = SS_MARGIN_LEFT;
    ctx.beginPath();
    for (let i = 0; i < m.notes.length; i++) {
        let interval = m.mode_type.intervals[i];
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

        _drawLabel(ctx, label, posx + interval * SS_STEP_WIDTH / 2, 17,
                   "14px Arial", "#000");

        ctx.strokeStyle = "#999";
        ctx.moveTo(posx + 3, 40);
        ctx.lineTo(posx + interval * SS_STEP_WIDTH / 2 - 3, 20);
        ctx.moveTo(posx + interval * SS_STEP_WIDTH / 2 + 3, 20);
        ctx.lineTo(posx + interval * SS_STEP_WIDTH - 3, 40);

        posx += SS_STEP_WIDTH * interval;
    }
    ctx.stroke();
  }

  render() {
    let m = stateStore.scale
    let positions = []
    let checkboxes = []

    let posx = SS_MARGIN_LEFT - 4;
    for (let i = 0; i <= m.notes.length; i++) {
        let j = i % m.notes.length;

        checkboxes.push((
          <input key={`c-${i}`} name={`c-${i}`} type="checkbox" style={{position: "absolute", left: posx + "px"}} checked={this.state.enabledSteps[i % m.notes.length]} onChange={this.handleInputChange} />
        ))
        positions.push(posx)

        posx += SS_STEP_WIDTH * m.mode_type.intervals[j];
    }

    return (
      <div>
      <div style={{display: "none"}}>fretboard {stateStore.note.displayNameJs()} {stateStore.scaleType.name} {stateStore.scale.length} {stateStore.tuning.name}</div>
      <div>
      <canvas ref="canvas" width={1200} height={80}  style={{border: "0px solid #000000"}}></canvas>
      </div>
      <div>
	  {checkboxes}
      <br />
	  <Button onClick={this.handlePlayPressed}>play</Button>
      </div>
      </div>
    )
  }
})
