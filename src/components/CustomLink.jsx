import React from 'react';
import { Link, useMatch } from 'react-router-dom';

const CustomLink = ({ children, to, ...props }) => {
  const match = useMatch({
    path: to,
    end: to.length === 1,
  });

  return (
    <Link to={to} className={match ? 'a active' : 'a'} {...props}>
      {children}
    </Link>
  );
};

export default CustomLink;
