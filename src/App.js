import React, { Component } from 'react';
import Header from './Header';
import TopNavi from './TopNavi';
import SelectionButtons from './SelectionButtons';
import SelectList from './SelectList';
import ContentFilter from './ContentFilter';
import Select from 'react-select';
import 'whatwg-fetch';
import { Table, Button, FormControl, Modal } from 'react-bootstrap';
import warehouses from './warehouses.json';
import allProjects from './projects.json';
import allProducts from './products.json';
import employees from './employees.json';
import logo from './logo.png';
import 'react-select/dist/react-select.css';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      employee: null,
      warehouse: null,
      project: null,
      projects: allProjects,
      warehouseProjects: allProjects,
      filterText: null,
      products: allProducts,
      orderLines: new Map()
    };
  }
  resetState = () => {
    this.setState({warehouse: null, project: null});
  }
  stepBack = () => {
    if (this.state.project) {
      this.setState({project: null});
    } else {
      this.setState({warehouse: null});
    }
  }
  filterProducts = (event) => {
    const products = allProducts.filter(function(item){
      return `${item.description} ${item.product_id}`.toLowerCase().search(
        event.target.value.toLowerCase()
      ) !== -1;
    });

    this.setState({products});
  }
  filterProjects = (event) => {
    const projects = this.state.warehouseProjects.filter(function(item){
      return `${item.name} ${item.simple_id}`.toLowerCase().search(
        event.target.value.toLowerCase()
      ) !== -1;
    });

    this.setState({projects});
  }
  save = () => {
    const { orderLines, employee, project, warehouse } = this.state;
    fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        project_id: project.id,
        warehouse_no: warehouse.simple_id,
        employee_id: employee.value,
        orderLines: [...orderLines].map(([id, { product_id, amount_order }]) => { return { product_id, amount_order }; })
      })
    });
  }
  /*
  setOrderLine = (event) => {
    const orderLines = new Map(this.state.orderLines);
    const item = this.state.products.find((product) => event.target.name === `amount_order[${product.product_id}]`);
    orderLines.set(item.product_id, {...item, amount_order: +event.target.value});
    this.setState({orderLines});
  }*/
  setOrderLine = (amount_order, item) => {
    const orderLines = new Map(this.state.orderLines);
    if (!amount_order) {
      orderLines.delete(item.product_id);
    } else {
      orderLines.set(item.product_id, {...item, amount_order});
    }
    this.setState({orderLines});
  }
  setEmployee = (employee) => {
    this.setState({employee});
  }
  setProject = (project) => {
    this.setState({project});
  }
  setWarehouse = (warehouse) => {
    this.setState({warehouse});
    this.setWarehouseProjects(warehouse);
  }
  setWarehouseProjects(warehouse) {
    const warehouseProjects = allProjects.filter(function(item) {
      return warehouse.id === item.business_location_id;
    });
    this.setState({warehouseProjects});
    this.setState({projects: [...warehouseProjects]});
  }
  render() {
    const {warehouse, project, projects, products, orderLines} = this.state;
    const path = project ? [warehouse, project] : [warehouse];

    let header = null;
    if (!warehouse) {
      header = <Header logo={logo} title="Nikkareiden varastohaut"/>;
    } else {
      header = <TopNavi backClickHandler={this.stepBack} path={path} />;

      if (project) {

      } else {

      }
    }

    let content = null;

    if (!warehouse) {
      content = <SelectionButtons items={warehouses} clickHandler={this.setWarehouse} />;
    } else if (!project) {
      content = (
        <div>
          <ContentFilter filterHandler={this.filterProjects} />
          <SelectList location={warehouse} items={projects} clickHandler={this.setProject} />
        </div>
      );
    } else {
      content = (
        <div>
          <ContentFilter filterHandler={this.filterProducts} />
          <ProductSelection
            items={products}
            filled={orderLines}
            changeHandler={this.setOrderLine}
            changeEmployee={this.setEmployee}
            selectedEmployee={this.state.employee}
            handleSave={this.save} />
        </div>
      );
    }

    return (
      <div className="App">
        {header}
        <div className="container">{content}</div>
      </div>
    );
  }
};

const ProductSelection = ({items, filled, changeHandler, changeEmployee, selectedEmployee, handleSave}) => {
  return (
    <div className="panel panel-default">
      <Table striped responsive style={{maxHeight:"80%"}}>
        <thead>
          <tr>
            <th>Tuote</th><th>Otetaan nyt</th><th>Tilaamatta</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            item.amount_order = filled.has(item.product_id) ? filled.get(item.product_id).amount_order : "";
            return <ProductSelectRow key={item.product_id} {...{item, changeHandler}} />
          })}
        </tbody>
      </Table>
      <div className="panel-footer">
        <ConfirmModal
          heading="Vahvista vielä syöttämäsi tiedot"
          handleSave={handleSave}>
          <Table striped responsive>
            <thead>
              <tr>
                <th>Tuote</th><th>Otetaan nyt</th><th>Poista</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(filled.values()).map(item => (
                <ProductConfirmRow key={item.product_id} {...{item, changeHandler}} />
              ))}
            </tbody>
          </Table>
          <Select options={employees} value={selectedEmployee} onChange={changeEmployee} placeholder="Tuotteet haki" />
        </ConfirmModal>
      </div>
    </div>
  );
}

const ProductConfirmRow = ({item, changeHandler}) => {
  return (
    <tr>
      <td>[{item.product_id}] {item.description}</td>
      <td>
        <FormControl
          type="number"
          onChange={(e) => changeHandler(+e.target.value, item)}
          value={item.amount_order}
        />
      </td>
      <td><Button onClick={() => changeHandler(0, item)} bsSize="small">&times;</Button></td>
    </tr>
  );
};

const ProductSelectRow = ({item, changeHandler}) => {
  return (
    <tr>
      <td>[{item.product_id}] {item.description}</td>
      <td>
        <FormControl
          type="number"
          onChange={(e) => changeHandler(+e.target.value, item)}
          value={item.amount_order}
        />
      </td>
      <td>{item.unordered}</td>
    </tr>
  );
};

class ConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showModal: false};
  }
  close = () => {
    this.setState({showModal: false});
  }
  open = ()  => {
    this.setState({showModal: true});
  }
  render() {
    return (
      <div>
        <Button onClick={this.open} bsStyle="primary">
          Tallenna
        </Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.heading}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.props.children}
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" className="pull-left" onClick={this.props.handleSave}>Vahvista</Button>
            <Button onClick={this.close}>Sulje</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default App;
