import React from "react";
import Select from "react-select";
import data from "./editedJSON.json";
import Context from "./context";

let options = data;

class Selectt extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {ctx => {
          return (
            <Select
              onChange={ ctx.actions.handleChange }
              defaultValue=""
              isMulti
              name="pres"
              options={ options }
              className="basic-multi-select co"
              classNamePrefix="select"
            />
          );
        }}
      </Context.Consumer>
    );
  }
}

export default Selectt;