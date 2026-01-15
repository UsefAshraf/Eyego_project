const express = require('express');
const { body } = require('express-validator');

function createActivityRoutes(activityController) {
  const router = express.Router();

  // POST /api/activities - Create new activity (send to Kafka)
  router.post(
    '/',
    [
      body('userId').notEmpty().withMessage('userId is required'),
      body('action').notEmpty().withMessage('action is required'),
      body('metadata').optional().isObject()
    ],
    (req, res, next) => activityController.createActivity(req, res, next)
  );

  // GET /api/activities - Get activities with filters and pagination
  router.get(
    '/',
    (req, res, next) => activityController.getActivities(req, res, next)
  );

  return router;
}

module.exports = createActivityRoutes;