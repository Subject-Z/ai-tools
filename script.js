document.addEventListener('DOMContentLoaded', async () => {
  // 加载数据
  await loadData();  // 添加这一行
  
  // 网站测速与跳转管理
  class SpeedTestManager {
    constructor() {
      this.domains = [
        'https://ai-tools-1i5.pages.dev',
        'https://subject-z.github.io/ai-tools'
      ];
      this.healthCheckFile = '/healthcheck.txt';
      this.cacheKey = 'preferredDomain';
      this.cacheExpiry = 1000 * 60 * 60; // 1小时过期
      
      // this.init(); // 注释掉初始化调用
    }

    async init() {
      // 检查缓存
      const cached = this.getCachedDomain();
      if (cached) {
        const isValid = await this.testDomain(cached.domain);
        if (isValid) return;
      }

      // 执行测速
      this.testAllDomains();
    }

    getCachedDomain() {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;

      try {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp > this.cacheExpiry) {
          localStorage.removeItem(this.cacheKey);
          return null;
        }
        return data;
      } catch {
        localStorage.removeItem(this.cacheKey);
        return null;
      }
    }

    async testDomain(domain, timeout = 2000) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const start = performance.now();
        const response = await fetch(`${domain}${this.healthCheckFile}`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) return { domain, time: Infinity };
        
        const time = performance.now() - start;
        return { domain, time };
      } catch {
        return { domain, time: Infinity };
      }
    }

    async testAllDomains() {
      try {
        const results = await Promise.all(
          this.domains.map(domain => this.testDomain(domain))
        );

        const validResults = results.filter(r => r.time !== Infinity);
        if (validResults.length === 0) return;

        // 选择最快的域名
        const fastest = validResults.reduce((a, b) => a.time < b.time ? a : b);
        
        // 保存到缓存
        localStorage.setItem(this.cacheKey, JSON.stringify({
          domain: fastest.domain,
          timestamp: Date.now()
        }));

        // 如果当前域名不是最快的，则跳转
        if (!window.location.href.startsWith(fastest.domain)) {
          window.location.href = fastest.domain;
        }
      } catch (error) {
        console.error('域名测速失败:', error);
      }
    }
  }

  // 注释掉 SpeedTestManager 的初始化
  // new SpeedTestManager();
  
  // 工具函数
  const toggleActiveClass = (elements, activeElement) => {
    elements.forEach(el => el.classList.remove('active'));
    activeElement.classList.add('active');
  };

  // 初始化卡片
  class CardManager {
    constructor() {
      this.initCardLogos();
      this.initCardEvents();
      // 添加单例 tooltip
      this.tooltip = null;
      this.tooltipTimeout = null;
    }

    initCardLogos() {
      document.querySelectorAll('.card[data-logo]').forEach(card => {
        card.style.setProperty('--logo-url', `url("${card.dataset.logo}")`);
      });
    }

    initCardEvents() {
      // 卡片点击事件保持不变
      document.addEventListener('click', e => {
        const card = e.target.closest('.card');
        if (card) {
          const link = card.querySelector('a');
          if (link) window.open(link.href, '_blank');
        }
      });

      // 使用 mouseenter 替代 mouseover
      document.addEventListener('mouseenter', e => {
        const card = e.target.closest('.card');
        if (!card) return;

        const description = card.dataset.description;
        if (!description) return;

        // 清除已有的超时
        if (this.tooltipTimeout) {
          clearTimeout(this.tooltipTimeout);
          this.tooltipTimeout = null;
        }

        // 创建或重用 tooltip
        if (!this.tooltip) {
          this.tooltip = document.createElement('div');
          this.tooltip.className = 'tooltip';
        }

        this.tooltip.textContent = description;
        this.tooltip.style.visibility = 'hidden';
        this.tooltip.style.opacity = '0';
        card.appendChild(this.tooltip);

        // 强制重排以确保过渡动画生效
        void this.tooltip.offsetWidth;

        // 计算位置并显示
        requestAnimationFrame(() => {
          const cardRect = card.getBoundingClientRect();
          const tooltipRect = this.tooltip.getBoundingClientRect();
          
          this.tooltip.style.visibility = 'visible';
          this.tooltip.style.opacity = '1';
          this.tooltip.style.left = `${(cardRect.width - tooltipRect.width) / 2}px`;
          this.tooltip.style.top = `${cardRect.height + 8}px`;
        });
      }, true);

      // 使用 mouseleave 替代 mouseout
      document.addEventListener('mouseleave', e => {
        const card = e.target.closest('.card');
        if (!card || !this.tooltip) return;

        this.tooltip.style.opacity = '0';
        
        // 设置延迟移除
        this.tooltipTimeout = setTimeout(() => {
          if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.remove();
          }
          this.tooltip = null;
        }, 200);
      }, true);
    }
  }

  // 搜索引擎管理
  class SearchManager {
    constructor() {
      this.form = document.getElementById('search-form');
      this.searchInput = this.form.querySelector('input');
      this.initEngineSwitch();
    }

    initEngineSwitch() {
      document.addEventListener('click', e => {
        const engineLink = e.target.closest('.engine-link');
        if (engineLink) {
          e.preventDefault();
          this.form.action = engineLink.dataset.engine;
          this.searchInput.name = engineLink.dataset.name;
          toggleActiveClass(document.querySelectorAll('.engine-link'), engineLink);
        }
      });
    }
  }

  // 导航管理
  class NavigationManager {
    constructor() {
      this.contentContainer = document.querySelector('main'); // 使用 main 标签作为内容容器
      this.data = null; // 添加数据存储
      this.initNavigation();
      this.initSubcategories();
    }

    initNavigation() {
      document.addEventListener('click', e => {
        const navLink = e.target.closest('.nav-link');
        if (!navLink) return;

        e.preventDefault();
        this.handleNavigation(navLink);
      });
    }

    handleNavigation(navLink) {
      try {
        toggleActiveClass(document.querySelectorAll('.nav-link'), navLink);
        const targetSection = document.getElementById(navLink.dataset.section);
        
        if (!targetSection) {
          console.warn(`目标部分 "${navLink.dataset.section}" 未找到`);
          return;
        }

        // 查找并渲染对应分类的内容
        if (this.data) {
          const category = this.data.categories.find(cat => cat.id === navLink.dataset.section);
          if (category) {
            renderCategory(category);
          }
        }

        document.querySelectorAll('section').forEach(section => {
          section.classList.remove('active');
        });
        targetSection.classList.add('active');

        // 获取目标位置
        const scrollPosition = this.calculateScrollPosition(targetSection);

        // 执行滚动
        this.smoothScroll(scrollPosition);
      } catch (error) {
        console.error('导航滚动发生错误:', error);
      }
    }

    calculateScrollPosition(targetSection) {
      const viewportHeight = window.innerHeight;
      const targetOffset = viewportHeight * 0.3;
      return targetSection.offsetTop - targetOffset;
    }

    smoothScroll(position) {
      window.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    }

    initSubcategories() {
      document.addEventListener('change', e => {
        const input = e.target.closest('.subcategory-tabs input');
        if (input) {
          const section = input.closest('section');
          const subcatId = input.nextElementSibling.dataset.subcat;
          section.querySelectorAll('.card-list').forEach(list => {
            list.style.display = list.id === subcatId ? 'grid' : 'none';
          });
        }
      });
    }
  }

  // 初始化所有管理器
  new CardManager();
  new SearchManager();
  window.navigationManager = new NavigationManager(); // 保存实例到全局

  await loadData();  // 加载数据
});

// 修改 renderContent 函数
function renderContent(data) {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = ''; // 清空现有内容
  
  // 先创建所有分类的容器，但不渲染内容
  data.categories.forEach(category => {
    const section = document.createElement('section');
    section.id = category.id;
    mainContent.appendChild(section);
  });

  // 渲染第一个分类的内容
  if (data.categories.length > 0) {
    renderCategory(data.categories[0]);
  }
}

// 新增 renderCategory 函数
function renderCategory(category) {
  const section = document.getElementById(category.id);
  
  // 如果已经渲染过，就不重复渲染
  if (section.querySelector('.card-list')) {
    return;
  }

  const cardList = document.createElement('div');
  cardList.className = 'card-list';
  
  // 渲染卡片
  category.items.forEach(item => {
    cardList.appendChild(createCard(item));
  });
  
  section.appendChild(cardList);
}

// 创建单个卡片
function createCard(cardData) {
  const card = document.createElement('div');
  card.className = 'card';
  if (cardData.logo) {
    card.setAttribute('data-logo', cardData.logo);
  }
  
  const link = document.createElement('a');
  link.href = cardData.url;
  link.target = '_blank';
  link.textContent = cardData.name;
  card.appendChild(link);
  
  if (cardData.description) {
    card.setAttribute('data-description', cardData.description);
  }
  
  return card;
}

// 修改加载数据的方式
async function loadData() {
  try {
    console.log('开始加载数据...');
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('成功加载数据:', data);
    
    // 保存数据到 NavigationManager 实例
    window.navigationManager.data = data;
    renderContent(data);
    
    // 默认激活第一个分类
    const firstSection = document.querySelector('section');
    const firstNavLink = document.querySelector('.nav-link');
    if (firstSection && firstNavLink) {
      firstSection.classList.add('active');
      firstNavLink.classList.add('active');
    }
  } catch (error) {
    console.error('加载数据失败:', error);
    document.getElementById('main-content').innerHTML = '<p>加载数据失败，请刷新页面重试</p>';
  }
}