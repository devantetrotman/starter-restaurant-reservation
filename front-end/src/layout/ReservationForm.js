import React, {useEffect} from "react";
import useState from 'react-usestateref'
import {useHistory, useParams, useLocation} from "react-router-dom";
import ErrorAlert from "./ErrorAlert";

    function ReservationForm({stateDate, stateTime, loadTables, tables}){
        const [firstName, setFirstName] = useState("");
        const [lastName, setLastName] = useState("");
        const [mobileNumber, setMobileNumber] = useState("");
        const [reservationDate, setReservationDate] = useState(stateDate);
        const [reservationTime, setReservationTime] = useState(stateTime);
        const [people, setPeople] = useState(1);
        const [edit, setEdit] = useState(null);
        const [errorMessage, setErrorMessage, errorMessageRef] = useState({});
        const [isError, setIsError, isErrorRef] = useState(false);
    
        const { reservation_id } = useParams();
        const history = useHistory();
        const location = useLocation();
    
        useEffect(() => {
            async function loadReservation(){
                if (location.pathname.includes("/edit")){
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
                    setEdit(true);
                }
                else{
                    setFirstName("");
                    setLastName("");
                    setMobileNumber("");
                    setReservationDate(stateDate);
                    setReservationTime(stateTime);
                    setPeople(1);
                    setEdit(false);
                }
            }
            loadReservation();
        },[reservation_id, location.pathname])
    

        async function handleEditSubmit(e){
          e.preventDefault();
          setIsError(false);
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
          try{
            const response = await fetch(`http://localhost:5000/reservations/${reservation_id}`, requestOptions);
            const data = await response.json();
            if (response.status !== 200){
                throw data.error;
            }
          }catch(error){
              setErrorMessage({message: error});
              setIsError(true);
          }
          if (!isError){
              history.push("/dashboard");
          }
        }

        async function handleCreateSubmit(e){
            e.preventDefault();
            setIsError(false);
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
                  people: Number(people)
              } 
            })
          };
          try{
            const response = await fetch('http://localhost:5000/reservations', requestOptions);
            const data = await response.json();
            if (response.status !== 200){
                throw data.error;
            }
          }catch(error){
              setErrorMessage({message: error});
              setIsError(true);
          }
          if (!isError){
              history.push(`/dashboard?date=${reservationDate}`);
          }
        }

    return(
        <div>
        {isErrorRef.current && <ErrorAlert error={errorMessageRef.current}/>}
        <form className="form" onSubmit={edit ? handleEditSubmit : handleCreateSubmit}>
            <h3>{edit ? "Edit Reservation:" : "New Reservation:"}</h3>
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

    export default ReservationForm;