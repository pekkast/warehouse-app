import React from "react";
import { FormControl } from "react-bootstrap";

const ContentFilter = ({ filterHandler, filterText }) => {
  return (
    <FormControl
      type="text"
      value={filterText}
      placeholder="Hae"
      onChange={filterHandler}
      style={{ width: "100%" }}
    />
  );
};

export default ContentFilter;
