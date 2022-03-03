import buildClient from '../api/build-client';

// Client Browser
const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

// Browser or SSR
LandingPage.getInitialProps = async (context) => {
  console.log('Landing page!');
  // const client = buildClient(context);
  // const { data } = await clientInformation.get('/api/users/currentuser');

  const { data } = await buildClient(context).get('/api/users/currentuser');

  console.log(data);

  return data;
};

export default LandingPage;
