import {
  useGetCoursesQuery,
  useGetStudentsQuery,
} from '../../services/dataApi';

//ICONS
import { RiBook2Fill, RiCalendarTodoFill } from 'react-icons/ri';
import { MdSchool } from 'react-icons/md';
import { FaCashRegister } from 'react-icons/fa';
import { HiOutlineCash } from 'react-icons/hi';
import { BsCalendar2Month } from 'react-icons/bs';

import useErrorHandler from '../../hooks/useErrorHandler';

import styles from './Statistics.module.css';
import Loader from '../../ui/Loader';

const Statistics = () => {
  const {
    data: students,
    isSuccess: studentsIsSuccess,
    error: studentsError,
  } = useGetStudentsQuery();

  const {
    data: courses,
    isSuccess: coursesIsSuccess,
    error: coursesError,
  } = useGetCoursesQuery();

  useErrorHandler([studentsError, coursesError]);

  console.log(courses);
  console.log(students);

  const currency = students ? students[0].currency : '';
  const studentsStudies = students?.filter((student) => student.studies).length;
  const activeCourses = courses?.filter((course) => course.is_active).length;
  const paymentsAmount = students?.reduce(
    (sum, student) => sum + student.full_payment,
    0
  );
  const overallPaid = students?.reduce(
    (sum, student) => sum + student.payment,
    0
  );
  const monthRemainders = students?.reduce(
    (sum, student) => sum + student.remainder_for_current_mount,
    0
  );
  const overallRemainders = students?.reduce(
    (sum, student) => sum + student.remainder,
    0
  );

  console.log(studentsStudies);
  console.log(activeCourses);
  console.log(paymentsAmount);

  return studentsIsSuccess && coursesIsSuccess ? (
    <div className={styles.cards__wrapper}>
      <div className={styles.statistics__card}>
        <div className={styles.card__header}>
          <RiBook2Fill />
        </div>
        <div className={styles.card__content}>
          <p className={styles.statistics__descr}>Идет курсов</p>
          <p className={styles.statistics__number}>{activeCourses}</p>
        </div>
      </div>

      <div className={styles.statistics__card}>
        <div className={styles.card__header}>
          <MdSchool />
        </div>
        <div className={styles.card__content}>
          <p className={styles.statistics__descr}>Учится студентов</p>
          <p className={styles.statistics__number}>{studentsStudies}</p>
        </div>
      </div>

      <div className={styles.statistics__card}>
        <div className={styles.card__header}>
          <FaCashRegister />
        </div>
        <div className={styles.card__content}>
          <p className={styles.statistics__descr}>Всего сумма</p>
          <p
            className={styles.statistics__number}
          >{`${paymentsAmount.toLocaleString()} ${currency}`}</p>
        </div>
      </div>

      <div className={styles.statistics__card}>
        <div className={styles.card__header}>
          <HiOutlineCash />
        </div>
        <div className={styles.card__content}>
          <p className={styles.statistics__descr}>Оплачено</p>
          <p
            className={styles.statistics__number}
          >{`${overallPaid.toLocaleString()} ${currency}`}</p>
        </div>
      </div>

      <div className={styles.statistics__card}>
        <div className={styles.card__header}>
          <RiCalendarTodoFill />
        </div>
        <div className={styles.card__content}>
          <p className={styles.statistics__descr}>Задолженности всего</p>
          <p
            className={styles.statistics__number}
          >{`${overallRemainders.toLocaleString()} ${currency}`}</p>
        </div>
      </div>

      <div className={styles.statistics__card}>
        <div className={styles.card__header}>
          <BsCalendar2Month />
        </div>
        <div className={styles.card__content}>
          <p className={styles.statistics__descr}>
            Задолженности в этом месяце
          </p>
          <p
            className={styles.statistics__number}
          >{`${monthRemainders.toLocaleString()} ${currency}`}</p>
        </div>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default Statistics;
