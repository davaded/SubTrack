/**
 * Database initialization script
 * Run this after migrations to set up default admin and system settings
 *
 * Usage: node -r esbuild-register scripts/init-db.ts
 * Or: npx tsx scripts/init-db.ts
 */

const { runInitialization } = require('../lib/init-admin')

async function main() {
  console.log('🚀 Starting database initialization...\n')

  try {
    await runInitialization()
    console.log('\n✅ Database initialization completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error)
    process.exit(1)
  }
}

main()
