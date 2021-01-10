import Axios from 'axios';
import { API_URL } from '../../assets/path/urls';

export const login = (data) => {
  return {
    type: 'LOGIN',
    payload: data,
  };
};

export const logout = () => {
  return {
    type: 'LOGOUT',
  };
};

export const checkout = () => {
  return {
    type: 'CHECKOUT',
  };
};

export const Login = (username, password) => {
  return (dispatch) => {
    Axios.get(
      API_URL + `/users/login?username=${username}&password=${password}`
    )
      .then((res) => {
        console.log(res.data);
        // console.log('test');
        if (res.data.dataLogin) {
          localStorage.setItem('token', res.data.dataLogin.token);

          dispatch({
            type: 'LOGIN',
            payload: res.data.dataLogin,
          });
        }
        // alert(res.data.messages);
      })
      .catch((err) => {
        console.log('GET ERROR LOGIN :', err);
      });
  };
};

export const KeepLogin = () => {
  return async (dispatch) => {
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      let get = await Axios.get(API_URL + `/users/keepLogin`, headers);
      // console.log('GET DATA KEEPLOGIN', get.data);
      localStorage.setItem('token', get.data.dataKeepLogin.token);
      dispatch({
        type: 'LOGIN',
        payload: get.data.dataKeepLogin,
      });
    } catch (error) {
      console.log('KEEPLOGIN', error);
    }
  };
};

export const getCart = () => {
  return async (dispatch) => {
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      let get = await Axios.get(API_URL + `/users/getCart`, headers);
      // console.log('GET CART ===>:', get.data);
      // localStorage.setItem('id', get.data.iduser);
      dispatch({
        type: 'GET_CART',
        payload: get.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};
