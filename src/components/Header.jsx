import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RiLogoutBoxLine } from 'react-icons/ri';

import Button from '../ui/Button';
import ItcLogo from '../assets/img/ITClogoW.png';
import { toggleLoginForm, clearUserData } from '../redux/slices/loginFormSlice';
import { useLogOutMutation } from '../services/authApi';

import '../css/components/Header.css';
import { useEffect } from 'react';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useSelector((store) => store.login.username);
  const token = useSelector((store) => store.login.token);

  const loginFormOpen = () => {
    dispatch(toggleLoginForm());
  };

  const [logOut, { isSuccess, isError }] = useLogOutMutation();
  const userExit = async () => {
    await logOut(token).unwrap();
  };
  // console.log('Header ISSUCCESS ' + isSuccess);

  function actionsAfterExit() {
    if (isSuccess) {
      // console.log('ActionsAfterExit');
      dispatch(clearUserData());
      navigate('/');
    }
  }

  useEffect(() => {
    // console.log('Header useeffect');
    actionsAfterExit();
  }, [isSuccess]);

  return (
    <div className="header">
      <Link to="/">
        <img src={ItcLogo} alt="ITClogo" />
      </Link>

      {username ? (
        <div>
          <p>Hello, {username}</p>
          <p className="exit__btn" onClick={userExit}>
            <RiLogoutBoxLine /> Logout
          </p>
        </div>
      ) : (
        <Button text="Login" action={loginFormOpen} />
      )}
    </div>
  );
};

export default Header;
