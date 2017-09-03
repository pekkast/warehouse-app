import React from 'react';
import { ListGroup, ListGroupItem, Glyphicon } from "react-bootstrap";

const SelectList = ({items, clickHandler}) => {
  return (
    <ListGroup className="selection-buttons">
      {items.map(item => (
        <ListGroupItem key={item.id} onClick={() => clickHandler(item)}>
          {item.name} <Glyphicon className="pull-right" glyph="chevron-right" />
        </ListGroupItem>
      ))}
    </ListGroup>
  );
};

export default SelectList;
