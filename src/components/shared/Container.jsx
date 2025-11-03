import React from 'react';
import clsx from 'clsx'; 

const Container = ({ children, className }) => {
  return (
    <div className={clsx('max-w-7xl px-4  mx-auto', className)}>
      {children}
    </div>
  );
};

export default Container;
