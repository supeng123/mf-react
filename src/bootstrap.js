import React, { lazy, Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import ErrorPage from './error-page';
import Index from './firstpage';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material/styles';
const theme = extendTheme({ cssVarPrefix: 'hostReact' });

const RemoteAppLazy = lazy(()  => import('./module/AppModule'))

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          errorElement: <ErrorPage />,
          children: [
            { index: true, element: <Index /> },
            {
              path: 'products',
              Component: RemoteAppLazy,
            },
            {
              path: 'contact',
              lazy: () => import('./firstpage')
            },
          ]
        }
      ]
    },
    {
      path: '/contacts',
      element: <Index />,
      errorElement: <ErrorPage />,
    },
  ]
)


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssVarsProvider theme={theme} defaultMode="dark"> 
    <Suspense fallback={<div>loading ....</div>}>
      <RouterProvider router={router} />
    </Suspense>
    </CssVarsProvider>
  </React.StrictMode>,
)




