import React, {Component} from 'react'
import {observer} from 'mobx-react'
import stateStore from "../stores"
import {drawNote} from "./utils"

const FRETBOARD_MARGIN_HORIZ = 20
const FRETBOARD_MARGIN_VERT = 30


export const Keyboard = observer(class Fretboard extends Component {
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
    c.height = 320;
    var l1 = 250;
    var w1 = 48;
    var l2 = 160;
    var w2 = 28;
    var keyTypes = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
    var keyShifts = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.translate(FRETBOARD_MARGIN_HORIZ, FRETBOARD_MARGIN_VERT);



    ctx.lineCap="round";
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1;

    for (let octave = 0; octave < 2; octave++) {
      let shift = octave * 7 * w1;

      ctx.fillStyle = "#EEE";
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.rect(shift + i * w1 + 0.5, 0.5, w1, l1);
        ctx.fill();
        ctx.stroke();
      }

      ctx.fillStyle = "#333";
      let sharps = [0, 1, 3, 4, 5];
      for (let i = 0; i < 5; i++) {
        let j = sharps[i];
        ctx.beginPath();
        ctx.rect(shift + (j + 1) * w1 - 0.5 * w2 + 0.5, 0.5, w2, l2);
        ctx.fill();
        ctx.stroke();
      }

      for (var i = 0; i < m.length; i++) {
        if (!stateStore.enabledSteps[i])
          continue;

        let s = m.notes[i].semitones;
        let posx = 0
        let posy = 0

        if (keyTypes[s] === 0) {
          posx = (keyShifts[s] + 0.5) * w1;
          posy = 0.8 * l1;
        } else {
          posx = (keyShifts[s] + 1) * w1;
          posy = 0.8 * l2;
        }

        drawNote(ctx, m.notes[i], posx + shift, posy, 0.7 * w1, 0.7 * w1);

      }
    }
  }

  render() {
    return (
      <div>
      <div style={{display: "none"}}>fretboard {stateStore.note.displayNameJs()} {stateStore.scaleType.name} {stateStore.scale.length} {stateStore.tuning.name} {stateStore.enabledSteps}</div>
      <div>
      <canvas ref="canvas" width={1200} height={600}  style={{border: "0px solid #000000"}}></canvas>
      </div>
      </div>
    )
  }
})
