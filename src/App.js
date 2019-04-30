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
        <Navbar bg="light" variant="light">
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
          {
            Scale.names().map((id) =>
              <NavDropdown.Item>
                <Nav.Link key={id} eventKey={id}>{id}</Nav.Link>
              </NavDropdown.Item>
            )
          }
          </NavDropdown>
          </Nav>
          <Nav onSelect={this.handleSelectTuning}>
          <NavDropdown title={stateStore.tuning.name} id="scale-drop-down">
          {
                tuningIds.map((id) =>
              <Nav.Item>
                <Nav.Link key={id} eventKey={id}>{tunings[id].name}</Nav.Link>
              </Nav.Item>
            )
          }
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
