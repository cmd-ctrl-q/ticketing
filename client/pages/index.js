import axios from 'axios';

// Client Browser
const LandingPage = ({ currentUser }) => {
  // console.log(currentUser);
  // axios.get('/api/users/currentuser').catch((err) => {
  //   console.log(err.message);
  // });

  return <h1>Landing Page</h1>;
};

// Browser or SSR
LandingPage.getInitialProps = async ({ req }) => {
  if (typeof window === 'undefined') {
    console.log(req.headers);
    // on server, request base domain must be specified
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        withCredentials: true,
        headers: req.headers,
      }
    );

    return data;
  } else {
    // on browser, request base domain doesn't have to be specified as it auto appends the headers
    const { data } = await axios.get('/api/users/currentuser');

    return data;
  }

  return {};
};

export default LandingPage;
