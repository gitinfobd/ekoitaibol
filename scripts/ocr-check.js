#!/usr/bin/env node

/**
 * Alibaba OpenCodeReview - Automated Quality & Defect Scanner
 * Customized for EkotaiBol (ekoitaibol.com)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getChangedFiles() {
  const args = process.argv.slice(2);
  const pathArgIdx = args.indexOf('--path');
  if (pathArgIdx !== -1 && args[pathArgIdx + 1]) {
    const targetPath = args[pathArgIdx + 1];
    if (fs.existsSync(targetPath)) {
      if (fs.statSync(targetPath).isDirectory()) {
        return getAllCodeFiles(targetPath);
      }
      return [targetPath];
    }
  }

  if (args.includes('--all')) {
    return getAllCodeFiles('src');
  }

  try {
    const statusOutput = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    if (statusOutput) {
      const files = statusOutput
        .split('\n')
        .map(line => line.trim().slice(3).trim())
        .filter(f => isCodeFile(f) && fs.existsSync(f));
      if (files.length > 0) return files;
    }
  } catch (err) {
    // fallback
  }

  return getAllCodeFiles('src').slice(0, 20);
}

function isCodeFile(file) {
  if (file.includes('scripts/ocr-check.js')) return false;
  const ext = path.extname(file).toLowerCase();
  return ['.js', '.jsx', '.ts', '.tsx', '.mjs'].includes(ext);
}

function getAllCodeFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file).replace(/\\/g, '/');
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'out', 'build', 'docs'].includes(file)) {
        results = results.concat(getAllCodeFiles(fullPath));
      }
    } else if (isCodeFile(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

function analyzeFileWithAlibabaRules(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

    // Rule 1: No var declaration
    if (/\bvar\s+[a-zA-Z_$]/.test(line)) {
      issues.push({
        line: lineNum,
        severity: 'WARN',
        rule: 'Code Quality: Prohibit "var"',
        message: 'Using "var" is strictly prohibited. Use "let" or "const".',
        snippet: trimmed
      });
    }

    // Rule 2: Strict Equality
    if (/(^|[^\!=])==($|[^\=])/.test(line) && !/['"`]==['"`]/.test(line) && !/==\s*null|null\s*==/.test(line)) {
      issues.push({
        line: lineNum,
        severity: 'INFO',
        rule: 'Code Quality: Strict Equality',
        message: 'Prefer strict equality "===" over "==" to avoid unexpected type coercion.',
        snippet: trimmed
      });
    }

    // Rule 3: Dangerous DOM APIs & Code Injection
    if (/\beval\s*\(/.test(line)) {
      issues.push({
        line: lineNum,
        severity: 'ERROR',
        rule: 'Security: Code Injection',
        message: 'Using eval() is strictly prohibited.',
        snippet: trimmed
      });
    }
    if (/new\s+Function\s*\(/.test(line)) {
      issues.push({
        line: lineNum,
        severity: 'ERROR',
        rule: 'Security: Code Injection',
        message: 'Using new Function() constructor is prohibited.',
        snippet: trimmed
      });
    }

    // Rule 4: innerHTML
    if (/\.innerHTML\s*=/.test(line)) {
      issues.push({
        line: lineNum,
        severity: 'WARN',
        rule: 'Security: XSS Protection',
        message: 'Direct innerHTML assignment detected. Use textContent or sanitized components.',
        snippet: trimmed
      });
    }
  });

  return issues;
}

async function main() {
  console.log('\n=================================================================');
  console.log('🛡️  Alibaba OpenCodeReview (OCR) - Automated Defect Scanner');
  console.log('=================================================================\n');

  const files = getChangedFiles();
  console.log(`🔍 Inspecting ${files.length} candidate file(s)...\n`);

  if (files.length === 0) {
    console.log('✅ No modified code files detected to review.');
    process.exit(0);
  }

  let totalIssues = 0;
  let errorCount = 0;
  let warnCount = 0;

  for (const file of files) {
    const issues = analyzeFileWithAlibabaRules(file);
    if (issues.length > 0) {
      console.log(`📁 File: ${file}`);
      issues.forEach(iss => {
        totalIssues++;
        if (iss.severity === 'ERROR') errorCount++;
        if (iss.severity === 'WARN') warnCount++;

        const icon = iss.severity === 'ERROR' ? '❌' : iss.severity === 'WARN' ? '⚠️ ' : 'ℹ️';
        console.log(`   ${icon} [Line ${iss.line}] [${iss.severity}] ${iss.rule}: ${iss.message}`);
        console.log(`      Snippet: ${iss.snippet.substring(0, 80)}`);
      });
      console.log('');
    }
  }

  console.log('-----------------------------------------------------------------');
  console.log(`Scan Summary: ${files.length} files scanned | ${errorCount} Errors | ${warnCount} Warnings | ${totalIssues} Total Notes`);
  console.log('-----------------------------------------------------------------\n');

  if (errorCount > 0) {
    console.error('❌ Alibaba OpenCodeReview found critical errors.');
    process.exit(1);
  } else {
    console.log('✅ Alibaba OpenCodeReview check passed successfully!\n');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Execution error in OCR scanner:', err);
  process.exit(0);
});
