document.addEventListener('DOMContentLoaded', async () => {
  // 在其他初始化之前，先初始化导航标签
  await initCategoryNav();
  
  // 搜索相关代码
  const searchContainer = document.querySelector('.search-container');
  const searchInput = document.querySelector('.search-input');
  const engineSelect = document.querySelector('.search-engine-select');
  const customSelect = document.querySelector('.custom-select');
  const selectTrigger = customSelect ? document.querySelector('.select-trigger') : null;
  const options = customSelect ? document.querySelectorAll('.option') : null;
  let currentEngine = 'bing';

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

    handleNavigation(navLink) {
      try {
        window.toggleActiveClass(document.querySelectorAll('.nav-link'), navLink);
        // 使用category作为section id
        const targetSection = document.getElementById(navLink.dataset.category);
        
        if (!targetSection) {
          return;
        }

        // 查找并渲染对应分类的内容
        if (this.data) {
          // 使用category字段进行匹配
          const category = this.data.categories.find(cat => cat.category === navLink.dataset.category);
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
        // 删除错误日志
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
  
  // 然后初始化管理器
  new window.CardManager();
  window.navigationManager = new NavigationManager();
  
  // 最后加载数据
  await loadData();
  initSearchEngineSelector();
});

// 初始化分类导航标签
async function initCategoryNav() {
  try {
    // 获取导航容器内的链接容器
    const categoryLinks = document.querySelector('.category-links');
    if (!categoryLinks) return;

    // 加载索引文件
    const response = await fetch('data/index.json');
    if (!response.ok) throw new Error(`索引文件加载失败! status: ${response.status}`);
    
    const index = await response.json();
    if (!index.categories || !index.categories.length) throw new Error('类别数据为空');
    
    // 创建导航标签 - 直接使用div包含链接，不使用ul/li结构
    const navHTML = index.categories.map((category, i) => 
      `<a href="#" class="nav-link ${i === 0 ? 'active' : ''}" 
         data-category="${category}">${getCategoryLabel(category)}</a>`
    ).join('');
    
    // 更新链接容器内容
    categoryLinks.innerHTML = navHTML;
    
    return index.categories;
  } catch (error) {
    console.error('初始化导航标签失败:', error);
    return [];
  }
}

// 获取分类的显示标签
function getCategoryLabel(category) {
  const labels = {
    'aigc': 'AI',
    'lifestyle': '生活',
    'information': '信息',
    'entertainment': '娱乐',
    'productivity': '效率'
    // 可根据需要添加更多标签映射
  };
  return labels[category] || category;
}

// 修改 renderContent 函数
function renderContent(data) {
  const mainContent = document.querySelector('.website-directory');
  if (!mainContent) return; // 安全检查
  
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
      const subcategoryTitle = document.createElement('h2');
      subcategoryTitle.className = 'subcategory-title';
      subcategoryTitle.textContent = subcategory.name;
      subcategorySection.appendChild(subcategoryTitle);
      
      // 创建内容容器
      const subcategoryContent = document.createElement('div');
      subcategoryContent.className = 'subcategory-content';
      
      // 渲染当前子分类下的所有卡片
      subcategory.items.forEach(item => {
        subcategoryContent.appendChild(window.createCard(item));
      });
      
      subcategorySection.appendChild(subcategoryContent);
      cardList.appendChild(subcategorySection);
    });
  } else if (category.items && category.items.length > 0) {
    category.items.forEach(item => {
      cardList.appendChild(window.createCard(item));
    });
  }
  
  section.appendChild(cardList);
}

// 修改加载数据的方式
async function loadData() {
  try {
    // 确保 navigationManager 已经初始化
    if (!window.navigationManager) {
      throw new Error('NavigationManager 未初始化');
    }
    
    // 先加载索引文件
    const indexResponse = await fetch('data/index.json');
    if (!indexResponse.ok) {
      throw new Error(`索引文件加载失败! status: ${indexResponse.status}`);
    }
    const index = await indexResponse.json();
    
    // 并行加载所有类别文件
    const categoriesPromises = index.categories.map(async (category) => {
      try {
        const response = await fetch(`data/${category}.json`);
        if (!response.ok) {
          return null;
        }
        return await response.json();
      } catch (err) {
        return null;
      }
    });
    
    const categoriesData = await Promise.all(categoriesPromises);
    
    // 过滤掉加载失败的类别
    const validCategories = categoriesData.filter(category => category !== null);
    
    if (validCategories.length === 0) {
      throw new Error('没有成功加载任何类别数据');
    }
    
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
    document.getElementsByClassName('website-directory').innerHTML = '<p>加载数据失败，请刷新页面重试</p>';
  }
}