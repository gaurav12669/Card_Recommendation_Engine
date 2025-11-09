const CategoryModel = require('../models/CategoryModel');

const FALLBACK_CATEGORIES = [
  { id: 1, key: 'travel', name: 'Travel' },
  { id: 2, key: 'shopping', name: 'Shopping' },
  { id: 3, key: 'fuel', name: 'Fuel' },
  { id: 4, key: 'food', name: 'Food' },
];

class CategoryService {
  static async getActiveCategories() {
    const categories = await CategoryModel.findActive();
    if (!categories || categories.length === 0) {
      return FALLBACK_CATEGORIES;
    }
    return categories;
  }
}

module.exports = CategoryService;

