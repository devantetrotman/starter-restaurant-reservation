const knex = require("../db/connection");



function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdReservations) => createdReservations[0]);
}

function list() {
  return knex("reservations").select("*");
}

function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .first();
}

function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

function reservationDates(date) {
  return knex("reservations")
    .distinct("reservations.*")
    .where({ "reservations.reservation_date": date })
    .whereNot("reservations.status", "finished")
    .orderBy('reservations.reservation_time', 'asc');
}

function tableStatus(table_id) {
  return knex("tables")
    .where({ table_id })
    .select("tables.status");
}

function reservationStatus(reservation_id) {
  return knex("reservations")
    .select("reservations.status")
    .where({ reservation_id: reservation_id });
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '-', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
  }


module.exports = {
  create,
  read,
  list,
  update,
  reservationDates,
  search,
  reservationStatus,
};

