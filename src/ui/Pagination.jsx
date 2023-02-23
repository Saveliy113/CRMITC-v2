import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import ReactPaginate from 'react-paginate';
import { changePage } from '../redux/slices/dataSlice';

import styles from './Pagination.module.css';

const Pagination = () => {
  const dispatch = useDispatch();
  const pageCount = useSelector((store) => store.data.pageCount);
  const currentPageIndex = useSelector((store) => store.data.currentPageIndex);

  const handlePageClick = (event) => {
    console.log('PAGE:', event);
    dispatch(changePage(event.selected));
  };

  return (
    <ReactPaginate
      // initialPage={0}
      breakLabel="..."
      forcePage={currentPageIndex}
      nextLabel={<FaArrowRight />}
      onPageChange={handlePageClick}
      pageRangeDisplayed={4}
      pageCount={pageCount}
      previousLabel={<FaArrowLeft />}
      renderOnZeroPageCount={null}
    />
  );
};

export default Pagination;
