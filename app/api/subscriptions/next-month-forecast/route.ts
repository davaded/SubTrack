import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { calculateMonthlyCost } from '@/lib/currency'
import dayjs from 'dayjs'

/**
 * 获取下个月续费预测
 * GET /api/subscriptions/next-month-forecast
 */
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return errorResponse('UNAUTHORIZED', '未授权', 401)
    }

    const defaultCurrency = currentUser.defaultCurrency || 'USD'

    // 获取所有活跃订阅
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: currentUser.id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        amount: true,
        currency: true,
        billingCycle: true,
        customCycleDays: true,
        nextBillingDate: true,
        logoUrl: true,
        category: true,
      },
    })

    // 计算下个月的日期范围
    const now = dayjs()
    const nextMonthStart = now.add(1, 'month').startOf('month')
    const nextMonthEnd = now.add(1, 'month').endOf('month')

    // 筛选出在下个月会续费的订阅
    const nextMonthRenewals = subscriptions
      .map((sub) => {
        const nextBillingDate = dayjs(sub.nextBillingDate)

        // 检查是否在下个月续费
        const isInNextMonth =
          nextBillingDate.isAfter(nextMonthStart.subtract(1, 'day')) &&
          nextBillingDate.isBefore(nextMonthEnd.add(1, 'day'))

        if (!isInNextMonth) {
          return null
        }

        // 转换为用户默认货币
        const convertedAmount = calculateMonthlyCost(
          Number(sub.amount),
          sub.currency,
          sub.billingCycle,
          sub.customCycleDays,
          defaultCurrency
        )

        return {
          id: sub.id,
          name: sub.name,
          amount: Number(sub.amount),
          currency: sub.currency,
          convertedAmount: Number(convertedAmount.toFixed(2)),
          nextBillingDate: sub.nextBillingDate,
          logoUrl: sub.logoUrl,
          category: sub.category,
        }
      })
      .filter((sub) => sub !== null)
      .sort((a, b) => dayjs(a!.nextBillingDate).unix() - dayjs(b!.nextBillingDate).unix())

    // 计算总金额
    const totalAmount = nextMonthRenewals.reduce((sum, sub) => {
      if (!sub) return sum
      // 使用原始金额进行计算
      const amount = calculateMonthlyCost(
        sub.amount,
        sub.currency,
        'monthly', // 已经是单次金额，不需要再转换
        null,
        defaultCurrency
      )
      return sum + amount
    }, 0)

    return successResponse({
      nextMonth: nextMonthStart.format('YYYY-MM'),
      nextMonthLabel: nextMonthStart.format('MMMM YYYY'),
      currency: defaultCurrency,
      totalAmount: Number(totalAmount.toFixed(2)),
      subscriptionCount: nextMonthRenewals.length,
      subscriptions: nextMonthRenewals,
    })
  } catch (error) {
    console.error('获取下月续费预测失败:', error)
    return errorResponse('INTERNAL_ERROR', '获取数据失败', 500)
  }
}
