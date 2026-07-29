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

  const emailUser = document.getElementById('email_login').value.trim();
  const passwordUser = document.getElementById('password_login').value;

  clearError();

  if (!emailUser || !passwordUser) {
    showError('Email dan password harus diisi.');
    return;
  }

  const dataKirim = new FormData();
  dataKirim.append('email', emailUser);
  dataKirim.append('password', passwordUser);

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
      }
    })
    .catch(() => {
      showError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    });
});

document.getElementById('formRegister').addEventListener('submit', function (e) {
  e.preventDefault();

  const namaLengkap = document.getElementById('reg_nama').value.trim();
  const email = document.getElementById('reg_email').value.trim();
  const password = document.getElementById('reg_password').value;
  const role = document.getElementById('reg_role').value;

  clearError();

  if (!namaLengkap || !email || !password) {
    showError('Semua kolom harus diisi.');
    return;
  }

  const dataKirim = new FormData();
  dataKirim.append('nama_lengkap', namaLengkap);
  dataKirim.append('email', email);
  dataKirim.append('password', password);
  dataKirim.append('role', role);

  fetch('api/proses_register.php', {
    method: 'POST',
    body: dataKirim
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'sukses') {
        alert(data.pesan);
        document.getElementById('formRegister').reset();
        setActiveTab('login');
      } else {
        showError(data.pesan || 'Gagal registrasi.');
      }
    })
    .catch(() => {
      showError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    });
});