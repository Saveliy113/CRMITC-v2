import React, { useEffect, useState } from 'react';

import { RiArrowDownSFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeItemsPerPage,
  changePage,
  clearItemsPerPage,
} from '../redux/slices/dataSlice';

import styles from './RowsSlicer.module.css';
import { useSearchParams } from 'react-router-dom';

const RowsSlicer = ({ initialState }) => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const rowsNumber = useSelector((store) => store.data.itemsPerPage);
  const urlRowsNumber = Number(searchParams.get('rows'));
  console.log('ROWSNUMBER', rowsNumber);
  console.log('URLROWSNUMBER', urlRowsNumber);

  // useEffect(() => {
  //   searchParams.set('rows', rowsNumber);
  //   setSearchParams(searchParams);
  // }, []);

  // useEffect(() => {
  //   if (urlRowsNumber !== rowsNumber) {
  //     if (urlRowsNumber === 0) {
  //       console.log('URLROWSNUMBER === 0');
  //       dispatch(clearItemsPerPage());
  //       dispatch(changePage(0));
  //     } else {
  //       dispatch(changeItemsPerPage(urlRowsNumber));
  //     }
  //     console.log('111');
  //   }
  // }, [urlRowsNumber]);

  const changeRowsNumber = (event) => {
    // searchParams.set('rows', event.target.value);
    // setSearchParams(searchParams);
    dispatch(changeItemsPerPage(Number(event.target.value)));
  };
  return (
    <div className={styles.select__container}>
      <select
        key={urlRowsNumber}
        onChange={changeRowsNumber}
        className={styles.select__box}
        value={rowsNumber}
      >
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
