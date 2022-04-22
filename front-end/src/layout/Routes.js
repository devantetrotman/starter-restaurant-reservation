import React, { useState, useEffect } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewTable from "./NewTable";
import ReservationSeat from "./ReservationSeat";
import Search from "./Search";
import ReservationForm from "./ReservationForm";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */



function Routes() {

  const [tables, setTables] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

 useEffect(() => {
  async function loadTables() {
    const response = await fetch(
      `http://localhost:5000/tables`
    );
    const theTables = await response.json();
    setTables(theTables.data);
  }
  loadTables();
  
}, []);

// const loadTables = useCallback(async() => {
//   const response = await fetch(
//   `http://localhost:5000/tables`
//   );
//   const theTables = await response.json();
//   setTables(theTables.data);
// }, [])

  async function loadTables() {
    const response = await fetch(
      `http://localhost:5000/tables`
    );
    const theTables = await response.json();
    setTables(theTables.data);
  }

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function formatTime(date) {
  var d = new Date(date),
      hour = (d.getHours()),
      minute = d.getMinutes();
      if (hour > 12) {
        hour = hour - 12;
        if (hour < 10) {
          hour = "0" + hour;
        }
      }
      if (minute < 10) {
        minute =  "0" + minute;
        
      }

  return [hour, minute].join(':');
}

  const stateDate = formatDate(today());
  const stateTime = formatTime(today());

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} tables={tables} todaysDate={today()} loadTables={loadTables} errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
      </Route>
      <Route path="/reservations/new">
        
        <ReservationForm stateDate={stateDate} stateTime={stateTime} tables={tables} loadTables={loadTables} errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <ReservationSeat tables={tables} loadTables={loadTables} errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <ReservationForm stateDate={stateDate} stateTime={stateTime} tables={tables} loadTables={loadTables} errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
      </Route>
      <Route path="/tables/new">
        <NewTable loadTables={loadTables} errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
      </Route>
      <Route path="/search">
        <Search loadTables={loadTables} errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
