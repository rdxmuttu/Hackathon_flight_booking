
from fastapi import FastAPI, HTTPException, Query
import mysql.connector
import pendulum
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()

# MySQL database configuration
db_config = {
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": "",
    "database": "Airlines",
}

# Function to establish a database connection
def get_db():
    db = mysql.connector.connect(**db_config)
    return db

# Map class input to class names
CLASS_MAP = {
    "B": "business_class",
    "F": "first_class",
    "E": "economy_class",
}

# Define a Pydantic model for the request body
class FlightRecommendationRequest(BaseModel):
    airport_from: str
    airport_to: str
    flight_class: str
    flight_date: str

# Define a Pydantic model for the airport autocompletion request
class AutoCompleteInput(BaseModel):
    Input: str

# Define a Pydantic model for the route
class RouteDetails(BaseModel):
    route_id: int
    flying_from: Dict[str, str]
    flying_to: Dict[str, str]
    airline: Dict[str, str]

# Define a Pydantic model for the advanced filter request
class AdvancedFilterRequest(BaseModel):
    routes: List[Dict]
    flight_class: List[str] = None
    airline_code: List[str] = None

# Define a route for flight recommendations
@app.post("/recommend_flights")
async def recommend_flights(data: FlightRecommendationRequest):
    try:
        # Parse the date string to a Pendulum datetime object
        date = pendulum.parse(data.flight_date)

        # Convert the date to a weekday (1 for Sunday, 2 for Monday, etc.)
        weekday = date.day_of_week + 1

        db = get_db()
        cursor = db.cursor(dictionary=True)  # Use dictionary cursor

        # Map user-entered class input to class names (e.g., "B" -> "business")
        flight_class_name = CLASS_MAP.get(data.flight_class.upper())
        if not flight_class_name:
            raise HTTPException(status_code=400, detail="Invalid flight class")

        # Query the database to retrieve flights based on user inputs
        query = f"""
        SELECT airline_code, airline_name, flight_duration FROM flight_data
        WHERE airport_from = %s
          AND airport_to = %s
          AND day{weekday} = 1
          AND {flight_class_name} = 1
        """

        cursor.execute(query, (data.airport_from, data.airport_to))
        recommended_flights = cursor.fetchall()

        # Check if there are no flight recommendations
        if not recommended_flights:
            return {"Error": "No flights found"}

        # Return only the airline's IATA code, airline name, and flight duration
        simplified_recommendations = [
            {
                "airline_name": flight["airline_name"],
                "airline_code": flight["airline_code"],
                "flight_duration": f"{flight['flight_duration']} minutes"
            }
            for flight in recommended_flights
        ]

        # Return the simplified flight recommendations
        return {"Available Flights": simplified_recommendations}

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {e}")
    finally:
        cursor.close()
        db.close()

# Define a route for airport autocompletion
@app.post("/autocompletion")
async def autocomplete_airports(input_data: AutoCompleteInput):
    prefix = input_data.Input
    try:
        db = get_db()
        cursor = db.cursor()

        results = []

        # Query the database to retrieve airport codes and names that start with the given prefix
        query = f"""
        SELECT code, name
        FROM airports
        WHERE code LIKE %s OR name LIKE %s
        LIMIT 20
        """

        # Execute the query with the prefix and retrieve matching airport codes and names
        cursor.execute(query, (f"{prefix}%", f"{prefix}%"))
        airport_data = cursor.fetchall()

        # Format each airport code and name pair as a dictionary
        for code, name in airport_data:
            results.append({
                "Airport Code": code,
                "Airport Name": name
            })

        return results

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {e}")
    finally:
        cursor.close()
        db.close()

# Define a route to get detailed itinerary information
@app.post("/get_detailed_itinerary", response_model=List[RouteDetails])
async def get_detailed_itinerary(route_ids: List[int]):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)  # Use dictionary cursor

        detailed_itinerary = []

        for route_id in route_ids:
            # Query the database to retrieve detailed itinerary information
            query = """
            SELECT route_id,
                   airport_from_name,
                   airport_from,
                   airport_from_location,
                   airport_to_name,
                   airport_to,
                   airport_to_location,
                   airline_code,
                   airline_name
            FROM flight_data
            WHERE route_id = %s
            """

            cursor.execute(query, (route_id,))
            route_data = cursor.fetchone()

            if route_data:
                flying_from = {
                    "airport_from_name": route_data["airport_from_name"],
                    "airport_from": route_data["airport_from"],
                    "airport_from_location": route_data["airport_from_location"]
                }
                flying_to = {
                    "airport_to_name": route_data["airport_to_name"],
                    "airport_to": route_data["airport_to"],
                    "airport_to_location": route_data["airport_to_location"]
                }
                airline = {
                    "airline_code": route_data["airline_code"],
                    "airline_name": route_data["airline_name"]
                }

                route = RouteDetails(
                    route_id=route_data["route_id"],
                    flying_from=flying_from,
                    flying_to=flying_to,
                    airline=airline
                )
                detailed_itinerary.append(route)

        return detailed_itinerary

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {e}")

# Define a route for flight recommendations with advanced filtering
@app.post("/adv_filter")
async def recommend_flights(data: AdvancedFilterRequest):
    try:
        routes = data.routes
        if not routes:
            raise HTTPException(status_code=400, detail="No routes provided")

        results = []

        for route in routes:
            flight_date_str = route.get("flight_date")
            airport_from = route.get("airport_from")
            airport_to = route.get("airport_to")
            flight_classes = data.flight_class
            airline_codes = data.airline_code

            # Parse the date string to a Pendulum datetime object
            flight_date = pendulum.parse(flight_date_str)

            # Convert the date to a weekday (1 for Sunday, 2 for Monday, etc.)
            weekday = flight_date.day_of_week + 1

            db = get_db()
            cursor = db.cursor(dictionary=True)  # Use dictionary cursor

            # Initialize lists to store flight details for different classes
            class_details = {key: [] for key in CLASS_MAP.values()}

            # Iterate through each flight class
            for flight_class in flight_classes or ["B", "F", "E"]:  # Default to all classes if not provided
                # Map user-entered class input to class names (e.g., "B" -> "business_class")
                flight_class_name = CLASS_MAP.get(flight_class.upper())
                if not flight_class_name:
                    raise HTTPException(status_code=400, detail="Invalid flight class")

                # Query the database to retrieve flights based on user inputs, including airline_code filtering
                query = f"""
                SELECT airline_code, airline_name, flight_duration FROM flight_data
                WHERE airport_from = %s
                  AND airport_to = %s
                  AND day{weekday} = 1
                  AND {flight_class_name} = 1
                """

                if airline_codes:  # Only add the IN clause if airline_codes is not empty
                    query += f"AND airline_code IN ({', '.join(['%s'] * len(airline_codes))})"

                cursor.execute(query, (airport_from, airport_to, *airline_codes))
                recommended_flights = cursor.fetchall()

                # Check if there are flight recommendations for this route and class
                if recommended_flights:
                    # Create a list of dictionaries with airline details
                    airline_details = [
                        {
                            "Airline Name": flight["airline_name"],
                            "Airline Code": flight["airline_code"],
                            "Total Duration": f"{flight['flight_duration']} minutes",
                            "Class": flight_class_name,
                        }
                        for flight in recommended_flights
                    ]

                    # Append airline details to the respective class list
                    class_details[flight_class_name].extend(airline_details)

            # Combine class details into a single set of data
            combined_details = []
            for class_name, details in class_details.items():
                if details:
                    combined_details.extend(details)

            # Create the result dictionary
            result = {
                "airport_from": airport_from,
                "airport_to": airport_to,
                "flight_date": flight_date_str,
                "Results": combined_details if combined_details else "No Flights Found",
            }

            results.append(result)

            # Close the cursor and database connection
            cursor.close()
            db.close()

        return {"routes": results}

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {e}")

# Define a GET endpoint to fetch airlines
@app.get("/airlines")
async def get_airlines():
    query = "SELECT * FROM airlines"
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)  # Use dictionary=True to fetch results as dictionaries
        cursor.execute(query)
        result = cursor.fetchall()
        return {"airlines": result}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {e}")
    finally:
        cursor.close()
        db.close()

# Define a GET endpoint to fetch airports
@app.get("/airports")
async def get_airports():
    query = "SELECT * FROM airports"
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)  # Use dictionary=True to fetch results as dictionaries
        cursor.execute(query)
        result = cursor.fetchall()
        return {"airports": result}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {e}")
    finally:
        cursor.close()
        db.close()

# Define a GET endpoint to fetch airline data by IATA code
@app.get("/airlines/{iata_code}")
async def get_airline_by_iata(iata_code: str):
    query = "SELECT * FROM airlines WHERE code = %s"  # Use the correct column name here
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute(query, (iata_code,))
        result = cursor.fetchone()
        if result:
            return {"airline": result}
        else:
            return {"message": "Airline not found"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {e}")
    finally:
        cursor.close()
        db.close()

# Define a GET endpoint to fetch airport data by IATA code
@app.get("/airports/{iata_code}")
async def get_airport_by_iata(iata_code: str):
    query = "SELECT * FROM airports WHERE code = %s"  # Use the correct column name here
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute(query, (iata_code,))
        result = cursor.fetchone()
        if result:
            return {"airport": result}
        else:
            return {"message": "Airport not found"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {e}")
    finally:
        cursor.close()
        db.close()

if __name__ == "__main__":
    import uvicorn

    # Use uvicorn to run the FastAPI application
    uvicorn.run(app, host="127.0.0.1", port=8000)
