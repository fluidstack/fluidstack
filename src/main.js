import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/main.css';
import { initNavbar } from './navbar.js';
import { initAnimations } from './animations.js';
import { initPortfolio } from './portfolio.js';
import { initContact } from './contact.js';
import $ from 'jquery';

$(function () {
  document.getElementById('copyright-year').textContent = new Date().getFullYear();

  initNavbar();
  initAnimations();
  initPortfolio();
  initContact();
});
