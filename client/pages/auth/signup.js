import { useState } from 'react';
import axios from 'axios';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault(); // prevents form from submitting by default

    try {
      const response = await axios.post('/api/users/signup', {
        email,
        password,
      });

      console.log(response.data);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>

      <div className='form-group'>
        <label>Email Address</label>
        <input
          value={email}
          className='form-control'
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className='form-group'>
        <label>Password</label>
        <input
          value={password}
          type='password'
          className='form-control'
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className='btn btn-primary'>Sign Up</button>
    </form>
  );
};
