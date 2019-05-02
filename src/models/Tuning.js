export default class Tuning {
  constructor(name, notes) {
    this.name = name;
    this.notes = new Array(notes.length);
    for (var i = 0; i < notes.length; i++)
        this.notes[i] = notes[notes.length - i - 1];
    this.length = notes.length;
  }
}

export const tunings = {
    guitar_std: new Tuning("Guitar Standard", ["E", "A", "D", "G", "B", "E"]),
    guitar_dropd: new Tuning("Drop D", ["D", "A", "D", "G", "B", "E"]),
    guitar_dropcs: new Tuning("Drop C#", ["C#", "G#", "C#", "F#", "A#", "D#"]),
    guitar_dropc: new Tuning("Drop C", ["C", "G", "C", "F", "A", "D"]),
    guitar_d: new Tuning("D", ["D", "G", "C", "F", "A", "D"]),
    guitar_7string: new Tuning("7-string standard", ["B", "E", "A", "D", "G", "B", "E"]),
    guitar_8string: new Tuning("8-string standard", ["F#", "B", "E", "A", "D", "G", "B", "E"]),
    bass_std: new Tuning("Bass Standard", ["E", "A", "D", "G"]),
    bass_5string: new Tuning("Bass 5-string", ["B", "E", "A", "D", "G"]),
    bass_5string_tenor: new Tuning("Bass 5-string tenor", ["E", "A", "D", "G", "C"]),
    bass_6string: new Tuning("Bass 6-string", ["B", "E", "A", "D", "G", "C"])
};

export const tuningIds = ['guitar_std', 'guitar_dropd', 'guitar_dropcs',
                'guitar_dropc', 'guitar_d', 'guitar_7string',
                'guitar_8string', 'bass_std', 'bass_5string',
                'bass_5string_tenor', 'bass_6string']
