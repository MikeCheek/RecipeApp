import {createContext, useContext} from 'react';

interface ICategoryContext {
  active: string;
  setActive: (active: string) => void;
  clicked: boolean;
  setClicked: (clicked: boolean) => void;
}

const CategoryContext = createContext<ICategoryContext>({
  active: 'Beef',
  setActive: () => null,
  clicked: false,
  setClicked: () => null,
});

export {CategoryContext};
export default () => useContext(CategoryContext);
