import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import jsPDF from "jspdf"; //used to generate PDFs
import Context from "./context";
import Selectt from "./select.js";

//initialize firebase
var config = {
  apiKey: "AIzaSyBVk2_g_-HSQ7qU2_9mziSTXO2D-6BZ-zQ",
  authDomain: "prescriptions-de3dc.firebaseapp.com",
  databaseURL: "https://prescriptions-de3dc.firebaseio.com",
  projectId: "prescriptions-de3dc",
  storageBucket: "",
  messagingSenderId: "137289280586"
};
firebase.initializeApp(config);

class Header extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  //renders the header component including logo and header links
  render() {
    return (
      <Context.Consumer>
        {ctx => {
          return (
            <div id="header">
              <div id="logo">
                <h1>
                  <a href="#">
                    Pres<span className="logo_colour">_pre.</span>
                  </a>
                </h1>
                <h2>
                  Hey Dr. Add Your Prescriptions Online and All In One Place.
                </h2>
                <button
                  className="add"
                  onClick={() => {
                    ctx.actions.toggle();
                  }}
                >
                  + Add Prescription
                </button>
              </div>
              <div id="menubar">
                <ul id="menu">
                  <li className="cursor">
                    <a
                      onClick={() => {
                        ctx.actions.toggle();
                      }}
                    >
                      All Prescriptions
                    </a>
                  </li>
                  <li>
                    <a href="#">Email a Patient</a>
                  </li>
                </ul>
              </div>
            </div>
          );
        }}
      </Context.Consumer>
    );
  }
}

class PreList extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  //selectedOptionObject() recives array of objects 'drugs', then returns an array to be rendered in UI
  selectedOptionObject(obj) {
    if (obj == null) {
      return null;
    } else {
      var result = [];
      for (let i = 0; i < obj.length; i++) {
        result.push(obj[i].value);
      }
      return result;
    }
  }

  //print() receives selected item from user the generates a pdf in new tab
  print(itm) {
    var doc = new jsPDF();
    doc.setFontSize(13);
    doc.text(85, 20, "JOHN SMITH, M.D.");
    doc.text(85, 25, "E. 14th Street");
    doc.text(85, 30, "HOMETOWN, USA 00 000");
    doc.text(85, 35, "(0 00) 123-4567");
    doc.line(20, 40, 190, 40);
    doc.text(10, 65, "NAME");
    doc.text(60, 65, itm.name);
    doc.line(60, 68, 120, 68);
    doc.text(10, 75, "AGE");
    doc.text(60, 75, itm.age);
    doc.line(60, 78, 120, 78);
    doc.text(10, 85, "DRUGS :");
    doc.setFontSize(12);

    let oneDrug = this.selectedOptionObject(itm.selectedOption);
    for (let i = 0, y = 95; i < oneDrug.length; i++, y = y + 10) {
      doc.text(20, y, oneDrug[i]);
    }

    doc.line(20, 250, 190, 250);
    doc.text(95, 260, "(Signature)");

    window.open(doc.output("bloburl"), "_blank");
  }

  render() {
    const { selectedOption } = this.state;
    return (
      <Context.Consumer>
        {ctx => {
          return (
            <div id="site_content">
              <div className="sidebar">
                <h1>
                  You Can&nbsp;<span className="small">(Up Coming)</span>
                </h1>
                <ul>
                  <li>Add</li>
                  <li>Delete</li>
                  <li>Edit</li>
                  <li>And Print a Prescription</li>
                </ul>
                <h1>
                  Search&nbsp;<span className="small">(Up Coming)</span>
                </h1>
                <form id="search_form">
                  <p>
                    <input
                      className="search"
                      type="text"
                      name="search_field"
                      value="Enter Patient Name"
                    />
                    <input
                      className="imgSearch"
                      name="search"
                      type="image"
                      src={require("./images/search.png")}
                      alt="Search"
                      title="Search"
                    />
                  </p>
                </form>
              </div>
              {!ctx.state.isAdd ? (
                ctx.state.pres.map((item, i) => {
                  return (
                    <div id="content">
                      <img
                        src={require("./images/pdf.png")}
                        onClick={() => {
                          this.print(item);
                        }}
                        className="print"
                        alt="pdf pre."
                      />
                      <h1 className="PreHeading">Pre. {i}</h1>

                      <div key={i} id={i} id="main">
                        <img src={require("./images/drug.png")} />
                        <p className="age">
                          <strong>Age :</strong>&nbsp;&nbsp;
                          {item.age}
                        </p>
                        <p className="name">
                          <strong>Name :</strong>&nbsp;&nbsp;
                          {item.name}
                        </p>
                      </div>
                      <p className="drugs">
                        <strong>Drugs :</strong>&nbsp;&nbsp;
                        {this.selectedOptionObject(item.selectedOption)}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div id="content2">
                  <h1>Add Prescription</h1>
                  <p>Add name, age and drugs to fill the prescription:</p>
                  <form>
                    <div className="form_settings">
                      <p>
                        <span>Name</span>
                        <input
                          className="contact"
                          type="text"
                          name="name"
                          value={ctx.state.name}
                          onChange={event => {
                            ctx.actions.onChangeName(event.target.value);
                          }}
                          placeholder="Name"
                        />
                      </p>
                      <p>
                        <span>Age</span>
                        <input
                          onChange={event => {
                            ctx.actions.onChangeAge(event.target.value);
                          }}
                          value={ctx.state.age}
                          placeholder="Age"
                          className="contact"
                          type="text"
                          name="age"
                          value={ctx.state.age}
                        />
                      </p>
                      <p>
                        <span>Drugs</span>
                        <Selectt />
                      </p>
                      <p>
                        <span>&nbsp;</span>{" "}
                      </p>
                    </div>
                  </form>
                  <button
                    className="submit"
                    name="add"
                    value="Add"
                    onClick={() => {
                      firebase
                        .firestore()
                        .collection("pres")
                        .add({
                          age: ctx.state.age,
                          name: ctx.state.name,
                          selectedOption: ctx.state.selectedOption,
                          date: Date.now()
                        });
                      ctx.state.name = "";
                      ctx.state.age = "";
                      ctx.actions.toggle();
                    }}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          );
        }}
      </Context.Consumer>
    );
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      pres: [{}],
      age: "",
      name: "",
      selectedOption: [],
      isAdd: false,
      isList: true
    };

    firebase
      .firestore()
      .collection("pres")
      .orderBy("date", "desc")
      .onSnapshot(snapshot => {
        let pres = [];

        snapshot.forEach(doc => {
          pres.push(doc.data());
          this.setState({
            pres: pres
          });
        });
      });
  }

  render() {
    return (
      <Context.Provider
        value={{
          state: this.state,
          actions: {
            onChangeName: value => {
              this.setState({
                name: value
              });
            },
            onChangeAge: value => {
              this.setState({
                age: value
              });
            },
            toggle: () => {
              if (this.state.isAdd == false) {
                this.setState({
                  isAdd: !this.state.isAdd
                });
              } else {
                this.setState({
                  isAdd: !this.state.isAdd
                });
              }
            },
            handleChange: selectedOption => {
              this.setState({ selectedOption });
            }
          }
        }}
      >
        <Header />
        <PreList />
      </Context.Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
