import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body }) => {
  // method === 'post', 'get', 'patch'
  const [errors, setErrors] = useState(null);

  const doRequest = () => {
    try {
      const response = await axios[method](url, body);
      return response.data;
    } catch (err) {
      setErrors(
        <div>
          {err.response.data.errors.map((err) => (
            <small style={{ color: 'red' }} key={err.message}>
              {err.message}
            </small>
          ))}
        </div>
      );
      return err.response.data;
    }
  };

  // return [doRequest, errors];
  return { doRequest, errors };
};
