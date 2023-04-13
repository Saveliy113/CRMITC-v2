//REACT
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

//REDUX
import { changePage } from "../redux/slices/dataSlice";

//ICONS
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";

//COMPONENTS
import ReactPaginate from "react-paginate";

//CSS
import styles from "./Pagination.module.css";

const Pagination = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageCount = useSelector((store) => store.data.pageCount);
  const currentPageIndex = useSelector((store) => store.data.currentPageIndex);
  const urlPageIndex = Number(searchParams.get("page"));

  //CHANGE CURRENT PAGE IF PAGE IN URL WAS CHANGED
  // useEffect(() => {
  //   if (urlPageIndex > 0) {
  //     dispatch(changePage(urlPageIndex - 1));
  //   } else dispatch(changePage(0));
  // }, [urlPageIndex]);

  const handlePageClick = (event) => {
    dispatch(changePage(event.selected))
    // searchParams.set("page", event.selected + 1);
    // setSearchParams(searchParams);
  };

  return (
    <ReactPaginate
      breakLabel="..."
      forcePage={currentPageIndex}
      nextLabel={<RiArrowRightSLine />}
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      pageCount={10}
      previousLabel={<RiArrowLeftSLine />}
      renderOnZeroPageCount={null}
    />
  );
};

export default Pagination;
