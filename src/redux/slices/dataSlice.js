import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  page: '',
  fetchData: [],
  currentData: [],
  pageCount: 0,
  currentPageIndex: 0,
  itemsPerPage: 10,
  itemOffset: 0,
  endOffset: 0,
  searchQuery: '',
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setFetchData(state, action) {
      console.log(action.payload);
      state.page = action.payload.page;
      state.fetchData = action.payload.data;
      // console.log(state.fetchData)
      state.pageCount = Math.ceil(state.fetchData.length / state.itemsPerPage);
      console.log(state.itemsPerPage);
      // state.itemsPerPage = 10
      console.log(state.fetchData.length);
      console.log(state.pageCount);
      console.log(state.pageCount);
      state.endOffset = state.itemOffset + state.itemsPerPage;
      state.currentData = state.fetchData.slice(
        state.itemOffset,
        state.endOffset
      );
    },
    changePage(state, action) {
      state.searchQuery = '';
      state.currentPageIndex = action.payload;
      state.itemOffset = action.payload * state.itemsPerPage;
      state.endOffset = state.itemOffset + state.itemsPerPage;
      state.currentData = state.fetchData.slice(
        state.itemOffset,
        state.endOffset
      );
    },
    changeItemsPerPage(state, action) {
      state.searchQuery = '';
      // console.log('ACTION PAYLOAD', typeof action.payload);
      if (action.payload === Infinity) {
        console.log('INFINITY TRUE');
        state.currentData = state.fetchData;
        state.pageCount = 0;
        state.itemOffset = 0;
        state.endOffset = state.fetchData.length - 1;
        state.itemsPerPage = Infinity;
      } else {
        state.itemsPerPage = action.payload;
        state.currentPageIndex = 0;
        state.itemOffset = state.currentPageIndex * state.itemsPerPage;
        state.pageCount = Math.ceil(
          state.fetchData.length / state.itemsPerPage
        );
        state.endOffset = Number(state.itemOffset + state.itemsPerPage);
        state.currentData = state.fetchData.slice(
          state.itemOffset,
          state.endOffset
        );
      }
    },
    clearItemsPerPage(state) {
      state.itemsPerPage = 10;
      state.itemOffset = 0;
      state.endOffset = state.itemOffset + state.itemsPerPage;
      state.currentPageIndex = 0;
      state.pageCount = Math.ceil(state.fetchData.length / state.itemsPerPage);
      state.currentData = state.fetchData.slice(
        state.itemOffset,
        state.endOffset
      );
    },
    onSearch(state, action) {
      if (!action.payload.searchText) {
        state.searchQuery = '';
        state.pageCount = Math.ceil(
          state.fetchData.length / state.itemsPerPage
        );
        state.currentData = state.fetchData.slice(
          state.itemOffset,
          state.endOffset
        );
      } else {
        state.searchQuery = action.payload.searchText;
        state.pageCount = 0;
        state.currentData = state.fetchData
          // .slice(state.itemOffset, state.endOffset)
          .filter((data) => {
            switch (state.page) {
              case 'branches':
                return data.name
                  .toLowerCase()
                  .includes(action.payload.searchText.toLowerCase());
              case 'trail_lessons':
                return data.title
                  .toLowerCase()
                  .includes(action.payload.searchText.toLowerCase());
              case 'courses':
                return data.title
                  .toLowerCase()
                  .includes(action.payload.searchText.toLowerCase());
              case 'students':
                return data.full_name
                  .toLowerCase()
                  .includes(action.payload.searchText.toLowerCase());
              case 'payments':
                if (action.payload.searchData) {
                  const searchText = action.payload.searchText;
                  const relevantStudents = action.payload.searchData.filter(
                    (student) =>
                      student.full_name.toLowerCase().includes(searchText)
                  );
                  const relevantStudentsId = relevantStudents.map(
                    (student) => student.id
                  );
                  return relevantStudentsId.includes(data.student);
                }
            }
          });
      }
    },
    clearData(state) {
      state.page = '';
      state.fetchData = [];
      state.currentData = [];
      state.pageCount = 0;
      state.itemsPerPage = 0;
      state.itemOffset = 0;
      state.endOffset = 0;
    },
  },
});

export const {
  setFetchData,
  setCurrentItems,
  changePage,
  clearData,
  clearItemsPerPage,
  changeItemsPerPage,
  onSearch,
} = dataSlice.actions;

export default dataSlice.reducer;
