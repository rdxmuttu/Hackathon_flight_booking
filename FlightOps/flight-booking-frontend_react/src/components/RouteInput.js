import React, { useState } from "react";
import { Col, Form } from "react-bootstrap";
import axios from "axios";
import Autosuggest from "react-autosuggest";

function RouteInput({ route, index, handleRouteChange }) {
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [fromInputValue, setFromInputValue] = useState("");
  const [toInputValue, setToInputValue] = useState("");

  const handleInputChange = (inputName, value) => {
    // Update the route state
    handleRouteChange(index, inputName, value);
  };

  const fetchSuggestions = async (inputName, searchString) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/autocompletion", // Update to the correct URL for airport autocomplete
        {
          Input: searchString,
        }
      );

      if (inputName === "airport_from") {
        setFromSuggestions(response.data);
      } else if (inputName === "airport_to") {
        setToSuggestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching suggestions: ", error);
    }
  };

  const handleFromInputChange = (event, { newValue }) => {
    setFromInputValue(newValue);
  };

  const handleToInputChange = (event, { newValue }) => {
    setToInputValue(newValue);
  };

  return (
    <>
      <Col>
        <Form.Group>
          <Form.Label htmlFor={`from${index}`}>From</Form.Label>
          <Autosuggest
            inputProps={{
              id: `from${index}`,
              value: fromInputValue,
              onChange: handleFromInputChange,
              onBlur: () => handleInputChange("airport_from", fromInputValue),
              placeholder: "Enter From Airport",
              className: "form-control",
            }}
            suggestions={fromSuggestions}
            onSuggestionsFetchRequested={({ value }) =>
              fetchSuggestions("airport_from", value)
            }
            onSuggestionsClearRequested={() => setFromSuggestions([])}
            getSuggestionValue={(suggestion) => suggestion["Airport Name"]}
            renderSuggestion={(suggestion) => <div>{suggestion["Airport Name"]}</div>}
          />
        </Form.Group>
      </Col>

      <Col>
        <Form.Group>
          <Form.Label htmlFor={`to${index}`}>To</Form.Label>
          <Autosuggest
            inputProps={{
              id: `to${index}`,
              value: toInputValue,
              onChange: handleToInputChange,
              onBlur: () => handleInputChange("airport_to", toInputValue),
              placeholder: "Enter To Airport",
              className: "form-control",
            }}
            suggestions={toSuggestions}
            onSuggestionsFetchRequested={({ value }) =>
              fetchSuggestions("airport_to", value)
            }
            onSuggestionsClearRequested={() => setToSuggestions([])}
            getSuggestionValue={(suggestion) => suggestion["Airport Name"]}
            renderSuggestion={(suggestion) => <div>{suggestion["Airport Name"]}</div>}
          />
        </Form.Group>
      </Col>

      {/* Additional input field for class */}
      <Col>
        <Form.Group>
          <Form.Label htmlFor={`class${index}`}>Class</Form.Label>
          <Form.Control
            as="select"
            id={`class${index}`}
            value={route.flight_class}
            onChange={(e) =>
              handleRouteChange(index, "flight_class", e.target.value)
            }
          >
            <option value="Economy class">Economy class</option>
            <option value="Business class">Business class</option>
            <option value="First class">First class</option>
          </Form.Control>
        </Form.Group>
      </Col>

      {/* Additional input field for trip date */}
      <Col>
        <Form.Group>
          <Form.Label htmlFor={`date${index}`}>Date</Form.Label>
          <Form.Control
            type="date"
            id={`date${index}`}
            value={route.departure_date}
            onChange={(e) =>
              handleRouteChange(index, "departure_date", e.target.value)
            }
            required
          />
        </Form.Group>
      </Col>

      {/* Add more input fields as needed */}
    </>
  );
}

export default RouteInput;
