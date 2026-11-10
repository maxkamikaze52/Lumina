/* Astrolab — boot: resume a known player, or ask for a display name. */
(function () {
  'use strict';
  const App = window.App;
  const boot = document.getElementById('boot');
  const shell = document.getElementById('app');

  function joinForm(message) {
    boot.innerHTML = `<div class="card" style="max-width:420px;text-align:center">
      <h2>${message || 'Open your observatory'}</h2>
      <p class="muted" style="margin:10px 0 16px">Choose the name other players will see — a nickname,
        never a real name.</p>
      <form id="join">
        <input id="nm" maxlength="18" placeholder="Display name" required autocomplete="off"
          style="width:100%;padding:14px;border-radius:12px;background:rgba(0,0,0,.3);
          border:2px solid rgba(255,255,255,.16);color:#fffaf0;font-size:18px;text-align:center">
        <button class="btn jade block" style="margin-top:12px">Enter Astrolab</button>
      </form>
      <p class="small muted" style="margin-top:12px">No email, no password. Progress is saved on this
        computer in Astrolab's own database.</p></div>`;
    const input = document.getElementById('nm');
    input.focus();
    document.getElementById('join').onsubmit = async (ev) => {
      ev.preventDefault();
      const name = input.value.trim();
      if (!name) return;
      try {
        const r = await App.API.call('/api/player', { method: 'POST', body: { name } });
        App.state = await App.API.get('/api/state');
        enter(r.player.name);
      } catch (err) { App.toast(err.message || 'Could not create the player', 'x'); }
    };
  }

  async function start() {
    try {
      App.state = await App.API.get('/api/state');
      enter();
    } catch (e) {
      joinForm(e.status === 401 ? 'Welcome to Astrolab' : 'Open your observatory');
    }
  }

  function enter(name) {
    shell.hidden = false;
    boot.classList.add('gone');
    setTimeout(() => { if (boot.parentNode) boot.remove(); }, 600);
    App.refreshWallet();
    const route = (location.hash || '#/home').slice(2) || 'home';
    App.route = { name: route, params: {} };
    App.render();
    if (name) App.toast(`Welcome, ${name} — your room is ready`, 'spark');
  }

  start();
})();
