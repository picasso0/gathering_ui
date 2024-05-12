import React from "react";
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Link } from 'react-router-dom';

class Sidebar extends React.Component {
    constructor(props){
        super(props)

        this.state = {}
    }

    render(){
        return <div className="border-end sidenav" id="sidebar-wrapper">
            <div className="sidebar-heading border-bottom ">
                <Link to="/">
                    <img alt="Alt content" src={require('./../assets/images/logo.png')} />
                </Link>
            </div>
            <PerfectScrollbar className="sidebar-items">
                <ul className="list-unstyled ps-0">
                    <li className="mb-1">
                        <Link tag="a" className="" to="/">
                            <i className="fa fa-dashboard"></i> Dashboard
                        </Link>
                    </li>
                    <li className="mb-1">
                        <Link tag="a" className="" to="/profiles">
                        <i className="fa fa-users" aria-hidden="true"></i> Profiles
                        </Link>
                    </li>
                    <li className="mb-1">
                        <Link tag="a" className="" to="/workers">
                        <i className="fa fa-puzzle-piece" aria-hidden="true"></i> Workers
                        </Link>
                    </li>
                    <li className="mb-1">
                        <Link tag="a" className="" to="/userdata">
                        <i className="fa fa-upload" aria-hidden="true"></i> Userdata
                        </Link>
                    </li>
                    <li className="mb-1">
                        <Link tag="a" className="" to="/upload_userdata">
                        <i className="fa fa-upload" aria-hidden="true"></i> Upload Userdata
                        </Link>
                    </li>
                    
                    {/* collapsable list item example */}
                    {/* <li className="mb-1">
                        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="false">
                        Opportunity
                        </button>
                        <div className="collapse" id="dashboard-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="#" className="rounded">Overview</a></li>
                            <li><a href="#" className="rounded">Weekly</a></li>
                            <li><a href="#" className="rounded">Monthly</a></li>
                            <li><a href="#" className="rounded">Annually</a></li>
                        </ul>
                        </div>
                    </li> 
                    <li className="border-top my-3"></li> */}
                   
                </ul>
            </PerfectScrollbar>
            <div className="dropdown fixed-bottom-dropdown">
                <a href="#" className="d-flex align-items-center text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="https://via.placeholder.com/50" alt="" width="32" height="32" className="rounded-circle me-2" />
                    <span>admin</span>
                </a>
                <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                    <li><Link className="dropdown-item" to="/profile"><i className="fa fa-user-circle" aria-hidden="true"></i> Profile</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button onClick={()=>localStorage.removeItem('accessToken')}><Link className="dropdown-item" to="/login"><i className="fa fa-sign-out" aria-hidden="true"></i> Sign out</Link></button></li>
                </ul>
            </div>
        </div>
    }
}

export default Sidebar;