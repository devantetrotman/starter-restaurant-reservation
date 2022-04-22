import React, {useEffect} from "react";
import useState from 'react-usestateref';
import {useHistory} from "react-router-dom";
import "../style.css";
// const reservations = require("../../back-end/src/db/seeds/00-reservations.json");

function NewReservation(){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [reservationDate, setReservationDate] = useState(null);
    const [reservationTime, setReservationTime] = useState(null);
    const [people, setPeople] = useState(1);
    const [errorMessage, setErrorMessage, errorMessageRef] = useState("");
    const [isError, setIsError] = useState(false);

    const history = useHistory();

//     useEffect(() => {

//     }, []);

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
        .then(data => setErrorMessage(data.error));
            // console.log(errorMessage);
            // console.log(isError);
        if (errorMessage !== ""){
              setIsError(true);
        }
      //   if (!isError){
      //         history.push("/dashboard");
       //8 }
    }

    return(
          <div>
      {isError && <p className="error">ERROR: {errorMessageRef.current}</p>}
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
            <input className="form-input" type="number" value={people} onChange={(e) => setPeople(e.target.value)} name="people" min="1"/>
      </div>
      <div className="form-buttons">
            <button className="cancel-btn" onClick={() => history.goBack()}>Cancel</button>
            <button className="submit-btn" type="submit">Submit</button>
      </div>
    </form>
    </div>
    );
}

export default NewReservation;