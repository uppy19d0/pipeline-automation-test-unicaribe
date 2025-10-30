const ReportGenerator = require('../src/reportGenerator');
const NotificationService = require('../src/notificationService');
const fs = require('fs');
const path = require('path');

describe('Reporting and Notification System', () => {
  let reportGenerator;
  let notificationService;
  
  beforeEach(() => {
    reportGenerator = new ReportGenerator();
    notificationService = new NotificationService();
  });

  describe('ReportGenerator', () => {
    test('should create reports directory structure', () => {
      expect(fs.existsSync(reportGenerator.reportsDir)).toBe(true);
      expect(fs.existsSync(path.join(reportGenerator.reportsDir, 'html'))).toBe(true);
      expect(fs.existsSync(path.join(reportGenerator.reportsDir, 'json'))).toBe(true);
      expect(fs.existsSync(path.join(reportGenerator.reportsDir, 'junit'))).toBe(true);
    });

    test('should extract summary from test results', () => {
      const mockResults = {
        numTotalTests: 10,
        numPassedTests: 8,
        numFailedTests: 2,
        numPendingTests: 0,
        success: false
      };

      const summary = reportGenerator.extractSummary(mockResults);
      
      expect(summary.totalTests).toBe(10);
      expect(summary.passedTests).toBe(8);
      expect(summary.failedTests).toBe(2);
      expect(summary.success).toBe(false);
    });

    test('should extract test suites information', () => {
      const mockResults = {
        testResults: [{
          testFilePath: '/path/to/test.js',
          status: 'passed',
          perfStats: { start: 1000, end: 2000 },
          assertionResults: [{
            title: 'should work',
            status: 'passed',
            duration: 100
          }]
        }]
      };

      const suites = reportGenerator.extractTestSuites(mockResults);
      
      expect(suites).toHaveLength(1);
      expect(suites[0].name).toBe('test.js');
      expect(suites[0].status).toBe('passed');
      expect(suites[0].tests).toHaveLength(1);
    });

    test('should get environment information', () => {
      const envInfo = reportGenerator.getEnvironmentInfo();
      
      expect(envInfo).toHaveProperty('nodeVersion');
      expect(envInfo).toHaveProperty('platform');
      expect(envInfo).toHaveProperty('arch');
      expect(envInfo).toHaveProperty('timestamp');
      expect(envInfo.nodeVersion).toBe(process.version);
    });

    test('should generate HTML content', () => {
      const mockReportData = {
        timestamp: new Date().toISOString(),
        summary: {
          totalTests: 5,
          passedTests: 4,
          failedTests: 1,
          skippedTests: 0,
          totalTime: 5000,
          success: false
        },
        testSuites: [{
          name: 'example.test.js',
          status: 'failed',
          duration: 2000,
          tests: [{
            name: 'should pass',
            status: 'passed',
            duration: 100
          }, {
            name: 'should fail',
            status: 'failed',
            duration: 200,
            errorMessage: 'Expected true but got false'
          }]
        }],
        coverage: null,
        environment: {
          nodeVersion: 'v18.0.0',
          platform: 'darwin',
          arch: 'x64',
          gitBranch: 'main',
          gitCommit: 'abc123def456'
        }
      };

      const html = reportGenerator.generateHTMLContent(mockReportData);
      
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('Reporte de Pruebas');
      expect(html).toContain('80.00%'); // Success rate
      expect(html).toContain('example.test.js');
      expect(html).toContain('should pass');
      expect(html).toContain('should fail');
      expect(html).toContain('Expected true but got false');
    });
  });

  describe('NotificationService', () => {
    test('should initialize with correct configuration', () => {
      expect(notificationService.emailConfig).toHaveProperty('host');
      expect(notificationService.emailConfig).toHaveProperty('port');
      expect(notificationService.emailConfig).toHaveProperty('auth');
    });

    test('should send console notification', () => {
      const mockReportData = {
        timestamp: new Date().toISOString(),
        summary: {
          totalTests: 3,
          passedTests: 3,
          failedTests: 0,
          skippedTests: 0,
          totalTime: 1500,
          success: true
        },
        environment: {
          gitBranch: 'main',
          gitCommit: 'abc123def456'
        }
      };

      // Capture console output
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      notificationService.sendConsoleNotification(mockReportData);
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('REPORTE DE PRUEBAS'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('✅ ÉXITO'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Total de Pruebas: 3'));
      
      consoleSpy.mockRestore();
    });

    test('should handle notifications when no services are configured', async () => {
      const mockReportData = {
        timestamp: new Date().toISOString(),
        summary: {
          totalTests: 1,
          passedTests: 1,
          failedTests: 0,
          skippedTests: 0,
          totalTime: 500,
          success: true
        },
        environment: {
          gitBranch: 'test',
          gitCommit: 'test123'
        }
      };

      const notifications = await notificationService.sendNotifications(mockReportData);
      
      // Should at least have console notification
      expect(notifications).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'console', success: true })
        ])
      );
    });
  });

  describe('Integration', () => {
    test('should generate complete report with mock data', async () => {
      const mockTestResults = {
        success: true,
        numTotalTests: 15,
        numPassedTests: 15,
        numFailedTests: 0,
        numPendingTests: 0,
        testResults: [{
          testFilePath: path.join(__dirname, 'example.test.js'),
          status: 'passed',
          perfStats: { start: Date.now() - 1000, end: Date.now() },
          assertionResults: [{
            title: 'should generate reports correctly',
            status: 'passed',
            duration: 50
          }]
        }]
      };

      const reportData = await reportGenerator.generateTestReport(mockTestResults);
      
      expect(reportData).toHaveProperty('timestamp');
      expect(reportData).toHaveProperty('summary');
      expect(reportData).toHaveProperty('testSuites');
      expect(reportData).toHaveProperty('environment');
      expect(reportData.summary.success).toBe(true);
      expect(reportData.summary.totalTests).toBe(15);
    });
  });
});
