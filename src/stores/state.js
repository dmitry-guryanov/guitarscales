import {extendObservable, action} from 'mobx'
import {scaleTypes} from '../models/ScaleType'
import {C} from '../models/Note'
import Scale from '../models/Scale'
import {tunings} from '../models/Tuning'

class StateStore {

  constructor() {
    extendObservable(this, {note: C})
    extendObservable(this, {scaleType: scaleTypes['major']})
    extendObservable(this, {scale: new Scale(this.note, this.scaleType)})
    extendObservable(this, {tuning: tunings['guitar_std']})
    extendObservable(this, {enabledSteps: Array(12).fill(true)})
  }

  setNote = action((note) => {
    this.note = note
    this.setScale(new Scale(this.note, this.scaleType))
  })

  setScaleType = action((scaleTypeId) => {
    this.scaleType = scaleTypes[scaleTypeId]
    this.setScale(new Scale(this.note, this.scaleType))
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
}

const stateStore = new StateStore()

export default stateStore
