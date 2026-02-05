/**
 * Debug script to check auth configuration and test login
 */

const { PrismaClient } = require('@prisma/client')
const { compare } = require('bcryptjs')

const prisma = new PrismaClient()

async function debugAuth() {
    console.log('🔍 Checking authentication configuration...\n')

    try {
        // Check database connection
        console.log('1. Testing database connection...')
        await prisma.$connect()
        console.log('✅ Database connected successfully\n')

        // Check for users
        console.log('2. Checking for users in database...')
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        })

        if (users.length === 0) {
            console.log('❌ No users found in database!')
            console.log('   You need to create an account first at: http://localhost:3000/admin/signup\n')
        } else {
            console.log(`✅ Found ${users.length} user(s):\n`)
            users.forEach((user, index) => {
                console.log(`   User ${index + 1}:`)
                console.log(`   - Email: ${user.email}`)
                console.log(`   - Name: ${user.name}`)
                console.log(`   - Role: ${user.role}`)
                console.log(`   - Created: ${user.createdAt}`)
                console.log('')
            })
        }

        // Check environment variables
        console.log('3. Checking environment variables...')
        const requiredVars = ['NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'DATABASE_URL']
        let allVarsPresent = true

        requiredVars.forEach(varName => {
            if (process.env[varName]) {
                console.log(`   ✅ ${varName} is set`)
            } else {
                console.log(`   ❌ ${varName} is missing!`)
                allVarsPresent = false
            }
        })

        if (!allVarsPresent) {
            console.log('\n⚠️  Missing environment variables! Check your .env.local file\n')
        } else {
            console.log('')
        }

        // Test password hashing
        console.log('4. Testing password hashing...')
        const testPassword = '12345678'
        const bcrypt = require('bcryptjs')
        const testHash = await bcrypt.hash(testPassword, 12)
        const isValid = await bcrypt.compare(testPassword, testHash)
        console.log(`   ✅ Password hashing works: ${isValid}\n`)

    } catch (error) {
        console.error('❌ Error:', error.message)
        console.error('\nFull error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

debugAuth()
