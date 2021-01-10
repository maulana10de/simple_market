import React from 'react';
import { Card, CardBody, CardImg } from 'reactstrap';

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-md-3'>
            <Card>
              <CardImg
                top
                style={{
                  borderRadius: '50%',
                  width: '10vw',
                  margin: '0 auto',
                  border: '1px solid #c3c3c3',
                  marginTop: '10px',
                }}
                src='https://icons.iconarchive.com/icons/diversity-avatars/avatars/1024/batman-icon.png'
              />
              <hr />
              <CardBody className='text-center'>
                <h5>Ade Maulana</h5>
              </CardBody>
            </Card>
          </div>
          <div className='col-12 col-md-9'>
            <Card>
              <CardBody>
                <h5>Daftar Belanja</h5>
                <hr />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfilePage;
