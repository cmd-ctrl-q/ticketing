import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
  // method === 'post', 'get', 'patch'
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      // reset errors state
      setErrors(null);

      const response = await axios[method](url, body);
      // check if the onSuccess callback was provided,
      // if it was, then call it
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      setErrors(
        <div className='alert alert-danger'>
          <h4>Oops...</h4>
          <ul className='my-0'>
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );

      // no need to re-throw err if using onSuccess callback
      // throw err;
    }
  };

  // return [doRequest, errors];
  return { doRequest, errors };
};
