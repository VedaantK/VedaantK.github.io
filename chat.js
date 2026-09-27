/*
  ============================================================
  chat.js — "Vedaant.EXE" floating chat widget
  ============================================================
  Talks to the FastAPI backend in the vedaant-chat repo,
  deployed on Render. The backend URL comes from the
  data-api-url attribute on #chatWidget in index.html — that's
  the one thing to fill in once the Render service is live.
  ============================================================
*/
(() => {
  const widget = document.getElementById('chatWidget');
  const CHAT_API_URL = (widget?.dataset.apiUrl || '').trim().replace(/\/$/, '');

  const toggle     = document.getElementById('chatToggle');
  const panel      = document.getElementById('chatPanel');
  const closeBtn   = document.getElementById('chatClose');
  const messagesEl = document.getElementById('chatMessages');
  const form       = document.getElementById('chatForm');
  const input      = document.getElementById('chatInput');
  const sendBtn    = form.querySelector('button[type="submit"]');

  const OPENING_MESSAGE = "yo, i'm vedaant (well, the ai version) — ask me anything";
  const MAX_HISTORY = 20; // messages kept for context, oldest dropped first

  let history = [];
  let hasOpenedBefore = false;
  let sending = false;

  function addMessage(role, text) {
    const row = document.createElement('div');
    row.className = `chat-msg chat-msg-${role}`;
    row.textContent = text;
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return row;
  }

  function openPanel() {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    if (!hasOpenedBefore) {
      hasOpenedBefore = true;
      addMessage('bot', OPENING_MESSAGE);
    }
    input.focus();
  }

  function closePanel() {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    if (panel.hidden) openPanel();
    else closePanel();
  });

  closeBtn.addEventListener('click', closePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) closePanel();
  });

  // Any element marked data-open-chat (e.g. the project card's [ CHAT ] link)
  // opens this same widget instead of navigating anywhere.
  document.querySelectorAll('[data-open-chat]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openPanel();
    });
  });

  if (!CHAT_API_URL) {
    input.disabled = true;
    sendBtn.disabled = true;
    input.placeholder = 'chat backend not configured yet';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending || !CHAT_API_URL) return;

    const message = input.value.trim();
    if (!message) return;

    addMessage('user', message);
    input.value = '';
    sending = true;
    sendBtn.disabled = true;

    const typingEl = addMessage('bot', '...');
    typingEl.classList.add('chat-typing');

    try {
      const res = await fetch(`${CHAT_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });

      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();

      typingEl.remove();
      addMessage('bot', data.reply);

      history.push({ role: 'user', content: message });
      history.push({ role: 'assistant', content: data.reply });
      if (history.length > MAX_HISTORY) {
        history = history.slice(history.length - MAX_HISTORY);
      }
    } catch (err) {
      typingEl.remove();
      addMessage(
        'bot',
        "hmm, can't reach me right now — the free server might be waking up, that can take " +
          "~30s on the first message. give it a sec and try again, or email vedaant2910@gmail.com."
      );
    } finally {
      sending = false;
      sendBtn.disabled = false;
    }
  });
})();
