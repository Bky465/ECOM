// import { Provider } from 'react-redux'
import '../styles/globals.css'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
// import store from '../redux/store'

const stripePromise = loadStripe('pk_test_51LXdHjSCUET3KE2FSLOOaR2tVlsUj4VBHU1W0gW1rb6E2IrI72UtjQU4HfvXra3M6PLFhZoP4u5OjKexCGbZRVF400EUirwaxb');
function MyApp({ Component, pageProps }) {
  return (
  <div className='m-0'>
  {/* <Provider store={store}> */}
   <Elements stripe={stripePromise} >
  <Component {...pageProps} />
  </Elements>
  {/* </Provider> */}
  </div>
  )
}

export default MyApp
