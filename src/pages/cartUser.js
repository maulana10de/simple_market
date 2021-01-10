import Axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import Swal from 'sweetalert2';
import { API_URL } from '../assets/path/urls';
import { login, checkout, getCart } from '../redux/actions/';

class CartPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIdx: null,
      redirect: false,
      totalOrder: 0,
    };
  }

  componentDidMount() {
    this.props.getCart();
  }

  refreshCart = (paramsidcart, paramsqty) => {
    Axios.patch(API_URL + `/users/updateCartQty/${paramsidcart}`, {
      qty: paramsqty,
    })
      .then((res) => {
        this.props.getCart();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  btIncrement = (idcart, index) => {
    let { cart, product } = this.props;
    // console.log('GET STOCK  ====>', product[index]);
    let idstock = product[index].stock.findIndex(
      (e) => e.code === cart[index].size
    );
    // console.log(idstock);
    // console.log('===>', product[index].stock[idstock].total, cart[index].qty);

    if (cart[index].qty >= product[index].stock[idstock].total) {
      Swal.fire({
        html: `<h3>Stok tersisa < ${product[index].stock[idstock].total}, beli segera!</h3>`,
      });
    } else {
      // if(product[index].stock[stock].qty)
      cart[index].qty += 1;
      // this.props.cart[index].total =
      //   this.props.cart[index].qty * this.props.cart[index].price;
      // console.log('GET INDEX', cart[index].qty);
      // this.setState({ totalQty: this.totalQty() });
      this.refreshCart(idcart, cart[index].qty);
    }
  };

  btDecrement = (idcart, index) => {
    let { cart } = this.props;
    if (cart[index].qty > 1) {
      cart[index].qty -= 1;
      // cart[index].total = cart[index].qty * cart[index].price;
      console.log('GET INDEX', cart[index].qty);
      // this.setState({ totalQty: this.totalQty() });
      this.refreshCart(idcart, cart[index].qty);
    } else {
      this.btDelete(idcart);
    }
  };

  btDelete = (idcart) => {
    Swal.fire({
      title: 'Hapus barang?',
      text: 'Barang ini akan dihapus dari keranjangmu.',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Hapus Barang!',
      width: '30rem',
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(API_URL + `/users/deleteCart/${idcart}`)
          .then((res) => {
            console.log(res);
            this.props.getCart();
          })
          .catch((err) => {
            console.log('GET ERROR CART', err);
          });
        this.refreshCart();
      }
    });
  };

  decrementStock = (id, stock) => {
    Axios.patch(API_URL + `/product/updateStock/${id}`, stock)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log('GET ERROR DECREMENT_STOCK:', err);
      });
  };

  btCheckout = () => {
    // let date = new Date();
    // let obj = {};
    // let dataCart = [];
    // let dataIdCart = [];
    // let invoice = `INV/${date.getFullYear()}/${date.getMonth()}/${Math.floor(
    //   Math.random() * 1000 + 1
    // )}`;
    // this.props.cart.forEach((item, idx) => {
    //   obj = {
    //     iduser: this.props.id,
    //     idproduct: item.idproduct,
    //     idstock: item.idstock,
    //     idsize: item.idsize,
    //     image: item.image,
    //     name: item.name,
    //     category: item.category,
    //     size: item.size,
    //     qty: item.qty,
    //     price: item.price,
    //     noinvoice: invoice,
    //     status: 'unpaid',
    //   };
    //   dataIdCart.push(item.idcart);
    //   dataCart.push(obj);
    // });

    // console.log('=====>', dataCart);
    // console.log('=====>', this.props.cart);
    console.log('====>', this.props.id);

    Axios.post(API_URL + `/transaction`, {
      cart: this.props.cart,
      iduser: this.props.id,
    })
      .then((res) => {
        this.setState({ redirect: true });
        // this.props.getCart();
        // Axios.delete(API_URL + `/users/deleteMulti?idcart=${dataIdCart}`)
        //   .then((res) => console.log(res))
        //   .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

    // Axios.post(API_URL + `/transaction`, obj)
    //   .then((res) => {
    //     // this.setState({ redirect: true });
    //     console.log(res);
    //   })
    //   .catch((err) => console.log(err));

    // if (this.props.cart.length > 0) {
    //   this.props.cart.forEach((item, index) => {
    //     // let indexProduct = this.props.product.findIndex(
    //     //   (value) => value.id === item.idproduct
    //     // );
    //     // let indexStock = this.props.product[indexProduct].stock.findIndex(
    //     //   (value) => value.code === item.size
    //     // );
    //     // this.props.product[indexProduct].stock[indexStock].total -= item.qty;
    //     // this.decrementStock(item.idproduct, {
    //     //   stock: this.props.product[indexProduct].stock,
    //     // });

    //     // Cara 1
    //     this.props.product.forEach((value, idx) => {
    //       if (item.idproduct === value.id) {
    //         console.log('sama', item.idproduct, value.id);
    //         let indexStock = value.stock.findIndex(
    //           (element) => element.code === item.size
    //         );
    //         value.stock[indexStock].total -= item.qty;
    //         this.decrementStock(value.id, { stock: value.stock });
    //         console.log('GET ==>', value.stock[indexStock]);
    //       }
    //     });
    //   });

    //   Axios.post(API_URL + `/transaction`, obj)
    //     .then((res) => {
    //       Axios.patch(API_URL + `/user/refreshCart/${this.props.id}`, {
    //         cart: [],
    //       })
    //         .then((response) => {
    //           this.setState({ redirect: true });
    //           this.props.checkout();
    //           console.log(
    //             'GET SUCCESS UPDATE PRODUCT REDUCER :',
    //             response.data
    //           );
    //         })
    //         .catch((error) => {
    //           console.log(error);
    //         });
    //       // console.log('GET SUCCESS USER_TRANSACTION :', res.data);
    //     })
    //     .catch((err) => console.log(err));
    // } else {
    //   Swal.fire({
    //     icon: 'warning',
    //     text: 'Sorry, your shopping cart is empty',
    //   });
    // }
  };

  renderCart = () => {
    console.log('=======> props :', this.props.cart);
    return this.props.cart.map((item, index) => {
      console.log('=======> props index :', item.idcart, index);
      return (
        <tr key={index}>
          <th>{index + 1}</th>
          <td>
            <img src={item.image} width='120vw' alt={item.title} />
          </td>
          <td>
            {item.name} - {this.state.totalOrder}
          </td>
          <td>{item.category}</td>
          <td>{item.size}</td>
          <td>{item.price.toLocaleString()}</td>
          <td>
            <div className='d-flex'>
              <Button onClick={() => this.btDecrement(item.idcart, index)}>
                -
              </Button>
              <p className='m-3 text-center'>{item.qty}</p>
              <Button onClick={() => this.btIncrement(item.idcart, index)}>
                +
              </Button>
            </div>
          </td>
          <td>{(item.qty * item.price).toLocaleString()}</td>
          <td>
            <Button color='danger' onClick={() => this.btDelete(item.idcart)}>
              Delete
            </Button>
          </td>
        </tr>
      );
    });
  };

  totalPayment = () => {
    let { cart } = this.props;
    let payment = 0;
    cart.forEach((element) => {
      payment += element.qty * element.price;
    });
    return payment;
  };

  totalQty = () => {
    let { cart } = this.props;
    let qty = 0;
    cart.forEach((element) => {
      qty += element.qty;
    });
    return qty;
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to='/transaction' />;
    }
    return (
      <div>
        <h1>Cart</h1>
        <hr />
        <Table dark>
          <thead>
            <tr>
              <th>No</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Size</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{this.renderCart()}</tbody>
          {this.props.cart.length === 0 ? (
            <tfoot>
              <tr>
                <th
                  colSpan='9'
                  style={{
                    textAlign: 'center',
                    letterSpacing: '2px',
                    padding: '50px',
                  }}>
                  <h5>Wah, keranjang belanjamu kosong</h5>
                  <p>
                    Daripada dianggurin, mending isi dengan barang-barang
                    impianmu. Yuk, cek sekarang!
                  </p>
                  <Button color='success'>
                    <Link
                      to='/product'
                      style={{ textDecoration: 'none', color: '#fff' }}>
                      Mulai Belanja
                    </Link>
                  </Button>
                </th>
              </tr>
            </tfoot>
          ) : (
            <tfoot>
              <tr>
                <th colSpan='6' className='text-center'>
                  Total Payment
                </th>
                <th className='text-center'>
                  {this.totalQty().toLocaleString()}
                </th>
                <th>{this.totalPayment().toLocaleString()}</th>
                <th>
                  <Button color='success' onClick={this.btCheckout}>
                    Checkout
                  </Button>
                </th>
              </tr>
            </tfoot>
          )}
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log('GET DATA CARTUSER :', state.authReducer.cart);
  // console.log('GET DATA CARTUSER PRODUCT :', state.productReducer);
  // console.log('GET PRODUCT :', state.productReducer);
  return {
    user: state.authReducer,
    cart: state.authReducer.cart,
    id: state.authReducer.iduser,
    product: state.productReducer,
  };
};

export default connect(mapStateToProps, { login, checkout, getCart })(CartPage);
