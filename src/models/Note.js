
export default class Note {
  constructor(octave, note, d) {
    this.names = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

    this.offsets = [];
    this.offsets[-2] = 'ff';
    this.offsets[-1] = 'f';
    this.offsets[0] = '';
    this.offsets[1] = 's';
    this.offsets[2] = 'ss';

    this.display_offsets = [];
    this.display_offsets[-2] = '&#x266D;&#x266D;';
    this.display_offsets[-1] = '&#x266D;';
    this.display_offsets[0] = '';
    this.display_offsets[1] = '&#x266F;';
    this.display_offsets[2] = '&#x266F;&#x266F;';

    this.display_offsets_js = [];
    this.display_offsets_js[-2] = '\u266D\u266D';
    this.display_offsets_js[-1] = '\u266D';
    this.display_offsets_js[0] = '';
    this.display_offsets_js[1] = '\u266F';
    this.display_offsets_js[2] = '\u266F\u266F';

    this.next_int_arr = [2, 2, 1, 2, 2, 2, 1];

    this.o = octave + note / 7;
    this.n = note % 7;
    this.d = d;

    this.semitones = 0;
    for (var i = 0; i < this.n; i++)
        this.semitones += this.next_int_arr[i];

    this.semitones += this.d;
    if (this.semitones < 0)
        this.semitones += 12;
    this.semitones = this.semitones % 12;
  }

  toString() {
    return this.names[this.n] + this.offsets[this.d];
  };

  normalizedNote() {
    let note = 0;
    let d = 0;
    let i = 0;
    while (i < 12) {
        if (i === this.semitones)
            break;
        if (i > this.semitones) {
            note--;
            d = 1;
            break
        }
        i += this.next_int_arr[note];
        note++;
    }

    return new Note(0, note, d);
  }

  displayName() {
    return this.names[this.n] + this.display_offsets[this.d];
  };

  displayNameJs() {
    return this.names[this.n] + this.display_offsets_js[this.d];
  };

  next_int(n) {
    var abs_int = 0;

    n = n % 7;
    for (var i = 0; i < n; i++)
        abs_int += this.next_int_arr[(this.n + i) % 7];
    return abs_int;
  }
}

export const C  = new Note(0, 0, 0);
export const Cf = new Note(0, 0, -1);
export const Cs = new Note(0, 0, 1);
export const D  = new Note(0, 1, 0);
export const Df = new Note(0, 1, -1);
export const Ds = new Note(0, 1, 1);
export const E  = new Note(0, 2, 0);
export const Ef = new Note(0, 2, -1);
export const Es = new Note(0, 2, 1);
export const F  = new Note(0, 3, 0);
export const Ff = new Note(0, 3, -1);
export const Fs = new Note(0, 3, 1);
export const G  = new Note(0, 4, 0);
export const Gf = new Note(0, 4, -1);
export const Gs = new Note(0, 4, 1);
export const A  = new Note(0, 5, 0);
export const Af = new Note(0, 5, -1);
export const As = new Note(0, 5, 1);
export const B  = new Note(0, 6, 0);
export const Bf = new Note(0, 6, -1);
export const Bs = new Note(0, 6, 1);

export const notes = [Cf, C, Cs, Df, D, Ds, Ef, E, Es, Ff, F, Fs, Gf, G, Gs, Af, A, As, Bf, B, Bs]

export const notesTable = [
  [Cf, C, Cs],
  [Df, D, Ds],
  [Ef, E, Es],
  [Ff, F, Fs],
  [Gf, G, Gs],
  [Af, A, As],
  [Bf, B, Bs]
]
