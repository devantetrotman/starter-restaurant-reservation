const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservations = require("../db/fixtures/reservations");
var moment = require('moment');

/**
 * List handler for reservation resources
 */

// Validation Functions

 async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({ status: 404, message: `Reservation ${reservation_id} cannot be found.` });
}

function bodyHasFirstName(req, res, next) {
  const { data: { first_name } = {} } = req.body
  if (first_name) {
    return next();
  }
  next({
    status: 400,
    message: `A 'first_name' ${first_name} property is required.`,
  })
}

function bodyHasLastName(req, res, next) {
  const { data: { last_name } = {} } = req.body
  if (last_name) {
    return next()
  }
  next({
    status: 400,
    message: `A 'last_name' property is required.`,
  })
}

function bodyHasMobileNumber(req, res, next) {
  const { data: { mobile_number } = {} } = req.body
  if (mobile_number) {
    return next()
  }
  next({
    status: 400,
    message: `A 'mobile_number' property is required.`,
  })
}

function bodyHasReservationDate(req, res, next) {
  const { data: { reservation_date } = {} } = req.body
  const reservatedDate = new Date(reservation_date);
  if (reservation_date) {
    if (RegExp(/\d{4}-\d{2}-\d{2}/).test(reservation_date)){
    res.locals.reservation_date = reservation_date
    return next()
    }
    else{
      next({
      status: 400,
      message: `A 'reservation_date' property must be a date.`,
      })
    }
  }
  else {
    next({
    status: 400,
    message: `A 'reservation_date' property is required.`,
    })
  }
}

function bodyHasReservationTime(req, res, next) {
  const { data: { reservation_time } = {} } = req.body
  const reservatedTime = new Date(reservation_time);
  if (reservation_time) {
    if (RegExp(/\d{2}:\d{2}/).test(reservation_time)){
    res.locals.reservation_time = reservation_time
    return next()
    }
    next({
      status: 400,
      message: `A 'reservation_time' property must be a time.`,
    })
  }
  next({
    status: 400,
    message: `A 'reservation_time' property is required.`,
  })
}

function bodyHasPeople(req, res, next) {
  const { data: { people } = {} } = req.body
  if (people) {
    if (typeof people == "number"){
      if (people > 0){
        res.locals.people = people
        return next()
      }
      next({
        status: 400,
        message: `A 'people' property must be a more than zero.`,
      })
    }
    next({
      status: 400,
      message: `A 'people' property must be a number.`,
    })
  }
  next({
    status: 400,
    message: `A 'people' property is required.`,
  })
}

function validReservationDate(req, res, next) {
  const { data: { reservation_date } = {} } = req.body
  const today = moment().toDate();
  const reservedDate = moment(reservation_date);
  if (moment(reservation_date).isBefore(today) ) {
      next({
      status: 400,
      message: `A reservation must be a future date`,
      })
    }
  if (reservedDate.day() === 2 ) {
      next({
      status: 400,
      message: `A 'reservation_date' cannot be on a Tuesday due to the restaurant being closed.`,
      })
    } 
  return next()
  }

  function validReservationTime(req, res, next) {
    const { data: { reservation_time } = {} } = req.body
    const hours = reservation_time.substr(0,2);
    const minutes = reservation_time.substr(3,2);
    if (parseInt(hours) < 10 || parseInt(hours) > 21  ) {
        next({
        status: 400,
        message: `reservation_time must be between 10:30am-9:30pm`,
        })
      }
    if (parseInt(hours) === 10 || parseInt(hours) === 21) {
        if (parseInt(minutes) < 30){
          next({
          status: 400,
          message: `reservation_time must be between 10:30am-9:30pm`,
          })
        }
      } 
    return next()
    }

    function reservationStatus(req, res, next){
      const { status } = req.body.data;
      if (status === "booked" || status === undefined){
        return next();
      }
      else {
        next({
            status: 400,
            message: `Reservation status ${status} is invalid`,
          })
        }
    }

    function validStatus(req, res, next){
      const { status } = req.body.data;
      const validStatus = ["booked", "seated", "finished", "cancelled"];
      if (validStatus.includes(status)){
        return next();
      }
      next({
        status: 400,
        message: "Reservation is unknown",
      })
    }

    async function reservationNotFinished(req, res, next) {
      const { reservation_id } = req.params;
      const status = await service.reservationStatus(reservation_id);
      if (status[0].status === "finished"){
        next({
          status: 400,
          message: `A finished Reservation cannot be updated.`,
        })
      }
      return next();
    }

    async function statusIsCancelled(req, res, next) {
      const { status } = req.body.data;
      if (status === "cancelled"){
        return next();
        
      }
      next({
        status: 400,
        message: `status ${status} is not valid.`,
      })
    }

    


// CRUD Functions

async function create(req, res) {
  const newReservation = {
    ...req.body.data,
    status: "booked"
  }
  const data = await service.create(newReservation);
  res.status(201).json({ data  });
}

 async function list(req, res, next) {
  const date = req.query.date
  const {mobile_number} = req.query;
  mobile_number && res.json({ data: await service.search(mobile_number) });
  const data = date ? await service.reservationDates(date): await service.list();
  res.json({data})
}

async function read (req, res) {
  const {reservation_id} = req.params;
  res.status(200).json({ data: await service.read(reservation_id) });
}

async function update(req, res) {
  const updatedReservation = {
    ...req.body.data,
    status: req.body.data.status,
    reservation_id: req.params.reservation_id
  };
  await service.update(updatedReservation).then((data) => res.status(200).json({ data }));
}

async function mobileNumberSearch (req, res) {
  const {mobile_number} = req.query;
  res.json({ data: await service.search(mobile_number) });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read)
  ],
  create: [
    asyncErrorBoundary(bodyHasFirstName), 
    asyncErrorBoundary(bodyHasLastName), 
    asyncErrorBoundary(bodyHasMobileNumber), 
    asyncErrorBoundary(bodyHasReservationDate), 
    asyncErrorBoundary(bodyHasReservationTime), 
    asyncErrorBoundary(bodyHasPeople),
    asyncErrorBoundary(validReservationDate),
    asyncErrorBoundary(validReservationTime),
    asyncErrorBoundary(reservationStatus), 
    asyncErrorBoundary(create)
  ],
  update: [
    asyncErrorBoundary(reservationExists), 
    asyncErrorBoundary(bodyHasFirstName), 
    asyncErrorBoundary(bodyHasLastName), 
    asyncErrorBoundary(reservationNotFinished), 
    asyncErrorBoundary(bodyHasMobileNumber), 
    asyncErrorBoundary(bodyHasReservationDate), 
    asyncErrorBoundary(bodyHasReservationTime), 
    asyncErrorBoundary(bodyHasPeople),
    asyncErrorBoundary(validReservationDate),
    asyncErrorBoundary(validReservationTime),  
    asyncErrorBoundary(update)
  ],
  statusUpdate: [
    asyncErrorBoundary(reservationExists), 
      asyncErrorBoundary(validStatus), 
      asyncErrorBoundary(reservationNotFinished),
    asyncErrorBoundary(update)
  ],
  readSearch: [asyncErrorBoundary(mobileNumberSearch)],
};
