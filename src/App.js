import React, { Component } from 'react';
import './App.css';
import { Container, Col, Row, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import {observer} from 'mobx-react';
import {Fretboard} from "./components/Fretboard"
import {Keyboard} from "./components/Keyboard"
import {ScaleScheme} from "./components/ScaleScheme"
import * as Scale from "tonal-scale"
import stateStore from "./stores"
import {noteNameJs, notesTable} from "./models/Note"
import {tunings, tuningIds} from "./models/Tuning"

function remove(array, element) {
  const index = array.indexOf(element);
  array.splice(index, 1);
}

const App = observer(class App extends Component {

  handleSelectKeyNote(n) {
    stateStore.setNote(n)
  }

  handleSelectScale(id) {
    stateStore.setScaleType(id)
  }

  handleSelectTuning(id) {
    stateStore.setTuning(id)
  }

  render() {
    let scalesOrig = Scale.names()
    let scales = [["major", "minor"],
      ["major pentatonic", "minor pentatonic"],
      ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"],
      ["chromatic"]]
    for (let sl of scales) {
      for (let s of sl) {
        remove(scalesOrig, s)
      }
    }
    scales.push(scalesOrig)
    let cc = []
    let first = true
    for (let sl of scales) {
      if (!first) {
        cc.push((<NavDropdown.Divider />))
      } else {
        first = false
      }
      for (let s of sl) {
          cc.push((<NavDropdown.Item key={s} eventKey={s}>{s}</NavDropdown.Item>))
      }

    }

    
    return (
      <div className="App">
        <Navbar size="sm" bg="light" variant="light">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav onSelect={this.handleSelectKeyNote}>
          <NavDropdown title={"Key Note: " + noteNameJs(stateStore.note)} id="keynote-drop-down">
          <Container fluid={true}>
          {
            notesTable.map((nr) =>
              (<Row key={nr}>
              {
                nr.map((n) =>
                  <Col key={n} style={{paddingLeft: "0px", paddingRight: "0px"}} xs={4} md={4}><a className='notelink' onClick={() => this.handleSelectKeyNote(n)}>{noteNameJs(n)}</a></Col>
                )
              }
              </Row>)
            )
          }
          </Container>
          </NavDropdown>
          </Nav>
          <Nav onSelect={this.handleSelectScale}>
          <NavDropdown title={stateStore.scaleType} id="scale-drop-down">
                {cc}
          </NavDropdown>
          </Nav>
          <Nav onSelect={this.handleSelectTuning}>
          <NavDropdown title={stateStore.tuning.name} id="scale-drop-down">
          {
                tuningIds.map((id) =>
              <NavDropdown.Item key={id} eventKey={id}>{tunings[id].name}</NavDropdown.Item>
            )
          }
          </NavDropdown>
          </Nav>
          </Navbar.Collapse>

          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <NavDropdown alignRight title="My other projects" id="basic-nav-dropdown">
                <NavDropdown.Item href="http://ixshot.com">Intelligent photo studio IxShot</NavDropdown.Item>
                <NavDropdown.Item href="https://dmitryguryanov.myportfolio.com/">My photo gallery</NavDropdown.Item>
                <NavDropdown.Item href="http://guryanov.org/pickup-calculator/">Guitar pickup frequency response calculator</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>

        </Navbar>
        <br />
        <ScaleScheme />
        <Fretboard />
        <Keyboard />
      </div>
    );
  }
})

export default App;
