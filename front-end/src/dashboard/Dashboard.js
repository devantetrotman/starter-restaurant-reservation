import React, { useEffect } from "react";
import useState from 'react-usestateref';
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, useLocation } from "react-router";
import "../style.css";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, tables, todaysDate, loadTables }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [reservationDates, setReservationDates] = useState([]);
  const [todayPoint, setTodayPoint] = useState(0);
  const [point, setPoint, pointRef] = useState(0);
  const history = useHistory();

  const search = useLocation().search;
  const queryDate = new URLSearchParams(search).get('date');

  
  let datePointer;
  let todayPointer;
  let reservedDates = [];
  let sortedDates = [];

  useEffect(() => {
    loadDashboard();
    getReservations();
    loadTables();
  }, [date, search]);

  // useEffect(() => {
    
  // }, [todaysDate]);

  // useEffect(loadDashboard, [date, point]);

  function loadDashboard() {
    let tempDate = date;
    if (window.location.href.includes("?")){
      tempDate = window.location.href.split("?")[1].split("=")[1]
    }

    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: tempDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }



  async function getReservations(){
    const response = await fetch("http://localhost:5000/reservations");
    const theReservations = await response.json();
    const ourReservations = theReservations.data;
    for (let i = 0 ; i < ourReservations.length; i++){
        let reservationDate = ourReservations[i].reservation_date;
        let fixedReservationDate = reservationDate.substr(0,10);
        if (reservedDates.includes(fixedReservationDate)){
          continue;
        }
        else{
          reservedDates.push(fixedReservationDate);
        }
      }
    if (!reservedDates.includes(todaysDate)){
    reservedDates.push(todaysDate);
    }
    sortedDates = reservedDates.sort((a,b) => Date.parse(a) - Date.parse(b));
    setReservationDates(sortedDates);
    todayPointer = reservationDates.indexOf(todaysDate);
    setTodayPoint(todayPointer);
    if (queryDate){
      if (sortedDates.includes(queryDate)){
        datePointer = reservationDates.indexOf(queryDate);
        setPoint(datePointer);
      }
    }
    else{
      datePointer = todayPointer;
      setPoint(todayPointer);
    }
  }

  function todayClick(){
    setPoint(todayPoint);
    history.push(`/dashboard`);
  }

  function nextClick(){
    setPoint(point + 1);
    history.push(`/dashboard?date=${reservationDates[pointRef.current]}`);
    }
  

  function previousClick(){
    setPoint(point - 1);
    history.push(`/dashboard?date=${reservationDates[pointRef.current]}`);
  }

  async function handleClick(tableId){
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")){
      fetch(`http://localhost:5000/tables/${tableId}/seat/`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
      });
      window.alert("Table ready to seat new guests!")
      await loadTables();
    }
  }

  async function handleCancel(reservation_id){
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        data:{
          status: "cancelled"
      } 
    })
  };
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")){
      fetch(`http://localhost:5000/reservations/${reservation_id}/status`, requestOptions)
        .then(response => response.json())
        .then(data => console.log(data));
      window.alert("Reservation Cancelled.");
      await loadTables();
    }
  }

  

  return (
    <main className="dashboard">
      <h1 className="pl-3">Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="reservation-date">{`Reservations for date ${point === undefined ? "" : reservationDates[pointRef.current]}`}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {/* {JSON.stringify(reservations)} */}
      {reservations.map((reservation) =>(
        <div className="reservation" key={reservation.reservation_id}>
          <div className="reservation-entry">
            <p className="reservation-info">{`First Name: ${reservation.first_name}`}</p>
            <p className="reservation-info">{`Last Name: ${reservation.last_name}`}</p>
            <p className="reservation-info">{`Mobile Number: ${reservation.mobile_number}`}</p>
            <p className="reservation-info">{`Reservation Date: ${reservation.reservation_date}`}</p>
            <p className="reservation-info">{`Reservation Time: ${reservation.reservation_time}`}</p>
            <p className="reservation-info">{`Party Size: ${reservation.people}`}</p>
          </div>
          <div className="form-buttons">
            <a className="cancel-btn" 
            onClick={() => handleCancel(reservation.reservation_id)}
          data-reservation-id-cancel={reservation.reservation_id}
          href={`/reservations/${reservation.reservation_id}/seat`}>Cancel</a>
          {reservation.status === "booked" &&
            <a className="submit-btn"
          data-reservation-id-status={reservation.reservation_id}
          href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>
          }
          <a className="edit-btn"href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a> 
          </div>
        </div>
      ))}
      <div className="text-center">
        <button className="nav-btns" onClick={() => previousClick()}
        disabled={pointRef.current === 0}>Previous</button>
        <button className="nav-btns" onClick={() => todayClick()}>Today</button>
        <button className="nav-btns" onClick={() => nextClick()}
        disabled={pointRef.current === reservationDates.length - 1}>Next</button>
      </div>
      <h3 className="tables-heading">Tables:</h3>
      {
      tables.map((table) =>(
        <div className="tables" key={table.table_id}>
            <p className="table-name">{`Table Name: ${table.table_name}`}</p>
            <div className="table-info">
            <p className="table-entry">{`Capacity: ${table.capacity}`}</p>
            <p
            data-table-id-status={table.table_id}
            className="table-entry"
            >{`Status: ${table.status}`}</p>
          { table.status === "occupied" &&
            <button
            className="finish-btn"
            onClick={() => handleClick(table.table_id)}
            data-table-id-finish={table.table_id}
            >Finish</button>
          }
          </div>
        </div>
      ))}
      
    </main>
  );
}

export default Dashboard;
