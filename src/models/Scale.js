import Note from './Note'

export default class Scale {
  constructor(key, mode_type) {
    var abs_int = 0;

    this.key = key;
    this.mode_type = mode_type;
    this.length = this.mode_type.length;

    this.notes = new Array(this.key);
    this.key.step = 0;


    for (let i = 1; i < this.mode_type.length; i++) {
      let n = this.key.n + this.mode_type.notes[i] - 1;
      abs_int += this.notes[i - 1].next_int(n - this.notes[i - 1].n);
      let d = this.key.d + this.mode_type.abs_int[i] - abs_int;
      let note = new Note(0, n, d);
      note.step = i;
      this.notes.push(note);
    }

    this.notesMap = new Array(12);
    for (let i = 0; i < 12; i++)
      this.notesMap[i] = null;
    for (let i = 0; i < this.length; i++) {
      this.notesMap[this.notes[i].semitones] = this.notes[i];
    }
  }
}
