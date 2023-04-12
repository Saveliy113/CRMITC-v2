//PAGES
import Branches from '../pages/branches/Branches';
import CountryeDetails from '../pages/branches/countryDetails/CountryDetails';
import BrancheDetails from '../pages/branches/brancheDetails/BrancheDetails';
import ClientDetails from '../pages/ClientDetails';
import CourseInfo from '../pages/courses/courseDetails/CourseInfo';
import Courses from '../pages/courses/Courses';
import Direction from '../pages/direction/Direction';
import Main from '../pages/Main';
import MentorDetails from '../pages/MentorDetails';
import NotFound from '../pages/NotFound';
import PaymentDetails from '../pages/payments/paymentDetails/PaymentDetails';
import Payments from '../pages/payments/Payments';
import RecruiterDetails from '../pages/RecruiterDetails';
import StudentInfo from '../pages/students/studentDetails/StudentInfo';
import Students from '../pages/students/Students';
import TrailLesson from '../pages/trailLessons/trailLessonDetails/TrailLesson';
import TrailLessons from '../pages/trailLessons/TrailLessons';

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
