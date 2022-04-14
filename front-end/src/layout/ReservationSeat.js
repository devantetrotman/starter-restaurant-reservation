import React, { useState } from "react";
import {useHistory, useParams} from "react-router-dom";

function ReservationSeat({tables, loadTables}){
    const [table_id, setTable_id] = useState(1);
    console.log(table_id);

    const {reservation_id} = useParams();
    const history = useHistory();

    async function handleSubmit(e){
        e.preventDefault();
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          data:{
                reservation_id: reservation_id
        } 
      })
    };
    
    fetch(`http://localhost:5000/tables/${table_id}/seat/`, requestOptions)
        .then(response => response.json())
        .then(data => console.log(data));
        await loadTables();
        history.push("/dashboard");
    }

    return(
        <form onSubmit={handleSubmit}>
                <h3>Seat Reservation</h3>
                <div class="m-3">
                    <label className="row">Choose Table ID:</label>
                    <select className="row col-4" id="table_id" name="table_id" onChange={(e) => setTable_id(e.target.value)}>
                        {tables.map((table) => (
                            <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
                        ))}
                    </select>
                </div>
                <button className="btn btn-danger mx-2 text-center" onClick={() => history.goBack()}>Cancel</button>
                <button className="btn btn-success mx-2 text-center" type="submit">Submit</button>
        </form>
    );
}

export default ReservationSeat;