import React from 'react';
import * as ort from 'onnxruntime-web';
import Async from 'react-async';


import MnistOnnxUrl from '../assets/mnist.onnx?url';

type MnistOnnxToolProps = {
  model: ort.InferenceSession
}

type MnistOnnxToolState = {
}

class MnistOnnxTool extends React.Component<MnistOnnxToolProps, MnistOnnxToolState> {

  constructor(props: MnistOnnxToolProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='card'>
        <div className='card-body'>
          <h5 className='card-title'>onnxruntime-web</h5>
          <p className='card-text'>
            This is a demo of running mnist model with onnxruntime-web.
          </p>
          <form>
            <div className='mb-3'>
              <label htmlFor='input' className='form-label'>Pick a file to classify</label>
              <input className='form-control' type='file' id='file' />
            </div>
            <button type='button' onClick=className='btn btn-primary'>Submit</button>
          </form>
        </div>
      </div>
    );
  }
}


const Home = () =>
  <div className='container'>
    <section>
      <h2>the data</h2>
      <p>
        Hi!
      </p>
      <div>
        <Async promise={ort.InferenceSession.create(MnistOnnxUrl)}>
          <Async.Loading>Loading...</Async.Loading>
          <Async.Resolved<ort.InferenceSession>>{(model) => <MnistOnnxTool model={model} />}</Async.Resolved>
        </Async>
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
