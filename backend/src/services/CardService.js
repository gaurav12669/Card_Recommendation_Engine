const CardModel = require('../models/CardModel');
const { travelConstant, shoppingConstant, fuelConstant, foodConstant } = require('../config/constants');

const DEFAULT_CARD = {
  card_name: 'HDFC Regalia Gold Credit Card',
  bank_name: 'HDFC Bank',
  rating: 4.5,
  reviews_count: 2847,
  best_for: 'Fuel Spends & Travel',
  total_savings: 0,
  annual_fees: 1500,
  net_savings: 0,
  categories: [],
};

class CardService {
  static getConstants() {
    return {
      travel: travelConstant,
      shopping: shoppingConstant,
      fuel: fuelConstant,
      food: foodConstant,
    };
  }

  static buildDefaultCard(spends) {
    const constants = CardService.getConstants();
    const categories = [];

    const travel = spends.travel ? spends.travel * 0.4 * constants.travel : 0;
    const shopping = spends.shopping ? spends.shopping * 0.5 * constants.shopping : 0;
    const fuel = spends.fuel ? spends.fuel * 0.6 * constants.fuel : 0;
    const food = spends.food ? spends.food * 0.7 * constants.food : 0;

    if (spends.travel) categories.push({ category: 'Travel', savings: Math.round(travel) });
    if (spends.shopping) categories.push({ category: 'Shopping', savings: Math.round(shopping) });
    if (spends.fuel) categories.push({ category: 'Fuel', savings: Math.round(fuel) });
    if (spends.food) categories.push({ category: 'Food', savings: Math.round(food) });

    const total = travel + shopping + fuel + food;

    return {
      ...DEFAULT_CARD,
      total_savings: Math.round(total),
      net_savings: Math.round(total - DEFAULT_CARD.annual_fees),
      categories,
    };
  }

  static async getCardRecommendations(spends) {
    const rows = await CardModel.findActiveCardsWithSavings();
    if (!rows || rows.length === 0) {
      const mockCard = CardService.buildDefaultCard(spends);
      return [mockCard];
    }

    const cardMap = new Map();

    rows.forEach((row) => {
      if (!cardMap.has(row.id)) {
        cardMap.set(row.id, {
          id: row.id,
          card_name: row.card_name,
          bank_name: row.bank_name,
          rating: row.rating,
          reviews_count: row.reviews_count,
          annual_fees: row.annual_fees,
          joining_fees: row.joining_fees,
          reward_points: row.reward_points,
          categories: [],
        });
      }

      if (row.category_key) {
        const cardData = cardMap.get(row.id);
        cardData.categories.push({
          category_key: row.category_key,
          category_name: row.category_name || row.category_key,
          savings_percentage: row.savings_percentage,
        });
      }
    });

    const constants = CardService.getConstants();

    const results = Array.from(cardMap.values()).map((card) => {
      let cardTotalSavings = 0;
      const categorySavings = [];

      const calculateCategory = (key, label, defaultMultiplier, spendValue) => {
        if (!spendValue) return;
        const category = card.categories.find((c) => c.category_key === key);
        let savings;
        if (category && category.savings_percentage) {
          savings = spendValue * (category.savings_percentage / 100);
        } else {
          savings = spendValue * defaultMultiplier;
        }
        cardTotalSavings += savings;
        categorySavings.push({
          category: label,
          savings: Math.round(savings),
          spent: spendValue,
        });
      };

      calculateCategory('travel', 'Travel', 0.4 * constants.travel, spends.travel);
      calculateCategory('shopping', 'Shopping', 0.5 * constants.shopping, spends.shopping);
      calculateCategory('fuel', 'Fuel', 0.6 * constants.fuel, spends.fuel);
      calculateCategory('food', 'Food', 0.7 * constants.food, spends.food);

      const bestCategory = categorySavings.length
        ? categorySavings.reduce((max, cat) => (cat.savings > max.savings ? cat : max), categorySavings[0])
        : { category: 'General', savings: 0 };

      return {
        id: card.id,
        card_name: card.card_name,
        bank_name: card.bank_name,
        rating: card.rating,
        reviews_count: card.reviews_count,
        best_for: `${bestCategory.category} Spends${categorySavings.length > 1 ? ' & More' : ''}`,
        total_savings: Math.round(cardTotalSavings),
        annual_fees: card.annual_fees,
        net_savings: Math.round(cardTotalSavings - card.annual_fees),
        categories: categorySavings,
      };
    });

    results.sort((a, b) => b.net_savings - a.net_savings);
    return results;
  }

  static async getCardById(cardId) {
    const cardDetails = await CardModel.findCardById(cardId);
    if (!cardDetails) {
      return null;
    }

    if (
      (!cardDetails.features || cardDetails.features.length === 0) &&
      !cardDetails.eligibility
    ) {
      cardDetails.features = [
        {
          feature_title: '4X reward points on dining',
          feature_description: 'Earn accelerated rewards on restaurant spends',
        },
        {
          feature_title: '2X on online shopping',
          feature_description: 'Double rewards on e-commerce purchases',
        },
        {
          feature_title: 'Complimentary airport lounge',
          feature_description: '4 domestic + 2 international per year',
        },
      ];

      cardDetails.eligibility = {
        min_age: 21,
        max_age: 60,
        min_income: 500000,
        min_cibil_score: 750,
      };
    }

    return cardDetails;
  }
}

module.exports = CardService;

