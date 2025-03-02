document.addEventListener('DOMContentLoaded', () => {
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
  new NavigationManager();
});