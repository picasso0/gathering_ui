import React from "react";
import adminLayout from "../hoc/adminLayout";
import axios from 'axios';

import ModalComponent from "../components/ModalComponent";

class Workers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          data: [],
          loading: true,
          currentPage: 1,
          totalPages: 1,
          limit: 10,
          worker: {}
        };
      }
      componentDidMount() {
        this.fetchData();
      }
      async get_worker(id) {
        const accessToken = localStorage.getItem('accessToken');
        try {
          const response = await axios.get(process.env.REACT_APP_API_URL + `/worker/?id=${id}`,{
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          this.setState({
            worker: response.data,
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
          const response = await axios.get(process.env.REACT_APP_API_URL + `/workers/?page=${this.state.currentPage}&limit=${this.state.limit}`,{
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          this.setState({
            data: response.data.data,
            totalPages: Math.ceil(response.data.total_count / this.state.limit) ,
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


    render(){
        const { data, loading, currentPage, totalPages, worker } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }
        return (
          <div>
            {console.log(this.state)}
            <div className="d-flex text-muted">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>ip</th>
                                <th>status</th>
                                <th>scans count</th>
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
                            {item.ip}
                            </td>
                            <td>
                            {item.status==0 ? (
        <>pending</>
      ) : item.status==1 ? (
        <>running</>
      ) : (
        <>failed</>
      )}
                            </td>
                            <td>
                            {item.reports_count}
                            </td>
                            <td>
                            <button onClick={()=>this.get_worker(item._id)} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#rightModalDefault">
                                        show data
                                    </button>
                                    <ModalComponent title={worker.id} content={<><div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
              <pre>{JSON.stringify(worker, null, 2)}</pre>
            </div></>} className="right" dataBsBackdrop="static" id="rightModalDefault"/>
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
                        <span  className="text-center text-small p-2 mt-2">Page {currentPage} of {totalPages}</span>
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

export default adminLayout(Workers);