//REACT
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

//REDUX
import { useLogOutMutation } from '../services/authApi';
import { toggleLoginForm, clearUserData } from '../redux/slices/loginFormSlice';

//ICONS
import { RiLogoutBoxLine } from 'react-icons/ri';

//COMPONENTS
import Button from '../ui/Button';
import ItcLogo from '../assets/img/ITClogoW.png';

//CSS
import '../css/components/Header.css';
import { clearData } from '../redux/slices/dataSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useSelector((store) => store.login.username);
  const token = useSelector((store) => store.login.token);

  const loginFormOpen = () => {
    dispatch(toggleLoginForm());
  };

  const [logOut, { isSuccess: logOutSuccess, isError: logOutIsError }] =
    useLogOutMutation();
  const userExit = async () => {
    await logOut(token).unwrap();
  };

  useEffect(() => {
    if (logOutSuccess || logOutIsError) {
      dispatch(clearUserData());
      navigate('/');
      dispatch(clearData());
    }
  }, [logOutSuccess, logOutIsError]);

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
