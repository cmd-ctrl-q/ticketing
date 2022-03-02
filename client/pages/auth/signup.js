import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
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
      <h1>Sign Up</h1>

      <div className='form-group'>
        <label>Email Address</label>
        <input
          value={email}
          className='form-control'
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* <div className='my-0'>
          {errors.map((err) =>
            err.field === 'email' ? (
              <small key={err.message} style={{ color: 'red' }}>
                {err.message}
              </small>
            ) : (
              ''
            )
          )}
        </div> */}
      </div>

      <div className='form-group'>
        <label>Password</label>
        <input
          value={password}
          type='password'
          className='form-control'
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* <div className='my-0'>
          {errors.map((err) =>
            err.field === 'password' ? (
              <small key={err.message} style={{ color: 'red' }}>
                {err.message}
              </small>
            ) : (
              ''
            )
          )}
        </div> */}
      </div>

      {errors}

      <button className='btn btn-primary'>Sign Up</button>
    </form>
  );
};
