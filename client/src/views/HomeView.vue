<script setup lang="ts">
import { computed } from 'vue'

interface StackItem {
  name: string
  description: string
}

const apiBaseUrl = computed(
  () => import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1',
)

const stackItems: StackItem[] = [
  {
    name: 'Vue 3 + TypeScript',
    description: '组件、组合式 API 和严格类型检查已经启用。',
  },
  {
    name: 'Vue Router',
    description: '页面路由入口已经建立，后续功能按路由边界扩展。',
  },
  {
    name: 'Pinia',
    description: '全局状态容器已经安装，认证和项目状态将在后续加入。',
  },
  {
    name: 'Element Plus',
    description: '桌面端组件库和基础样式已经接入。',
  },
]
</script>

<template>
  <div class="home-shell">
    <!-- 应用页头：展示品牌与当前初始化状态。 -->
    <header class="app-header">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true">TF</span>
        <div>
          <strong>TaskFlow</strong>
          <span>全栈任务协作项目</span>
        </div>
      </div>
      <span class="status-tag">前端工程已初始化</span>
    </header>

    <main class="home-content">
      <!-- 工程概览：确认初始化边界和开发环境状态。 -->
      <section class="overview-card" aria-labelledby="overview-title">
        <div class="overview-copy">
          <span class="eyebrow">CLIENT WORKSPACE</span>
          <h1 id="overview-title">前端基础工程已就绪</h1>
          <p>
            当前版本建立了 Vue
            应用外壳、路由、状态容器和组件库入口，为登录、项目和任务功能提供稳定起点。
          </p>
          <dl class="environment">
            <div>
              <dt>API 地址</dt>
              <dd>{{ apiBaseUrl }}</dd>
            </div>
            <div>
              <dt>开发端口</dt>
              <dd>5173</dd>
            </div>
          </dl>
        </div>
        <div class="overview-badge" aria-hidden="true">
          <span>01</span>
          <small>初始化阶段</small>
        </div>
      </section>

      <!-- 技术栈状态：帮助开发时快速核对基础能力。 -->
      <section class="stack-section" aria-labelledby="stack-title">
        <div class="section-heading">
          <div>
            <h2 id="stack-title">基础能力</h2>
            <p>以下模块已经安装并接入应用入口。</p>
          </div>
        </div>
        <ul class="stack-grid">
          <li v-for="item in stackItems" :key="item.name" class="stack-card">
            <span class="stack-indicator" aria-hidden="true"></span>
            <strong>{{ item.name }}</strong>
            <p>{{ item.description }}</p>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style scoped>
.home-shell {
  min-height: 100vh;
  background: var(--color-canvas);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 68px;
  border-bottom: 1px solid var(--color-border);
  padding: 0 40px;
  background: var(--color-surface);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 9px;
  background: var(--color-primary);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
}

.brand strong,
.brand span {
  display: block;
}

.brand strong {
  color: var(--color-text);
  font-size: 17px;
}

.brand div > span {
  margin-top: 2px;
  color: var(--color-text-muted);
  font-size: 12px;
}

.status-tag {
  border: 1px solid #b9ebc8;
  border-radius: 6px;
  padding: 5px 10px;
  background: var(--color-success-soft);
  color: var(--color-success);
  font-size: 12px;
  font-weight: 700;
}

.home-content {
  width: min(1180px, calc(100% - 64px));
  margin: 0 auto;
  padding: 44px 0 60px;
}

.overview-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: 48px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 38px 40px;
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.eyebrow {
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.overview-copy h1 {
  margin: 13px 0 12px;
  color: var(--color-text);
  font-size: 31px;
  line-height: 1.3;
}

.overview-copy > p {
  max-width: 720px;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 1.8;
}

.environment {
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
  margin: 28px 0 0;
}

.environment div {
  min-width: 240px;
}

.environment dt {
  color: var(--color-text-muted);
  font-size: 12px;
}

.environment dd {
  margin: 6px 0 0;
  color: var(--color-text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
}

.overview-badge {
  display: grid;
  width: 160px;
  height: 160px;
  place-content: center;
  justify-self: end;
  border: 1px solid #b9d6ff;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  text-align: center;
}

.overview-badge span,
.overview-badge small {
  display: block;
}

.overview-badge span {
  font-size: 42px;
  font-weight: 800;
  line-height: 1;
}

.overview-badge small {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
}

.stack-section {
  margin-top: 30px;
}

.section-heading {
  margin-bottom: 16px;
}

.section-heading h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 20px;
}

.section-heading p {
  margin: 6px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.stack-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.stack-card {
  min-height: 154px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.stack-indicator {
  display: block;
  width: 9px;
  height: 9px;
  margin-bottom: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 0 5px var(--color-primary-soft);
}

.stack-card strong {
  display: block;
  color: var(--color-text);
  font-size: 15px;
}

.stack-card p {
  margin: 9px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.65;
}

@media (max-width: 900px) {
  .app-header {
    padding: 0 24px;
  }

  .home-content {
    width: calc(100% - 40px);
    padding-top: 28px;
  }

  .overview-card {
    grid-template-columns: 1fr;
  }

  .overview-badge {
    display: none;
  }

  .stack-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
