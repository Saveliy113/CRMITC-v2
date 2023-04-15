//REACT
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

//COMPONENTS
import ItcLogo from '../assets/img/ITClogoW.png';

//ICONS
import {
  RiHome4Fill,
  RiMapPin2Fill,
  RiBook2Fill,
  RiUser3Fill,
  RiMoneyDollarCircleFill,
  RiComputerLine,
} from 'react-icons/ri';

//CSS
import '../css/components/Menu.css';
import CustomLink from './CustomLink';

const Menu = () => {
  const isLoged = useSelector((store) => store.login.token);
  const blockedStyles = {
    pointerEvents: 'none',
    color: 'rgba(0, 0, 0, 0.4)',
  };

  return (
    <aside>
      <NavLink id="logo" to="/">
        <img src={ItcLogo} alt="ITClogo" />
      </NavLink>

      <div className="menu">
        <CustomLink to="/">
          <RiHome4Fill />
          <h3>Главная</h3>
        </CustomLink>

        <CustomLink
          // className="a"
          to="/branches"
          style={isLoged ? {} : blockedStyles}
        >
          <RiMapPin2Fill />
          <h3>Филиалы</h3>
        </CustomLink>

        <CustomLink
          // className="a"
          to="/trail_lessons"
          style={isLoged ? {} : blockedStyles}
        >
          <RiComputerLine />
          <h3>Пробные уроки</h3>
        </CustomLink>

        <CustomLink
          // className="a"
          to="/courses"
          style={isLoged ? {} : blockedStyles}
        >
          <RiBook2Fill />
          <h3>Курсы</h3>
        </CustomLink>

        <CustomLink
          // className="a"
          to="/students"
          style={isLoged ? {} : blockedStyles}
        >
          <RiUser3Fill />
          <h3>Студенты</h3>
        </CustomLink>

        <CustomLink
          // className="a"
          to="/payments"
          style={isLoged ? {} : blockedStyles}
        >
          <RiMoneyDollarCircleFill />
          <h3>Оплаты</h3>
        </CustomLink>

        <div className="indicator"></div>
      </div>
    </aside>
  );
};

export default Menu;
