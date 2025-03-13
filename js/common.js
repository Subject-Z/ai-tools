/**
 * 通用工具函数和组件
 * 包含顶部导航、工具函数、域名切换功能和卡片管理器
 */

// 顶部导航更新
function updateTopNav() {
  document.querySelector('.top-links').innerHTML = 
    ['🧭 导航', '📖 小说', '✉️ 关于']
      .map((name, i) => `<a href="${[
        '/', 
        '/webnovel/index.html', 
        '/about/index.html'
      ][i]}">${name}</a>`).join('');
}

// 初始化汉堡菜单功能
function initHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger-menu');
  const topLinks = document.querySelector('.top-links');
  
  if (hamburger && topLinks) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      topLinks.classList.toggle('active');
    });
    
    // 点击链接后自动关闭菜单
    topLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        topLinks.classList.remove('active');
      });
    });
    
    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.hamburger-menu') && 
          !event.target.closest('.top-links')) {
        hamburger.classList.remove('active');
        topLinks.classList.remove('active');
      }
    });
  }
}

// ===== 工具函数 =====

// 切换元素活跃状态
const toggleActiveClass = (elements, activeElement) => {
  elements.forEach(el => el.classList.remove('active'));
  activeElement.classList.add('active');
};

// 向上查找具有特定类名的父元素
function findParentByClass(element, className) {
  while (element) {
    if (element.classList && element.classList.contains(className)) {
      return element;
    }
    element = element.parentNode;
  }
  return null;
}

// ===== 域名切换功能 =====

// 优化后的域名切换功能 - 考虑CNAME别名和多托管服务器情况
function initDomainFallback() {
  // 避免循环跳转
  if (new URLSearchParams(window.location.search).get('from') === 'fallback') {
    return;
  }

  // 定义域名配置和优先级
  const DOMAIN_CONFIG = {
    // 主域名 (CNAME别名)
    "omninav.uk": {
      priority: 1,
      fallback: ["ai-tools-1i5.pages.dev", "subject-z.github.io"]
    },
    // 托管服务器1
    "ai-tools-1i5.pages.dev": {
      priority: 2, 
      fallback: ["subject-z.github.io", "omninav.uk"]
    },
    // 托管服务器2
    "subject-z.github.io": {
      priority: 3,
      fallback: ["ai-tools-1i5.pages.dev", "omninav.uk"]
    },
    // 本地开发环境不跳转
    "127.0.0.1": {
      priority: 0,
      fallback: []
    },
    "localhost": {
      priority: 0,
      fallback: []
    }
  };
  
  const currentHostname = window.location.hostname;
  const config = DOMAIN_CONFIG[currentHostname];
  
  // 如果当前域名未在配置中或为本地开发环境，不进行跳转
  if (!config || config.priority === 0) {
    return;
  }
  
  // 检测当前站点可用性，如果不可用则立即跳转
  checkSiteAvailability()
    .then(isAvailable => {
      if (!isAvailable && config.fallback.length > 0) {
        // 当前站点不可用，立即跳转到备选站点
        performFallback(config.fallback[0]);
      }
    })
    .catch(() => {
      // 检测过程中出错，也立即跳转到备选站点
      if (config.fallback.length > 0) {
        performFallback(config.fallback[0]);
      }
    });
}

// 检查当前站点可用性
function checkSiteAvailability() {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve(false);
    }, 1000);
    
    fetch(`/favicon.ico?t=${Date.now()}`, { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store'
    })
    .then(() => {
      clearTimeout(timeoutId);
      resolve(true); // 请求成功认为可用
    })
    .catch(() => {
      clearTimeout(timeoutId);
      resolve(false); // 请求失败认为不可用
    });
  });
}

// 执行域名跳转
function performFallback(fallbackDomain) {
  if (!fallbackDomain) {
    return;
  }
  
  // 保存当前路径和查询参数，以便在跳转时保留
  const currentPathWithQuery = window.location.pathname + window.location.search + window.location.hash;
  
  // 添加fallback标记，防止循环重定向
  const separator = currentPathWithQuery.includes('?') ? '&' : '?';
  const fallbackMarker = `${separator}from=fallback`;
  const fullPath = currentPathWithQuery + (currentPathWithQuery.includes('from=fallback') ? '' : fallbackMarker);
  
  // 生成跳转URL并立即跳转
  const protocol = window.location.protocol;
  window.location.href = `${protocol}//${fallbackDomain}${fullPath}`;
}

// ===== 卡片管理器类 =====

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
    // 修改卡片点击事件处理 - 删除UTM参数处理
    document.addEventListener('click', e => {
      const target = e.target || e.srcElement; // 增加兼容性处理
      const cardBody = target.closest ? target.closest('.card-body') : findParentByClass(target, 'card-body');
      
      if (cardBody) {
        const link = cardBody.querySelector('a');
        if (link) {
          // 直接打开链接，不添加UTM参数
          window.open(link.href, '_blank');
        }
      }
    });
  }
}

// 创建单个卡片
function createCard(cardData) {
  const card = document.createElement('div');
  card.className = 'card';
  
  // 创建卡片主体容器
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  card.appendChild(cardBody);
  
  // 创建 logo 元素
  const logo = document.createElement('div');
  logo.className = 'card-logo';
  if (cardData.logo) {
    logo.style.backgroundImage = `url("${cardData.logo}")`;
  }
  cardBody.appendChild(logo);
  
  // 主链接
  const link = document.createElement('a');
  link.href = cardData.url;
  link.target = '_blank';
  link.textContent = cardData.name;
  cardBody.appendChild(link);
  
  // 添加优惠链接按钮（如果存在）- 放在主链接下方，但在卡片容器内
  if (cardData.promotion) {
    const promotionBtn = document.createElement('a');
    // 不直接设置href属性，而是使用javascript:void(0)
    promotionBtn.href = "javascript:void(0)";
    promotionBtn.className = 'promotion-btn';
    promotionBtn.textContent = cardData.promotion.text || '优惠';
    
    // 使用点击事件处理器来打开链接
    promotionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(cardData.promotion.url, '_blank');
    });
    
    card.appendChild(promotionBtn);
  }
  
  return card;
}

// ===== 页面加载时执行 =====

document.addEventListener('DOMContentLoaded', () => {
  // 更新顶部导航
  updateTopNav();
  
  // 初始化汉堡菜单
  initHamburgerMenu();
  
  // 初始化域名切换功能
  initDomainFallback();
});

// 禁用默认右键菜单
document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
  return false;
}, false);

// 可选：实现自定义上下文菜单
document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
  
  const customMenu = document.querySelector('.custom-context-menu');
  if (customMenu) {
    customMenu.style.left = `${event.clientX}px`;
    customMenu.style.top = `${event.clientY}px`;
    customMenu.classList.add('visible');
  }
});

// 点击其他区域关闭自定义菜单
document.addEventListener('click', function() {
  const customMenu = document.querySelector('.custom-context-menu');
  if (customMenu) {
    customMenu.classList.remove('visible');
  }
});

// 导出通用组件和函数
window.CardManager = CardManager;
window.createCard = createCard;
window.toggleActiveClass = toggleActiveClass;
window.findParentByClass = findParentByClass;