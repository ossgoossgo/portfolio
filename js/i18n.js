const I18n = {
  currentLang: localStorage.getItem('lang') || 'zh',
  data: {},
  basePath: '',

  async init() {
    await this.loadLanguage(this.currentLang);
    this.applyTranslations();
    this.updateToggleButton();
  },

  async loadLanguage(lang) {
    const response = await fetch(`${this.basePath}i18n/${lang}.json`);
    this.data = await response.json();
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
  },

  async toggle() {
    const newLang = this.currentLang === 'zh' ? 'en' : 'zh';
    await this.loadLanguage(newLang);
    this.applyTranslations();
    this.updateToggleButton();
    document.documentElement.lang = newLang === 'zh' ? 'zh-Hant' : 'en';
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: newLang } }));
  },

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = this.getNestedValue(key);
      if (value) el.textContent = value;
    });
  },

  updateToggleButton() {
    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = this.currentLang === 'zh' ? 'EN' : '中文';
  },

  getNestedValue(key) {
    return key.split('.').reduce((obj, k) => obj && obj[k], this.data);
  },

  get(key) {
    return this.getNestedValue(key) || key;
  }
};
