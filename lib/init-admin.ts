import { prisma } from './prisma'
import { hashPassword } from './auth'

/**
 * Initialize default admin user if no admin exists
 * This runs automatically on application startup
 */
export async function initializeDefaultAdmin() {
  try {
    // Check if any admin exists
    const adminExists = await prisma.user.findFirst({
      where: { role: 'admin' }
    })

    if (adminExists) {
      console.log('✅ Admin user already exists')
      return
    }

    // Get default admin credentials from environment variables
    const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com'
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123456'
    const defaultName = process.env.DEFAULT_ADMIN_NAME || 'System Administrator'

    // Create default admin user
    const hashedPassword = await hashPassword(defaultPassword)

    const admin = await prisma.user.create({
      data: {
        email: defaultEmail,
        password: hashedPassword,
        name: defaultName,
        role: 'admin',
        status: 'active',
        mustChangePassword: true, // Force password change on first login
        defaultCurrency: 'USD'
      }
    })

    console.log('✅ Default admin user created successfully')
    console.log('📧 Email:', defaultEmail)
    console.log('🔑 Password:', defaultPassword)
    console.log('⚠️  IMPORTANT: Please log in and change the password immediately!')

    return admin
  } catch (error) {
    console.error('❌ Failed to initialize default admin:', error)
    throw error
  }
}

/**
 * Initialize system settings if not exists
 */
export async function initializeSystemSettings() {
  try {
    const settings = await prisma.systemSettings.findUnique({
      where: { id: 1 }
    })

    if (settings) {
      console.log('✅ System settings already initialized')
      return settings
    }

    // Create default system settings
    const newSettings = await prisma.systemSettings.create({
      data: {
        id: 1,
        registrationMode: 'approval', // Default: require admin approval
        siteName: 'SubTrack',
        maxUsersLimit: null
      }
    })

    console.log('✅ System settings initialized')
    return newSettings
  } catch (error) {
    console.error('❌ Failed to initialize system settings:', error)
    throw error
  }
}

/**
 * Run all initialization tasks
 */
export async function runInitialization() {
  console.log('🚀 Running initialization tasks...')

  try {
    await initializeSystemSettings()
    await initializeDefaultAdmin()
    console.log('✅ All initialization tasks completed')
  } catch (error) {
    console.error('❌ Initialization failed:', error)
  }
}
