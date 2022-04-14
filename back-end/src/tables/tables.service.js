const knex = require("../db/connection");



function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdTables) => createdTables[0]);
}

function list() {
  return knex("tables")
    .select("*")
    .orderBy("tables.table_name", "asc");
}

function read(table_id) {
  return knex("tables")
    .select("*")
    .where({ table_id })
    .first();
}

function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

function updateReservation(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

function destroy(table_id) {
  return knex("tables")
    .select("*")
    .where({ table_id })
    .del();
}

function tableCapacityVsPeople(reservation_id){
  return knex("reservations")
    .join('tables', 'reservations.reservation_id', 'tables.reservation_id')
    .select('reservations.people', 'tables.capacity')
    .where("reservations.reservation_id", reservation_id)
}

function readReservationId(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .first();
}

function reservationSize(reservation_id) {
  return knex("reservations")
    .where({ reservation_id })
    .select("reservations.people")
    .first();
}

function tableStatus(table_id) {
  return knex("tables")
    .where({ table_id })
    .select("tables.status");
}

function tableCapacity(table_id) {
  return knex("tables")
    .where({ table_id })
    .select("tables.capacity")
    .first();
}

function reservationStatus(reservation_id) {
  return knex("reservations")
    .select("reservations.status")
    .where({ reservation_id: reservation_id });
}


module.exports = {
  create,
  read,
  list,
  update,
  delete: destroy,
  readReservationId,
  reservationSize,
  tableCapacityVsPeople,
  tableStatus,
  tableCapacity,
  reservationStatus,
  updateReservation,
};

