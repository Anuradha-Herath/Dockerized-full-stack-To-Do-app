const fs = require('fs');
const path = require('path');

// Security monitoring and alerting system
class SecurityMonitor {
  constructor() {
    this.logFile = path.join(__dirname, 'security-events.log');
    this.alertsFile = path.join(__dirname, 'security-alerts.log');
    this.events = [];
    this.alerts = [];
  }

  // Log security event
  logSecurityEvent(event) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'security_event',
      ...event
    };

    this.events.push(logEntry);
    this.writeToFile(this.logFile, logEntry);

    // Check if this event should trigger an alert
    this.checkForAlerts(logEntry);
  }

  // Check for alert conditions
  checkForAlerts(event) {
    const alerts = [];

    // Alert on multiple failed login attempts from same IP
    if (event.type === 'failed_login') {
      const recentFailures = this.events.filter(e =>
        e.type === 'failed_login' &&
        e.ip === event.ip &&
        new Date() - new Date(e.timestamp) < 300000 // Last 5 minutes
      );

      if (recentFailures.length >= 5) {
        alerts.push({
          level: 'HIGH',
          type: 'BRUTE_FORCE_ATTEMPT',
          message: `Multiple failed login attempts from IP: ${event.ip}`,
          details: { attempts: recentFailures.length, ip: event.ip }
        });
      }
    }

    // Alert on account lockouts
    if (event.type === 'account_locked') {
      alerts.push({
        level: 'MEDIUM',
        type: 'ACCOUNT_LOCKOUT',
        message: `Account locked due to multiple failed attempts: ${event.email}`,
        details: { email: event.email, ip: event.ip }
      });
    }

    // Alert on CSRF attempts
    if (event.type === 'csrf_attempt') {
      alerts.push({
        level: 'HIGH',
        type: 'CSRF_ATTACK',
        message: 'CSRF attack attempt detected',
        details: { ip: event.ip, userAgent: event.userAgent }
      });
    }

    // Alert on unusual OAuth activity
    if (event.type === 'oauth_suspicious') {
      alerts.push({
        level: 'MEDIUM',
        type: 'OAUTH_ANOMALY',
        message: 'Suspicious OAuth activity detected',
        details: event.details
      });
    }

    // Process alerts
    alerts.forEach(alert => this.triggerAlert(alert));
  }

  // Trigger security alert
  triggerAlert(alert) {
    const alertEntry = {
      timestamp: new Date().toISOString(),
      id: this.generateAlertId(),
      ...alert
    };

    this.alerts.push(alertEntry);
    this.writeToFile(this.alertsFile, alertEntry);

    // In a real system, you would:
    // 1. Send email notifications
    // 2. Send SMS alerts
    // 3. Integrate with monitoring systems (DataDog, New Relic, etc.)
    // 4. Send to Slack/Discord webhooks

    console.log(`🚨 SECURITY ALERT [${alert.level}]: ${alert.message}`);
  }

  // Write to log file
  writeToFile(filePath, data) {
    const logLine = JSON.stringify(data) + '\n';
    fs.appendFileSync(filePath, logLine);
  }

  // Generate unique alert ID
  generateAlertId() {
    return `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get recent events
  getRecentEvents(hours = 24) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.events.filter(event => new Date(event.timestamp) > cutoff);
  }

  // Get recent alerts
  getRecentAlerts(hours = 24) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.alerts.filter(alert => new Date(alert.timestamp) > cutoff);
  }

  // Generate security report
  generateReport() {
    const report = {
      generated: new Date().toISOString(),
      period: 'Last 24 hours',
      summary: {
        totalEvents: this.events.length,
        totalAlerts: this.alerts.length,
        highPriorityAlerts: this.alerts.filter(a => a.level === 'HIGH').length,
        mediumPriorityAlerts: this.alerts.filter(a => a.level === 'MEDIUM').length
      },
      topEvents: this.getTopEvents(),
      recentAlerts: this.getRecentAlerts(24)
    };

    return report;
  }

  // Get most common event types
  getTopEvents() {
    const eventCounts = {};
    this.events.forEach(event => {
      eventCounts[event.type] = (eventCounts[event.type] || 0) + 1;
    });

    return Object.entries(eventCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  }
}

// Create global security monitor instance
const securityMonitor = new SecurityMonitor();

// Export for use in other modules
module.exports = securityMonitor;

// Example usage and periodic reporting
if (require.main === module) {
  // Example security events
  securityMonitor.logSecurityEvent({
    type: 'failed_login',
    email: 'test@example.com',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0...'
  });

  // Generate and display report every hour
  setInterval(() => {
    const report = securityMonitor.generateReport();
    console.log('\n📊 Security Report (Last 24h):');
    console.log(`Total Events: ${report.summary.totalEvents}`);
    console.log(`Total Alerts: ${report.summary.totalAlerts}`);
    console.log(`High Priority: ${report.summary.highPriorityAlerts}`);
    console.log(`Medium Priority: ${report.summary.mediumPriorityAlerts}`);

    if (report.topEvents.length > 0) {
      console.log('\nTop Security Events:');
      report.topEvents.forEach(([type, count]) => {
        console.log(`- ${type}: ${count}`);
      });
    }

    if (report.recentAlerts.length > 0) {
      console.log('\nRecent Alerts:');
      report.recentAlerts.slice(-5).forEach(alert => {
        console.log(`[${alert.level}] ${alert.message}`);
      });
    }
  }, 60 * 60 * 1000); // Every hour
}