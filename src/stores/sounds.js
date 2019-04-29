import stateStore from "."

class SoundsStore {
  constructor() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()

    this.samplesData = {}
    this.x = 10
    this.toLoad = 122 - 36

    for (let i = 36; i < 122; i++) {
      let request = new XMLHttpRequest()
      request.open('GET', `${process.env.PUBLIC_URL}/sounds/note-${i}.ogg`, true)
      request.responseType = 'arraybuffer'
      request.onload = (data) => {
        this.audioCtx.decodeAudioData(data.target.response).then((audioBuffer) => {
          this.samplesData[i] = audioBuffer;
          this.toLoad--

        if (this.toLoad === 0)
          stateStore.setLoaded(true)
        })
      }
      request.send()
    }
  }
}

const soundsStore = new SoundsStore()

export default soundsStore
