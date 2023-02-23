import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  RiHome4Fill,
  RiMapPin2Fill,
  RiBook2Fill,
  RiUser3Fill,
  RiMoneyDollarCircleFill,
} from 'react-icons/ri';

import ItcLogo from '../assets/img/ITClogoW.png';

import '../css/components/Menu.css';
import { useSelector } from 'react-redux';

const Menu = () => {
  const isLoged = useSelector((store) => store.login.token);
  const blockedStyles = {
    pointerEvents: 'none',
    color: 'rgba(114, 114, 114, 0.5)',
  };
  return (
    <aside>
      <NavLink id="logo" to="/">
        <img src={ItcLogo} alt="ITClogo" />
      </NavLink>

      <div className="menu">
        <NavLink className="a" to="/">
          <RiHome4Fill />
          <h3>Главная</h3>
        </NavLink>
        <NavLink
          className="a"
          to="/branches"
          style={isLoged ? {} : blockedStyles}
        >
          <RiMapPin2Fill />
          <h3>Филиалы</h3>
        </NavLink>
        <NavLink
          className="a"
          to="/courses"
          style={isLoged ? {} : blockedStyles}
        >
          <RiBook2Fill />
          <h3>Курсы</h3>
        </NavLink>
        <NavLink
          className="a"
          to="/students"
          style={isLoged ? {} : blockedStyles}
        >
          <RiUser3Fill />
          <h3>Студенты</h3>
        </NavLink>
        <NavLink
          className="a"
          to="/payments"
          style={isLoged ? {} : blockedStyles}
        >
          <RiMoneyDollarCircleFill />
          <h3>Оплаты</h3>
        </NavLink>
        <div className="indicator"></div>
      </div>
    </aside>
  );
};

export default Menu;
