import React from "react";
import adminLayout from "../hoc/adminLayout"
import axios from 'axios';

class DashboardPage extends React.Component {
    state = {
      data: null,
      loading: true
    };
  
    async componentDidMount() {
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('http://127.0.0.1:8888/dashboard/',{
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        this.setState({ data: response.data, loading: false });
      } catch (error) {
        window.location.href = '/login';
        console.error('Error fetching data:', error);
        this.setState({ loading: false });
      }
    }
    

    render(){
      const { data, loading } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

        return <>
            <div className="row">
        <div className="col-xl-3 col-sm-6 mb-3">
          <div className="card text-white bg-primary o-hidden h-100">
            <div className="card-body">
              <div className="d-flex card-body-icon">
                <i className="m-1 fa fa-fw fa-puzzle-piece"></i>
                <h2>workers</h2>
              </div>
              <div className="mr-5">
                {data.workers}
                </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 mb-3">
          <div className="card text-white bg-warning o-hidden h-100">
            <div className="card-body">
              <div className="card-body-icon d-flex">
                <i className="m-1 fa fa-fw fa-user"></i>
                <h2>profiles</h2>
              </div>
              <div className="mr-5">
                {data.profiles}
                </div>
            </div>
           
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 mb-3">
          <div className="card text-white bg-success o-hidden h-100">
            <div className="card-body">
              <div className="card-body-icon d-flex">
                <i className="fa fa-fw m-1 fa-whatsapp"></i>
                <h2>whatsapp profiles</h2>
              </div>
              <div className="mr-5">
              <div className="mr-5">
                {data.whatsapp_profiles}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 mb-3">
          <div className="card text-white bg-danger o-hidden h-100">
            <div className="card-body">
              <div className="card-body-icon d-flex">
                <i className="fa m-1 fa-fw fa-chrome"></i>
                <h2>Chrome Profiles</h2>
              </div>
              <div className="mr-5">
              <div className="mr-5">
                {data.user_data}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
    }
}

export default adminLayout(DashboardPage);