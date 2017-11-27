import * as MidiWriter from "midi-writer-js"
import * as MidiPlayer from "midi-player-js"
//import * as Note from "tonal-note"
import * as Scale from "tonal-scale"
import { transpose, scale } from 'tonal'
import { soundsStore } from "../stores"

export default class ScalePlayer {

  loadSamples = () => {

    for (let i = 36; i < 122; i++) {
          let source = this.audioCtx.createBufferSource()
          source.buffer = soundsStore.samplesData[i]
          this.samples[i] = source
          this.gains[i] = this.audioCtx.createGain()
          this.samples[i].connect(this.gains[i])
          this.gains[i].connect(this.audioCtx.destination)
          console.log(i)
    }
  }

  constructor(s) {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    this.samples = {}
    this.gains = {}


    let tokens = Scale.tokenize(s)
    this.key = tokens[0]
    this.scale = tokens[1]

    this.notes = {}

    this.track = new MidiWriter.Track()
    this.track.addEvent(new MidiWriter.ProgramChangeEvent({instrument : 1}))

    let notes = scale(this.scale).map(transpose(this.key + "3"))

    for (let n of notes) {
      let note = new MidiWriter.NoteEvent({pitch:[n], duration: '4'})
      this.track.addEvent(note)
    }

    let write = new MidiWriter.Writer([this.track])
    this.dataUri = write.dataUri()


    this.player = new MidiPlayer.Player((event) => {
      console.log(event)

      if (event.name === "Note on") {
          console.log(event.noteNumber)
          this.gains[event.noteNumber].gain.value = 1
          this.samples[event.noteNumber].start()
      } else if (event.name === "Note off") {
        var timerId
        timerId = setInterval(() => {
          if (this.gains[event.noteNumber].gain.value > 0) {
            let newVol = this.gains[event.noteNumber].gain.value - 0.02
            if (newVol < 0)
              newVol = 0
            this.gains[event.noteNumber].gain.value = newVol
          } else {
            this.samples[event.noteNumber].stop()
            clearInterval(timerId)
          }
        }, 5)
      }
    });

    this.player.loadDataUri(write.dataUri());
  }

  play() {
    this.loadSamples()
    this.player.play()
  }
}
