// 初始化数据库脚本
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始初始化数据库...\n');

try {
  // 创建 Prisma Client
  console.log('📦 生成 Prisma Client...');
  execSync('npx -y prisma@5.20.0 generate', {
    stdio: 'inherit',
    env: { ...process.env, PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING: '1' }
  });

  console.log('\n✅ Prisma Client 生成成功！');
  console.log('\n🎉 数据库初始化完成！');
  console.log('\n现在可以运行: npm run dev');

} catch (error) {
  console.error('\n❌ 初始化失败:', error.message);
  console.log('\n💡 解决方案：');
  console.log('1. 确保网络连接正常');
  console.log('2. 或者手动运行: PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate');
  process.exit(1);
}
