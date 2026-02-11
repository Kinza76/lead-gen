const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const files = [
  'app/page.tsx',
  'app/dashboard/page.tsx',
  'app/settings/page.tsx',
  'components/LeadTable.tsx',
  'components/LeadForm.tsx',
  'components/EmailTemplates.tsx',
  'components/LanguageSelector.tsx'
];

const violations = [];

for (const file of files) {
  const source = readFileSync(join(process.cwd(), file), 'utf8');
  if (source.includes('"@prisma/client"') || source.includes("'@prisma/client'")) {
    violations.push(file);
  }
}

if (violations.length > 0) {
  console.error('UI files must not import @prisma/client. Violations:');
  for (const file of violations) console.error(` - ${file}`);
  process.exit(1);
}

console.log('OK: no UI file imports @prisma/client');
