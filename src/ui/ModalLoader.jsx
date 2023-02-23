import React from 'react';

import styles from './ModalLoader.module.css';

const ModalLoader = () => {
  return (
    <div className={styles.modal__loader}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default ModalLoader;
