// 将initSidebar函数移到全局作用域
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.querySelector('#sidebar-toggle');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');
  
  if (!sidebar || !sidebarToggle) {
    console.warn('侧边栏元素未找到', {
      sidebar: sidebar,
      sidebarToggle: sidebarToggle
    });
    return;
  }

  // 侧边栏按钮点击事件
  sidebarToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
    
    // 添加日志
    console.log('侧边栏状态:', {
      isOpen: sidebar.classList.contains('open'),
      sidebarClasses: sidebar.className
    });
  });

  // 点击遮罩层关闭侧边栏
  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  });

  // 点击页面其他地方关闭侧边栏
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // 搜索相关代码
  const searchContainer = document.querySelector('.search-container');
  const searchInput = document.querySelector('.search-input');
  const engineSelect = document.querySelector('.search-engine-select');
  const customSelect = document.querySelector('.custom-select');
  const selectTrigger = customSelect ? document.querySelector('.select-trigger') : null;
  const options = customSelect ? document.querySelectorAll('.option') : null;
  let currentEngine = 'google';
  
  // 删除重复定义的initSidebar函数

  // 汉堡包菜单功能初始化
  setTimeout(() => {
    initSidebar();
  }, 100);

  // 初始化搜索引擎选择器，自动选择第一个引擎
  function initSearchEngineSelector() {
    const selectTrigger = document.querySelector('.select-trigger');
    const firstOption = document.querySelector('.select-dropdown .option');
    
    if (selectTrigger && firstOption) {
      // 获取第一个选项的图标和值
      const firstIcon = firstOption.querySelector('img');
      const engineValue = firstOption.getAttribute('data-value');
      
      // 设置触发器显示第一个选项的图标
      const triggerIcon = selectTrigger.querySelector('img');
      triggerIcon.src = firstIcon.src;
      triggerIcon.alt = firstIcon.alt;
      
      // 为表单设置默认搜索引擎值
      const searchForm = document.querySelector('.search-container');
      if (searchForm) {
        // 可以在表单上设置data属性或添加隐藏字段来存储当前搜索引擎
        searchForm.setAttribute('data-engine', engineValue);
      }
      
      // 标记第一个选项为已选中
      firstOption.classList.add('selected');
    }
  }

  // 汉堡包菜单初始化函数
  function initHamburgerMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuDropdown = document.querySelector('.hamburger-menu .menu-dropdown');
    
    if (!menuToggle || !menuDropdown) {
      console.warn('菜单元素不存在: menuToggle 或 menuDropdown 未找到', {
        menuToggle: menuToggle,
        menuDropdown: menuDropdown
      });
      return;
    }
    
    // 点击菜单按钮时切换下拉菜单显示
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      menuDropdown.classList.toggle('show');
      console.log('菜单被点击，当前状态：', menuDropdown.classList.contains('show') ? '显示' : '隐藏');
    });
    
    // 点击页面其他区域关闭下拉菜单
    document.addEventListener('click', function(e) {
      if (!menuDropdown.contains(e.target) && e.target !== menuToggle) {
        menuDropdown.classList.remove('show');
      }
    });
    
    console.log('汉堡包菜单初始化成功');
  }

  // 设置搜索引擎图标 - 添加错误检查
  function updateEngineSelectStyle() {
    if (!engineSelect) return; // 如果engineSelect不存在，直接返回
    
    const selectedOption = engineSelect.options[engineSelect.selectedIndex];
    if (!selectedOption) return; // 如果没有选中选项，直接返回
    
    const logoUrl = selectedOption.dataset.logo;
    if (logoUrl) {
      engineSelect.style.backgroundImage = `url(${logoUrl})`;
    }
  }

  // 初始化搜索引擎下拉列表样式 - 添加错误检查
  if (engineSelect) {
    updateEngineSelectStyle();
    engineSelect.addEventListener('change', updateEngineSelectStyle);
  }

  // 自定义下拉菜单逻辑 - 添加错误检查
  if (customSelect && selectTrigger && options) {
    // 点击触发器显示/隐藏下拉菜单
    selectTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      customSelect.classList.toggle('active');
    });

    // 点击选项更新选择
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        const value = option.dataset.value;
        const icon = option.querySelector('img')?.src;
        
        if (icon && selectTrigger.querySelector('img')) {
          // 更新触发器图标
          selectTrigger.querySelector('img').src = icon;
        }
        
        currentEngine = value;
        
        // 关闭下拉菜单
        customSelect.classList.remove('active');
      });
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click', () => {
      customSelect.classList.remove('active');
    });
  }

  // 搜索表单提交处理 - 添加错误检查
  if (searchContainer && searchInput) {
    searchContainer.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (!query) return;

      const searchEngines = {
        google: 'https://www.google.com/search?q=',
        bing: 'https://www.bing.com/search?q=',
        perplexity: 'https://www.perplexity.ai/?q='
      };

      // 使用自定义下拉菜单或传统select的值
      const selectedEngine = engineSelect ? engineSelect.value : currentEngine;
      const searchUrl = searchEngines[selectedEngine] + encodeURIComponent(query);
      window.open(searchUrl, '_blank');
    });
  }

  // 首先定义所有类
  class CardManager {
    constructor() {
      this.initCardLogos();
      this.initCardEvents();
    }

    initCardLogos() {
      document.querySelectorAll('.card[data-logo]').forEach(card => {
        card.style.setProperty('--logo-url', `url("${card.dataset.logo}")`);
      });
    }

    initCardEvents() {
      // 修改卡片点击事件处理
      document.addEventListener('click', e => {
        const target = e.target || e.srcElement; // 增加兼容性处理
        const card = target.closest ? target.closest('.card') : findParentByClass(target, 'card');
        if (card) {
          const link = card.querySelector('a');
          if (link) window.open(link.href, '_blank');
        }
      });
    }
  }

  class NavigationManager {
    constructor() {
      this.contentContainer = document.querySelector('main'); // 使用 main 标签作为内容容器
      this.data = null; // 添加数据存储
      this.initNavigation();
    }

    initNavigation() {
      document.addEventListener('click', e => {
        const navLink = e.target.closest('.nav-link');
        if (!navLink) return;

        e.preventDefault();
        this.handleNavigation(navLink);
      });
    }

    // 在NavigationManager类的handleNavigation方法中更新逻辑

    handleNavigation(navLink) {
      try {
        toggleActiveClass(document.querySelectorAll('.nav-link'), navLink);
        // 使用category作为section id
        const targetSection = document.getElementById(navLink.dataset.category); // 修改这里
        
        if (!targetSection) {
          console.warn(`目标部分 "${navLink.dataset.category}" 未找到`); // 更新错误信息
          return;
        }

        // 查找并渲染对应分类的内容
        if (this.data) {
          // 使用category字段进行匹配
          const category = this.data.categories.find(cat => cat.category === navLink.dataset.category); // 修改这里
          if (category) {
            renderCategory(category);
          }
        }

        document.querySelectorAll('section').forEach(section => {
          section.classList.remove('active');
        });
        targetSection.classList.add('active');

        // 获取目标位置并滚动
        const scrollPosition = this.calculateScrollPosition(targetSection);
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
  }

  class SpeedTestManager {
    constructor() {
      this.domains = [
        'https://ai-tools-1i5.pages.dev',
        'https://subject-z.github.io/ai-tools',
        'http://127.0.0.1:5500'
      ];
      // 不再使用专门的健康检查文件
      this.cacheKey = 'preferredDomain';
      this.cacheExpiry = 1000 * 60 * 60; // 1小时过期
      
      this.init();
    }

    async init() {
      // 检查缓存
      const cached = this.getCachedDomain();
      if (cached) {
        const isValid = await this.testDomain(cached.domain);
        if (isValid) return;
      }

      // 执行测速
      this.raceAllDomains();
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
        
        // 直接请求域名根路径
        const response = await fetch(domain, {
          signal: controller.signal,
          method: 'HEAD'  // 只获取头信息，减少数据传输
        });
        
        clearTimeout(timeoutId);
        return response.ok;
      } catch {
        return false;
      }
    }

    async raceAllDomains() {
      try {
        console.log('开始域名竞速测试...');
        
        // 创建一个Promise.race竞赛，谁先完成谁就赢
        const domainPromises = this.domains.map(domain => {
          return new Promise(async (resolve) => {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时
              
              const start = performance.now();
              // 直接请求域名根路径，使用HEAD方法减少数据传输
              const response = await fetch(domain, {
                signal: controller.signal,
                method: 'HEAD'
              });
              clearTimeout(timeoutId);
              
              if (response.ok) {
                const time = performance.now() - start;
                console.log(`域名 ${domain} 响应成功，耗时: ${time.toFixed(2)}ms`);
                resolve({ domain, time });
              } else {
                // 不解析失败的请求
                console.log(`域名 ${domain} 响应失败，状态码: ${response.status}`);
              }
            } catch (error) {
              console.log(`域名 ${domain} 请求失败: ${error.message}`);
              // 不解析出错的请求
            }
          });
        });

        // 添加一个超时Promise，确保有最终结果
        const timeoutPromise = new Promise(resolve => {
          setTimeout(() => {
            resolve({ domain: this.domains[0], time: Infinity, isTimeout: true });
          }, 6000); // 6秒后如果都没响应，使用默认域名
        });

        // 将所有Promise合并到一个race中
        const winner = await Promise.race([
          ...domainPromises,
          timeoutPromise
        ]);

        // 如果是因为超时导致的结果，记录日志但不做跳转
        if (winner.isTimeout) {
          console.log('所有域名测试均未成功，使用默认域名');
          return;
        }

        console.log(`获胜的域名是: ${winner.domain}，耗时: ${winner.time.toFixed(2)}ms`);
        
        // 保存到缓存
        localStorage.setItem(this.cacheKey, JSON.stringify({
          domain: winner.domain,
          timestamp: Date.now()
        }));

        // 如果当前域名不是最快的，则跳转
        if (!window.location.href.startsWith(winner.domain)) {
          console.log(`跳转到更快的域名: ${winner.domain}`);
          window.location.href = winner.domain;
        }
      } catch (error) {
        console.error('域名竞速测试失败:', error);
      }
    }
  }

  // 然后再初始化管理器
  new CardManager();
  window.navigationManager = new NavigationManager();
  
  // 最后加载数据
  await loadData();
  initSearchEngineSelector();
});

// 工具函数
const toggleActiveClass = (elements, activeElement) => {
  elements.forEach(el => el.classList.remove('active'));
  activeElement.classList.add('active');
};

// 修改 renderContent 函数
function renderContent(data) {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = ''; // 清空现有内容
  
  // 使用category字段作为section id
  data.categories.forEach(category => {
    const section = document.createElement('section');
    section.id = category.category; // 修改这里
    mainContent.appendChild(section);
  });

  // 渲染第一个分类的内容
  if (data.categories.length > 0) {
    renderCategory(data.categories[0]);
  }
}

// 新增 renderCategory 函数
function renderCategory(category) {
  const section = document.getElementById(category.category); // 修改这里
  
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
  
  // 创建 logo 元素
  const logo = document.createElement('div');
  logo.className = 'card-logo';
  if (cardData.logo) {
    logo.style.backgroundImage = `url("${cardData.logo}")`;
  }
  card.appendChild(logo);
  
  const link = document.createElement('a');
  link.href = cardData.url;
  link.target = '_blank';
  link.textContent = cardData.name;
  card.appendChild(link);
  
  return card;
}

// 修改加载数据的方式
async function loadData() {
  try {
    // 确保 navigationManager 已经初始化
    if (!window.navigationManager) {
      throw new Error('NavigationManager 未初始化');
    }
    
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

// 添加辅助函数用于向上查找具有特定类名的父元素
function findParentByClass(element, className) {
  while (element) {
    if (element.classList && element.classList.contains(className)) {
      return element;
    }
    element = element.parentNode;
  }
  return null;
}
