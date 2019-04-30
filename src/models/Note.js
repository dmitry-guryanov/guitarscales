import * as Note from "tonal-note"

export function noteNameJs(n) {
  let tokens = Note.tokenize(n)
  let acc = tokens[1].replace(/b/g, "\u266D")
  acc = acc.replace(/#/g, "\u266F")
  return tokens[0] + acc
}

export const notesTable = [
  ["Cb", "C", "C#"],
  ["Db", "D", "D#"],
  ["Eb", "E", "E#"],
  ["Fb", "F", "F#"],
  ["Gb", "G", "G#"],
  ["Ab", "A", "A#"],
  ["Bb", "B", "B#"]
]
