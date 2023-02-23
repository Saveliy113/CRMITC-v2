import { Routes, Route } from 'react-router-dom';

import Menu from './components/Menu';
import Main from './pages/Main';
import Branches from './pages/Branches';
import Courses from './pages/Courses';
import CourseInfo from './pages/CourseInfo';
import Students from './pages/Students';
import Payments from './pages/Payments';
import Button from './ui/Button';
import Loader from './ui/Loader';
import LoginForm from './components/LoginForm';
import RowsSlicer from './ui/RowsSlicer';
import Search from './ui/Search';
import { CSSTransition } from 'react-transition-group';

import './App.css';
import Header from './components/Header';
import { useState } from 'react';
import NotFound from './pages/NotFound';
import StudentInfo from './pages/StudentInfo';
import ModalLoader from './ui/ModalLoader';

function App() {
  return (
    <div className="App">
      <Menu />
      <LoginForm />
      <div className="content">
        <Header />
        {/* <div className="table__actions-box">
          <RowsSlicer />
          <Search />
        </div> */}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course" element={<CourseInfo />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/student" element={<StudentInfo />} />
          <Route path="/Payments" element={<Payments />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <ModalLoader /> */}
      </div>
    </div>
  );
}

export default App;
