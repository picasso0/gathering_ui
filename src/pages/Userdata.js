import React from "react";
import adminLayout from "../hoc/adminLayout";
import axios from 'axios';

import ModalComponent from "../components/ModalComponent";

class Userdata extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          data: [],
          loading: true,
          currentPage: 1,
          totalPages: 1,
          limit: 10,
          userdata: {}
        };
      }
      componentDidMount() {
        this.fetchData();
      }

      fetchData = async () => {
        const accessToken = localStorage.getItem('accessToken');
        try {
          const response = await axios.get(process.env.REACT_APP_API_URL + `/userdatas/?page=${this.state.currentPage}&limit=${this.state.limit}`,{
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
        const { data, loading, currentPage, totalPages, userdata } = this.state;

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
                                <th>path</th>
                                <th>status</th>
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
                            {item.path}
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

export default adminLayout(Userdata);