const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const envs = [
  {
    path: 'apps/api/.env',
    content: `PORT=4001\nNODE_ENV=development\nDATABASE_URL="postgresql://user:password@localhost:5432/mydb"\n`
  },
  {
    path: 'apps/web/.env',
    content: `PORT=2001\nVITE_API_URL=http://localhost:4001\nVITE_APP_NAME="My App"\n`
  },
  {
    path: 'packages/database/.env',
    content: `# Prisma Database Connection\nDATABASE_URL="postgresql://user:password@localhost:5432/mydb"\n`
  }
];

let created = [];
let existing = [];

for (const env of envs) {
  const fullPath = path.join(rootDir, env.path);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, env.content);
    created.push(env.path);
  } else {
    existing.push(env.path);
  }
}

console.log('✅ Setup script finished executing!\n');

if (created.length > 0) {
  console.log('📄 The following files were CREATED with default templates:');
  created.forEach(p => console.log(`  - ${p}`));
}

if (existing.length > 0) {
  console.log('📄 The following files ALREADY EXISTED and were left untouched:');
  existing.forEach(p => console.log(`  - ${p}`));
}

console.log('\n=========================================');
console.log('⚠️  ACTION REQUIRED (Update your .env files)');
console.log('=========================================');
console.log('Please open these files and update the `DATABASE_URL` with your actual PostgreSQL credentials:');
console.log('  - apps/api/.env');
console.log('  - packages/database/.env');

console.log('\n🗄️  Prisma Database Dashboard:');
console.log('To view and manage your database data, you can start Prisma Studio.');
console.log('Run the following command in your terminal:');
console.log('  pnpm --filter database prisma studio');
console.log('Then open the dashboard at: http://localhost:5555');
