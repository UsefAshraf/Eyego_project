// Use case: Retrieve activities
class GetActivities {
  constructor(activityService) {
    this.activityService = activityService;
  }

  async execute(filters, pagination) {
    return await this.activityService.getActivities(filters, pagination);
  }
}

module.exports = GetActivities;