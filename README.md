# Restaurant Reservation Application

This application was created using React.js, Express.js, Knex.js, Node.js, PostgreSql and CSS/Bootstrap.

The Client Side was created using React.js and styled with CSS/Bootstrap. The Server Side of this application was designed following RESTful Api principals and made using Express.js. The database was created with Elephant PostgreSQL and maintained using Knex.js. 

The application is a Restaurant Reservation management system used to track and maintain reservations made for various days.

This application allows the user to:

- Create, Update, and Cancel reservations
- Seat each reservation at a specific table
- Create Tables for reservations to be sat at
- Search for a reservation using the mobile number associated with the reservation
- Seat reservation when the customer arrives



## Installation Instructions
Fork and clone this repository.
Run cp ./back-end/.env.sample ./back-end/.env.
Update the ./back-end/.env file with the connection URL's to your ElephantSQL database instance.
Run cp ./front-end/.env.sample ./front-end/.env.
You should not need to make changes to the ./front-end/.env file unless you want to connect to a backend at a location other than http://localhost:5000.
Run npm install to install project dependencies.
Run npm run start:dev to start your server in development mode.

## Application Screenshots

### Dashboard
![Dashboard Screen](/Screenshots/Dashboard-reservation.png)

### New Reservation
![New Reservation Screen](/Screenshots/New-reservation.png)

### New Table
![New Table Screen](/Screenshots/New-table.png)

### Search Reservation
![Search Reservation Screen](/Screenshots/Search-reservation.png)
