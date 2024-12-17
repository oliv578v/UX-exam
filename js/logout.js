import { activateLinks } from './common.js';

activateLinks();

document.querySelector('#utility button').addEventListener('click', (e) => {
    e.preventDefault();

    sessionStorage.removeItem('e-book_user_id');
    sessionStorage.removeItem('userEmail');
    sessionStorage.clear();
    window.location.reload();
});

document.querySelector('.mobile-logout').addEventListener('click', (e) => {
    e.preventDefault();

    sessionStorage.clear();
    window.location.reload();
});