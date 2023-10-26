create database Airlines;
drop database Airlines;
use Airlines;

 

create table airlines ( 
	name varchar(25), code varchar(2) , logo varchar(100));

 

select * from airlines;
drop table airlines;
 

 

create table Airports(id integer primary key auto_increment, code varchar(10), 
	lat varchar(20) , lon varchar(20), 
	name varchar(50), city varchar(50),
	state varchar(20), country varchar(20));

 

drop table Airports;
select * from Airports;

CREATE TABLE flight_data (
    route_id INT ,
    airline_code VARCHAR(2),
    airline_name VARCHAR(20), 
    airport_from VARCHAR(3) NOT NULL,
    airport_from_location VARCHAR(50),
    airport_from_name VARCHAR(50),
    airport_to VARCHAR(3) NOT NULL,
    airport_to_location VARCHAR(50),
    airport_to_name VARCHAR(50),
    business_class BOOLEAN,
    economy_class BOOLEAN,
    first_class BOOLEAN,
    flight_duration VARCHAR(10),
    day1 BOOLEAN,
    day2 BOOLEAN,
    day3 BOOLEAN,
    day4 BOOLEAN, 
    day5 BOOLEAN, 
    day6 BOOLEAN, 
    day7 BOOLEAN
);

drop table flight_data;

select * from flight_data;

SET GLOBAL wait_timeout = 28800;
SET GLOBAL interactive_timeout = 28800;
