import React, {Component} from 'react'
import {observer} from 'mobx-react'
import * as Scale from "tonal-scale"
import * as Distance from "tonal-distance"
import stateStore from "../stores"
import {drawNote} from "./utils"

const FRETBOARD_MARGIN_HORIZ = 20
const FRETBOARD_MARGIN_VERT = 30
const FRETBOARD_MIN_WIDTH = 600
const FRETBOARD_MAX_WIDTH = 1500
const FRETBOARD_BASE_COLOR = "#DDD"
const FRETBOARD_SCALE_FACTOR = 1.3
const FRETBOARD_LABEL_FONT = "bold 12px Monospace"
const FRETBOARD_LABEL_COLOR = "#888"
const FRETBOARD_DOTS_COLOR = "#444"


function getFretPos(l0, n) {
    return l0 * (1 - Math.pow(FRETBOARD_SCALE_FACTOR, - n / 12.0));
}

function getFretWidth(l0, n) {
    return getFretPos(l0, n) - getFretPos(l0, n - 1);
}

export const Fretboard = observer(class Fretboard extends Component {
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
    var m = Scale.notes(stateStore.scale)
    c.width = Math.max(Math.min(FRETBOARD_MAX_WIDTH, window.innerWidth),
               FRETBOARD_MIN_WIDTH) - 5;
    var fretsNumber = 24;
    var w = c.width - 2 * FRETBOARD_MARGIN_HORIZ;
    var fretHeight = 24;
    var stepWidth = c.width / 50;
    var stepHeight = fretHeight * 0.8;
    var stringLength = w / getFretPos(1.0, fretsNumber);
    var stringsNumber = stateStore.tuning.length;

    c.height = (fretHeight * (stringsNumber - 1) +
          2 * FRETBOARD_MARGIN_VERT + 10);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.lineCap="round";
    ctx.translate(FRETBOARD_MARGIN_HORIZ, FRETBOARD_MARGIN_VERT);

    var notesMap = Array(12).fill(null)
    var stepsMap = Array(12).fill(null)
    for (let i in m) {
      notesMap[Distance.semitones("C", m[i])] = m[i]
      stepsMap[Distance.semitones("C", m[i])] = i
    }

    /* draw lines */
    var frets = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
    ctx.font = FRETBOARD_LABEL_FONT;
    let posy = fretHeight * (stringsNumber - 1) + 0.5 * stepHeight;
    for (let i in frets) {
      ctx.fillStyle = FRETBOARD_LABEL_COLOR;
      let posx = getFretPos(stringLength, frets[i] - 1);
      posx += 0.5 * getFretWidth(stringLength, frets[i] - 1);
      ctx.fillText(frets[i], posx, - stepHeight / 2 - 3);

      ctx.fillStyle = FRETBOARD_DOTS_COLOR;
      if (frets[i] === 12 || frets[i] === 24) {
        ctx.beginPath();
        ctx.arc(posx, posy + 6, 4, 0, 2 * Math.PI);
        ctx.fill()

        ctx.beginPath();
        ctx.arc(posx, posy + 16, 4, 0, 2 * Math.PI);
        ctx.fill()
      } else {
        ctx.beginPath();
        ctx.arc(posx, posy + 11, 4, 0, 2 * Math.PI);
        ctx.fill()
      }
    }

    /* draw fretboard */
    ctx.fillStyle = FRETBOARD_BASE_COLOR;
    ctx.fillRect(0, 0, w, fretHeight * (stringsNumber - 1));

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    for (var i = 0; i < stringsNumber; i++) {
      ctx.moveTo(0, Math.round(i * fretHeight));
      ctx.lineTo(w, Math.round(i * fretHeight));
    }
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#888";
    ctx.beginPath();
    for (let i = 0; i <= fretsNumber; i++) {
      let x = getFretPos(stringLength, i);
      ctx.moveTo(Math.round(x), 0);
      ctx.lineTo(Math.round(x), (stringsNumber - 1) * fretHeight);
    }
    ctx.stroke();

    /* draw steps */
    ctx.lineWidth = 1;
    for (let i = 0; i < stringsNumber; i++) {
      for (let j = 0; j <= fretsNumber; j++) {
        let posx;

        let s = (Distance.semitones("C", stateStore.tuning.notes[i]) + j) % 12

        if (notesMap[s] == null)
          continue;

        if (!stateStore.enabledSteps[stepsMap[s]])
          continue;

        posx = (getFretPos(stringLength, j) -
            0.5 * getFretWidth(stringLength, j));
        if (j === 0)
          posx = 0;

        drawNote(ctx, notesMap[s], notesMap[s] === m[0], posx, i * fretHeight, stepWidth, stepHeight);
      }
    }
  }

  render() {
    return (
      <div>
      <div style={{display: "none"}}>fretboard {stateStore.note} {stateStore.scaleType} {stateStore.scale} {stateStore.tuning.name}  {stateStore.enabledSteps}</div>
      <div>
      <canvas ref="canvas" width={1200} height={600}  style={{border: "0px solid #000000"}}></canvas>
      </div>
      </div>
    )
  }
})
