import React from "react";
import adminLayout from "../hoc/adminLayout";
import axios from 'axios';

import ModalComponent from "../components/ModalComponent";

class Profiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      currentPage: 1,
      whatsapp_finded: undefined,
      totalPages: 1,
      limit: 10,
      profile: {}
    };
  }
  handleCheckboxChange = (value) => {
    this.setState({ whatsapp_finded: value });
  };
  componentDidMount() {
    this.fetchData();
  }
  async get_profile(mobile) {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + `/profile/?mobile=${mobile}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      this.setState({
        profile: response.data,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      window.location.href = '/login';
      this.setState({
        loading: false,
      });
    }
  }
  fetchData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + `/profiles/?page=${this.state.currentPage}&limit=${this.state.limit}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      this.setState({
        data: response.data.data,
        totalPages: Math.ceil(response.data.total_count / this.state.limit),
        loading: false
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      window.location.href = '/login';
      this.setState({
        loading: false
      });
    }
  };

  goToPage = (page) => {
    if (page >= 1 && page <= this.state.totalPages) {
      this.setState({ currentPage: page }, this.fetchData);
    }
  };


  render() {
    const { data, loading, currentPage, totalPages, profile } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <div>
        <label>
          <input
            type="checkbox"
            checked={this.state.whatsapp_finded === 'true'}
            onChange={() => this.handleCheckboxChange('true')}
          />
          True
        </label>
        <label>
          <input
            type="checkbox"
            checked={this.state.whatsapp_finded === 'false'}
            onChange={() => this.handleCheckboxChange('false')}
        />
          False
        </label>
        <label>
          <input
            type="checkbox"
            checked={this.state.whatsapp_finded === 'none'}
            onChange={() => this.handleCheckboxChange('none')}
          />
          None
        </label>
      </div>
        <div className="d-flex text-muted">
          <table className="table">
            <thead>
              <tr>
                <th>id</th>
                <th>mobile</th>
                <th>data</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <>
                  <tr>
                    <td>
                      {item._id}
                    </td>
                    <td>
                      {item.mobile}
                    </td>
                    <td>
                    {item.whatsapp_searching === 0 ? (
                         <span className="bg-primary">ready</span>
                      ) : item.whatsapp_searching === 1 ? (
                        <span className="bg-success">in searching</span>
                      ) : (
                        <span className="bg-danger">ready for first search</span>
                      )}
                    </td>
                    <td>
                      <button onClick={() => this.get_profile(item.mobile)} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#rightModalDefault">
                        show data
                      </button>
                      <ModalComponent title={profile.mobile} content={<><div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                        <pre>{JSON.stringify(profile, null, 2)}</pre>
                      </div></>} className="right" dataBsBackdrop="static" id="rightModalDefault" />

                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
        <nav className="table-bottom-center-pagination" aria-label="Page navigation example ">
          <ul className="pagination">
            <li className="page-item">
              <a onClick={() => this.goToPage(currentPage - 1)} className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                <span className="sr-only">Previous</span>
              </a>
            </li>
            <li>
              <span className="text-center text-small p-2 mt-2">Page {currentPage} of {totalPages}</span>
            </li>
            <li className="page-item">
              <a onClick={() => this.goToPage(currentPage + 1)} className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                <span className="sr-only">Next</span>
              </a>
            </li>
          </ul>
        </nav>
        <div>
        </div>
      </div>
    );
  }
}

export default adminLayout(Profiles);