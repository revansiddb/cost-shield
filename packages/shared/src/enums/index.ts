// =============================
// Subscription Status
// =============================
export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
  PAST_DUE = 'past_due',
}

// =============================
// Project Status
// =============================
export enum ProjectStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

// =============================
// Alert Type
// =============================
export enum AlertType {
  WARNING = 'warning',
  CRITICAL = 'critical',
}

// =============================
// Payment Status
// =============================
export enum PaymentStatus {
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// =============================
// Billing Interval
// =============================
export enum BillingInterval {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

// =============================
// Payment Gateway
// =============================
export enum Gateway {
  RAZORPAY = 'razorpay',
  STRIPE = 'stripe',
  FREE = 'free',
}

// =============================
// Auth Provider
// =============================
export enum AuthProvider {
  PASSWORD = 'password',
  GOOGLE = 'google',
  GITHUB = 'github',
}

// =============================
// User Role
// =============================
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
