const nodemailer = require('nodemailer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class NotificationService {
  constructor() {
    this.emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    };
    
    this.slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    this.teamsWebhookUrl = process.env.TEAMS_WEBHOOK_URL;
    this.discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
  }

  async sendNotifications(reportData, reportPaths = {}) {
    const notifications = [];
    
    try {
      // Send email notification if configured
      if (this.emailConfig.auth.user && this.emailConfig.auth.pass) {
        const emailResult = await this.sendEmailNotification(reportData, reportPaths);
        notifications.push({ type: 'email', success: true, result: emailResult });
      }
      
      // Send Slack notification if configured
      if (this.slackWebhookUrl) {
        const slackResult = await this.sendSlackNotification(reportData);
        notifications.push({ type: 'slack', success: true, result: slackResult });
      }
      
      // Send Teams notification if configured
      if (this.teamsWebhookUrl) {
        const teamsResult = await this.sendTeamsNotification(reportData);
        notifications.push({ type: 'teams', success: true, result: teamsResult });
      }
      
      // Send Discord notification if configured
      if (this.discordWebhookUrl) {
        const discordResult = await this.sendDiscordNotification(reportData);
        notifications.push({ type: 'discord', success: true, result: discordResult });
      }
      
      // Console notification (always available)
      this.sendConsoleNotification(reportData);
      notifications.push({ type: 'console', success: true });
      
    } catch (error) {
      console.error('Error sending notifications:', error);
      notifications.push({ type: 'error', success: false, error: error.message });
    }
    
    return notifications;
  }

  async sendEmailNotification(reportData, reportPaths) {
    const transporter = nodemailer.createTransporter(this.emailConfig);
    
    const { summary, environment } = reportData;
    const successRate = summary.totalTests > 0 ? (summary.passedTests / summary.totalTests * 100).toFixed(2) : 0;
    
    const subject = `${summary.success ? '✅' : '❌'} Reporte de Pruebas - ${successRate}% éxito`;
    
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">📊 Reporte de Pruebas</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Generado el ${new Date(reportData.timestamp).toLocaleString('es-ES')}</p>
      </div>
      
      <div style="padding: 20px; background: white; border: 1px solid #dee2e6;">
        <h2 style="color: ${summary.success ? '#28a745' : '#dc3545'};">
          ${summary.success ? '✅ Todas las pruebas pasaron' : '❌ Algunas pruebas fallaron'}
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Total de Pruebas</strong></td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${summary.totalTests}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Pruebas Exitosas</strong></td>
            <td style="padding: 10px; border: 1px solid #dee2e6; color: #28a745;">${summary.passedTests}</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Pruebas Fallidas</strong></td>
            <td style="padding: 10px; border: 1px solid #dee2e6; color: #dc3545;">${summary.failedTests}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Tasa de Éxito</strong></td>
            <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>${successRate}%</strong></td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Tiempo Total</strong></td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${(summary.totalTime / 1000).toFixed(2)}s</td>
          </tr>
        </table>
        
        <h3>🔧 Información del Entorno</h3>
        <ul>
          <li><strong>Rama:</strong> ${environment.gitBranch}</li>
          <li><strong>Commit:</strong> ${environment.gitCommit.substring(0, 8)}</li>
          <li><strong>Node.js:</strong> ${environment.nodeVersion}</li>
        </ul>
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; text-align: center; color: #6c757d; border-radius: 0 0 8px 8px;">
        <p style="margin: 0;">Reporte generado automáticamente por CI Simple Node Project</p>
      </div>
    </div>`;
    
    const attachments = [];
    if (reportPaths.html && fs.existsSync(reportPaths.html)) {
      attachments.push({
        filename: 'test-report.html',
        path: reportPaths.html
      });
    }
    if (reportPaths.json && fs.existsSync(reportPaths.json)) {
      attachments.push({
        filename: 'test-report.json',
        path: reportPaths.json
      });
    }
    
    const mailOptions = {
      from: this.emailConfig.auth.user,
      to: process.env.NOTIFICATION_EMAIL || this.emailConfig.auth.user,
      subject,
      html: htmlContent,
      attachments
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email notification sent:', result.messageId);
    return result;
  }

  async sendSlackNotification(reportData) {
    const { summary, environment } = reportData;
    const successRate = summary.totalTests > 0 ? (summary.passedTests / summary.totalTests * 100).toFixed(2) : 0;
    
    const color = summary.success ? 'good' : 'danger';
    const emoji = summary.success ? ':white_check_mark:' : ':x:';
    
    const payload = {
      username: 'Test Reporter',
      icon_emoji: ':test_tube:',
      attachments: [{
        color,
        title: `${emoji} Reporte de Pruebas - ${successRate}% éxito`,
        fields: [
          {
            title: 'Total de Pruebas',
            value: summary.totalTests.toString(),
            short: true
          },
          {
            title: 'Exitosas',
            value: summary.passedTests.toString(),
            short: true
          },
          {
            title: 'Fallidas',
            value: summary.failedTests.toString(),
            short: true
          },
          {
            title: 'Tiempo Total',
            value: `${(summary.totalTime / 1000).toFixed(2)}s`,
            short: true
          },
          {
            title: 'Rama',
            value: environment.gitBranch,
            short: true
          },
          {
            title: 'Commit',
            value: environment.gitCommit.substring(0, 8),
            short: true
          }
        ],
        footer: 'CI Simple Node Project',
        ts: Math.floor(Date.now() / 1000)
      }]
    };
    
    const response = await axios.post(this.slackWebhookUrl, payload);
    console.log('Slack notification sent');
    return response.data;
  }

  async sendTeamsNotification(reportData) {
    const { summary, environment } = reportData;
    const successRate = summary.totalTests > 0 ? (summary.passedTests / summary.totalTests * 100).toFixed(2) : 0;
    
    const themeColor = summary.success ? '28a745' : 'dc3545';
    const emoji = summary.success ? '✅' : '❌';
    
    const payload = {
      "@type": "MessageCard",
      "@context": "https://schema.org/extensions",
      summary: `Reporte de Pruebas - ${successRate}% éxito`,
      themeColor,
      sections: [{
        activityTitle: `${emoji} Reporte de Pruebas`,
        activitySubtitle: `Generado el ${new Date(reportData.timestamp).toLocaleString('es-ES')}`,
        facts: [
          { name: 'Total de Pruebas', value: summary.totalTests.toString() },
          { name: 'Exitosas', value: summary.passedTests.toString() },
          { name: 'Fallidas', value: summary.failedTests.toString() },
          { name: 'Tasa de Éxito', value: `${successRate}%` },
          { name: 'Tiempo Total', value: `${(summary.totalTime / 1000).toFixed(2)}s` },
          { name: 'Rama', value: environment.gitBranch },
          { name: 'Commit', value: environment.gitCommit.substring(0, 8) }
        ]
      }]
    };
    
    const response = await axios.post(this.teamsWebhookUrl, payload);
    console.log('Teams notification sent');
    return response.data;
  }

  async sendDiscordNotification(reportData) {
    const { summary, environment } = reportData;
    const successRate = summary.totalTests > 0 ? (summary.passedTests / summary.totalTests * 100).toFixed(2) : 0;
    
    const color = summary.success ? 0x28a745 : 0xdc3545;
    const emoji = summary.success ? '✅' : '❌';
    
    const payload = {
      username: 'Test Reporter',
      avatar_url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f9ea.png',
      embeds: [{
        title: `${emoji} Reporte de Pruebas`,
        description: `Tasa de éxito: **${successRate}%**`,
        color,
        fields: [
          { name: 'Total', value: summary.totalTests.toString(), inline: true },
          { name: 'Exitosas', value: summary.passedTests.toString(), inline: true },
          { name: 'Fallidas', value: summary.failedTests.toString(), inline: true },
          { name: 'Tiempo', value: `${(summary.totalTime / 1000).toFixed(2)}s`, inline: true },
          { name: 'Rama', value: environment.gitBranch, inline: true },
          { name: 'Commit', value: environment.gitCommit.substring(0, 8), inline: true }
        ],
        timestamp: reportData.timestamp,
        footer: { text: 'CI Simple Node Project' }
      }]
    };
    
    const response = await axios.post(this.discordWebhookUrl, payload);
    console.log('Discord notification sent');
    return response.data;
  }

  sendConsoleNotification(reportData) {
    const { summary, environment } = reportData;
    const successRate = summary.totalTests > 0 ? (summary.passedTests / summary.totalTests * 100).toFixed(2) : 0;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 REPORTE DE PRUEBAS');
    console.log('='.repeat(60));
    console.log(`Estado: ${summary.success ? '✅ ÉXITO' : '❌ FALLO'}`);
    console.log(`Total de Pruebas: ${summary.totalTests}`);
    console.log(`Exitosas: ${summary.passedTests}`);
    console.log(`Fallidas: ${summary.failedTests}`);
    console.log(`Omitidas: ${summary.skippedTests}`);
    console.log(`Tasa de Éxito: ${successRate}%`);
    console.log(`Tiempo Total: ${(summary.totalTime / 1000).toFixed(2)}s`);
    console.log(`Rama: ${environment.gitBranch}`);
    console.log(`Commit: ${environment.gitCommit.substring(0, 8)}`);
    console.log(`Generado: ${new Date(reportData.timestamp).toLocaleString('es-ES')}`);
    console.log('='.repeat(60) + '\n');
  }

  async sendCustomWebhook(url, payload) {
    try {
      const response = await axios.post(url, payload);
      console.log(`Custom webhook notification sent to ${url}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to send webhook to ${url}:`, error.message);
      throw error;
    }
  }
}

module.exports = NotificationService;
