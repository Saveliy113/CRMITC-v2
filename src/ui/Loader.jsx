import React from 'react';

import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loader__container}>
      <div className={styles.ring}></div>
      <div className={styles.ring}></div>
      <div className={styles.ring}></div>
      <span className={styles.loading}>Загрузка...</span>
    </div>
  );
};

export default Loader;
