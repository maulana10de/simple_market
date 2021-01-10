import Axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Input, Jumbotron } from 'reactstrap';
import { API_URL } from '../assets/path/urls';

class VerificationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log(this.props.match.params.token);
  }

  btVerify = () => {
    const headers = {
      headers: {
        Authorization: `Bearer ${this.props.match.params.token}`,
      },
    };

    Axios.patch(
      API_URL + '/users/verification',
      {
        otp: this.otp.value,
      },
      headers
    )
      .then((res) => {
        console.log('Verification', res);
        this.setState({ redirect: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to='/' />;
    }
    return (
      <div>
        <Jumbotron>
          <h1 className='display-3'>Verify your Account</h1>
          <p>
            You can shop with your account if the status is{' '}
            <strong>VERIFIED</strong>{' '}
          </p>
          <hr />
          <p>
            Input Your OTP
            <Input
              placeholder='6 Character OTP'
              style={{ width: '15%', marginBottom: '5px' }}
              innerRef={(e) => (this.otp = e)}></Input>
          </p>
          <Button onClick={this.btVerify}>Verify Now</Button>
        </Jumbotron>
      </div>
    );
  }
}

export default VerificationPage;
