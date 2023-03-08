//REACt
import { Routes, Route } from 'react-router-dom';

//COMPONENTS
import Header from './components/Header';
import Menu from './components/Menu';
import LoginForm from './components/LoginForm';

//PAGES
import Main from './pages/Main';
import CountryDetail from './pages/CountryDetails';
import Branches from './pages/Branches';
import BrancheDetails from './pages/BrancheDetails';
import Direction from './pages/Direction';
import TrailLessons from './pages/TrailLessons';
import ClientDetails from './pages/ClientDetails';
import RecruiterDetails from './pages/RecruiterDetails';
import MentorDetails from './pages/MentorDetails';
import Courses from './pages/Courses';
import CourseInfo from './pages/CourseInfo';
import Students from './pages/Students';
import StudentInfo from './pages/StudentInfo';
import Payments from './pages/Payments';
import PaymentDetails from './pages/PaymentDetails';
import NotFound from './pages/NotFound';

//CSS
import './App.css';
import TrailLesson from './pages/TrailLesson';

function App() {
  return (
    <div className="App">
      <Menu />
      <LoginForm />
      <div className="content">
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/country_details" element={<CountryDetail />} />
          <Route path="/recruiter" element={<RecruiterDetails />} />
          <Route path="/mentor" element={<MentorDetails />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="branche_details/*" element={<BrancheDetails />} />
          <Route path="/trail_lessons" element={<TrailLessons />} />
          <Route path="/trail_lesson" element={<TrailLesson />} />
          <Route path="/client_details" element={<ClientDetails />} />
          <Route path="/direction" element={<Direction />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course" element={<CourseInfo />} />
          <Route path="/students" element={<Students />} />
          <Route path="/student" element={<StudentInfo />} />
          <Route path="/courses/course" element={<CourseInfo />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/payment" element={<PaymentDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
