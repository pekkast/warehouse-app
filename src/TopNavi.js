import React from 'react';
import { Button, Glyphicon, Navbar, Breadcrumb, BreadcrumbItem } from 'react-bootstrap';

const TopNavi = ({backClickHandler, path}) => {
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <Button onClick={backClickHandler}>
            <Glyphicon className="pull-left" glyph="chevron-left" />
          </Button>
        </Navbar.Brand>
        <Breadcrumb>
        {path.map((item, ind) =>
          <BreadcrumbItem key={item.id} onClick={ind !== (path.length - 1) ? backClickHandler : () => false} active={ind === (path.length - 1)}>
            {item.name}
          </BreadcrumbItem>
        )}
        </Breadcrumb>
      </Navbar.Header>
    </Navbar>
  );
};

export default TopNavi;
