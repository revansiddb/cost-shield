import { User } from './User';
import { Country } from './Country';
import { Plan } from './Plan';
import { AuthProvider } from './AuthProvider';
import { Subscription } from './Subscription';
import { Payment } from './Payment';
import { Project } from './Project';
import { CostEvent } from './CostEvent';
import { DailyCost } from './DailyCost';
import { BudgetAlert } from './BudgetAlert';

// ==========================================
// Define Relationships
// ==========================================

// User <-> Country
Country.hasMany(User, { foreignKey: 'countryId' });
User.belongsTo(Country, { foreignKey: 'countryId' });

// User <-> AuthProvider
User.hasMany(AuthProvider, { foreignKey: 'userId', as: 'authProviders' });
AuthProvider.belongsTo(User, { foreignKey: 'userId' });

// User <-> Subscription
User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

// Plan <-> Subscription
Plan.hasMany(Subscription, { foreignKey: 'planId' });
Subscription.belongsTo(Plan, { foreignKey: 'planId', as: 'plan' });

// User <-> Payment
User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

// Subscription <-> Payment
Subscription.hasMany(Payment, { foreignKey: 'subscriptionId' });
Payment.belongsTo(Subscription, { foreignKey: 'subscriptionId' });

// User <-> Project
User.hasMany(Project, { foreignKey: 'userId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'userId' });

// Project <-> CostEvent
Project.hasMany(CostEvent, { foreignKey: 'projectId', as: 'events' });
CostEvent.belongsTo(Project, { foreignKey: 'projectId' });

// Project <-> DailyCost
Project.hasMany(DailyCost, { foreignKey: 'projectId', as: 'dailyCosts' });
DailyCost.belongsTo(Project, { foreignKey: 'projectId' });

// Project <-> BudgetAlert
Project.hasMany(BudgetAlert, { foreignKey: 'projectId', as: 'alerts' });
BudgetAlert.belongsTo(Project, { foreignKey: 'projectId' });

export {
  User,
  Country,
  Plan,
  AuthProvider,
  Subscription,
  Payment,
  Project,
  CostEvent,
  DailyCost,
  BudgetAlert,
};
