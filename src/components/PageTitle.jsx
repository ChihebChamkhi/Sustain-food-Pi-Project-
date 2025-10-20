import { useEffect } from 'react';

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = `${title} | SustainFood`;
  }, [title]);

  return null;
};

export default PageTitle;