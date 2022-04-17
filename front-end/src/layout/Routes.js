import React, { useState, useEffect } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservation from "./NewReservation";
import NewTable from "./NewTable";
import ReservationSeat from "./ReservationSeat";
import Search from "./Search";
import EditReservation from "./EditReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */



function Routes() {

  const [tables, setTables] = useState([]);

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

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} tables={tables} todaysDate={today()} loadTables={loadTables}/>
      </Route>
      <Route path="/reservations/new">
        <NewReservation loadTables={loadTables}/>
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <ReservationSeat tables={tables} loadTables={loadTables}/>
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation tables={tables} loadTables={loadTables}/>
      </Route>
      <Route path="/tables/new">
        <NewTable loadTables={loadTables}/>
      </Route>
      <Route path="/search">
        <Search loadTables={loadTables}/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
