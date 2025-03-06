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
  let currentEngine = 'bing';
  
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
      let query = searchInput.value.trim();
      if (!query) {
        // 如果搜索框为空，使用placeholder的值
        query = searchInput.placeholder;
      }

      const searchEngines = {
        google: 'https://www.google.com/search?q=',
        bing: 'https://www.bing.com/search?q=',
        perplexity: 'https://www.perplexity.ai/?q=',
        Genspark: 'https://www.genspark.ai/search?query=',
        ThinkAny: 'https://thinkany.so/zh/search?q=',
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

  // 域名切换功能 - 简化版
  function initDomainFallback() {
    // 避免循环跳转
    if (new URLSearchParams(window.location.search).get('from') === 'fallback') {
      console.log("已从备用站点跳转，不再重复操作");
      return;
    }
  
    // 定义域名映射关系
    const DOMAIN_MAP = {
      "ai-tools-1i5.pages.dev": "https://subject-z.github.io/ai-tools",
      "subject-z.github.io": "https://ai-tools-1i5.pages.dev",
      "127.0.0.1": null // 本地开发环境不跳转
    };
    
    const currentHostname = window.location.hostname;
    // 从域名映射中获取当前站点的备用站点
    const fallbackDomain = DOMAIN_MAP[currentHostname];
    
    if (!fallbackDomain) {
      console.log("当前为开发环境或无备用域名，跳过可用性检测");
      return;
    }
    
    // 设置超时，确保不会因网络问题永久挂起
    const timeoutId = setTimeout(() => {
      console.log("当前站点响应超时，跳转到备用站点");
      window.location.href = `${fallbackDomain}?from=fallback`;
    }, 3000);
    
    // 检测当前站点可用性
    fetch(`/favicon.ico?t=${Date.now()}`, { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store'
    })
    .then(() => {
      // 当前站点可用，清除超时
      clearTimeout(timeoutId);
      console.log("当前站点可用，无需跳转");
    })
    .catch(error => {
      // 当前站点不可用，跳转到备用站点
      console.error("当前站点不可用，跳转到备用站点:", error);
      window.location.href = `${fallbackDomain}?from=fallback`;
    });
  }
  
  // 在DOMContentLoaded事件中调用
  initDomainFallback();

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

// 修改 renderCategory 函数，将子分类内容包裹在半透明背景中
function renderCategory(category) {
  const section = document.getElementById(category.category);
  
  // 如果已经渲染过，就不重复渲染
  if (section.querySelector('.card-list')) {
    return;
  }

  const cardList = document.createElement('div');
  cardList.className = 'card-list';
  
  // 检查是否有子分类
  if (category.subcategories && category.subcategories.length > 0) {
    // 渲染子分类
    category.subcategories.forEach(subcategory => {
      // 创建子分类区域容器
      const subcategorySection = document.createElement('div');
      subcategorySection.className = 'subcategory-section';
      
      // 添加子分类标题
      const subcategoryTitle = document.createElement('h3');
      subcategoryTitle.className = 'subcategory-title';
      subcategoryTitle.textContent = subcategory.name;
      subcategorySection.appendChild(subcategoryTitle);
      
      // 创建内容容器
      const subcategoryContent = document.createElement('div');
      subcategoryContent.className = 'subcategory-content';
      
      // 渲染当前子分类下的所有卡片
      subcategory.items.forEach(item => {
        subcategoryContent.appendChild(createCard(item));
      });
      
      subcategorySection.appendChild(subcategoryContent);
      cardList.appendChild(subcategorySection);
    });
  } else if (category.items && category.items.length > 0) {
    // 兼容旧结构：没有子分类，直接渲染卡片
    category.items.forEach(item => {
      cardList.appendChild(createCard(item));
    });
  }
  
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
    // 直接使用原始 URL 而不使用缓存系统
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
    
    // 先加载索引文件
    const indexResponse = await fetch('data/index.json');
    if (!indexResponse.ok) {
      throw new Error(`索引文件加载失败! status: ${indexResponse.status}`);
    }
    const index = await indexResponse.json();
    console.log('成功加载索引:', index);
    
    // 并行加载所有类别文件
    const categoriesPromises = index.categories.map(async (category) => {
      try {
        const response = await fetch(`data/${category}.json`);
        if (!response.ok) {
          console.warn(`加载类别 ${category} 失败: ${response.status}`);
          return null;
        }
        return await response.json();
      } catch (err) {
        console.error(`加载类别 ${category} 时出错:`, err);
        return null;
      }
    });
    
    const categoriesData = await Promise.all(categoriesPromises);
    
    // 过滤掉加载失败的类别
    const validCategories = categoriesData.filter(category => category !== null);
    
    if (validCategories.length === 0) {
      throw new Error('没有成功加载任何类别数据');
    }
    
    console.log('成功加载数据:', validCategories);
    
    // 创建与原始数据结构兼容的对象
    const data = {
      categories: validCategories
    };
    
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