const { execSync } = require('child_process');

console.log('🔍 Checking for outdated dependencies in apps/api, apps/web, and packages/database...');

try {
  // Using pnpm outdated with directory filters to specify exactly which packages to check
  execSync('pnpm --filter ./apps/api --filter ./apps/web --filter ./packages/database outdated', { stdio: 'inherit' });
  console.log('\n✅ All dependencies are up to date!');
} catch (error) {
  // pnpm outdated returns a non-zero exit code if there are outdated dependencies
  console.log('\n⚠️  Outdated dependencies found. Run `pnpm update -i --filter <package>` to update them interactively.');
}
