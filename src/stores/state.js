import {extendObservable, action} from 'mobx'
import {tunings} from '../models/Tuning'

class StateStore {

  constructor() {
    extendObservable(this, {note: "C"})
    extendObservable(this, {scaleType: "major"})
    extendObservable(this, {scale: "C major"})
    extendObservable(this, {tuning: tunings['guitar_std']})
    extendObservable(this, {enabledSteps: Array(12).fill(true)})
    extendObservable(this, {loaded: false})
  }

  setNote = action((note) => {
    this.note = note
    this.setScale(note + " " + this.scaleType)
  })

  setScaleType = action((scaleTypeId) => {
    this.scaleType = scaleTypeId
    this.setScale(this.note + " " + this.scaleType)
  })

  setScale = action((scale) => {
    this.scale = scale
  })

  setTuning = action((tuningId) => {
    this.tuning = tunings[tuningId]
  })

  setEnabledSteps = action((enabledSteps) => {
    this.enabledSteps = enabledSteps
  })

  setLoaded = action((loaded) => {
    this.loaded = loaded
  })
}

const stateStore = new StateStore()

export default stateStore
