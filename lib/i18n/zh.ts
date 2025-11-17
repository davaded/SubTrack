export const zh = {
  // 通用
  common: {
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    back: '返回',
    confirm: '确认',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    search: '搜索',
    filter: '筛选',
    all: '全部',
    active: '活跃',
    inactive: '已取消',
  },

  // 导航
  nav: {
    dashboard: '首页',
    subscriptions: '订阅管理',
    analytics: '统计分析',
    settings: '设置',
    logout: '退出',
    profile: '个人资料',
  },

  // 认证
  auth: {
    login: '登录',
    register: '注册',
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    forgotPassword: '忘记密码？',
    noAccount: '还没有账号？',
    hasAccount: '已有账号？',
    loginNow: '立即登录',
    registerNow: '立即注册',
    welcomeBack: '欢迎回来',
    createAccount: '创建账号',
  },

  // 订阅管理
  subscription: {
    // 列表
    title: '我的订阅',
    addNew: '添加订阅',
    noSubscriptions: '暂无订阅',
    noSubscriptionsDesc: '点击上方按钮添加您的第一个订阅',
    totalSubscriptions: '总订阅数',
    activeSubscriptions: '活跃订阅',

    // 表单
    createTitle: '添加订阅',
    createDesc: '快速添加新的订阅服务',
    editTitle: '编辑订阅',
    editDesc: '修改 {name} 的信息',

    // 字段
    name: '订阅名称',
    namePlaceholder: '如：Netflix',
    amount: '金额',
    amountPlaceholder: '30.00',
    currency: '货币',
    billingCycle: '计费周期',
    customCycleDays: '自定义天数',
    firstBillingDate: '首次计费日期',
    nextBillingDate: '下次计费日期',
    category: '分类',
    categorySelect: '选择分类',
    websiteUrl: '网站链接',
    websiteUrlPlaceholder: 'https://example.com',
    logoUrl: '图标 URL',
    notes: '备注',
    notesPlaceholder: '添加备注信息...',
    remindDaysBefore: '提前提醒(天)',
    status: '订阅状态',

    // 分类
    categories: {
      entertainment: '娱乐',
      productivity: '工作',
      education: '学习',
      fitness: '健身',
      music: '音乐',
      cloud: '云服务',
      other: '其他',
    },

    // 计费周期
    cycles: {
      monthly: '每月',
      quarterly: '每季度',
      semiAnnually: '每半年',
      annually: '每年',
      custom: '自定义',
    },

    // 货币
    currencies: {
      CNY: '¥ 人民币',
      USD: '$ 美元',
      EUR: '€ 欧元',
      GBP: '£ 英镑',
    },

    // 图标
    quickSelect: '快速选择常见服务',
    iconSettings: '图标设置',
    fetchFavicon: 'Favicon',
    fetchGoogle: 'Google',
    fetchClearbit: 'Clearbit',

    // 按钮
    creating: '创建中...',
    create: '创建订阅',
    saving: '保存中...',
    saveChanges: '保存更改',
    deleting: '删除中...',

    // 详情
    detailsTitle: '订阅详情',
    renewalInfo: '续费信息',
    reminderSettings: '提醒设置',
    website: '网站',
    daysBeforeRenewal: '在续费日期前 {days} 天提醒',

    // 续费状态
    renewingToday: '今天续费',
    renewingTomorrow: '明天续费',
    renewingInDays: '{days} 天后续费',
    overdueDays: '逾期 {days} 天',

    // 消息
    deleteConfirm: '确定要删除这个订阅吗？',
    deleteSuccess: '订阅已删除',
    createSuccess: '订阅创建成功',
    updateSuccess: '订阅更新成功',
    canceledNote: '已取消的订阅将不计入统计',
  },

  // 仪表盘
  dashboard: {
    title: '仪表盘',
    welcome: '欢迎回来',
    overview: '概览',
    monthlySpending: '本月支出',
    upcomingRenewals: '即将续费',
    recentActivity: '最近活动',
    viewAll: '查看全部',
    noUpcoming: '暂无即将续费的订阅',
  },

  // 统计
  analytics: {
    title: '统计分析',
    totalSpending: '总支出',
    avgMonthly: '月均支出',
    byCategory: '按分类统计',
    byCurrency: '按货币统计',
    trend: '支出趋势',
    thisMonth: '本月',
    lastMonth: '上月',
    thisYear: '今年',
  },

  // 设置
  settings: {
    title: '设置',
    profile: '个人资料',
    preferences: '偏好设置',
    language: '语言',
    theme: '主题',
    notifications: '通知设置',
    account: '账户设置',
    changePassword: '修改密码',
    deleteAccount: '删除账户',
  },

  // 错误消息
  errors: {
    required: '此字段为必填项',
    invalidEmail: '邮箱格式不正确',
    passwordTooShort: '密码至少需要6个字符',
    passwordMismatch: '两次输入的密码不一致',
    loginFailed: '登录失败，请检查邮箱和密码',
    registerFailed: '注册失败，请重试',
    networkError: '网络错误，请检查您的连接',
    unknownError: '发生未知错误，请重试',
    loadFailed: '加载失败',
    saveFailed: '保存失败',
    deleteFailed: '删除失败',
  },
}

export type Translation = typeof zh
