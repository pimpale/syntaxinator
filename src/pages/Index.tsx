
const Home = () =>
   <div>
     Hi
   </div>


import React from 'react';
import { createRoot } from 'react-dom/client';

import ReactDOM from 'react-dom';

// Bootstrap CSS & JS
import '../styles/style.scss';
import 'bootstrap/dist/js/bootstrap';
import { transform } from 'typescript';

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
);
