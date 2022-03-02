import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body }) => {
  // method === 'post', 'get', 'patch'
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      // reset errors state
      setErrors(null);

      const response = await axios[method](url, body);
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
      return err.response.data;
    }
  };

  // return [doRequest, errors];
  return { doRequest, errors };
};
