import Axios from 'axios';
import React from 'react';
import { Button, ButtonGroup, Input, Jumbotron } from 'reactstrap';
import { API_URL } from '../assets/path/urls';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      thumbnail: 0,
      qty: 0,
      total: 0,
      disabled: false,
      totalHarga: 0,
    };
  }

  componentDidMount() {
    this.getProductDetail();
  }

  getProductDetail = () => {
    // console.log('GET ID PRODUCT =====>', this.props.location.search);
    Axios.get(API_URL + `/products${this.props.location.search}`)
      .then((res) => {
        // console.log('get products:', res.data);
        this.setState({ detail: res.data });
      })
      .catch((err) => {
        console.log('get error products:', err);
      });
  };

  renderThumbnail = (images) => {
    return images.map((item, index) => {
      return (
        <div
          key={index}
          className='flex-grow-1 select-image'
          onClick={() => this.setState({ thumbnail: index })}
          style={{ padding: '0 1px' }}>
          <img src={item.image} width='100%' alt={item.title} />
        </div>
      );
    });
  };

  renderStock = (stock) => {
    return stock.map((item, index) => {
      return (
        <Button
          style={{
            borderRadius: 0,
          }}
          disabled={item.total === 0 && true}
          key={index}
          onClick={() =>
            this.setState({
              total: item.total,
              size: item.code,
              idstock: item.idstock,
            })
          }>
          {item.code}
        </Button>
      );
    });
  };

  btIncrement = () => {
    let { qty, total, detail } = this.state;

    // console.log(qty, total, detail);
    if (qty < total) {
      this.setState({
        qty: (qty += 1),
        totalHarga: qty * detail.price,
      });
    } else {
      Swal.fire({
        html: `<h3>Stok tersisa < ${total}, beli segera!</h3>`,
      });
    }
  };

  btAddToCart = () => {
    let cart = {
      iduser: this.props.iduser,
      idstock: this.state.idstock,
      idproduct: this.state.detail.idproduct,
      qty: this.state.qty,
    };

    Axios.post(API_URL + `/users/addToCart`, { cart })
      .then((response) => {
        this.setState({ redirect: true });
      })
      .catch((err) => console.log('ERROR ADD TO CART :', err));
  };

  // Versi II
  // btAddToCart = () => {
  //   let cart = {
  //     iduser: this.props.iduser,
  //     idstock: this.state.idstock,
  //     idproduct: this.state.detail.idproduct,
  //     qty: this.state.qty,
  //   };

  //   let newCart = this.props.cart.filter((item, index) => {
  //     return (
  //       item.size === this.state.size &&
  //       item.idproduct === this.state.detail.idproduct
  //     );
  //   });

  //   if (this.props.cart.length === 0) {
  //     Axios.post(API_URL + `/users/addToCart`, { cart })
  //       .then((response) => {
  //         this.setState({ redirect: true });
  //       })
  //       .catch((err) => console.log('ERROR ADD TO CART :', err));
  //   } else {
  //     if (newCart.length === 0) {
  //       Axios.post(API_URL + `/users/addToCart`, { cart })
  //         .then((response) => {
  //           this.setState({ redirect: true });
  //         })
  //         .catch((err) => console.log('ERROR ADD TO CART :', err));
  //     }
  //     newCart.forEach((item) => {
  //       if (
  //         item.size === this.state.size &&
  //         item.idproduct === this.state.detail.idproduct
  //       ) {
  //         item.qty += this.state.qty;
  //         item.total = item.qty * this.state.detail.price;
  //         Axios.patch(API_URL + `/users/updateCartQty/${item.idcart}`, {
  //           qty: item.qty,
  //         })
  //           .then((response) => {
  //             this.setState({ redirect: true });
  //           })
  //           .catch((err) => console.log(err));
  //       }
  //     });
  //   }

  // this.props.cart.forEach((item, i) => {
  //   let newCart = this.props.cart.filter((item, index) => {
  //     return (
  //       item.size === this.state.size &&
  //       item.idproduct === this.state.detail.idproduct
  //     );
  //   });

  //   if (
  //     newCart[0].size === this.state.size &&
  //     newCart[0].idproduct === this.state.detail.idproduct
  //   ) {
  //     item.qty += this.state.qty;
  //     item.total = item.qty * this.state.detail.price;
  //     Axios.patch(API_URL + `/users/updateCartQty/${item.idcart}`, {
  //       qty: item.qty,
  //     })
  //       .then((response) => {
  //         this.setState({ redirect: true });
  //       })
  //       .catch((err) => console.log(err));
  //   } else {
  //     cart = {
  //       iduser: this.props.iduser,
  //       idstock: this.state.idstock,
  //       idproduct: this.state.detail.idproduct,
  //       qty: this.state.qty,
  //     };
  //     Axios.post(API_URL + `/users/addToCart`, { cart })
  //       .then((response) => {
  //         this.setState({ redirect: true });
  //       })
  //       .catch((err) => console.log('ERROR ADD TO CART :', err));
  //   }
  // });

  render() {
    let { detail, thumbnail, redirect, qty, total, totalHarga } = this.state;

    if (redirect) {
      return <Redirect to='/cart' />;
    }

    // console.log('GET DETAIL PRODUCT :', detail);
    return (
      <div className='container'>
        {detail.idproduct && (
          <Jumbotron
            className='row p-3'
            style={{ borderRadius: 0, backgroundColor: '#fff' }}>
            <div className='col-12 col-md-5 pr-3 border-right'>
              <img
                src={detail.images[thumbnail].image}
                width='100%'
                alt='images'
              />
              <div className='d-flex mt-1'>
                {this.renderThumbnail(detail.images)}
              </div>
            </div>
            <div className='col-12 col-md-7'>
              <div>
                <h5
                  style={{
                    fontSize: '16px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}>
                  {detail.brand} / {detail.category}
                </h5>
                <br />

                <h1
                  style={{
                    fontSize: '52px',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    fontStyle: 'italic',
                  }}>
                  {detail.name}
                </h1>
                <br />
                <h5
                  style={{
                    fontSize: '11px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}>
                  {detail.colour}
                </h5>
                <br />
                <br />
                <h4
                  style={{
                    fontSize: '16px',
                    letterSpacing: '1.5px',
                    fontWeight: 700,
                  }}>
                  Rp.{detail.price.toLocaleString()}
                </h4>
                <h4
                  style={{
                    fontSize: '16px',
                    letterSpacing: '1.5px',
                    lineHeight: '30px',
                  }}>
                  {detail.description}
                </h4>
                <br />
                <div>
                  <ButtonGroup>{this.renderStock(detail.stock)}</ButtonGroup>
                  <p
                    style={{
                      fontSize: '12px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      marginTop: '5px',
                    }}>
                    Stock : {total}
                  </p>
                </div>
                <div className='d-flex justify-content-center m-1'>
                  <Button
                    onClick={() =>
                      this.setState({
                        qty: qty > 0 ? (qty -= 1) : 0,
                        totalHarga: qty * detail.price,
                      })
                    }>
                    -
                  </Button>
                  <Input
                    value={qty}
                    style={{ width: '4vw' }}
                    className='text-center m-1'
                    readOnly
                  />

                  <Button onClick={this.btIncrement}>+</Button>
                </div>
                <div className='row'>
                  <div className='col-md-6'>
                    <h3
                      style={{
                        fontSize: '28px',
                        letterSpacing: '1.5px',
                        fontWeight: 700,
                      }}>
                      Rp.{' '}
                      {qty > 0
                        ? totalHarga.toLocaleString()
                        : detail.price.toLocaleString()}
                    </h3>
                  </div>
                  <div className='col-md-6'>
                    <Button
                      style={{ float: 'right', width: '8vw' }}
                      onClick={this.btAddToCart}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Jumbotron>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log('CHECK DATA :', state.authReducer);
  return {
    cart: state.authReducer.cart,
    iduser: state.authReducer.iduser,
  };
};

export default connect(mapStateToProps)(ProductDetail);
