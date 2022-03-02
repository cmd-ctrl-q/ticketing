import React from 'react';

export const alert = ({ message, style }) => {
  return <small className={style}>error: {message}</small>;
};

alert.defaultProps = {
  style: 'alert alert-danger',
};
