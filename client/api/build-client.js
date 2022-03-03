import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // on server

    // creates preconfigured version of axios request
    return axios.create({
      withCredentials: true,
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // on browser
    return axios.create({
      withCredentials: true,
      baseURL: '/',
    });
  }
};
