import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import './App.css';
import './assembly.min.css'
import './assembly.js'
import loading from './loading.gif'

const UPLOAD_URL = 'http://138.197.5.83:5000/api/v1/detect';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFile: null,
      uploadedFileUrl: '',
      result: null,
      draggedOver: false,
      loading: false
    };
  }

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0],
      draggedOver: false
    });

    this.setState({
      loading: true
    });

    this.handleImageUpload(files[0]);
  }

  onImageDragOver() {
    this.setState({
      draggedOver: true
    });
  }

  onImageDragLeave() {
    this.setState({
      draggedOver: false
    });
  }

  handleImageUpload(file) {

    this.setState({
      loading: true
    });
    let upload = request.post(UPLOAD_URL)
                     .field('image', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }
      console.log(response);

      var body = response.body || JSON.parse(response.text)

      if (body.data.output_image_link !== '') {
        this.setState({
          uploadedFileUrl: body.data.output_image_link,
          result: body,
          loading: false
        });
      }
    });
  }

  render() {
    return (
      <div>
      <div className="grid mt24 mb36">
        <div className="col--2">
        </div>
        <div className="header col--8 ">
        <h1> Trash Detector </h1>

        </div>
        <div className="col--2">
      </div>
      </div>

      <div className="grid">
      <div className="col--2">
      </div>
      <div className="col--8 mb12">

      <form>
        <div className="file_upload">
          <Dropzone  className={(this.state.draggedOver) ? "dropzone border--dash faint_ground":
           "dropzone border--dash"}
            onDrop={this.onImageDrop.bind(this)}
            onDragOver={this.onImageDragOver.bind(this)}
            onDragLeave={this.onImageDragLeave.bind(this)}
            multiple={false}
            accept="image/*">
            <div>Drop an image or click to select a file to upload.</div>
          </Dropzone>
        </div>

        <div>
          
        </div>
      </form>
      </div>
       <div className="col--2">
      </div>
      </div>
      <div className="grid">
        <div className="col submit">
        {this.state.uploadedFile === null ? null :
          <div >
            <h3 className="mb6 text-bold"> Uploaded Image</h3>
            <div className="imgbox">
            <img className="col--9 center-fit" src={this.state.uploadedFile.preview} />
            </div>
          </div>}
        </div>
        <div className="col--2">
        {this.state.loading? <img className="mt24" src={loading}/> : ""}
        {this.state.result === null ? null :
          <div>
            <h3 className="content mb6"> <span className="align-center">Content </span></h3>
            {this.state.result.data.trash_present?
             <div> 
             <h4 className="txt-bold center"> TRASH FOUND</h4>
             <span className="txt-bold"> Approximate Trash area: </span>

             <span>{this.state.result.data.trash_area / 10000} square metre </span> <br></br>
             <span className="txt-bold"> Total processing time:</span>
             <span> {this.state.result.time} </span>
             {/*<h4 className="fl"> Result Image url: {this.state.result.data.output_image_link} </h4> */}
             </div>:
            <h4 className="txt-bold"> NO TRASH FOUND </h4> }
          </div>
        }
        </div>
        <div className="col result">
          {this.state.uploadedFileUrl === '' ? null :
          <div>
            <h3 className="mb6 text-bold">Result Image</h3>
            
            <img className="col--9" src={this.state.uploadedFileUrl} />
          </div>}
        </div>

      </div>
       <div className="grid mt180 mb60">
         <div className="col--2">
         </div>
         <div className="footer col--8">
          &copy;  Resilient Dar 
         </div>
         <div className="col--2">
         </div>
       </div>
      </div>
    )
  }
}
