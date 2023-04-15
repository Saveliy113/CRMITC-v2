//REACT
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useErrorHandler from '../../hooks/useErrorHandler';

//COMPONENTS
import BranchesTable from './BranchesTable';
import Pagination from '../../ui/Pagination';
import RowsSlicer from '../../ui/RowsSlicer';
import Search from '../../ui/Search';
import Loader from '../../ui/Loader';

//REDUX
import { setFetchData } from '../../redux/slices/dataSlice';
import { useGetCountriesQuery } from '../../services/dataApi';

//CSS
import '../students/Students.css';

const Branches = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector((store) => store.data.page);

  //-----------------------DATA-------------------------//

  const {
    data: countriesData,
    isSuccess: countriesIsSuccess,
    isLoading: countriesIsLoading,
    isError,
    error,
  } = useGetCountriesQuery();

  useEffect(() => {
    if (countriesIsSuccess) {
      console.log('111');
      dispatch(setFetchData({ page: 'branches', data: countriesData }));
    }
  }, [countriesIsSuccess]);

  useErrorHandler([error]); //QUERIES ERRORS HANDLING

  const countries = useSelector((store) => store.data.currentData);

  //----------------------------------------------------//

  return (
    <>
      {countriesIsSuccess ? (
        <>
          <div className="table__actions-box">
            <RowsSlicer />
            <Search placeholder="Страна" />
          </div>
          <div className="table__box">
            <BranchesTable countries={countries} currentPage={currentPage} />
            <Pagination />
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Branches;
