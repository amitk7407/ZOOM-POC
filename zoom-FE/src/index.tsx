import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { App } from './App';
import { StartMeeting } from './StartMeeting';

import "bootstrap/dist/css/bootstrap.css";
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/meeting', element: <StartMeeting /> }
])

root.render(
  <RouterProvider router={router} />
);

