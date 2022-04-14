const service = require("./tables.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */

// Validation Functions

 async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  if (!table) {
    next({ 
      status: 404, 
      message: `Table ${table_id} cannot be found.` 
    });
  }
  res.locals.table = table;
  return next();
}

function correctCapacity(req, res, next) {
  // const { data: { capacity } } = req.body
  const { capacity } = req.body.data;
  console.log("Capacity body",capacity)
  if (capacity) {
    if (capacity === 0 || typeof capacity !== "number"){
      next({
        status: 400,
        message: `capacity must be a number above 0.`,
      })
    }
    res.locals.capacity = capacity;
    return next()
    
  }
  next({
    status: 400,
    message: `A table must have a capacity property.`,
  })
}

function tableHasName(req, res, next) {
  const { data: { table_name } = {} } = req.body
  if (table_name) {
    if (table_name.length === 1){
      next({
        status: 400,
        message: `A 'table_name' must be at least 2 characters.`,
      })
    }
    res.locals.table_name = table_name
    return next()
  }
  next({
    status: 400,
    message: `A 'table_name' property is required.`,
  })
}

function tableHasReservationId(req, res, next) {
  const { data: { reservation_id } = {} } = req.body
  if (reservation_id) {
    res.locals.reservation_id = reservation_id;
    return next();
  }
  next({
    status: 400,
    message: `An reservation_id is required.`,
  })
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await service.readReservationId(reservation_id);
  if (!reservation) {
    return next({ status: 404, message: `Reservation ${reservation_id} cannot be found.` });
  }
  res.locals.reservation = reservation;
  return next();
}

async function tableHasRightCapacity(req, res, next) {
  const { reservation_id } = req.body.data;
  const { table_id } = req.params;
  const reservationPeople = await service.reservationSize(reservation_id);
  console.log("Reservation People",reservationPeople.people);
  const tableSize = await service.tableCapacity(table_id);
  console.log("Table Size",tableSize);
  console.log(reservationPeople.people > tableSize.capacity);
  if (reservationPeople.people < tableSize.capacity || reservationPeople.people === tableSize.capacity) {
    return next();
  }
  else {
    next({ 
      status: 400, 
      message: `Table does not have the appropriate capacity for this reservation.` 
    });
    
  }
}

async function tableNotOccupied(req, res, next) {
  const { table_id } = req.params;
  const status = await service.tableStatus(table_id);
  if (status[0].status === "occupied") {
    next({
      status: 400,
      message: `An occupied table cannot be seated.`,
    });
  }
  return next();
}

async function tableStatus(req, res, next) {
  const { table_id } = req.params;
  const status = await service.tableStatus(table_id);
  if (status[0].status === "occupied"){
    return next();
  }
  else{
    next({
      status: 400,
      message: `not occupied.`,
    })
  }
}

async function tableNotSeated(req, res, next) {
  const { table_id } = req.params;
  const status = await service.tableStatus(table_id);
  if (status[0].status === "seated"){
    next({
      status: 400,
      message: `Tabled is seated.`,
    })
  }
  else{
    return res.status(200).json("Table is free!"); 
  }
}

async function reservationSeated(req, res, next) {
  const { reservation_id } = req.body.data;
  const status = await service.reservationStatus(reservation_id);
  if (status[0].status === "seated"){
    next({
      status: 400,
      message: `Reservation is currently seated.`,
    })
  }
  return next();
}



// CRUD Functions

async function create(req, res) {
  const newTable = {
    ...req.body.data,
    status: "Free",
  };
  res.status(201).json({ data: await service.create(newTable) });
}

 async function list(req, res, next) {
  res.json({ data: await service.list() });
}

async function read (req, res) {
  const {table_id} = req.params;
  const data = await service.read(table_id);
  res.json({data})
}

async function update(req, res) {
  const updatedTable = {
    ...req.body.data,
    status: "occupied",
    table_id: req.params.table_id,
    reservation_id: req.body.data.reservation_id,
  };
  await service.update(updatedTable).then((data) => res.status(200).json({ data }));
}

async function updateRes(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    status: "seated",
  };
  await service.updateReservation(updatedReservation);
  return next();
}

async function destroy(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    status: "finished",
  };
  if (req.body.data){
    await service.updateReservation(updatedReservation);
    await service.delete(res.locals.table.table_id).then(() => res.sendStatus(200));
  }
  else {
    await service.delete(res.locals.table.table_id).then(() => res.sendStatus(200));
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [
    asyncErrorBoundary(tableExists), 
    asyncErrorBoundary(read)
  ],
  create: [
    asyncErrorBoundary(tableHasName),
    asyncErrorBoundary(correctCapacity),
    asyncErrorBoundary(create)
  ],
  update: [
    asyncErrorBoundary(tableExists), 
    asyncErrorBoundary(tableHasReservationId), 
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableHasRightCapacity),  
    asyncErrorBoundary(tableNotOccupied),
    asyncErrorBoundary(reservationSeated),
    asyncErrorBoundary(updateRes),
    asyncErrorBoundary(update)
  ],
  delete: [
    asyncErrorBoundary(tableExists), 
    asyncErrorBoundary(tableStatus),
    asyncErrorBoundary(destroy)
  ],
};
