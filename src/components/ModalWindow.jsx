//REACT
import React from 'react';

//ICONS
import { RiCloseCircleLine } from 'react-icons/ri';

//COMPONENTS
import Button from '../ui/Button';

const ModalWindow = ({ opened, action, children, title }) => {
  return (
    <div className={`modal__container ${opened ? '' : 'ifHidden'}`}>
      <div className={`modal__window ${opened ? '' : 'ifHidden'}`}>
        <div id="modal__close">
          <RiCloseCircleLine onClick={action} />
        </div>
        <h1>{title}</h1>
        {React.Children.map(children, (child) => {
          return child;
        })}
      </div>
    </div>
  );
};

export default ModalWindow;
