document.addEventListener('DOMContentLoaded', function() {
  // 加载优惠券数据
  loadCoupons();
  
  // 分类导航功能
  setupCategoryNavigation();
  
  // 复制优惠码功能
  setupCouponCodeCopy();
});

function loadCoupons() {
  // 这里可以是静态数据或从API获取的数据
  const coupons = [
    {
      title: "ChatGPT Plus 订阅优惠",
      description: "首月订阅享8折优惠",
      code: "AIPLUS20",
      expire: "2025-04-15",
      category: "ai",
      link: "https://chat.openai.com/"
    },
    {
      title: "Claude Pro 会员折扣",
      description: "年付立减20%",
      code: "CLAUDEPRO20",
      expire: "2025-03-31",
      category: "ai",
      link: "https://claude.ai/"
    },
    {
      title: "京东自营商品券",
      description: "满300减50",
      code: "JD50OFF300",
      expire: "2025-03-25",
      category: "shopping",
      link: "https://www.jd.com/"
    }
    // 更多优惠券...
  ];
  
  // 渲染所有优惠券到"全部"分类
  renderCoupons(coupons, document.querySelector('#all .coupon-container'));
  
  // 按分类渲染优惠券
  const categories = ['ai', 'shopping', 'software', 'education'];
  categories.forEach(category => {
    const filteredCoupons = coupons.filter(coupon => coupon.category === category);
    renderCoupons(filteredCoupons, document.querySelector(`#${category} .coupon-container`));
  });
}

function renderCoupons(coupons, container) {
  container.innerHTML = '';
  
  if (coupons.length === 0) {
    container.innerHTML = '<p class="no-coupons">暂无优惠券</p>';
    return;
  }
  
  coupons.forEach(coupon => {
    const couponCard = document.createElement('div');
    couponCard.className = 'coupon-card';
    
    // 检查优惠券是否过期
    const isExpired = new Date(coupon.expire) < new Date();
    const expireClass = isExpired ? 'expired' : '';
    
    couponCard.innerHTML = `
      <div class="coupon-info">
        <div class="coupon-title">${coupon.title}</div>
        <div class="coupon-description">${coupon.description}</div>
        <div class="coupon-code" data-code="${coupon.code}">${coupon.code}</div>
        <div class="coupon-expire ${expireClass}">有效期至: ${coupon.expire}</div>
      </div>
      <a href="${coupon.link}" target="_blank" class="coupon-button">立即使用</a>
    `;
    
    container.appendChild(couponCard);
  });
}

function setupCategoryNavigation() {
  const navLinks = document.querySelectorAll('#coupon-categories .nav-link');
  const sections = document.querySelectorAll('#coupon-content section');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 移除所有活动类
      navLinks.forEach(item => item.classList.remove('active'));
      sections.forEach(item => item.classList.remove('active'));
      
      // 添加活动类到当前项
      link.classList.add('active');
      const category = link.getAttribute('data-category');
      document.getElementById(category).classList.add('active');
    });
  });
}

function setupCouponCodeCopy() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('coupon-code')) {
      const code = e.target.getAttribute('data-code');
      navigator.clipboard.writeText(code).then(() => {
        // 显示复制成功提示
        const originalText = e.target.textContent;
        e.target.textContent = '已复制!';
        e.target.style.backgroundColor = '#e6f7ff';
        
        setTimeout(() => {
          e.target.textContent = originalText;
          e.target.style.backgroundColor = '';
        }, 1500);
      });
    }
  });
}