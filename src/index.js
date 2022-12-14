import { React } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

if (process.env.NODE_ENV === 'production') disableReactDevTools();

const queryClient = new QueryClient({
  defaultOptions: { queries: {staleTime: Infinity}}
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App queryClient={queryClient}/>
      </QueryClientProvider>
    </BrowserRouter>
);


