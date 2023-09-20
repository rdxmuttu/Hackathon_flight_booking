# import json
# import requests
# import mysql.connector
# from urllib3.exceptions import InsecureRequestWarning
#
# # Disable SSL certificate verification warnings
# requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
#
# # Make the HTTP GET request to fetch JSON data for airlines with SSL verification disabled
# response_API_airlines = requests.get(
#     'https://cdn.jsdelivr.net/gh/besrourms/airlines@latest/airlines.json',
#     verify=False  # Disable SSL certificate verification
# )
#
# # Similarly, disable SSL verification for the airports URL
# response_API_airports = requests.get(
#     'https://gist.githubusercontent.com/tdreyno/4278655/raw/7b0762c09b519f40397e4c3e100b097d861f5588/airports.json',
#     verify=False  # Disable SSL certificate verification
# )
#
# try:
#     response_API_airlines.raise_for_status()  # Raise an exception for bad status codes (4xx and 5xx)
# except requests.exceptions.RequestException as e:
#     print(f"Error making the HTTP request for airlines data: {e}")
#     exit(1)
#
# data_airlines = response_API_airlines.text
#
# # Parse the JSON data for airlines
# try:
#     parse_json_airlines = json.loads(data_airlines)
#     if not isinstance(parse_json_airlines, list):
#         print("JSON data for airlines is not a list.")
#         exit(1)
# except json.JSONDecodeError as e:
#     print(f"Error parsing JSON for airlines: {e}")
#     exit(1)
#
# # Make the HTTP GET request to fetch JSON data for airports with SSL verification disabled
# try:
#     response_API_airports.raise_for_status()  # Raise an exception for bad status codes (4xx and 5xx)
# except requests.exceptions.RequestException as e:
#     print(f"Error making the HTTP request for airports data: {e}")
#     exit(1)
#
# data_airports = response_API_airports.text
#
# # Parse the JSON data for airports
# try:
#     parse_json_airports = json.loads(data_airports)
#     if not isinstance(parse_json_airports, list):
#         print("JSON data for airports is not a list.")
#         exit(1)
# except json.JSONDecodeError as e:
#     print(f"Error parsing JSON for airports: {e}")
#     exit(1)
#
# # Connect to your MySQL database
# try:
#     conn = mysql.connector.connect(
#         host='127.0.0.1',
#         port=3306,
#         user='root',
#         password='',
#         database='Airlines'
#     )
# except mysql.connector.Error as e:
#     print(f"Error connecting to MySQL: {e}")
#     exit(1)
#
# # Create a cursor object
# cursor = conn.cursor()
#
# # Iterate through the JSON data for airlines and insert into the existing MySQL table
# for airline in parse_json_airlines:
#     name = airline.get('name', 'N/A')
#     code = airline.get('code', 'N/A')
#     logo = airline.get('logo', 'N/A')
#
#     # Define the SQL INSERT statement for airlines
#     insert_statement = "INSERT INTO airlines (name, code, logo) VALUES (%s, %s, %s)"
#
#     # Insert the data into the MySQL table for airlines
#     try:
#         cursor.execute(insert_statement, (name, code, logo))
#     except mysql.connector.Error as e:
#         print(f"Error inserting data for airlines: {e}")
#
# # Iterate through the JSON data for airports and insert into the existing MySQL table
# for airport in parse_json_airports:
#     code = airport.get('code', 'N/A')
#     lat = airport.get('lat', 'N/A')
#     lon = airport.get('lon', 'N/A')
#     name = airport.get('name', 'N/A')
#     city = airport.get('city', 'N/A')
#     state = airport.get('state', 'N/A')
#     country = airport.get('country', 'N/A')
#
#     # Define the SQL INSERT statement for airports
#     insert_statement = "INSERT INTO airports (code, lat, lon, name, city, state, country) " \
#                        "VALUES (%s, %s, %s, %s, %s, %s, %s)"
#
#     # Insert the data into the MySQL table for airports
#     try:
#         cursor.execute(insert_statement, (code, lat, lon, name, city, state, country))
#     except mysql.connector.Error as e:
#         print(f"Error inserting data for airports: {e}")
#
# # Commit changes and close the cursor and connection
# conn.commit()
# cursor.close()
# conn.close()
#
# # Replace with your own database credentials
# conn = mysql.connector.connect(
#     host='127.0.0.1',
#     port=3306,
#     user='root',
#     password='',
#     database='Airlines'
# )
#
# cursor = conn.cursor()
#
# # json_file_path
# json_file_path = r'C:\Users\248751\PycharmProjects\FlightOps\flightsDB.routes_v2.json'
#
# # Load JSON data from a file
# try:
#     with open(json_file_path, encoding='utf-8', errors='ignore') as json_data:
#         data = json.load(json_data, strict=False)
#
#         # Assuming your JSON data is a list of dictionaries
#         for data_entry in data:
#             route_id = data_entry.get("id", 0)  # Replace 0 with a default value if needed
#
#             airline_iata = data_entry.get("airline_code", "")
#             airline_name = data_entry.get("airline_name", "")
#
#             # Check if "airport_from" key is not None and contains "IATA" key
#             if "airport_from" in data_entry and data_entry["airport_from"] is not None:
#                 airport_from_iata = data_entry["airport_from"].get("code", "")
#                 airport_from_location = data_entry["airport_from"].get("airport_from_location", "")
#                 airport_from_name = data_entry["airport_from"].get("name", "")
#             else:
#                 airport_from_iata = ""
#                 airport_from_location = ""
#                 airport_from_name = ""
#
#             # Check if "airport_to" key is not None and contains "IATA" key
#             if "airport_to" in data_entry and data_entry["airport_to"] is not None:
#                 airport_to_iata = data_entry["airport_to"].get("code", "")
#                 airport_to_location = data_entry["airport_to"].get("airport_to_location", "")
#                 airport_to_name = data_entry["airport_to"].get("name", "")
#             else:
#                 airport_to_iata = ""
#                 airport_to_location = ""
#                 airport_to_name = ""
#
#             business_class = data_entry.get("business_class", False)
#             economy_class = data_entry.get("economy_class", False)
#             first_class = data_entry.get("first_class", False)
#             flight_duration = data_entry.get("flight_duration", "")
#             day1 = data_entry.get("day1", False)
#             day2 = data_entry.get("day2", False)
#             day3 = data_entry.get("day3", False)
#             day4 = data_entry.get("day4", False)
#             day5 = data_entry.get("day5", False)
#             day6 = data_entry.get("day6", False)
#             day7 = data_entry.get("day7", False)
#
#             # Define the SQL INSERT statement for routes
#             insert_statement = "INSERT INTO flight_data (route_id, airline_code, airline_name, " \
#                                 "airport_from, airport_from_location, airport_from_name, " \
#                                 "airport_to, airport_to_location, airport_to_name, " \
#                                 "business_class, economy_class, first_class, " \
#                                 "flight_duration, day1, day2, day3, day4, day5, day6, day7) " \
#                                 "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
#
#             # Insert the data into the MySQL table for routes
#             try:
#                 cursor.execute(insert_statement, (
#                     route_id, airline_iata, airline_name,
#                     airport_from_iata, airport_from_location, airport_from_name,
#                     airport_to_iata, airport_to_location, airport_to_name,
#                     business_class, economy_class, first_class,
#                     flight_duration, day1, day2, day3, day4, day5, day6, day7))
#             except mysql.connector.Error as e:
#                 print(f"Error inserting data for routes: {e}")
#
#         # Commit changes and close the cursor and connection
#         conn.commit()
#         cursor.close()
#         conn.close()
#
# except FileNotFoundError:
#     print(f"JSON file not found at: {json_file_path}")
#
# except json.JSONDecodeError as e:
#     print(f"Error loading JSON data: {e}")
#
# # Commit changes and close the cursor and connection
# conn.commit()
# cursor.close()
# conn.close()
import json
import requests
import mysql.connector
import urllib3

# Bypass SSL certificate verification
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


# Function to establish a MySQL connection
def connect_to_mysql():
    try:
        conn = mysql.connector.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',
            database='Airlines'
        )
        return conn
    except mysql.connector.Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None


# Function to insert data into airlines table
def insert_airline_data(cursor, airline):
    name = airline.get('name', 'N/A')
    code = airline.get('code', 'N/A')
    logo = airline.get('logo', 'N/A')
    insert_statement = "INSERT INTO airlines (name, code, logo) VALUES (%s, %s, %s)"
    try:
        cursor.execute(insert_statement, (name, code, logo))
    except mysql.connector.Error as e:
        print(f"Error inserting data for airlines: {e}")


# Function to insert data into airports table
def insert_airport_data(cursor, airport):
    code = airport.get('code', 'N/A')
    lat = airport.get('lat', 'N/A')
    lon = airport.get('lon', 'N/A')
    name = airport.get('name', 'N/A')
    city = airport.get('city', 'N/A')
    state = airport.get('state', 'N/A')
    country = airport.get('country', 'N/A')
    insert_statement = "INSERT INTO airports (code, lat, lon, name, city, state, country) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    try:
        cursor.execute(insert_statement, (code, lat, lon, name, city, state, country))
    except mysql.connector.Error as e:
        print(f"Error inserting data for airports: {e}")


# Function to fetch and insert flight data from a JSON file
def insert_flight_data_from_file(cursor, json_file_path):
    try:
        with open(json_file_path, encoding='utf-8', errors='ignore') as json_data:
            data = json.load(json_data, strict=False)
            for data_entry in data:
                route_id = data_entry.get("id", 0)  # Replace 0 with a default value if needed
                airline_iata = data_entry.get("airline", {}).get("IATA", "")
                airline_name = data_entry.get("airline", {}).get("name", "")

                # Check if "airportFrom" key is not None and contains "IATA" key
                if "airportFrom" in data_entry and data_entry["airportFrom"] is not None:
                    airport_from_iata = data_entry["airportFrom"].get("IATA", "")
                    airport_from_location = data_entry["airportFrom"].get("display_name", "")
                    airport_from_name = data_entry["airportFrom"].get("name", "")
                else:
                    airport_from_iata = ""
                    airport_from_location = ""
                    airport_from_name = ""

                # Check if "airportTo" key is not None and contains "IATA" key
                if "airportTo" in data_entry and data_entry["airportTo"] is not None:
                    airport_to_iata = data_entry["airportTo"].get("IATA", "")
                    airport_to_location = data_entry["airportTo"].get("display_name", "")
                    airport_to_name = data_entry["airportTo"].get("name", "")
                else:
                    airport_to_iata = ""
                    airport_to_location = ""
                    airport_to_name = ""

                business_class = data_entry.get("class_business", 0)
                economy_class = data_entry.get("class_economy", 0)
                first_class = data_entry.get("class_first", 0)
                flight_duration = data_entry.get("common_duration", "")
                day1 = data_entry.get("day1", "").lower() == "yes"
                day2 = data_entry.get("day2", "").lower() == "yes"
                day3 = data_entry.get("day3", "").lower() == "yes"
                day4 = data_entry.get("day4", "").lower() == "yes"
                day5 = data_entry.get("day5", "").lower() == "yes"
                day6 = data_entry.get("day6", "").lower() == "yes"
                day7 = data_entry.get("day7", "").lower() == "yes"

                insert_query = """
                INSERT INTO flight_data
                (route_id, airline_code, airline_name, airport_from, airport_from_location, airport_from_name, airport_to, airport_to_location, airport_to_name, business_class, economy_class, first_class, flight_duration, day1, day2, day3, day4, day5, day6, day7)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(insert_query, (
                    route_id, airline_iata, airline_name, airport_from_iata, airport_from_location, airport_from_name,
                    airport_to_iata, airport_to_location, airport_to_name, business_class, economy_class, first_class,
                    flight_duration, day1, day2, day3, day4, day5, day6, day7))

                # Print a message for each successful insertion
                # print("Data inserted successfully!")
    except mysql.connector.Error as err:
        print(f"Error: {err}")


# Main function
def main():
    # Make the HTTP GET request to fetch JSON data for airlines
    response_API_airlines = requests.get('https://cdn.jsdelivr.net/gh/besrourms/airlines@latest/airlines.json', verify=False)
    try:
        response_API_airlines.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error making the HTTP request for airlines data: {e}")
        exit(1)

    data_airlines = response_API_airlines.text

    # Parse the JSON data for airlines
    try:
        parse_json_airlines = json.loads(data_airlines)
        if not isinstance(parse_json_airlines, list):
            print("JSON data for airlines is not a list.")
            exit(1)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON for airlines: {e}")
        exit(1)

    # Make the HTTP GET request to fetch JSON data for airports
    response_API_airports = requests.get(
        'https://gist.githubusercontent.com/tdreyno/4278655/raw/7b0762c09b519f40397e4c3e100b097d861f5588/airports.json', verify=False)
    try:
        response_API_airports.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error making the HTTP request for airports data: {e}")
        exit(1)

    data_airports = response_API_airports.text

    # Parse the JSON data for airports
    try:
        parse_json_airports = json.loads(data_airports)
        if not isinstance(parse_json_airports, list):
            print("JSON data for airports is not a list.")
            exit(1)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON for airports: {e}")
        exit(1)

    # Connect to the MySQL database
    connection = connect_to_mysql()
    if not connection:
        exit(1)

    # Create a cursor object
    cursor = connection.cursor()

    # Insert data into airlines table
    for airline in parse_json_airlines:
        insert_airline_data(cursor, airline)

    # Insert data into airports table
    for airport in parse_json_airports:
        insert_airport_data(cursor, airport)

    # Insert flight data from a JSON file
    json_file_path = 'flightsDB.routes_v2.json'  # Change this to your JSON file path
    insert_flight_data_from_file(cursor, json_file_path)

    # Commit changes and close the cursor and connection
    connection.commit()
    cursor.close()
    connection.close()


if __name__ == "__main__":
    main()
