const namaUser = localStorage.getItem('nama_lengkap');
if (namaUser) {
  document.getElementById('namaPanggilan').textContent = namaUser;
}

if (localStorage.getItem('role') !== 'mahasiswa') {
  alert('Maaf, halaman ini khusus Mahasiswa!');
  window.location.href = 'index.html';
}

const logout = () => {
  localStorage.clear();
  window.location.href = 'index.html';
};

const renderEmptyState = (message) => `
  <div class="empty-state">
    <p>${message}</p>
  </div>
`;

const loadLoker = () => {
  const wadah = document.getElementById('daftarLoker');
  const idMahasiswa = localStorage.getItem('id_user');

  fetch(`api/get_semua_pekerjaan.php?id_mahasiswa=${idMahasiswa}`)
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        wadah.innerHTML = renderEmptyState('Belum ada lowongan yang buka.');
        return;
      }

      wadah.innerHTML = data.map(job => {
        const applied = Boolean(job.id_lamaran);
        const badgeClass = applied ? 'badge-info' : 'badge-primary';
        const badgeText = applied ? 'TERDAFTAR' : 'TERSEDIA';

        return `
          <div class="job-card">
            <div class="job-card-header">
              <div>
                <h4 class="job-card-title">${job.judul_pekerjaan}</h4>
                <p class="job-card-desc">${job.deskripsi}</p>
              </div>
              <span class="badge ${badgeClass}">${badgeText}</span>
            </div>
            <div class="job-card-actions">
              <button ${applied ? 'disabled' : ''} class="${applied ? 'btn btn-ghost' : 'btn btn-success'} btn-sm" ${applied ? '' : `onclick="siapkanLamaran(${job.id_pekerjaan})"`}>
                ${applied ? 'Sudah Dilamar' : 'Lamar Sekarang'}
              </button>
            </div>
          </div>
        `;
      }).join('');
    })
    .catch(() => {
      document.getElementById('daftarLoker').innerHTML = renderEmptyState('Gagal memuat lowongan.');
    });
};

const siapkanLamaran = (id_pekerjaan) => {
  document.getElementById('wadahLamar').classList.add('active');
  document.getElementById('lamar_id_pekerjaan').value = id_pekerjaan;
  document.getElementById('wadahLamar').scrollIntoView({ behavior: 'smooth' });
};

const batalLamar = () => {
  document.getElementById('wadahLamar').classList.remove('active');
  document.getElementById('formLamarKerja').reset();
};

document.getElementById('formLamarKerja').addEventListener('submit', function (e) {
  e.preventDefault();

  const dataKirim = new FormData();
  dataKirim.append('id_pekerjaan', document.getElementById('lamar_id_pekerjaan').value);
  dataKirim.append('pesan_pelamar', document.getElementById('pesan_pelamar').value.trim());
  dataKirim.append('id_mahasiswa', localStorage.getItem('id_user'));

  fetch('api/lamar_pekerjaan.php', {
    method: 'POST',
    body: dataKirim
  })
    .then(response => response.json())
    .then(data => {
      alert(data.pesan);
      if (data.status === 'sukses') {
        batalLamar();
        loadLoker();
      }
    })
    .catch(() => alert('Gagal mengirim lamaran.'));
});

const formatStatusBadge = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'diterima') return '<span class="badge badge-success">DITERIMA</span>';
  if (normalized === 'ditolak') return '<span class="badge badge-danger">DITOLAK</span>';
  return '<span class="badge badge-warning">MENUNGGU</span>';
};

const loadHistoryLamaran = () => {
  const idMahasiswa = localStorage.getItem('id_user');
  const wadah = document.getElementById('statusLamaran');

  fetch(`api/get_lamaran_mahasiswa.php?id_mahasiswa=${idMahasiswa}`)
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        wadah.innerHTML = renderEmptyState('Kamu belum melamar pekerjaan apapun.');
        return;
      }

      wadah.innerHTML = data.map(item => `
        <div class="job-card">
          <div class="job-card-header">
            <div>
              <h4 class="job-card-title">${item.judul_pekerjaan}</h4>
              <p class="job-card-meta">Status lamaran kamu</p>
            </div>
            ${formatStatusBadge(item.status_lamaran)}
          </div>
          <div class="applicant-message">${item.status_lamaran === 'diterima' ? '🎉 Selamat! Lamaranmu diterima. Silakan tunggu email dari client.' : item.status_lamaran === 'ditolak' ? 'Mohon tetap semangat dan coba lowongan lain.' : 'Lamaran sedang diproses oleh client.'}</div>
        </div>
      `).join('');
    })
    .catch(() => {
      wadah.innerHTML = renderEmptyState('Gagal memuat status lamaran.');
    });
};

loadLoker();
loadHistoryLamaran();
