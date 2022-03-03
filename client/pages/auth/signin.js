import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    // callback
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (e) => {
    e.preventDefault(); // prevents form from submitting by default

    await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>

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

      {errors}

      <button className='btn btn-primary'>Sign In</button>
    </form>
  );
};
