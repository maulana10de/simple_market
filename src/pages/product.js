import React from 'react';
import CardProduct from '../components/CardProduct';
import { connect } from 'react-redux';
import { getProducts } from '../redux/actions';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
} from 'reactstrap';
import Axios from 'axios';
import { API_URL } from '../assets/path/urls';

class ProductPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dbProducts: [],
    };
  }

  btSort = (param) => {
    let url =
      param !== 'Shoes' && param !== 'Clothing'
        ? '/products'
        : `/products?category=${param}`;
    Axios.get(API_URL + url)
      .then((res) => {
        console.log('get product success:', res.data);
        this.props.getProducts(res.data);
      })
      .catch((err) => {
        console.log('get error:', err);
      });
  };

  renderProduct = () => {
    return this.props.products.map((item, index) => {
      return <CardProduct key={index} data={item} />;
    });
  };

  getFilter = () => {
    let order = this.order.value;
    let sort = this.field.value;
    // console.log(sort);
    // console.log(order);
    Axios.get(API_URL + `/products?_sort=${sort}&_order=${order}`)
      .then((res) => {
        console.log('GET PRODUCT :', res.data);
        this.setState({ dbProducts: res.data });
      })
      .catch((err) => console.log('ERR GET CAROUSEL :', err));
  };

  render() {
    return (
      <div className='row'>
        <div className='col-md-6'>
          <Dropdown
            isOpen={this.state.dropdownOpen}
            toggle={() =>
              this.setState({ dropdownOpen: !this.state.dropdownOpen })
            }>
            <DropdownToggle caret onClick={() => this.btSort('')}>
              All Products
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => this.btSort('Shoes')}>
                Shoes
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={() => this.btSort('Clothing')}>
                Clothing
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className='col-md-6'>
          <Form>
            <FormGroup className='d-flex'>
              <Input
                type='select'
                innerRef={(value) => (this.order = value)}
                className='mr-1'>
                <option value='Asc'>Asc</option>
                <option value='Desc'>Desc</option>
              </Input>
              <Input
                type='select'
                innerRef={(value) => (this.field = value)}
                className='mr-1'>
                <option value='name'>Name</option>
                <option value='price'>Price</option>
              </Input>
              <Button style={{ width: '10vw' }} onClick={this.getFilter}>
                Cari
              </Button>
            </FormGroup>
          </Form>
        </div>
        {this.renderProduct()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('GET PRODUCT ERROR ==>', state.productReducer);
  return {
    products: state.productReducer,
  };
};

export default connect(mapStateToProps, { getProducts })(ProductPage);
