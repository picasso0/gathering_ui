import React, { useState, useEffect } from "react";
import adminLayout from "../hoc/adminLayout";
import axios from 'axios';
import ModalComponent from "../components/ModalComponent";

const Profiles = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [whatsapp_finded, setWhatsappFinded] = useState(undefined);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    fetchData();
  }, [whatsapp_finded, currentPage]); // Fetch data when whatsapp_finded or currentPage changes

  const handleCheckboxChange = () => {
    // Cycle through the states: undefined -> true -> false
    setWhatsappFinded((prevwhatsapp_finded) => {
      if (prevwhatsapp_finded === undefined) return true; // Set to true
      if (prevwhatsapp_finded === true) return false; // Set to false
      return undefined; // Set to undefined
    });
    setLoading(true)
  };


  const fetchData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + `/profiles/?whatsapp_finded=${whatsapp_finded}&page=${currentPage}&limit=${limit}`, {
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

  const get_profile = async (mobile) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + `/profile/?mobile=${mobile}`, {
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
        <span>WhatsApp Result: </span>
        <div class="input-group mb-3">
  <div class="input-group-prepend">
    <div class="input-group-text">
   
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
       <label className="p-2">
    {whatsapp_finded === undefined ? 'All Profiles' : whatsapp_finded ? 'Founded Profiles' : 'Not Founded Profiles'}
    </label>
      
    </div>
  </div>
</div>
      </div>
      <div className="d-flex text-muted">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mobile</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.mobile}</td>
                <td>
                  {item.whatsapp_searching === 0 ? (
                    <span className="bg-primary">Ready</span>
                  ) : item.whatsapp_searching === 1 ? (
                    <span className="bg-success">In Searching</span>
                  ) : (
                    <span className="bg-danger">Ready for First Search</span>
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
                    Show Data
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
      <nav className="table-bottom-center-pagination" aria-label="Page navigation example ">
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