import buildClient from '../api/build-client';

// Client Browser
const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

// Browser or SSR
LandingPage.getInitialProps = async (context) => {
  // const client = buildClient(context);
  // const { data } = await clientInformation.get('/api/users/currentuser');

  const { data } = await buildClient(context).get('/api/users/currentuser');

  console.log(data);

  return data;
};

export default LandingPage;
