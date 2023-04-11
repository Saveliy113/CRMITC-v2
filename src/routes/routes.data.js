//PAGES
import Branches from '../pages/branches/Branches';
import CountryeDetails from '../pages/branches/countryDetails/CountryDetails';
import BrancheDetails from '../pages/branches/brancheDetails/BrancheDetails';
import ClientDetails from '../pages/ClientDetails';
import CourseInfo from '../pages/CourseInfo';
import Courses from '../pages/Courses';
import Direction from '../pages/Direction';
import Main from '../pages/Main';
import MentorDetails from '../pages/MentorDetails';
import NotFound from '../pages/NotFound';
import PaymentDetails from '../pages/PaymentDetails';
import Payments from '../pages/Payments';
import RecruiterDetails from '../pages/RecruiterDetails';
import StudentInfo from '../pages/StudentInfo';
import Students from '../pages/Students';
import TrailLesson from '../pages/TrailLesson';
import TrailLessons from '../pages/TrailLessons';

export const routes = [
  {
    path: '/',
    component: Main,
  },
  {
    path: '/branches',
    component: Branches,
  },
  {
    path: '/branches/:country_details',
    component: CountryeDetails,
  },
  {
    path: '/branches/:country_details/:branche_details',
    component: BrancheDetails,
  },
  {
    path: '/recruiter',
    component: RecruiterDetails,
  },
  {
    path: '/mentor',
    component: MentorDetails,
  },
  {
    path: '/trail_lessons',
    component: TrailLessons,
  },
  {
    path: '/trail_lessons/trail_lesson',
    component: TrailLesson,
  },
  {
    path: '/client_details',
    component: ClientDetails,
  },
  {
    path: '/direction',
    component: Direction,
  },
  {
    path: '/courses',
    component: Courses,
  },
  {
    path: '/courses/course',
    component: CourseInfo,
  },
  {
    path: '/course',
    component: CourseInfo,
  },
  {
    path: '/students',
    component: Students,
  },
  {
    path: '/students/student',
    component: StudentInfo,
  },
  {
    path: '/payments',
    component: Payments,
  },
  {
    path: '/payments/payment',
    component: PaymentDetails,
  },
  {
    path: '*',
    component: NotFound,
  },
];
