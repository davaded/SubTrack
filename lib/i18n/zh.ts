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
    appName: 'SubTrack',
    cancelled: '已取消',
    comingSoon: '即将推出',
  },

  // 导航
  nav: {
    dashboard: '首页',
    subscriptions: '订阅管理',
    subscriptionsShort: '订阅',
    analytics: '统计分析',
    analyticsShort: '统计',
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
    signIn: '登录',
    signUp: '注册',
    signingIn: '登录中...',
    creatingAccount: '创建账号中...',
    loginDescription: '登录以管理您的订阅',
    registerDescription: '注册以开始追踪您的订阅',
    emailPlaceholder: 'your@email.com',
    nameOptional: '姓名（可选）',
    namePlaceholder: '您的姓名',
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
    manageDescription: '在一个地方管理您的所有订阅',
    searchPlaceholder: '搜索订阅...',
    allCategories: '全部分类',
    noMatchingSubscriptions: '未找到符合条件的订阅',
    addFirstSubscription: '添加您的第一个订阅',
    viewDetails: '查看详情',
    nextBilling: '下次计费：',

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
    quickSelectLabel: '快速选择常见服务：',
    iconSettings: '图标设置',
    iconLogoOptional: '图标/Logo（可选）',
    currentIcon: '当前图标',
    customIconUrl: '或输入自定义图标 URL',
    iconTip: '提示：输入官网链接后，可选择不同方式自动获取图标',
    fetchFavicon: '获取 Favicon',
    fetchGoogle: 'Google 图标',
    fetchClearbit: 'Clearbit Logo',

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
    overviewDescription: '您的订阅支出概览',
    monthlySpending: '本月支出',
    monthlyCost: '月度支出',
    perYear: '每年',
    nextMonthForecast: '下月预计续费',
    subscriptionsRenewing: '个订阅续费',
    upcomingRenewals: '即将续费',
    recentActivity: '最近活动',
    viewAll: '查看全部',
    noUpcoming: '暂无即将续费的订阅',
    noUpcomingRenewals30Days: '未来 30 天内没有即将续费的订阅',
    inNext30Days: '未来 30 天内',
  },

  // 统计
  analytics: {
    title: '统计分析',
    description: '查看您的订阅支出详情',
    totalSpending: '总支出',
    avgMonthly: '月均支出',
    byCategory: '按分类统计',
    byCurrency: '按货币统计',
    trend: '支出趋势',
    thisMonth: '本月',
    lastMonth: '上月',
    thisYear: '今年',
    monthlyTotal: '每月总计',
    yearlyTotal: '每年总计',
    monthlyCost: '月度支出',
    yearlyCost: '年度支出',
    cancelledSubscriptions: '已取消订阅',
    services: '个服务',
    categorySpending: '分类支出占比',
    monthlyYearlyComparison: '月度/年度支出对比',
    monthly: '月度',
    yearly: '年度',
    noCategoryData: '暂无分类数据',
    categoryDetails: '分类详情',
    loadFailed: '加载统计数据失败',
    upcomingRenewals: '本月即将续费',
    renewToday: '今天续费',
    renewTomorrow: '明天续费',
    daysLeft: '天后',
  },

  // 设置
  settings: {
    title: '设置',
    description: '管理您的账户设置和偏好',
    profile: '个人资料',
    profileDescription: '更新您的个人资料',
    preferences: '偏好设置',
    language: '语言',
    theme: '主题',
    notifications: '通知设置',
    notificationsDescription: '管理您的通知偏好',
    account: '账户设置',
    changePassword: '修改密码',
    changePasswordDescription: '为了安全，请定期更新您的密码',
    deleteAccount: '删除账户',
    deleteAccountWarning: '永久删除您的账户和所有数据',

    // 个人信息
    emailLabel: '邮箱',
    emailCannotChange: '邮箱无法修改',
    nameLabel: '姓名',
    namePlaceholder: '您的姓名',
    defaultCurrency: '默认货币',
    defaultCurrencyHint: '新添加的订阅将默认使用此货币',
    profileUpdateSuccess: '个人信息更新成功',

    // 密码
    currentPassword: '当前密码',
    newPassword: '新密码',
    confirmNewPassword: '确认新密码',
    passwordMinLength: '至少 6 位字符',
    passwordChanging: '修改中...',
    passwordChangeSuccess: '密码修改成功',
    passwordChangeFailed: '密码修改失败，请检查当前密码是否正确',

    // 通知
    browserNotifications: '浏览器通知',
    browserNotificationsDesc: '当订阅即将续费时通知您',
    emailNotifications: '邮件通知',
    emailNotificationsDesc: '接收续费提醒邮件',
    notificationTest: '通知渠道测试',
    notificationTestDesc: '测试您配置的通知渠道是否正常工作',
    loadingConfig: '加载配置中...',
    noChannelConfigured: '未配置任何通知渠道',
    configureChannelHint: '请在项目的 .env 文件中配置至少一个通知渠道',
    emailChannel: '邮件通知 (Resend)',
    dingtalkChannel: '钉钉通知',
    feishuChannel: '飞书通知',
    webhookConfigured: 'Webhook：已配置',
    signatureVerification: '签名验证',
    signatureEnabled: '已启用',
    signatureDisabled: '未启用',
    sendTest: '发送测试',
    sending: '发送中...',
    testSuccess: '测试成功',
    testFailed: '测试失败',
    sender: '发件人',
    receiver: '接收邮箱',
    testTip: '提示：点击"发送测试"按钮后',
    checkEmail: '邮件通知：检查您的邮箱收件箱',
    checkDingtalk: '钉钉通知：检查您的钉钉群消息',
    checkFeishu: '飞书通知：检查您的飞书群消息',

    // 数据管理
    dataManagement: '数据管理',
    dataManagementDescription: '导出或删除您的数据',
    exportData: '导出数据',
    exportDataDescription: '下载您的所有订阅数据',
    exportCSV: '导出 CSV',

    // 关于
    about: '关于',
    appTitle: 'SubTrack - 订阅管理系统',
    version: '版本',
    termsOfService: '使用条款',
    privacyPolicy: '隐私政策',
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
    updateFailed: '更新失败',
  },

  // 页面元数据
  meta: {
    title: 'SubTrack - 订阅管理系统',
    description: '在一个地方管理您的所有订阅',
  },
}

export type Translation = typeof zh
