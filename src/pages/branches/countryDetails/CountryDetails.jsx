//REACT
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import useErrorHandler from '../../../hooks/useErrorHandler';

//REDUX
import { setFetchData } from '../../../redux/slices/dataSlice';
import { useGetBranchesQuery } from '../../../services/dataApi';

//COMPONENTS
import CountryDetailsTable from './CountryDetailsTable';
import RowsSlicer from '../../../ui/RowsSlicer';
import Loader from '../../../ui/Loader';
import Pagination from '../../../ui/Pagination';

const CountryDetail = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const currentPage = useSelector((store) => store.data.page);
  const countryId = Number(searchParams.get('id'));
  const country = searchParams.get('country');

  //-----------------------DATA-------------------------//

  const {
    data: branchesData,
    isSuccess: branchesIsSuccess,
    error: branchesError,
  } = useGetBranchesQuery();

  useEffect(() => {
    if (branchesIsSuccess) {
      dispatch(
        setFetchData({
          page: 'branches',
          data: branchesData.filter((branche) => branche.country === countryId),
        })
      );
    }
  }, [branchesIsSuccess]);

  useErrorHandler([branchesError]); //QUERIES ERRORS HANDLING

  const branches = useSelector((store) => store.data.currentData);

  //----------------------------------------------------//

  return (
    <>
      <h1>{country}</h1>
      {branchesIsSuccess ? (
        <>
          <div className="table__actions-box">
            <RowsSlicer />
          </div>
          <div className="table__box">
            <CountryDetailsTable
              currentPage={currentPage}
              branches={branches}
            />
            <Pagination />
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default CountryDetail;
