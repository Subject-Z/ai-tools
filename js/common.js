function updateTopNav() {
    document.querySelector('.top-links').innerHTML = 
      ['💡 导航', '🎉 福利', '📝 文章', '✉️ 关于']
        .map((name, i) => `<a href="${[
          '/', 
          '/coupon/index.html', 
          '/blog/index.html', 
          '/about-us/index.html'
        ][i]}">${name}</a>`).join('');
  }
  
  document.addEventListener('DOMContentLoaded', updateTopNav);