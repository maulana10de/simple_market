import React from 'react';
import { Jumbotron } from 'reactstrap';
import CarouselCom from '../components/Carousel';
import Axios from 'axios';
import { API_URL } from '../assets/path/urls';
import { getSlides } from '../redux/actions';
import { connect } from 'react-redux';

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getCarousel();
  }

  getCarousel = () => {
    Axios.get(API_URL + '/carousel')
      .then((res) => {
        // console.log('GET MAP STATE TO PROPS :', res.data);
        this.props.getSlides(res.data);
      })
      .catch((err) => {
        console.log('error: ', err);
      });
  };

  render() {
    return (
      <div>
        <Jumbotron className='text-center'>
          <h1 className='display-3'>AdiSport Indonesia</h1>
          <hr className='my-2' />
          <p>
            Through sports, we have the power to change lives. Sports keep us
            fit. They keep us mindful. They bring us together. Athletes inspire
            us.
          </p>
        </Jumbotron>
        <CarouselCom carousel={this.props.slides} />
      </div>
    );
  }
}

const mapStateToProps = ({ slideReducer }) => ({
  slides: slideReducer,
});

export default connect(mapStateToProps, { getSlides })(Homepage);
