import React, { useState, useEffect } from "react";
import {useHistory, useParams} from "react-router-dom";
import "../style.css";

function EditReservation({errorMessage, setErrorMessage, stateDate, stateTime}){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [reservationDate, setReservationDate] = useState(stateDate);
    const [reservationTime, setReservationTime] = useState(stateTime);
    const [people, setPeople] = useState(1);

    const { reservation_id } = useParams();
    const history = useHistory();

    useEffect(() => {
        async function loadReservation(){
            const response = await fetch(`http://localhost:5000/reservations/${reservation_id}`);
            const theReservation = await response.json();
            const theReservationsData = theReservation.data;
            setFirstName(theReservationsData.first_name);
            setLastName(theReservationsData.last_name);
            setMobileNumber(theReservationsData.mobile_number);
            const resDate = theReservationsData.reservation_date.substr(0,10);
            setReservationDate(resDate);
            setReservationTime(theReservationsData.reservation_time);
            setPeople(theReservationsData.people);
        }
        loadReservation();
    },[reservation_id])

    async function handleSubmit(e){
        e.preventDefault();
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          data:{
            first_name: firstName,
            last_name: lastName,
            mobile_number: mobileNumber,
            reservation_date: reservationDate,
            reservation_time: reservationTime,
            people: Number(people)
        } 
      })
    };
    fetch(`http://localhost:5000/reservations/${reservation_id}`, requestOptions)
        .then(response => response.json())
        .then(data => setErrorMessage(data.error));
        history.push("/dashboard");
    }

    return(
      <div>
      {errorMessage && <p>{errorMessage}</p>}
      <form className="form" onSubmit={handleSubmit}>
            <h3>New Reservation:</h3>
            <div className="form-line">
                  <label className="form-label">First Name:</label>
                  <input className="form-input" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} name="first_name" placeholder="First Name"/>
            </div>
            <div className="form-line">
                  <label className="form-label">Last Name:</label>
                  <input className="form-input" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} name="last_name" placeholder="Last Name"/>
            </div>
            <div className="form-line">
                  <label className="form-label">Mobile Number:</label>
                  <input className="form-input" type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} name="mobile_number" placeholder="XXX-XXX-XXXX"/>
            </div>
            <div className="form-line">
                  <label className="form-label">Reservation Date:</label>
                  <input className="form-input" type="date" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} name="reservation_date" />
            </div>
            <div className="form-line">
                  <label className="form-label">Reservation Time:</label>
                  <input className="form-input" type="time" value={reservationTime} onChange={(e) => setReservationTime(e.target.value)} name="reservation_time" />
            </div>
            <div className="form-line">
                  <label className="form-label">People:</label>
                  <input className="form-input" type="number" value={people} onChange={(e) => setPeople(e.target.value)} name="people" min="1" placeholder="XXX-XXX-XXXX"/>
            </div>
            <div className="form-buttons">
                  <button className="cancel-btn" onClick={() => history.goBack()}>Cancel</button>
                  <button className="submit-btn" type="submit">Submit</button>
            </div>
    </form>
    </div>
    );
}

export default EditReservation;