import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import ReactPaginate from "react-paginate";
import "./Airlines.css"; // Import your custom CSS file for styling

function Airports() {
  const [airports, setAirports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const airportsPerPage = 9; // Number of airports to display per page

  useEffect(() => {
    // Fetch the list of all airports when the component mounts
    fetch("http://localhost:8000/airports")
      .then((response) => response.json())
      .then((data) => {
        setAirports(data.airports);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearch = () => {
    // Search for an airport by IATA code (case-insensitive)
    if (searchTerm) {
      const foundAirport = airports.find((airport) =>
        airport.code.toLowerCase() === searchTerm.toLowerCase()
      );
      setSearchResult(foundAirport);
    } else {
      setSearchResult(null);
    }
  };
  

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  // Calculate the index of the first and last airports to display on the current page
  const indexOfLastAirport = (pageNumber + 1) * airportsPerPage;
  const indexOfFirstAirport = indexOfLastAirport - airportsPerPage;
  const currentAirports = airports.slice(
    indexOfFirstAirport,
    indexOfLastAirport
  );

  return (
    <div className="text-white mt-4 p-5 vh-100 w-100">
      <h1>Airports</h1>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Enter IATA code"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
        <button onClick={handleSearch} className="btn btn-primary mt-3">
          Search
        </button>
      </div>
      {searchResult ? (
        <div className="mb-4">
          <strong>Code:</strong> {searchResult.code}, <strong>Name:</strong>{" "}
          {searchResult.name}
        </div>
      ) : null}
      <div className="row">
        {currentAirports.map((airport) => (
          <div key={airport.code} className="col-lg-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <span className="name">{airport.name}</span>
                  <span className="code">{airport.code}</span>
                </h5>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="center-pagination">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(airports.length / airportsPerPage)}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          breakClassName={"page-item disabled"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
}

export default Airports;
