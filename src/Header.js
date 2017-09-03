import React from 'react';
import { Jumbotron } from 'react-bootstrap';

const Header = ({logo, title}) => (
  <Jumbotron>
    <img src={logo} className="app-logo" alt="logo" />
    <h1>{title}</h1>
  </Jumbotron>
);

export default Header;
