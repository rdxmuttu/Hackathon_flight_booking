// import React, { useState } from "react";
// import axios from "axios";
// import TripTypeSelector from "./TripTypeSelector";
// import RouteList from "./RouteList"; // Missing component
// import ReturnDateInput from "./ReturnDateInput"; // Missing component
// import RecommendationCard from "./RecommendationCard"; // Missing component
// import { Card, Row, Col, Form } from "react-bootstrap";
// import Button from "react-bootstrap/Button";

// function FlightRoutes() {
//   const [recommendations, setRecommendations] = useState([]);
//   const [tripType, setTripType] = useState("one-way");
//   const [routes, setRoutes] = useState([
//     {
//       airport_from: "",
//       airport_to: "",
//       flight_class: "",
//       departure_date: "",
//     },
//   ]);
//   const [returnDate, setReturnDate] = useState("");
//   const [airlines, setAirlines] = useState();
//   const [date, setDate] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = {
//       class_: [],
//       airlines,
//       tripType,
//       routes: routes.map((route) => ({
//         flight_date: route.departure_date, // Change "date" to "flight_date"
//         airport_from: route.airport_from,
//         airport_to: route.airport_to,
//       })),
//       returnDate: tripType === "round-trip" ? returnDate : null,
//     };

//     try {
//       const response = await axios.post(
//         "http://localhost:8000/recommend_flights", // Update the URL to match your FastAPI endpoint
//         formData
//       );

//       console.log("Recommendations:", response.data);
//       setRecommendations(response.data["Available Flights"]); // Access the data from the response object
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const handleRouteChange = (index, field, value) => {
//     const updatedRoutes = [...routes];
//     updatedRoutes[index][field] = value;
//     setRoutes(updatedRoutes);
//   };

//   // Missing function: handleAddRoute
//   const handleAddRoute = () => {
//     setRoutes([...routes, { airport_from: "", airport_to: "", flight_class: "", departure_date: "" }]);
//   };

//   // Missing function: handleRemoveRoute
//   const handleRemoveRoute = (index) => {
//     const updatedRoutes = [...routes];
//     updatedRoutes.splice(index, 1);
//     setRoutes(updatedRoutes);
//   };

//   return (
// //     <>
// //       <section className="m-5 sticky-top fixed-top">
// //         <Card className="mt-4">
// //           <Card.Body>
// //             <Form onSubmit={handleSubmit}>
// //               <TripTypeSelector tripType={tripType} setTripType={setTripType} /> {/* TripTypeSelector component */}
// //               <RouteList routes={routes} handleAddRoute={handleAddRoute} handleRemoveRoute={handleRemoveRoute} handleRouteChange={handleRouteChange} /> {/* RouteList component */}
// //               <ReturnDateInput tripType={tripType} returnDate={returnDate} setReturnDate={setReturnDate} /> {/* ReturnDateInput component */}
// //               <Button variant="primary" type="submit">
// //                 Find Flights
// //               </Button>
// //               <Button variant="secondary" onClick={handleAddRoute}>
// //                 Add Route
// //               </Button>
// //             </Form>
// //           </Card.Body>
// //         </Card>
// //       </section>
// //       <section id="recommendations" className="mt-5">
// //         <div className="container">
// //           <div className="col-md-12" style={{ maxHeight: "400px", overflowY: "auto" }}>
// //             {recommendations.map((flight, index) => (
// //               <RecommendationCard key={index} routeArray={flight} />
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //     </>
// //   );
// // }
// <div className="container">
//       <section className="m-5 sticky-top fixed-top">
//         <Card className="mt-4">
//           <Card.Body>
//             <Form onSubmit={handleSubmit}>
//               <TripTypeSelector tripType={tripType} setTripType={setTripType} />
//               {routes.map((route, index) => (
//                 <RouteList
//                   key={index}
//                   index={index}
//                   routes={routes}
//                   route={route}
//                   handleAddRoute={handleAddRoute}
//                   handleRemoveRoute={handleRemoveRoute}
//                   handleRouteChange={handleRouteChange}
//                 />
//               ))}
//               <ReturnDateInput
//                 tripType={tripType}
//                 returnDate={returnDate}
//                 setReturnDate={setReturnDate}
//               />
//               <Button variant="primary" type="submit">
//                 Find Flights
//               </Button>
//             </Form>
//           </Card.Body>
//         </Card>
//       </section>
//       <section id="recommendations" className="mt-5">
//         <div className="container">
//           <Row>
//             {recommendations.map((flight, index) => (
//               <Col key={index} md={4}>
//                 <RecommendationCard flight={flight} />
//               </Col>
//             ))}
//           </Row>
//         </div>
//       </section>
//     </div>
//   );
// }


// export default FlightRoutes;
import React, { useState } from "react";
import axios from "axios";
import TripTypeSelector from "./TripTypeSelector";
import RouteList from "./RouteList";
import ReturnDateInput from "./ReturnDateInput";
import RecommendationCard from "./RecommendationCard";
import { Card, Row, Col, Form, Button } from "react-bootstrap";

function FlightRoutes() {
  const [recommendations, setRecommendations] = useState([]);
  const [tripType, setTripType] = useState("one-way");
  const [routes, setRoutes] = useState([
    {
      airport_from: "",
      airport_to: "",
      flight_class: "",
      departure_date: "",
    },
  ]);
  const [returnDate, setReturnDate] = useState("");
  const [airlines, setAirlines] = useState(""); // Initialize as an empty string
  const [date, setDate] = useState(""); // Initialize as an empty string

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      airport_from: routes[0].airport_from, // Use the first route's airport_from
      airport_to: routes[0].airport_to, // Use the first route's airport_to
      flight_class: routes[0].flight_class, // Use the first route's flight_class
      flight_date: routes[0].departure_date, // Use the first route's departure_date
      // airlines,  Use the airlines from state
      // tripType,
      // returnDate: tripType === "round-trip" ? returnDate : null,
    };
    console.log(formData)
    try {
      const response = await axios.post(
        "http://localhost:8000/recommend_flights",
        formData
      );

      console.log("Recommendations:", response.data);
      setRecommendations(response.data["Available Flights"]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRouteChange = (index, field, value) => {
    const updatedRoutes = [...routes];
    updatedRoutes[index][field] = value;
    setRoutes(updatedRoutes);
  };

  const handleAddRoute = () => {
    setRoutes([
      ...routes,
      { airport_from: "", airport_to: "", flight_class: "", departure_date: "" },
    ]);
  };

  const handleRemoveRoute = (index) => {
    const updatedRoutes = [...routes];
    updatedRoutes.splice(index, 1);
    setRoutes(updatedRoutes);
  };

  return (
    <div className="container">
      <section className="m-5 sticky-top fixed-top">
        <Card className="mt-4">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <TripTypeSelector
                tripType={tripType}
                setTripType={setTripType}
              />
              {routes.map((route, index) => (
                <RouteList
                  key={index}
                  index={index}
                  routes={routes}
                  route={route}
                  handleAddRoute={handleAddRoute}
                  handleRemoveRoute={handleRemoveRoute}
                  handleRouteChange={handleRouteChange}
                />
              ))}
              <ReturnDateInput
                tripType={tripType}
                returnDate={returnDate}
                setReturnDate={setReturnDate}
              />
              <Button variant="primary" type="submit">
                Find Flights
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </section>
      <section id="recommendations" className="mt-5">
        <div className="container">
          <Row>
            {recommendations.length > 0 && (
              recommendations.map((flight, index) => (
                <Col key={index} md={4}>
                  <RecommendationCard flight={flight} />
                </Col>
              ))
            )}
          </Row>
        </div>
      </section>
    </div>
  );
}

export default FlightRoutes;




