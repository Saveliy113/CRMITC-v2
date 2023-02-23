import { useDispatch, useSelector } from 'react-redux';

import { onStudentSearch } from '../redux/slices/dataSlice';

import styles from './Search.module.css';

const Search = ({ searchData }) => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((store) => store.data.searchQuery);
  const setSearchQuery = (event) => {
    dispatch(onStudentSearch({ searchText: event.target.value, searchData }));
  };

  return (
    <div className={styles.search__container}>
      <label htmlFor="search" id="">
        Search:
      </label>
      <input
        onChange={setSearchQuery}
        id="search"
        type="text"
        value={searchQuery}
      />
    </div>
  );
};

export default Search;
