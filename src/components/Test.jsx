import React from 'react';
import ErrorBoundary from './ErrorBoundary';

const Test = ({ hasError }) => {
  if (hasError) {
    // throw new Error('ERROR!!!');
  }
  return <div>test</div>;
};

export default Test;
