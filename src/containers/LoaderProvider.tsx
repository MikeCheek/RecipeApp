import PageLoader from 'components/PageLoader';
import {LoaderContext} from 'helpers/useLoaderContext';
import React, {useState} from 'react';

const LoaderProvider = ({children}: {children: React.ReactNode}) => {
  const [showLoader, setShowLoader] = useState<boolean>(false);

  return (
    <LoaderContext.Provider
      value={{visible: showLoader, setVisible: setShowLoader}}>
      {children}
      <PageLoader visible={showLoader} />
    </LoaderContext.Provider>
  );
};

export default LoaderProvider;
