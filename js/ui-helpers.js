function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));
}

function showToast(message, type = 'success', duration = 3500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'status');
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duration);
}

function renderSkeletonCards(count = 3) {
  return Array.from({ length: count }).map(() => `
    <div class="skeleton-card">
      <div class="skeleton-line title"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>
  `).join('');
}

function renderEmptyState(message, icon = '📭') {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">${icon}</div>
      <p>${message}</p>
    </div>
  `;
}

function renderErrorState(message, icon = '⚠️') {
  return `
    <div class="empty-state error-state">
      <div class="empty-state-icon">${icon}</div>
      <p>${message}</p>
    </div>
  `;
}

function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function setButtonLoading(button, isLoading, loadingText = 'Memproses...') {
  if (!button) return;

  if (isLoading) {
    if (button.dataset.originalHtml === undefined) {
      button.dataset.originalHtml = button.innerHTML;
    }
    button.disabled = true;
    button.innerHTML = `<span class="btn-spinner"></span> ${loadingText}`;
  } else {
    button.disabled = false;
    if (button.dataset.originalHtml !== undefined) {
      button.innerHTML = button.dataset.originalHtml;
      delete button.dataset.originalHtml;
    }
  }
}

function showFieldError(input, message) {
  if (!input) return;
  input.classList.add('field-invalid');
  let errorEl = input.parentElement.querySelector('.field-error');
  if (!errorEl) {
    errorEl = document.createElement('p');
    errorEl.className = 'field-error';
    input.insertAdjacentElement('afterend', errorEl);
  }
  errorEl.textContent = message;
  errorEl.classList.add('show');
}

function clearFieldError(input) {
  if (!input) return;
  input.classList.remove('field-invalid');
  const errorEl = input.parentElement.querySelector('.field-error');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('show');
  }
}
