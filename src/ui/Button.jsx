import React from 'react';

import styles from './Button.module.css';

const Button = ({ type, text, action, disabled }) => {
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
