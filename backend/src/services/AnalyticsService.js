const AnalyticsModel = require('../models/AnalyticsModel');

class AnalyticsService {
  static async logCardApplication(data) {
    try {
      await AnalyticsModel.logCardApplication(data);
      return true;
    } catch (error) {
      console.error('Failed to log card application analytics:', error.message);
      return false;
    }
  }
}

module.exports = AnalyticsService;

