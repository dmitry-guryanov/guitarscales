import {noteNameJs} from "../models/Note"

const FRETBOARD_NOTE_STROKE_COLOR = "#666"
const FRETBOARD_NOTE_FILL_COLOR = "#FFF"
const FRETBOARD_KEYNOTE_STROKE_COLOR = "#F88"
const FRETBOARD_KEYNOTE_FILL_COLOR = "#FCC"
const FRETBOARD_NOTE_FONT_FACE = "Monospace"
const FRETBOARD_NOTE_TEXT_COLOR = "#000"

export function drawNote(ctx, note, isPerfect, posx, posy, stepWidth, stepHeight)
{
    ctx.beginPath();
    if (isPerfect) {
        ctx.strokeStyle = FRETBOARD_KEYNOTE_STROKE_COLOR;
        ctx.fillStyle = FRETBOARD_KEYNOTE_FILL_COLOR;
    } else {
        ctx.strokeStyle = FRETBOARD_NOTE_STROKE_COLOR;
        ctx.fillStyle = FRETBOARD_NOTE_FILL_COLOR;
    }

    ctx.rect(posx - stepWidth / 2, posy - stepHeight / 2,
             stepWidth, stepHeight);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = FRETBOARD_NOTE_TEXT_COLOR;
    let fontSize = Math.floor(stepHeight);
    var maxWidth = 0.8 * stepWidth;
    var name = noteNameJs(note);
    var w = 0;
    while (fontSize > 6) {
        ctx.font = `${fontSize}px ${FRETBOARD_NOTE_FONT_FACE}`
        w = ctx.measureText(name).width;
        if (w < maxWidth)
            break;
        else
            fontSize--;
    }

    ctx.fillText(name, posx - w * 0.5, posy + fontSize * 0.35);
}
