import React from 'react';
import MnistOnnxDemo from '../components/MnistOnnxDemo'

const Home = () =>
  <div className='container'>
    <section>
      <h2>the data</h2>
      <p>
        Hi!
      </p>
      <div>
        <MnistOnnxDemo />
      </div>
    </section>
  </div>


import { createRoot } from 'react-dom/client';

import ReactDOM from 'react-dom';

// Bootstrap CSS & JS
import '../styles/style.scss';
import 'bootstrap/dist/js/bootstrap';

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
);
