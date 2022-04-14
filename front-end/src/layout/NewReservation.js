import React, { useState } from "react";
import {useHistory} from "react-router-dom";
// const reservations = require("../../back-end/src/db/seeds/00-reservations.json");

function NewReservation(){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [reservationDate, setReservationDate] = useState();
    const [reservationTime, setReservationTime] = useState();
    const [people, setPeople] = useState(1);

    console.log(typeof people);
    const history = useHistory();

    async function handleSubmit(e){
      e.preventDefault();
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          data:{
            first_name: firstName,
            last_name: lastName,
            mobile_number: mobileNumber,
            reservation_date: reservationDate,
            reservation_time: reservationTime,
            people: parseInt(people)
        } 
      })
    };
    fetch('http://localhost:5000/reservations', requestOptions)
        .then(response => response.json())
        .then(data => console.log(data));
        history.push("/dashboard");
    }

    return(
        <form className="pl-3" onSubmit={handleSubmit}>
          <h3>New Reservation:</h3>
          <div class="mb-3">
                <label className="row">First Name:</label>
                <input className="row col-8" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} name="first_name" placeholder="First Name"/>
          </div>
          <div class="mb-3">
                <label className="row">Last Name:</label>
                <input className="row col-8" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} name="last_name" placeholder="Last Name"/>
          </div>
          <div class="mb-3">
                <label className="row">Mobile Number:</label>
                <input className="row col-8" type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} name="mobile_number" placeholder="XXX-XXX-XXXX"/>
          </div>
          <div class="mb-3">
                <label className="row">Reservation Date:</label>
                <input className="row col-8" type="date" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} name="reservation_date" />
          </div>
          <div class="mb-3">
                <label className="row">Reservation Time:</label>
                <input className="row col-8" type="time" value={reservationTime} onChange={(e) => setReservationTime(e.target.value)} name="reservation_time" />
          </div>
          <div class="mb-3">
                <label className="row">People:</label>
                <input className="row col-8" type="number" value={people} onChange={(e) => setPeople(e.target.value)} name="people" min="1" placeholder="XXX-XXX-XXXX"/>
          </div>
                <button className="btn btn-danger mx-1" onClick={() => history.goBack()}>Cancel</button>
                <button className="btn btn-success mx-1" type="submit">Submit</button>
        </form>
    );
}

export default NewReservation;