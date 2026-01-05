#!/usr/bin/env node
/**
 * OmniCortex AI Labs - Accessibility Audit Script
 * Uses Axe Core to audit all public pages for WCAG compliance
 */

import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = 'http://localhost:3000';

const PAGES_TO_AUDIT = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/research', name: 'Research' },
  { path: '/models', name: 'Models' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/playground', name: 'Playground' },
];

async function runAccessibilityAudit() {
  console.log('🔍 OmniCortex AI Labs - Accessibility Audit\n');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const allResults = [];
  let totalViolations = 0;
  let totalPasses = 0;
  
  for (const pageConfig of PAGES_TO_AUDIT) {
    const url = `${BASE_URL}${pageConfig.path}`;
    console.log(`\n📄 Auditing: ${pageConfig.name} (${url})`);
    console.log('-'.repeat(50));
    
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1000); // Wait for animations
      
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        .analyze();
      
      const violations = results.violations;
      const passes = results.passes;
      
      totalViolations += violations.length;
      totalPasses += passes.length;
      
      allResults.push({
        page: pageConfig.name,
        url: pageConfig.path,
        violations: violations,
        passes: passes.length,
        incomplete: results.incomplete.length
      });
      
      if (violations.length === 0) {
        console.log(`   ✅ No violations found! (${passes.length} rules passed)`);
      } else {
        console.log(`   ⚠️  ${violations.length} violation(s) found:`);
        
        violations.forEach((violation, index) => {
          console.log(`\n   ${index + 1}. [${violation.impact?.toUpperCase()}] ${violation.id}`);
          console.log(`      Description: ${violation.description}`);
          console.log(`      Help: ${violation.help}`);
          console.log(`      WCAG: ${violation.tags.filter(t => t.startsWith('wcag')).join(', ')}`);
          console.log(`      Affected elements: ${violation.nodes.length}`);
          
          // Show first 3 affected elements
          violation.nodes.slice(0, 3).forEach((node, i) => {
            console.log(`         ${i + 1}. ${node.target.join(' > ')}`);
            if (node.failureSummary) {
              console.log(`            Fix: ${node.failureSummary.split('\n')[0]}`);
            }
          });
          
          if (violation.nodes.length > 3) {
            console.log(`         ... and ${violation.nodes.length - 3} more elements`);
          }
        });
      }
      
    } catch (error) {
      console.log(`   ❌ Error auditing page: ${error.message}`);
      allResults.push({
        page: pageConfig.name,
        url: pageConfig.path,
        error: error.message
      });
    }
  }
  
  await browser.close();
  
  // Summary Report
  console.log('\n' + '='.repeat(60));
  console.log('📊 ACCESSIBILITY AUDIT SUMMARY');
  console.log('='.repeat(60));
  
  console.log(`\nPages Audited: ${PAGES_TO_AUDIT.length}`);
  console.log(`Total Violations: ${totalViolations}`);
  console.log(`Total Rules Passed: ${totalPasses}`);
  
  console.log('\n📋 Results by Page:');
  console.log('-'.repeat(50));
  
  allResults.forEach(result => {
    if (result.error) {
      console.log(`   ${result.page}: ❌ Error`);
    } else if (result.violations.length === 0) {
      console.log(`   ${result.page}: ✅ ${result.passes} passed, 0 violations`);
    } else {
      console.log(`   ${result.page}: ⚠️  ${result.passes} passed, ${result.violations.length} violations`);
    }
  });
  
  // Categorize violations by impact
  const violationsByImpact = {
    critical: [],
    serious: [],
    moderate: [],
    minor: []
  };
  
  allResults.forEach(result => {
    if (result.violations) {
      result.violations.forEach(v => {
        const impact = v.impact || 'minor';
        if (!violationsByImpact[impact]) violationsByImpact[impact] = [];
        violationsByImpact[impact].push({
          page: result.page,
          ...v
        });
      });
    }
  });
  
  console.log('\n🎯 Violations by Impact:');
  console.log('-'.repeat(50));
  Object.entries(violationsByImpact).forEach(([impact, violations]) => {
    const emoji = impact === 'critical' ? '🔴' : impact === 'serious' ? '🟠' : impact === 'moderate' ? '🟡' : '🟢';
    console.log(`   ${emoji} ${impact.toUpperCase()}: ${violations.length}`);
  });
  
  // Return results for further processing
  return {
    totalPages: PAGES_TO_AUDIT.length,
    totalViolations,
    totalPasses,
    results: allResults,
    violationsByImpact
  };
}

// Run the audit
runAccessibilityAudit()
  .then(results => {
    console.log('\n✨ Audit complete!');
    if (results.totalViolations === 0) {
      console.log('🎉 Congratulations! No accessibility violations found.');
      process.exit(0);
    } else {
      console.log(`\n⚠️  Found ${results.totalViolations} total violation(s) to address.`);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  });
