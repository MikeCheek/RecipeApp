import {createContext, useContext} from 'react';

interface ILoaderContext {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const LoaderContext = createContext<ILoaderContext>({
  visible: false,
  setVisible: () => null,
});

export {LoaderContext};
export default () => useContext(LoaderContext);
