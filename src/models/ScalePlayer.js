import * as MidiWriter from "midi-writer-js"
import * as MidiPlayer from "midi-player-js"
//import * as Note from "tonal-note"
import * as Scale from "tonal-scale"
import stateStore from "../stores"
import { transpose, scale } from 'tonal'
import { soundsStore } from "../stores"

export default class ScalePlayer {

  playNote = (track, note) => {
    console.log(`play ${track}, ${note}`)
    let s = this.audioCtx.createBufferSource()
    s.buffer = soundsStore.samplesData[note]
    let g = this.audioCtx.createGain()
    s.connect(g)
    g.connect(this.audioCtx.destination)

    g.gain.value = 1
    s.start()

    this.samples[track][note] = s
    this.gains[track][note] = g
  }

  stopNote = (track, note) => {
    var timerId
    timerId = setInterval(() => {
      if (this.gains[track][note].gain.value > 0) {
        let newVol = this.gains[track][note].gain.value - 0.02
        if (newVol < 0)
          newVol = 0
        this.gains[track][note].gain.value = newVol
      } else {
        this.samples[track][note].stop()
        this.samples[track][note] = null
        clearInterval(timerId)
      }
    }, 5)
  }

  constructor(s) {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    this.samples = [{}, {}, {}]
    this.gains = [{}, {}, {}]


    let tokens = Scale.tokenize(s)
    this.key = tokens[0]
    this.scale = tokens[1]

    this.notes = {}

    this.track = new MidiWriter.Track()
    this.track.setTempo(120)
    this.track.addEvent(new MidiWriter.ProgramChangeEvent({instrument : 1}))

    let notes = scale(this.scale).map(transpose(this.key + "3"))
    let notes2 = scale(this.scale).map(transpose(this.key + "2"))

    for (let i in notes) {
      if (!stateStore.enabledSteps[i])
        continue;
      let note = new MidiWriter.NoteEvent({pitch:[notes[i]], duration: '8'})
      this.track.addEvent(note)
    }

    let track2 = new MidiWriter.Track()
    track2.setTempo(120)
    track2.addEvent(new MidiWriter.ProgramChangeEvent({instrument : 1}))

    let note = new MidiWriter.NoteEvent({pitch:[notes2[0]], duration: '1'})
    track2.addEvent(note)

    let write = new MidiWriter.Writer([this.track, track2])

    this.dataUri = write.dataUri()


    this.player = new MidiPlayer.Player((event) => {
      console.log(JSON.stringify(event))

      if (event.name === "Note on") {
        this.playNote(event.track, event.noteNumber)
      } else if (event.name === "Note off") {
        this.stopNote(event.track, event.noteNumber)
      }
    });

    this.player.loadDataUri(write.dataUri());
  }

  play() {
    this.player.play()
  }
}
