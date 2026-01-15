// Domain service: Business logic that doesn't fit in entities
class ActivityService {
  constructor(activityRepository) {
    this.activityRepository = activityRepository;
  }

  async processActivity(activityData) {
    // Business rules here
    const UserActivity = require('../entities/UserActivity');
    const activity = new UserActivity(activityData);
    
    activity.validate();
    
    // Save to repository
    return await this.activityRepository.save(activity);
  }

  async getActivities(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    
    return await this.activityRepository.findAll(filters, {
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    });
  }
}

module.exports = ActivityService;