//REACt
import { Routes, Route } from "react-router-dom";

//COMPONENTS
import Header from "./components/Header";
import Menu from "./components/Menu";
import LoginForm from "./components/LoginForm";

//PAGES
import Main from "./pages/Main";
import CountryDetail from "./pages/CountryDetails";
import Branches from "./pages/Branches";
import BrancheDetails from "./pages/BrancheDetails";
import Direction from "./pages/Direction";
import TrailLessons from "./pages/TrailLessons";
import TrailLesson from "./pages/TrailLesson";
import ClientDetails from "./pages/ClientDetails";
import RecruiterDetails from "./pages/RecruiterDetails";
import MentorDetails from "./pages/MentorDetails";
import Courses from "./pages/Courses";
import CourseInfo from "./pages/CourseInfo";
import Students from "./pages/Students";
import StudentInfo from "./pages/StudentInfo";
import Payments from "./pages/Payments";
import PaymentDetails from "./pages/PaymentDetails";
import NotFound from "./pages/NotFound";

//CSS
import "./App.css";

function App() {
  return (
    <div className="App">
      <Menu />
      <LoginForm />
      <div className="content">
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="branches/:country_details" element={<CountryDetail />} />
          <Route
            path="/branches/:country_details/:branche_details/*"
            element={<BrancheDetails />}
          />
          <Route path="/recruiter" element={<RecruiterDetails />} />
          <Route path="/mentor" element={<MentorDetails />} />
          <Route path="/trail_lessons" element={<TrailLessons />} />
          <Route path="/trail_lessons/trail_lesson" element={<TrailLesson />} />
          <Route path="/client_details" element={<ClientDetails />} />
          <Route path="/direction" element={<Direction />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/course" element={<CourseInfo />} />
          <Route path="/course" element={<CourseInfo />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/student" element={<StudentInfo />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/payments/payment" element={<PaymentDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
