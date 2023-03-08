//REACT
import { useDispatch, useSelector } from 'react-redux';

//REDUX
import { onSearch } from '../redux/slices/dataSlice';

//CSS
import styles from './Search.module.css';

const Search = ({ placeholder, searchData }) => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((store) => store.data.searchQuery);

  const setSearchQuery = (event) => {
    dispatch(onSearch({ searchText: event.target.value, searchData }));
  };

  return (
    <div className={styles.search__container}>
      <label htmlFor="search">Поиск:</label>
      <input
        onChange={setSearchQuery}
        id="search"
        type="text"
        value={searchQuery}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Search;
