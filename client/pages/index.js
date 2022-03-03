const LandingPage = ({ color }) => {
  console.log('I am in the component,', color);
  return <div>landing page...</div>;
};

LandingPage.getInitialProps = () => {
  console.log('I am on the server!');

  // shows up on LandingPage as the initial props.
  return { color: 'red' };
};

export default LandingPage;
