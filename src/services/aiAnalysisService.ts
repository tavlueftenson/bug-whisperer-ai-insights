
import { DefectData } from "@/components/FileUpload";
import { AnalysisResults } from "@/components/DefectAnalytics";

/**
 * AIAnalysisService
 * 
 * This service provides AI-powered analysis of defect logs.
 * In a real application, this would connect to an external AI service.
 * For demo purposes, we are implementing a simulated analysis using pattern matching.
 */
export class AIAnalysisService {
  /**
   * Analyzes defect data and generates insights
   * @param defects Array of defect data to analyze
   * @returns Analysis results including metrics and recommendations
   */
  public static async analyzeDefects(defects: DefectData[]): Promise<AnalysisResults> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Extract root causes from defect descriptions and steps
    const rootCauses = this.identifyRootCauses(defects);
    
    // Calculate metrics
    const reworkRate = this.calculateReworkRate(defects);
    const bugBounceRate = this.calculateBugBounceRate(defects);
    const badFixRate = this.calculateBadFixRate(defects);
    
    // Generate feature and origin distributions
    const featureDistribution = this.generateFeatureDistribution(defects);
    const originDistribution = this.generateOriginDistribution(defects);
    
    // Generate recommendations based on all the analysis
    const recommendations = this.generateRecommendations(
      defects, rootCauses, reworkRate, bugBounceRate, badFixRate
    );
    
    return {
      rootCauses,
      reworkRate,
      bugBounceRate,
      badFixRate,
      featureDistribution,
      originDistribution,
      recommendations
    };
  }
  
  /**
   * Identifies potential root causes from defect descriptions
   * In real-world, this would use NLP/ML to classify root causes
   */
  private static identifyRootCauses(defects: DefectData[]) {
    // Keywords to look for in descriptions and categorize
    const causeKeywords = {
      'Input Validation': ['validation', 'input', 'invalid', 'format', 'required field'],
      'Error Handling': ['exception', 'error', 'crash', 'handled', 'timeout'],
      'UI/UX Issues': ['ui', 'display', 'interface', 'button', 'layout', 'alignment'],
      'Performance': ['slow', 'performance', 'lag', 'loading', 'timeout'],
      'Data Processing': ['data', 'calculation', 'processing', 'incorrect value'],
      'Integration': ['integration', 'api', 'service', 'endpoint', 'connection']
    };
    
    // Count occurrences of each cause
    const causeCounts: Record<string, number> = {};
    
    defects.forEach(defect => {
      const text = (defect.description + ' ' + defect.stepsToReproduce).toLowerCase();
      
      Object.entries(causeKeywords).forEach(([cause, keywords]) => {
        if (keywords.some(keyword => text.includes(keyword))) {
          causeCounts[cause] = (causeCounts[cause] || 0) + 1;
        }
      });
    });
    
    // If no matches found, add "Unknown" category
    if (Object.keys(causeCounts).length === 0) {
      causeCounts['Unknown'] = defects.length;
    }
    
    // Format for chart display
    return Object.entries(causeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }
  
  /**
   * Calculates rework rate based on defect descriptions
   * In real-world, would be based on historical data
   */
  private static calculateReworkRate(defects: DefectData[]): number {
    // Simulate rework rate calculation
    // For demo, look for keywords that suggest rework was needed
    const reworkKeywords = ['reopened', 'not fixed', 'still occurs', 'persists', 'incomplete fix'];
    
    const reworkCount = defects.filter(defect => {
      const text = (defect.description + ' ' + defect.actualResult).toLowerCase();
      return reworkKeywords.some(keyword => text.includes(keyword));
    }).length;
    
    // Add some baseline rework
    const baselineRework = Math.ceil(defects.length * 0.15);
    const totalRework = reworkCount + baselineRework;
    
    // Calculate percentage, capped at 100%
    return Math.min(Math.round((totalRework / defects.length) * 100), 100) || 24;
  }
  
  /**
   * Calculates bug bounce rate
   */
  private static calculateBugBounceRate(defects: DefectData[]): number {
    // In real system, this would be calculated from actual workflow data
    // Simulate by analyzing descriptions for indications of bugs being returned
    const bounceKeywords = ['returned', 'reassigned', 'invalid', 'not reproducible', 'needs clarification'];
    
    const bounceCount = defects.filter(defect => {
      const text = (defect.description + ' ' + defect.actualResult).toLowerCase();
      return bounceKeywords.some(keyword => text.includes(keyword));
    }).length;
    
    // Add some baseline bounces
    const baselineBounces = Math.ceil(defects.length * 0.1);
    const totalBounces = bounceCount + baselineBounces;
    
    // Calculate percentage, capped at 100%
    return Math.min(Math.round((totalBounces / defects.length) * 100), 100) || 18;
  }
  
  /**
   * Calculates bad fix rate (fixes that cause other issues)
   */
  private static calculateBadFixRate(defects: DefectData[]): number {
    // In real system, this would be calculated from regression analysis
    // Simulate by looking for keywords that suggest a fix caused other problems
    const badFixKeywords = ['regression', 'caused by fix', 'after update', 'new issue', 'since fixing'];
    
    const badFixCount = defects.filter(defect => {
      const text = (defect.description + ' ' + defect.actualResult).toLowerCase();
      return badFixKeywords.some(keyword => text.includes(keyword));
    }).length;
    
    // Add some baseline bad fixes
    const baselineBadFixes = Math.ceil(defects.length * 0.05);
    const totalBadFixes = badFixCount + baselineBadFixes;
    
    // Calculate percentage, capped at 100%
    return Math.min(Math.round((totalBadFixes / defects.length) * 100), 100) || 12;
  }
  
  /**
   * Generates feature distribution data for visualization
   */
  private static generateFeatureDistribution(defects: DefectData[]) {
    const featureCounts: Record<string, number> = {};
    
    defects.forEach(defect => {
      const feature = defect.featureTag || 'Untagged';
      featureCounts[feature] = (featureCounts[feature] || 0) + 1;
    });
    
    // Format for chart display
    return Object.entries(featureCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }
  
  /**
   * Generates origin/environment distribution data for visualization
   */
  private static generateOriginDistribution(defects: DefectData[]) {
    const originCounts: Record<string, number> = {};
    
    defects.forEach(defect => {
      const origin = defect.bugOrigin || 'Unknown';
      originCounts[origin] = (originCounts[origin] || 0) + 1;
    });
    
    // Format for chart display
    return Object.entries(originCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }
  
  /**
   * Generates recommendations based on the analysis
   */
  private static generateRecommendations(
    defects: DefectData[],
    rootCauses: { name: string; value: number }[],
    reworkRate: number,
    bugBounceRate: number,
    badFixRate: number
  ) {
    // Process improvement recommendations
    const processRecs: string[] = [];
    
    // Base recommendations on metrics
    if (reworkRate > 20) {
      processRecs.push("Implement peer code reviews to catch issues earlier in the development process.");
      processRecs.push("Establish clearer acceptance criteria before development begins to reduce rework.");
    }
    
    if (bugBounceRate > 15) {
      processRecs.push("Create a more detailed defect reporting template to improve defect clarity.");
      processRecs.push("Add a defect triage step to validate and properly assign issues.");
    }
    
    if (badFixRate > 10) {
      processRecs.push("Implement automated regression testing for all bug fixes.");
      processRecs.push("Establish a more thorough code review process for bug fix PRs.");
    }
    
    // Add root-cause specific recommendations
    rootCauses.forEach(cause => {
      if (cause.name === 'Input Validation' && cause.value >= 2) {
        processRecs.push("Establish consistent input validation standards across the application.");
      }
      if (cause.name === 'Error Handling' && cause.value >= 2) {
        processRecs.push("Implement a centralized error handling framework to improve consistency.");
      }
      if (cause.name === 'UI/UX Issues' && cause.value >= 2) {
        processRecs.push("Create UI component guidelines to ensure consistent interface behavior.");
      }
      if (cause.name === 'Performance' && cause.value >= 2) {
        processRecs.push("Add performance benchmarks to CI/CD pipeline to catch performance regressions.");
      }
    });
    
    // Ensure we have at least 3 process recommendations
    while (processRecs.length < 3) {
      const genericRecs = [
        "Implement automated code quality checks in the CI pipeline.",
        "Establish regular retrospectives to continuously improve the development process.",
        "Create a knowledge sharing system to document common issues and solutions.",
        "Standardize the deployment process to reduce environment-related issues."
      ];
      
      // Add recommendations we don't already have
      for (const rec of genericRecs) {
        if (!processRecs.includes(rec)) {
          processRecs.push(rec);
          break;
        }
      }
    }
    
    // Test coverage recommendations
    const testRecs: string[] = [];
    
    // Analyze which features have the most defects
    const featureDistribution = this.generateFeatureDistribution(defects);
    
    if (featureDistribution.length > 0) {
      const topIssueFeature = featureDistribution[0].name;
      testRecs.push(`Expand test coverage for the ${topIssueFeature} feature which has the highest defect rate.`);
    }
    
    // Generate recommendations based on root causes
    rootCauses.forEach(cause => {
      if (cause.name === 'Error Handling') {
        testRecs.push("Add more negative testing scenarios to validate error handling paths.");
      }
      if (cause.name === 'Integration') {
        testRecs.push("Implement more thorough integration tests for external system interfaces.");
      }
      if (cause.name === 'Performance') {
        testRecs.push("Add load and stress tests to identify performance bottlenecks.");
      }
    });
    
    // Add general recommendations if we need more
    const generalTestRecs = [
      "Implement automated UI tests to catch visual regression issues.",
      "Add more edge case scenarios to the test suite.",
      "Create data-driven tests to cover more variations with less code.",
      "Implement end-to-end test scenarios that cover critical user journeys."
    ];
    
    while (testRecs.length < 3) {
      for (const rec of generalTestRecs) {
        if (!testRecs.includes(rec)) {
          testRecs.push(rec);
          break;
        }
      }
    }
    
    // Training recommendations
    const trainingRecs: string[] = [];
    
    // Base training recommendations on identified issues
    rootCauses.forEach(cause => {
      if (cause.name === 'Input Validation') {
        trainingRecs.push("Training on defensive programming and robust input validation techniques.");
      }
      if (cause.name === 'UI/UX Issues') {
        trainingRecs.push("Workshop on UI/UX best practices and responsive design principles.");
      }
      if (cause.name === 'Performance') {
        trainingRecs.push("Training on application performance optimization techniques.");
      }
      if (cause.name === 'Error Handling') {
        trainingRecs.push("Workshop on robust error handling patterns and strategies.");
      }
      if (cause.name === 'Integration') {
        trainingRecs.push("Training on API design and integration best practices.");
      }
    });
    
    // Add more general recommendations if needed
    const generalTrainingRecs = [
      "Code review training to help developers identify common issues early.",
      "Testing strategy workshop to improve test coverage and efficiency.",
      "Technical writing training to improve documentation and specifications.",
      "Training on the full development lifecycle to improve understanding of cross-functional impacts."
    ];
    
    while (trainingRecs.length < 3) {
      for (const rec of generalTrainingRecs) {
        if (!trainingRecs.includes(rec)) {
          trainingRecs.push(rec);
          break;
        }
      }
    }
    
    return {
      process: processRecs.slice(0, 5), // Limit to 5 recommendations
      testCoverage: testRecs.slice(0, 5),
      training: trainingRecs.slice(0, 5)
    };
  }
}
