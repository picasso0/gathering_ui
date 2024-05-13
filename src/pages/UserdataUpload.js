// FileUpload.js
import React, { Component } from 'react';
import adminLayout from "../hoc/adminLayout";
import axios from 'axios';

class UploadUserdata extends Component {
  state = {
    file: null,
    error: '',
    loading: false,
  };
  

  handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/zip') {
      this.setState({ error: 'Only zip files are allowed.' });
    } else {
      this.setState({ file, error: '' });
      
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { file, loading } = this.state;

    if (!file) {
      this.setState({ error: 'Please select a file to upload.' });
      return;
    }

    try {
      const formData = new FormData();
      const accessToken = localStorage.getItem('accessToken');
      this.setState({loading: true });
      formData.append('file', file);

      await axios.post(process.env.REACT_APP_API_URL + '/upload_userdata/', formData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset the file input
      window.location.href = '/userdata';
      this.setState({ file: null, error: '', loading: false });

    } catch (error) {
      this.setState({ error: 'Error uploading the file.' });
    }
  };

  render() {
    const { file, error, loading } = this.state;
    if (loading) {
        return <div>Loading...</div>;
      }
    return (
        <div className="container my-5">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">File Upload</h2>
            </div>
            <div className="card-body">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="file-input">Select a file:</label>
                  <input
                    type="file"
                    className="form-control-file"
                    id="file-input"
                    onChange={this.handleFileChange}
                  />
                </div>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <button type="submit" className="btn btn-primary">
                  Upload
                </button>
              </form>
            </div>
          </div>
        </div>
      );
  }
}

export default adminLayout(UploadUserdata);