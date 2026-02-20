import { initNavbar } from './navbar.js';
import { initAnimations } from './animations.js';
import { initPortfolio } from './portfolio.js';
import { initContact } from './contact.js';

const $ = window.jQuery;

$(function () {
  document.getElementById('copyright-year').textContent = new Date().getFullYear();

  initNavbar();
  initAnimations();
  initPortfolio();
  initContact();
});
