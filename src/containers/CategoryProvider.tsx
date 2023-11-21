import {CategoryContext} from 'helpers/useCategoryContext';
import React, {useState} from 'react';

const CategoryProvider = ({children}: {children: React.ReactNode}) => {
  const [active, setActive] = useState<string>('Beef');
  const [clicked, setClicked] = useState<boolean>(false);

  return (
    <CategoryContext.Provider
      value={{
        active: active,
        setActive: setActive,
        clicked: clicked,
        setClicked: setClicked,
      }}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;
