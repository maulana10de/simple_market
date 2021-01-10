import Axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import { API_URL } from './assets/path/urls';
import Footer from './components/Footer';
import NavbarCom from './components/Navbar';
import AboutPage from './pages/about';
import TransactionAdmin from './pages/adminTransaction';
import CartPage from './pages/cartUser';
import Homepage from './pages/home';
import Notfound from './pages/notfound';
import ProductPage from './pages/product';
import ProductDetail from './pages/productDetail';
import ProductManagement from './pages/productManagement';
import ProfilePage from './pages/profile';
import RegisterPage from './pages/register';
import SlideManagement from './pages/slideManagement';
import Transaction from './pages/transaction';
import VerificationPage from './pages/verification';
import { login, getProducts, KeepLogin, getCart } from './redux/actions';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.KeepLogin();
    this.getProducts();
    this.props.getCart();
  }

  getProducts = () => {
    Axios.get(API_URL + `/products`)
      .then((res) => {
        this.props.getProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className='container'>
        <NavbarCom user={this.props.user} />
        <Switch>
          <Route path='/' exact component={Homepage} />
          <Route path='/product' component={ProductPage} />
          <Route path='/product-detail' component={ProductDetail} />
          <Route path='/register' component={RegisterPage} />
          <Route path='/about' component={AboutPage} />
          <Route path='/verification/:token' component={VerificationPage} />

          {this.props.role && this.props.role === 'admin' ? (
            <>
              <Route path='/product-admin' component={ProductManagement} />
              <Route path='/slide-admin' component={SlideManagement} />
              <Route path='/transaction-admin' component={TransactionAdmin} />
            </>
          ) : (
            <>
              <Route path='/cart' component={CartPage} />
              <Route path='/transaction' component={Transaction} />
              <Route path='/profile' component={ProfilePage} />
            </>
          )}

          <Route path='*' component={Notfound} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

// ambil data dari reducer
const mapStateToProps = (state) => {
  return {
    user: state.authReducer,
    role: state.authReducer.role,
  };
};

// param 1 yaitu untuk mengambil data dari reducer
// param 2 untuk menyimpan data
export default connect(mapStateToProps, {
  login,
  getProducts,
  KeepLogin,
  getCart,
})(App);
