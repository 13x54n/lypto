const SectionCard = require('../models/SectionCard');
const Payment = require('../models/Payment');

class SectionCardService {
  // Static section card templates
  static getStaticTemplates() {
    return [
      {
        title: "Total Revenue",
        description: "Total revenue generated",
        businessType: "revenue"
      },
      {
        title: "Active Subscriptions", 
        description: "Active subscription payments",
        businessType: "subscriptions"
      },
      {
        title: "One-time Payments",
        description: "One-time payment count", 
        businessType: "payments"
      },
      {
        title: "Refunds",
        description: "Total refunds processed",
        businessType: "refunds"
      }
    ];
  }

  // Get static values for section cards (no payment data dependency)
  static getStaticValues() {
    return {
      totalRevenue: 15420.50,
      subscriptionPayments: 7,
      oneTimePayments: 3,
      refunds: 3
    };
  }

  // Update section cards with static values for a specific user
  static async updateSectionCards(userId) {
    try {
      const staticValues = this.getStaticValues();
      const templates = this.getStaticTemplates();

      for (const template of templates) {
        let value, trend, trendLabel;

        switch (template.businessType) {
          case 'revenue':
            value = `$${staticValues.totalRevenue.toFixed(2)}`;
            trend = 24.5;
            trendLabel = "+24.5%";
            break;
          case 'subscriptions':
            value = staticValues.subscriptionPayments.toString();
            trend = 31;
            trendLabel = "+31%";
            break;
          case 'payments':
            value = staticValues.oneTimePayments.toString();
            trend = 18.2;
            trendLabel = "+18.2%";
            break;
          case 'refunds':
            value = staticValues.refunds.toString();
            trend = -5.2;
            trendLabel = "-5.2%";
            break;
          default:
            continue;
        }

        // Update or create section card for the specific user
        await SectionCard.findOneAndUpdate(
          { userId: userId, title: template.title },
          {
            userId: userId,
            ...template,
            value,
            trend,
            trendLabel,
            lastUpdated: new Date(),
            dataSource: 'static'
          },
          { upsert: true, new: true }
        );
      }

      console.log(`Section cards updated with static values for user ${userId}`);
    } catch (error) {
      console.error('Error updating section cards:', error);
      throw error;
    }
  }

  // Get all section cards for a specific user
  static async getSectionCards(userId) {
    try {
      return await SectionCard.find({ userId }).sort({ title: 1 });
    } catch (error) {
      console.error('Error fetching section cards:', error);
      throw error;
    }
  }

  // Manually update a section card value for a specific user
  static async updateSectionCardValue(userId, title, value, trend, trendLabel) {
    try {
      const sectionCard = await SectionCard.findOne({ userId, title });
      if (!sectionCard) {
        throw new Error(`Section card with title "${title}" not found for user ${userId}`);
      }

      sectionCard.value = value;
      sectionCard.trend = trend;
      sectionCard.trendLabel = trendLabel;
      sectionCard.lastUpdated = new Date();
      sectionCard.dataSource = 'manual';

      return await sectionCard.save();
    } catch (error) {
      console.error('Error updating section card value:', error);
      throw error;
    }
  }

  // Initialize section cards with static templates for a specific user
  static async initializeSectionCards(userId) {
    try {
      const staticValues = this.getStaticValues();
      const templates = this.getStaticTemplates();
      
      for (const template of templates) {
        let value, trend, trendLabel;

        switch (template.businessType) {
          case 'revenue':
            value = `$${staticValues.totalRevenue.toFixed(2)}`;
            trend = 24.5;
            trendLabel = "+24.5%";
            break;
          case 'subscriptions':
            value = staticValues.subscriptionPayments.toString();
            trend = 31;
            trendLabel = "+31%";
            break;
          case 'payments':
            value = staticValues.oneTimePayments.toString();
            trend = 18.2;
            trendLabel = "+18.2%";
            break;
          case 'refunds':
            value = staticValues.refunds.toString();
            trend = -5.2;
            trendLabel = "-5.2%";
            break;
          default:
            value = "0";
            trend = 0;
            trendLabel = "0%";
        }

        await SectionCard.findOneAndUpdate(
          { userId: userId, title: template.title },
          {
            userId: userId,
            ...template,
            value,
            trend,
            trendLabel,
            lastUpdated: new Date(),
            dataSource: 'static'
          },
          { upsert: true, new: true }
        );
      }

      console.log(`Section cards initialized with static values for user ${userId}`);
    } catch (error) {
      console.error('Error initializing section cards:', error);
      throw error;
    }
  }

  // Auto-seed section cards for new users (initialize if no data exists)
  static async autoSeedForUser(userId) {
    try {
      // Check if user already has section cards
      const existingCards = await SectionCard.find({ userId });
      
      if (existingCards.length === 0) {
        console.log(`No section cards found for user ${userId}, auto-seeding...`);
        
        // Initialize with default templates
        await this.initializeSectionCards(userId);
        
        // Calculate values from user's payment data
        await this.updateSectionCards(userId);
        
        console.log(`Auto-seeding completed for user ${userId}`);
        return true; // Indicates that seeding was performed
      }
      
      return false; // Indicates that user already had data
    } catch (error) {
      console.error('Error auto-seeding section cards:', error);
      throw error;
    }
  }

  // Check if user has section cards and auto-seed if needed
  static async ensureUserHasData(userId) {
    try {
      const existingCards = await SectionCard.find({ userId });
      
      if (existingCards.length === 0) {
        console.log(`User ${userId} has no section cards, auto-seeding...`);
        await this.autoSeedForUser(userId);
        return await SectionCard.find({ userId }); // Return the newly created cards
      }
      
      return existingCards; // Return existing cards
    } catch (error) {
      console.error('Error ensuring user has data:', error);
      throw error;
    }
  }
}

module.exports = SectionCardService;
