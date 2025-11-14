import { z } from 'zod'

// User validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Subscription validation schemas
export const billingCycleEnum = z.enum([
  'monthly',
  'quarterly',
  'semi-annually',
  'annually',
  'custom',
])

export const categoryEnum = z.enum([
  'entertainment',
  'productivity',
  'education',
  'fitness',
  'music',
  'cloud',
  'other',
])

export const currencyEnum = z.enum(['CNY', 'USD', 'EUR', 'GBP'])

export const subscriptionSchema = z
  .object({
    name: z.string().min(1, 'Subscription name is required'),
    amount: z.number().positive('Amount must be greater than 0'),
    currency: currencyEnum.default('CNY'),
    billingCycle: billingCycleEnum,
    customCycleDays: z.number().int().positive().optional(),
    firstBillingDate: z.string().or(z.date()),
    category: categoryEnum.optional(),
    websiteUrl: z.string().url().optional().or(z.literal('')),
    logoUrl: z.string().url().optional().or(z.literal('')),
    notes: z.string().optional(),
    remindDaysBefore: z.number().int().min(0).default(3),
  })
  .refine(
    (data) => {
      if (data.billingCycle === 'custom') {
        return !!data.customCycleDays
      }
      return true
    },
    {
      message: 'Custom cycle days is required when billing cycle is custom',
      path: ['customCycleDays'],
    }
  )

export const updateSubscriptionSchema = subscriptionSchema.partial().extend({
  isActive: z.boolean().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type SubscriptionInput = z.infer<typeof subscriptionSchema>
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>
