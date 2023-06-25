import React from 'react';
import * as ort from 'onnxruntime-web';
import Async from 'react-async';


import MnistOnnxUrl from '../assets/mnist.onnx?url';

type MnistOnnxDemoProps = {
    model: ort.InferenceSession
}

type MnistOnnxDemoState = {
    pickerState: "empty" | "loading" | "error" | "drawn";
    modelGuess: number | null;
    error: string | null;
}

class MnistOnnxDemoInner extends React.Component<MnistOnnxDemoProps, MnistOnnxDemoState> {

    // this is the ref to the file picker
    private filepicker = React.createRef<HTMLInputElement>();

    // canvas element
    private canvas = React.createRef<HTMLCanvasElement>();

    constructor(props: MnistOnnxDemoProps) {
        super(props);
        this.state = {
            pickerState: "empty",
            modelGuess: null,
            error: null
        };
    }

    doDraw = async () => {
        this.setState({ pickerState: "loading" });
        // retrieve image file from file picker
        const file = this.filepicker.current!.files![0];
        // create a new image element
        const img = new Image();
        // set the image element src to the file url
        img.src = URL.createObjectURL(file);
        // get the canvas context
        const ctx = this.canvas.current!.getContext('2d')!;
        // when the image is loaded, draw the image on the canvas
        try {
            await img.decode();
            ctx.drawImage(img, 0, 0, 28, 28);
            this.setState({ pickerState: "drawn", error: null });
        } catch (e: any) {
            console.log(e);
            this.setState({
                pickerState: "error",
                error: e.message
            });
        }
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
                            <input className={['form-control', this.state.error === null ? '' : 'is-invalid'].join(' ')} type='file' ref={this.filepicker} onChange={() => this.doDraw()} />
                            <div className='invalid-feedback'>
                                {this.state.error}
                            </div>
                        </div>
                        <div className='mb-3'>
                            <canvas ref={this.canvas} className="border border-dark" style={{ 'width': '15rem', 'height': '15rem' }} width={28} height={28} />
                        </div>
                        <button type='submit' className='btn btn-primary' disabled={this.state.pickerState !== 'drawn'}>
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

function MnistOnnxDemo(props: MnistOnnxDemoProps) {
    return (
        <Async promise={ort.InferenceSession.create(MnistOnnxUrl)}>
            <Async.Loading>Loading...</Async.Loading>
            <Async.Resolved<ort.InferenceSession>>{(model) => <MnistOnnxDemoInner model={model} />}</Async.Resolved>
        </Async>
    );
}

export default MnistOnnxDemo;