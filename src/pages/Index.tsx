import * as ort from 'onnxruntime-web';

const Home = () =>
  <div className='container'>
    <section>
      <h2>the data</h2>
      <p>
        Hi!
      </p>
    </section>
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
