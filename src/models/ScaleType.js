import {C} from "./Note"

export default class ScaleType {
  constructor(name, notes, intervals) {
    var majorAbsInt = [0, 2, 4, 5, 7, 9, 11];
    var d = 0;

    this.name = name;
    this.notes = notes;
    this.intervals = intervals;

    this.abs_int = []
    this.stepNames = []
    this.length = notes.length;
    this.l = notes.length;

    for (var i in intervals) {
      this.abs_int.push(d);

      let delta = this.abs_int[i] - majorAbsInt[this.notes[i] - 1];
      this.stepNames.push(this.notes[i] + C.display_offsets_js[delta]);
      d += intervals[i];
    }
  }
}

export const scaleTypes = {
    major: new ScaleType("Major", [1, 2, 3, 4, 5, 6, 7], [2, 2, 1, 2, 2, 2, 1]),
    minor: new ScaleType("Minor", [1, 2, 3, 4, 5, 6, 7], [2, 1, 2, 2, 1, 2, 2]),
    major_pent: new ScaleType("Major Pentatonic", [1, 2, 3, 5, 6], [2, 2, 3, 2, 3]),
    minor_pent: new ScaleType("Minor Pentatonic", [1, 3, 4, 5, 7], [3, 2, 2, 3, 2]),
    ionian: new ScaleType("Ionian", [1, 2, 3, 4, 5, 6, 7], [2, 2, 1, 2, 2, 2, 1]),
    dorian: new ScaleType("Dorian", [1, 2, 3, 4, 5, 6, 7], [2, 1, 2, 2, 2, 1, 2]),
    phrygian: new ScaleType("Phrygian", [1, 2, 3, 4, 5, 6, 7], [1, 2, 2, 2, 1, 2, 2]),
    lydian: new ScaleType("Lydian", [1, 2, 3, 4, 5, 6, 7], [2, 2, 2, 1, 2, 2, 1]),
    mixolydian: new ScaleType("Mixolydian", [1, 2, 3, 4, 5, 6, 7], [2, 2, 1, 2, 2, 1, 2]),
    aeolyan: new ScaleType("Aeolyan", [1, 2, 3, 4, 5, 6, 7], [2, 1, 2, 2, 1, 2, 2]),
    locrian: new ScaleType("Locrian", [1, 2, 3, 4, 5, 6, 7], [1, 2, 2, 1, 2, 2, 2]),
    chromatic: new ScaleType("Chromatic", [1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 7], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
}

export const scaleTypeIds = ['major', 'minor', 'major_pent', 'minor_pent', 'ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolyan', 'locrian', 'chromatic'];
