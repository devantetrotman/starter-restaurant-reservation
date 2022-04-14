/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
    .route("/search")
    .get(controller.readSearch)
    .all(methodNotAllowed);

router
    .route("/:reservation_id/status")
    .put(controller.statusUpdate)
    .all(methodNotAllowed);

router
    .route("/:reservation_id/seat")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);

router
    .route("/:reservation_id")
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed);

router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);

module.exports = router;
