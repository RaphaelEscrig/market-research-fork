import { useEffect, useState } from 'react';

const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const storageApiKey = localStorage.getItem('apiKey');
    const paramsApiKey = new URLSearchParams(window.location.search).get('api_key');

    if (paramsApiKey) {
      setApiKey(paramsApiKey);
      localStorage.setItem('apiKey', paramsApiKey);
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      setApiKey(storageApiKey);
    }
  }, []);

  return {
    apiKey,
    setApiKey,
  };
};

export default useApiKey;
