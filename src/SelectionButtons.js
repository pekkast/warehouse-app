import React from 'react';
import { Button, Glyphicon } from "react-bootstrap";

const SelectionButtons = ({items, clickHandler}) => {
  return <div className="selection-buttons">{items.map(item => (
    <Button key={item.id} onClick={() => clickHandler(item)} bsSize="large" block>
      {item.name} <Glyphicon className="pull-right" glyph="chevron-right" />
    </Button>
  ))}</div>;
};

export default SelectionButtons;
