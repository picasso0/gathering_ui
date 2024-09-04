import React, { useState, useEffect } from "react";
import adminLayout from "../hoc/adminLayout";
import axios from 'axios';
import ModalComponent from "../components/ModalComponent";

const Profiles = () => {
  const [whatsapp_finded, setWhatsappFinded] = useState(undefined);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [profile, setProfile] = useState({});

  const handleCheckboxChange = () => {
    // Cycle through the states: undefined -> true -> false
    setWhatsappFinded((prevValue) => {
      if (prevValue === undefined) return 'true'; // Set to true
      if (prevValue === 'true') return 'false'; // Set to false
      return undefined; // Set to undefined
    });
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, whatsapp_finded]); // Fetch data when currentPage or whatsapp_finded changes

  const get_profile = async (mobile) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile/?mobile=${mobile}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      window.location.href = '/login';
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/profiles/?whatsapp_finded=${whatsapp_finded}&page=${currentPage}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData(response.data.data);
      setTotalPages(Math.ceil(response.data.total_count / limit));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      window.location.href = '/login';
      setLoading(false);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <span>whatsapp result </span>
        <label>
      <input
        type="checkbox"
        checked={whatsapp_finded === true} // Checked if whatsapp_finded is true
        onChange={handleCheckboxChange}
        ref={(input) => {
          if (input) {
            input.indeterminate = whatsapp_finded === undefined; // Set indeterminate state
          }
        }}
      />
      {whatsapp_finded === undefined ? 'All' : whatsapp_finded ? 'Found' : 'Not Found'}
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
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.mobile}</td>
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
                  <button 
                    onClick={() => get_profile(item.mobile)} 
                    type="button" 
                    className="btn btn-primary" 
                    data-bs-toggle="modal" 
                    data-bs-target="#rightModalDefault"
                  >
                    show data
                  </button>
                  <ModalComponent 
                    title={profile.mobile} 
                    content={
                      <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                        <pre>{JSON.stringify(profile, null, 2)}</pre>
                      </div>
                    } 
                    className="right" 
                    dataBsBackdrop="static" 
                    id="rightModalDefault" 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav className="table-bottom-center-pagination" aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item">
            <a onClick={() => goToPage(currentPage - 1)} className="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Previous</span>
            </a>
          </li>
          <li>
            <span className="text-center text-small p-2 mt-2">Page {currentPage} of {totalPages}</span>
          </li>
          <li className="page-item">
            <a onClick={() => goToPage(currentPage + 1)} className="page-link" href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only">Next</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default adminLayout(Profiles);