import React from 'react';
import { useEffect } from 'react';

import styles from './Button.module.css';

const Button = ({ type, text, action, disabled }) => {
  // const keyPressHandler = (event) => {
  //   if (event.key === 'Enter') {
  //     // action();
  //     console.log('111');
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('keydown', (event) => {
  //     keyPressHandler(event);
  //   });

  //   return window.removeEventListener('keydown', (event) => {
  //     keyPressHandler(event);
  //   });
  // });

  return (
    <button
      className={styles.btn}
      onClick={action}
      disabled={disabled}
      type={type ? type : ''}
    >
      {text}
    </button>
  );
};

export default Button;
