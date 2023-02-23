import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setFetchData } from '../redux/slices/dataSlice';
import { useGetBranchesQuery, useGetCountriesQuery } from '../services/dataApi';
import Pagination from '../ui/Pagination';
import RowsSlicer from '../ui/RowsSlicer';
import Search from '../ui/Search';
import '../css/pages/Students.css';
import styles from '../ui/Table.module.css';
import Loader from '../ui/Loader';

const Branches = () => {
  const dispatch = useDispatch();
  const columns = ['Страна', 'Город', 'Адрес'];
  const currentPage = useSelector((store) => store.data.page);

  const { data, isSuccess: branchesIsSuccess } = useGetBranchesQuery();
  const { data: countries, isSuccess: countriesIsSuccess } =
    useGetCountriesQuery();

  useEffect(() => {
    branchesIsSuccess && dispatch(setFetchData({ page: 'branches', data }));
  }, [branchesIsSuccess]);

  const branches = useSelector((store) => store.data.currentData);
  const tableTh = columns.map((item, index) => <th key={index}>{item}</th>);
  const tableTr =
    currentPage === 'branches' &&
    branches &&
    branches.map((branche, index) => {
      return (
        <tr key={index}>
          <td data-label="Страна">
            {countriesIsSuccess &&
              countries.map((country) =>
                country.id === branche.country ? country.name : ''
              )}
          </td>
          <td data-label="Город">{branche.city}</td>
          <td data-label="Адресс">{branche.address}</td>
        </tr>
      );
    });

  return (
    <>
      {tableTr && branchesIsSuccess && countriesIsSuccess ? (
        <>
          <div className="table__actions-box">
            <RowsSlicer />
            <Search />
          </div>
          <div className="table__box">
            <table className={styles.table}>
              <thead>
                <tr>{tableTh}</tr>
              </thead>
              <tbody>{tableTr}</tbody>
            </table>
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
