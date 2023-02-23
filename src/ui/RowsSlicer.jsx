import React, { useEffect, useState } from 'react';

import { RiArrowDownSFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { changeItemsPerPage } from '../redux/slices/dataSlice';

import styles from './RowsSlicer.module.css';

const RowsSlicer = () => {
  const dispatch = useDispatch();
  const [rowsNumber, setRowsNumber] = useState(5);
  console.log('ROWS NUMBER IS: ' + rowsNumber);
  useEffect(() => {
    console.log('DISPATCH ROWSSLICER');
    dispatch(changeItemsPerPage(Number(rowsNumber)));
  }, [rowsNumber]);
  const changeRowsNumber = (event) => {
    setRowsNumber(event.target.value);
    dispatch(changeItemsPerPage(Number(rowsNumber)));
  };
  return (
    <div className={styles.select__container}>
      <select onChange={changeRowsNumber} className={styles.select__box}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value={Infinity}>all</option>
      </select>
      <div className={styles.icon__container}>
        <RiArrowDownSFill />
      </div>
    </div>
  );
};

export default RowsSlicer;
