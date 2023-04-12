//REACT
import { useEffect, useRef } from 'react';

//CSS
import styles from './Button.module.css';

const Button = ({ type, text, action, disabled, actionOnEnter = false }) => {
  const buttonRef = useRef();

  useEffect(() => {
    const keyPressHandler = (event) => {
      if (!disabled && actionOnEnter && event.key === 'Enter') {
        buttonRef.current.focus();
        action();
      }
    };

    window.addEventListener('keydown', keyPressHandler);

    return () => {
      window.removeEventListener('keydown', keyPressHandler);
    };
  }, [action, disabled]);

  return (
    <button
      ref={buttonRef}
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
