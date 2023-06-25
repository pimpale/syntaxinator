import React from 'react';
import * as ort from 'onnxruntime-web';
import Async from 'react-async';


import MnistOnnxUrl from '../assets/mnist.onnx?url';

type MnistOnnxToolProps = {
  model: ort.InferenceSession
}

type MnistOnnxToolState = {
  modelGuess: number | null
}

class MnistOnnxTool extends React.Component<MnistOnnxToolProps, MnistOnnxToolState> {

  // this is the ref to the file picker
  private filepicker = React.createRef<HTMLInputElement>();

  // canvas element
  private canvas = React.createRef<HTMLCanvasElement>();

  // button element
  private button = React.createRef<HTMLButtonElement>();

  // model guess

  constructor(props: MnistOnnxToolProps) {
    super(props);
    this.state = {
      modelGuess: null
    };
  }

  doDraw = async () => {
    // retrieve image file from file picker
    const file = this.filepicker.current!.files![0];
    // create a new image element
    const img = new Image();
    // set the image element src to the file url
    img.src = URL.createObjectURL(file);
    // get the canvas context
    const ctx = this.canvas.current!.getContext('2d')!;
    // when the image is loaded, draw the image on the canvas
    await img.decode();
    ctx.drawImage(img, 0, 0, 28, 28);
  }

  doInference = async () => {
    const ctx = this.canvas.current!.getContext('2d')!;
    // get the image data from the canvas
    const imageData = ctx.getImageData(0, 0, 28, 28);
    // get the grayscale data from the image data
    const data = new Float32Array(28 * 28);
    for (let i = 0; i < 28 * 28; i++) {
      const j = i * 4;
      data[i] = (imageData.data[j] + imageData.data[j + 1] + imageData.data[j + 2]) / 3 / 255;
    }
    // create a tensor from the data
    const inputTensor = new ort.Tensor('float32', data, [1, 1, 28, 28]);
    // run inference with the tensor
    const outputMap = await this.props.model.run({ input: inputTensor });
    // get the output tensor
    const outputTensor = outputMap.output
    // get the data from the tensor
    const outputData = outputTensor.data as Float32Array;
    // get the max value from the output data
    const maxValue = Math.max(...outputData);
    // get the index of the max value
    const maxIndex = outputData.indexOf(maxValue);
    // log the result
    console.log(maxIndex);
    this.setState({ modelGuess: maxIndex });
  }

  render() {
    return (
      <div className='card'>
        <div className='card-body'>
          <h5 className='card-title'>onnxruntime-web</h5>
          <p className='card-text'>
            This is a demo of running mnist model with onnxruntime-web.
          </p>
          <form
            className='mb-3'
            onSubmit={(event) => {
              event.preventDefault();
              this.doInference();
            }}>
            <div className='mb-3'>
              <label htmlFor='input' className='form-label'>Pick a file to classify</label>
              <input className='form-control' type='file' ref={this.filepicker} onChange={() => this.doDraw()} />
            </div>
            <div className='mb-3'>
              <canvas ref={this.canvas} className="border border-dark" style={{ 'width': '15rem', 'height': '15rem' }} width={28} height={28} />
            </div>
            <button ref={this.button} type='submit' className='btn btn-primary'>
              Submit
            </button>
          </form>
          {this.state.modelGuess !== null
            ? <div className='alert alert-dark' role='alert'>
              <h4 className='alert-heading'>Model's Guess:</h4>
              <hr />
              <p>{this.state.modelGuess}</p>
            </div>
            : null
          }
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
