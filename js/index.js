const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const errorMessage = document.getElementById('pesanError');

const setActiveTab = (tabName) => {
  authTabs.forEach(tab => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle('active', isActive);
  });

  authForms.forEach(form => {
    const isLoginForm = form.id === 'formLogin';
    form.classList.toggle('active', (tabName === 'login' && isLoginForm) || (tabName === 'register' && !isLoginForm));
  });

  errorMessage.classList.remove('show');
  errorMessage.textContent = '';
};

authTabs.forEach(tab => {
  tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
});

const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
};

const clearError = () => {
  errorMessage.textContent = '';
  errorMessage.classList.remove('show');
};

const redirectByRole = (role) => {
  if (role === 'mahasiswa') {
    window.location.href = 'mahasiswa.html';
  } else if (role === 'client') {
    window.location.href = 'client.html';
  } else {
    showError('Role pengguna tidak valid.');
  }
};

document.getElementById('formLogin').addEventListener('submit', function (e) {
  e.preventDefault();

  const emailInput = document.getElementById('email_login');
  const passwordInput = document.getElementById('password_login');
  const emailUser = emailInput.value.trim();
  const passwordUser = passwordInput.value;
  const submitBtn = e.target.querySelector('button[type="submit"]');

  clearError();
  clearFieldError(emailInput);
  clearFieldError(passwordInput);

  let valid = true;
  if (!emailUser) {
    showFieldError(emailInput, 'Email wajib diisi.');
    valid = false;
  }
  if (!passwordUser) {
    showFieldError(passwordInput, 'Password wajib diisi.');
    valid = false;
  }
  if (!valid) return;

  const dataKirim = new FormData();
  dataKirim.append('email', emailUser);
  dataKirim.append('password', passwordUser);

  setButtonLoading(submitBtn, true, 'Masuk...');

  fetch('api/proses_login.php', {
    method: 'POST',
    body: dataKirim
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        localStorage.setItem('id_user', data.id_user);
        localStorage.setItem('role', data.role);
        localStorage.setItem('nama_lengkap', data.nama_lengkap);
        redirectByRole(data.role);
      } else {
        showError(data.pesan || 'Email atau password salah.');
        setButtonLoading(submitBtn, false);
      }
    })
    .catch(() => {
      showError('Terjadi kesalahan jaringan. Silakan coba lagi.');
      setButtonLoading(submitBtn, false);
    });
});

document.getElementById('formRegister').addEventListener('submit', function (e) {
  e.preventDefault();

  const namaInput = document.getElementById('reg_nama');
  const emailInput = document.getElementById('reg_email');
  const passwordInput = document.getElementById('reg_password');
  const role = document.getElementById('reg_role').value;
  const submitBtn = e.target.querySelector('button[type="submit"]');

  const namaLengkap = namaInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  clearError();
  [namaInput, emailInput, passwordInput].forEach(clearFieldError);

  let valid = true;
  if (!namaLengkap) {
    showFieldError(namaInput, 'Nama wajib diisi.');
    valid = false;
  }
  if (!email) {
    showFieldError(emailInput, 'Email wajib diisi.');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError(emailInput, 'Format email tidak valid.');
    valid = false;
  }
  if (!password) {
    showFieldError(passwordInput, 'Password wajib diisi.');
    valid = false;
  } else if (password.length < 6) {
    showFieldError(passwordInput, 'Password minimal 6 karakter.');
    valid = false;
  }
  if (!valid) return;

  const dataKirim = new FormData();
  dataKirim.append('nama_lengkap', namaLengkap);
  dataKirim.append('email', email);
  dataKirim.append('password', password);
  dataKirim.append('role', role);

  setButtonLoading(submitBtn, true, 'Mendaftar...');

  fetch('api/proses_register.php', {
    method: 'POST',
    body: dataKirim
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'sukses') {
        showToast(data.pesan, 'success');
        document.getElementById('formRegister').reset();
        setActiveTab('login');
      } else {
        showError(data.pesan || 'Gagal registrasi.');
      }
    })
    .catch(() => {
      showError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    })
    .finally(() => setButtonLoading(submitBtn, false));
});
