import React from 'react';
import Axios from 'axios';
import { Button, Card, Table, UncontrolledCollapse } from 'reactstrap';
import Swal from 'sweetalert2';
import { API_URL } from '../assets/path/urls';
import { connect } from 'react-redux';
import { KeepLogin } from '../redux/actions/authAction';
import moment from 'moment';

class Transaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dbTransaction: [],
    };
  }

  componentDidMount() {
    this.getTransaction();
  }

  // fungsi getTransaction di filter berdasarkan user id,
  // jadi yang akan tampil hanya yang punya user id tersebut
  getTransaction = () => {
    const headers = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    Axios.get(API_URL + `/transaction`, headers)
      .then((res) => {
        console.log('GET SUCCESS GET_TRANSACTION:', res.data);
        this.setState({ dbTransaction: res.data });
        this.props.KeepLogin();
      })
      .catch((err) => {
        console.log('GET ERROR GET_TRANSACTION:', err);
      });
  };

  btPayment = (id) => {
    // update menggunakan metode patch, yang hanya mengganti "status" menjadi "paid"
    Axios.patch(API_URL + `/transaction/${id}`, { status: 'paid' })
      .then((res) => {
        Swal.fire({
          icon: 'success',
          text: 'Your payment has been successful',
        });
        this.getTransaction();
      })
      .catch((err) => console.log(err));
  };

  renderTransaction = () => {
    return this.state.dbTransaction.map((item, index) => {
      return (
        <>
          <tr key={index} className='text-center'>
            <td>{index + 1}</td>
            <td>{moment(item.date).format('L')}</td>
            <td>{item.invoice}</td>
            <td>{item.total_payment.toLocaleString()}</td>
            <td>{item.status.toUpperCase()}</td>
            <td>
              <Button className='mr-1' id={`toggler${index}`}>
                Detail
              </Button>
              <Button
                disabled={item.status !== 'Unpaid' ? true : false}
                onClick={() => this.btPayment(item.idtransaction)}>
                Payment
              </Button>
            </td>
          </tr>
          <tr className='text-center'>
            <td colSpan='6'>
              <UncontrolledCollapse toggler={`#toggler${index}`}>
                <Card
                  style={{
                    backgroundColor: '#627282',
                    padding: '20px',
                    margin: '20px',
                  }}>
                  <table style={{ width: '100%' }}>
                    <thead>
                      <th>No</th>
                      <th>Product</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Size</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </thead>
                    <tbody>
                      {item.detail.map((elem, idx) => {
                        console.log(elem);
                        return (
                          <tr key={idx} className='text-center'>
                            <th>{idx + 1}</th>
                            <th>
                              <img
                                src={elem.image}
                                alt={elem.name}
                                width='100vw'
                              />
                            </th>
                            <th>{elem.name}</th>
                            <th>{elem.category}</th>
                            <th>{elem.size}</th>
                            <th>{elem.qty}</th>
                            <th>{elem.price.toLocaleString()}</th>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>
              </UncontrolledCollapse>
            </td>
          </tr>
        </>
      );
    });
  };

  // renderDetailCart = () => {
  //   return this.state.dbTransaction.map((item, index) => {
  //     return item.cart.map((elem, idx) => {
  //       return (
  //         <div>
  //           <UncontrolledCollapse toggler={`#toggler${index}`}>
  //             <Table dark>
  //               <thead>
  //                 <tr className='text-center'>
  //                   <th>No</th>
  //                   <th>Product</th>
  //                   <th>Name</th>
  //                   <th>Category</th>
  //                   <th>Size</th>
  //                   <th>Qty</th>
  //                   <th>Price</th>
  //                   <th>Amount Price</th>
  //                 </tr>
  //               </thead>
  //               <tbody></tbody>
  //             </Table>
  //           </UncontrolledCollapse>
  //         </div>
  //       );
  //     });
  //   });
  // };

  render() {
    return (
      <div>
        <h1>Your Transaction</h1>
        <hr />
        <Table dark>
          <thead>
            <tr className='text-center'>
              <th>#</th>
              <th>Transaction Date</th>
              <th>Invoice</th>
              <th>Total Payment</th>
              <th>Status</th>
              <th style={{ width: '10vw' }}>Action</th>
            </tr>
          </thead>
          <tbody>{this.renderTransaction()}</tbody>
        </Table>
      </div>
    );
  }
}

export default connect(null, { KeepLogin })(Transaction);
