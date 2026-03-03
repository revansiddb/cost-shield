import { Resend } from 'resend';
import { AlertType } from '@costshield/shared';

import { config } from '../../config';
import { logger } from '../../utils';
import { User } from '../../models';

const resend = new Resend(config.resend.apiKey);

export const alertsService = {
  /**
   * Send a budget alert email via Resend.
   * This function wraps the entire process in a try/catch.
   * NEVER throw an error from this function. It must fail silently and log.
   */
  async sendBudgetAlertEmail(
    userId: string,
    projectName: string,
    alertType: AlertType,
    currentCost: number, // in floating point or converted string
    limit: number,
    currencyCode: string,
  ): Promise<void> {
    try {
      // It's safe to fetch user here or we could pass user email directly if we joined it earlier.
      // But passing userId is fine since email sending happens after the fast track transaction.
      const user = await User.findByPk(userId);
      if (!user) {
        logger.warn('Failed to send alert email: User not found', { userId });
        return;
      }

      const isCritical = alertType === AlertType.CRITICAL;
      const subject = isCritical
        ? `🚨 CRITICAL: Budget Limit Reached for Project ${projectName}`
        : `⚠️ WARNING: Approaching Budget Limit for Project ${projectName}`;

      const percentage = Math.round((currentCost / limit) * 100);

      // Create a nice looking email string
      const htmlContent = `
        <h2>CostShield Budget Alert</h2>
        <p>Hello ${user.firstName || 'Developer'},</p>
        <p>This is an automated alert from CostShield.</p>
        <p>Your project <strong>${projectName}</strong> has ${isCritical ? 'reached' : 'exceeded'} its budget threshold.</p>
        <ul>
          <li><strong>Alert Level:</strong> ${alertType.toUpperCase()}</li>
          <li><strong>Current Usage:</strong> ${currentCost.toFixed(2)} ${currencyCode} (${percentage}%)</li>
          <li><strong>Budget Limit:</strong> ${limit.toFixed(2)} ${currencyCode}</li>
        </ul>
        <p>Please review your usage in the CostShield dashboard.</p>
        <p>Thanks,<br/>The CostShield Team</p>
      `;

      // If we are in development and no api key is set, we just log it and return instead of failing calling Resend.
      if (!config.resend.apiKey || config.resend.apiKey === '') {
        logger.info('Simulating Alert Email (Resend API Key not set)', {
          subject,
          userEmail: user.email,
        });
        return;
      }

      await resend.emails.send({
        from: config.resend.fromEmail,
        to: user.email,
        subject: subject,
        html: htmlContent,
      });

      logger.info('Budget alert email sent successfully', {
        userId,
        projectId: projectName,
        type: alertType,
      });
    } catch (error) {
      // Must not throw because it might be awaited in the controller and we shouldn't fail the request.
      logger.error('Failed to send budget alert email via Resend', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
    }
  },
};
