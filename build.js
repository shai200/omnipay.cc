const { execSync } = require('child_process');
try {
  execSync('npm run build', { stdio: 'inherit', shell: true });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
