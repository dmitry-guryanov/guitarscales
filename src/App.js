import React, { Component } from 'react';
import './App.css';
import { Grid, Col, Row, Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import {observer} from 'mobx-react';
import {Fretboard} from "./components/Fretboard"
import {Keyboard} from "./components/Keyboard"
import {ScaleScheme} from "./components/ScaleScheme"
import stateStore from "./stores"
import {noteNameJs, notesTable} from "./models/Note"
import {scaleTypeIds} from "./models/ScaleType"
import {tunings, tuningIds} from "./models/Tuning"

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
    return (
      <div className="App">
        <Navbar>
          <Nav onSelect={this.handleSelectKeyNote}>
          <NavDropdown eventKey={2} title={"Key Note: " + noteNameJs(stateStore.note)} id="keynote-drop-down">
          <Grid fluid={true}>
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
          </Grid>
          </NavDropdown>
          </Nav>
          <Nav onSelect={this.handleSelectScale}>
          <NavDropdown eventKey={3} title={stateStore.scaleType} id="scale-drop-down">
          {
            scaleTypeIds.map((id) =>
              <MenuItem key={id} eventKey={id}>{id}</MenuItem>
            )
          }
          </NavDropdown>
          </Nav>
          <Nav onSelect={this.handleSelectTuning}>
          <NavDropdown eventKey={3} title={stateStore.tuning.name} id="scale-drop-down">
          {
            tuningIds.map((id) =>
              <MenuItem key={id} eventKey={id}>{tunings[id].name}</MenuItem>
            )
          }
          </NavDropdown>
          </Nav>
        </Navbar>
        <ScaleScheme />
        <Fretboard />
        <Keyboard />
      </div>
    );
  }
})

export default App;
