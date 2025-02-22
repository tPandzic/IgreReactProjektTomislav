import React, { Component } from "react";
import IgraPogadjanjeBrojeva from "./components/IgraPogadjanjeBrojeva";
import Highscore from "./components/Highscore/Index";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Igra1Highscore from "./components/Highscore/Igra1";
//import VjezbamoHookice from "./components/VjezbamoHookice";
//import ProbaKonteksta from "./containers/ProbaKonteksta";
import izracunajIgru1 from "./services/izracunajIgru1";

import IvaninaIgra from "./containers/IvaninaIgra";

import { MojaTemaContext } from "./services/konteksti";

import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { array } from "prop-types";

export default class App extends Component {
  constructor(props) {
    super(props);
    const stanjeIzBrowsera = JSON.parse(localStorage.getItem("stanje"));
    const inicijalnoStanje = {
      highscore: stanjeIzBrowsera
        ? stanjeIzBrowsera.highscore
        : {
            pogadjanjeBrojeva: [],
            igraBoja: [],
            ivaninaIgra: [],
          },
      brojPokusaja: 0,
      feedback: "",
      username: "",
      inputName: "",
      zamisljeniBroj: Math.floor(Math.random() * 101),
    };
    this.state = inicijalnoStanje;
  }

  static defaultProps = {
    proizvod: "Čekić",
  };

  componentDidUpdate() {
    console.log("evo me jfhkjfdhjkfdjkfd");
  }

  handleLogin = (username = "", inputName = "") => {
    this.setState((state) => {
      return { username: username, inputName: inputName };
    });
  };

  promijeniStanje = (feedback) => {
    let novoStanje = izracunajIgru1(feedback, this.state);
    localStorage.setItem("stanje", JSON.stringify(novoStanje));
    this.setState(novoStanje);
  };

  //Kada budeš pozivao ofu funkciju iz svog koda ne zaboravi dati ova 2 parametra
  dodajHighscoreUStanje = (imeIgre, noviRezultat) => {
    this.setState((state) => {
      const staro = !state.highscore[imeIgre] ? [] : state.highscore[imeIgre];
      return {
        highscore: {
          ...state.highscore,
          [imeIgre]: [...staro, noviRezultat],
        },
      };
    });
  };

  render() {
    return (
      <MojaTemaContext.Provider
        value={{ pozdrav: "Dobar dan", odzdrav: "laku noć" }}>
        <div id='nasApp'>
          <Header />
          <main>
            <Routes>
              <Route
                path='/'
                element={
                  <Login
                    inputName={this.state.inputName}
                    handleLogin={(username, inputName) =>
                      this.handleLogin(username, inputName)
                    }
                  />
                }
              />
              <Route
                path='/igra1'
                element={
                  <IgraPogadjanjeBrojeva
                    brojPokusaja={this.state.brojPokusaja}
                    zamisljeniBroj={this.state.zamisljeniBroj}
                    username={this.state.username}
                    feedback={this.state.feedback}
                    promijeniStanje={(feedback) =>
                      this.promijeniStanje(feedback)
                    }
                  />
                }
              />
              <Route
                path='/ivaninaIgra'
                element={
                  <IvaninaIgra
                    dodajUHighscore={(imePropa, vrijednostPropa) =>
                      this.dodajHighscoreUStanje(imePropa, vrijednostPropa)
                    }
                    username={this.state.username}
                  />
                }
              />
              <Route
                path='/highscore'
                element={<Highscore highscore={this.state.highscore} />}>
                <Route
                  path='igra1'
                  element={
                    <Igra1Highscore
                      highscore={this.state.highscore}
                      username={this.state.username}
                    />
                  }
                />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </MojaTemaContext.Provider>
    );
  }
}
