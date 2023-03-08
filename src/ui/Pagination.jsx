//REACT
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

//REDUX
import { changePage } from '../redux/slices/dataSlice';

//ICONS
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

//COMPONENTS
import ReactPaginate from 'react-paginate';

//CSS
import styles from './Pagination.module.css';

const Pagination = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  // useEffect(() => {
  //   setSearchParams({ page: currentPageIndex });
  // }, []);
  const pageCount = useSelector((store) => store.data.pageCount);
  const currentPageIndex = useSelector((store) => store.data.currentPageIndex);
  const urlPageIndex = Number(searchParams.get('page'));
  // useEffect(() => {
  //   if (!urlPageIndex) {
  //     searchParams.set('page', 1);
  //     setSearchParams(searchParams);
  //   }
  // });

  // useEffect(() => {
  //   searchParams.set('page', 1);
  //   setSearchParams(searchParams);
  // }, [pageCount]);

  useEffect(() => {
    if (urlPageIndex > 0) {
      dispatch(changePage(urlPageIndex - 1));
    } else dispatch(changePage(0));
  }, [urlPageIndex]);

  const handlePageClick = (event) => {
    // dispatch(changePage(event.selected));
    searchParams.set('page', event.selected + 1);
    // setSearchParams({ page: event.selected + 1 });
    setSearchParams(searchParams);
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
