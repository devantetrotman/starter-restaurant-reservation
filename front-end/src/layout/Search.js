import React, { useState } from "react";

function Search({loadTables}){
    const [mobileNumber, setMobileNumber] = useState("Enter a customer's phone number");
    const [matchedReservations, setMatchedReservations] = useState([]);

    async function handleSubmit(e){
        e.preventDefault();
        const response = await fetch(
             `http://localhost:5000/reservations/search?mobile_number=${mobileNumber}`
              );
        const reservations = await response.json();
        setMatchedReservations(mobileNumber !== "" ? reservations.data : []);
        
    }

    async function handleClick(reservation_id){
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")){
                await fetch(`https://reservations/${reservation_id}/status`, {
                    method: 'PUT',
                    body: JSON.stringify({data: { status: 'cancelled' }})
                });
                await loadTables();
        }
    }


    return(
        <div>
            <h3>Reservation Search:</h3>
            <form onSubmit={handleSubmit}>
                    <label>Mobile Number:</label>
                    <input className="m-2 col-4" type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} name="mobile_number" />
                    <button className="btn btn-success m-1" type="submit">Find</button>
            </form>
            <div>
                {matchedReservations == null && <div> No Reservations Found</div>}
                {matchedReservations !== null && matchedReservations.length === 0 && <h4>No Reservations Found</h4>}
                {matchedReservations !== null && matchedReservations.length > 0 && <h4>Matching Records:</h4>}
                {matchedReservations.map((reservation) =>(
                    <div className="row border border-dark m-3" key={reservation.reservation_id}>
                    <p className="col-2 mx-2">{`First Name: ${reservation.first_name}`}</p>
                    <p className="col-2 mx-2">{`Last Name: ${reservation.last_name}`}</p>
                    <p className="col-2 mx-2">{`Mobile Number: ${reservation.mobile_number}`}</p>
                    <p className="col-2 mx-2">{`Reservation Date: ${reservation.reservation_date}`}</p>
                    <p className="col-2 mx-2">{`Reservation Time: ${reservation.reservation_time}`}</p>
                    <p className="col-2 mx-2">{`Party Size: ${reservation.people}`}</p> 
                    <a className="btn btn-primary m-2" href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a>
                    <button
                    className="btn btn-danger m-2"
                    onClick={() => handleClick(reservation.reservation_id)}
                    data-reservation-id-cancel={reservation.reservation_id}>
                        Cancel
                    </button>
                  </div>
                ))}
            </div>
        </div>
    );
}

export default Search;