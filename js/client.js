const namaUser = localStorage.getItem('nama_lengkap');
if (namaUser) {
  document.getElementById('namaPanggilan').textContent = namaUser;
}

const logout = () => {
  localStorage.clear();
  window.location.href = 'index.html';
};

if (localStorage.getItem('role') !== 'client') {
  alert('Maaf, Anda tidak memiliki akses ke halaman ini.');
  window.location.href = 'index.html';
}

const setFeedback = (message, isSuccess = true) => {
  const pesanEl = document.getElementById('pesanClient');
  pesanEl.textContent = message;
  pesanEl.style.color = isSuccess ? 'var(--success)' : 'var(--danger)';
};

const formatJobStatus = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'menunggu') return '<span class="badge badge-warning">MENUNGGU</span>';
  if (normalized === 'diterima') return '<span class="badge badge-success">DITERIMA</span>';
  if (normalized === 'ditolak') return '<span class="badge badge-danger">DITOLAK</span>';
  return `<span class="badge badge-primary">${status || 'UNKNOWN'}</span>`;
};

document.getElementById('formTambahKerja').addEventListener('submit', function (e) {
  e.preventDefault();

  const dataKirim = new FormData();
  dataKirim.append('judul_pekerjaan', document.getElementById('judul_pekerjaan').value.trim());
  dataKirim.append('deskripsi', document.getElementById('deskripsi').value.trim());
  dataKirim.append('id_client', localStorage.getItem('id_user'));

  fetch('api/tambah_pekerjaan.php', {
    method: 'POST',
    body: dataKirim
  })
    .then(response => response.json())
    .then(data => {
      setFeedback(data.pesan, data.status === 'sukses');
      if (data.status === 'sukses') {
        document.getElementById('formTambahKerja').reset();
        loadPekerjaan();
      }
    })
    .catch(() => setFeedback('Terjadi kesalahan saat menambahkan pekerjaan.', false));
});

const loadPekerjaan = () => {
  const idClient = localStorage.getItem('id_user');
  const wadah = document.getElementById('daftarPekerjaan');

  fetch(`api/get_pekerjaan_client.php?id_client=${idClient}`)
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        wadah.innerHTML = '<div class="empty-state"><p>Belum ada pekerjaan yang diposting.</p></div>';
        return;
      }

      wadah.innerHTML = data.map(job => `
        <div class="job-card">
          <div class="job-card-header">
            <div>
              <h4 class="job-card-title">${job.judul_pekerjaan}</h4>
              <p class="job-card-desc">${job.deskripsi}</p>
            </div>
            ${formatJobStatus(job.status_loker)}
          </div>
          <div class="job-card-actions">
            <button class="btn btn-danger btn-sm" onclick="hapusPekerjaan(${job.id_pekerjaan})">Hapus</button>
            <button class="btn btn-warning btn-sm" onclick="siapkanEdit(${job.id_pekerjaan}, ${JSON.stringify(job.judul_pekerjaan)}, ${JSON.stringify(job.deskripsi)})">Edit</button>
          </div>
        </div>
      `).join('');
    })
    .catch(() => {
      wadah.innerHTML = '<div class="empty-state"><p>Gagal memuat data.</p></div>';
    });
};

const hapusPekerjaan = (id_pekerjaan) => {
  if (!confirm('Yakin mau hapus pekerjaan ini?')) return;

  const dataKirim = new FormData();
  dataKirim.append('id_pekerjaan', id_pekerjaan);
  dataKirim.append('id_client', localStorage.getItem('id_user'));

  fetch('api/hapus_pekerjaan.php', {
    method: 'POST',
    body: dataKirim
  })
    .then(response => response.json())
    .then(data => {
      alert(data.pesan);
      if (data.status === 'sukses') loadPekerjaan();
    })
    .catch(() => alert('Gagal menghapus pekerjaan.'));
};

const siapkanEdit = (id, judul, deskripsi) => {
  document.getElementById('wadahEdit').classList.add('active');
  document.getElementById('edit_id_pekerjaan').value = id;
  document.getElementById('edit_judul_pekerjaan').value = judul;
  document.getElementById('edit_deskripsi').value = deskripsi;
  document.getElementById('wadahEdit').scrollIntoView({ behavior: 'smooth' });
};

const batalEdit = () => {
  document.getElementById('wadahEdit').classList.remove('active');
  document.getElementById('formEditPekerjaan').reset();
};

document.getElementById('formEditPekerjaan').addEventListener('submit', function (e) {
  e.preventDefault();

  const dataKirim = new FormData();
  dataKirim.append('id_pekerjaan', document.getElementById('edit_id_pekerjaan').value);
  dataKirim.append('id_client', localStorage.getItem('id_user'));
  dataKirim.append('judul_pekerjaan', document.getElementById('edit_judul_pekerjaan').value.trim());
  dataKirim.append('deskripsi', document.getElementById('edit_deskripsi').value.trim());

  fetch('api/edit_pekerjaan.php', {
    method: 'POST',
    body: dataKirim
  })
    .then(response => response.json())
    .then(data => {
      alert(data.pesan);
      if (data.status === 'sukses') {
        batalEdit();
        loadPekerjaan();
      }
    })
    .catch(() => alert('Gagal memperbarui pekerjaan.'));
});

const loadLamaran = () => {
  const idClient = localStorage.getItem('id_user');
  const wadahLamaran = document.getElementById('daftarLamaran');

  fetch(`api/get_lamaran_client.php?id_client=${idClient}`)
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        wadahLamaran.innerHTML = '<div class="empty-state"><p>Belum ada mahasiswa yang melamar.</p></div>';
        return;
      }

      wadahLamaran.innerHTML = data.map(lamar => {
        const statusClass = lamar.status_lamaran === 'menunggu' ? 'badge-warning' : lamar.status_lamaran === 'diterima' ? 'badge-success' : 'badge-danger';
        const actions = lamar.status_lamaran === 'menunggu'
          ? `<button class="btn btn-success btn-sm" onclick="ubahStatusLamaran(${lamar.id_lamaran}, 'diterima')">Terima</button>
             <button class="btn btn-danger btn-sm" onclick="ubahStatusLamaran(${lamar.id_lamaran}, 'ditolak')">Tolak</button>`
          : '';

        return `
          <div class="applicant-card">
            <div class="card-header">
              <div>
                <h4 class="card-title">${lamar.judul_pekerjaan}</h4>
                <p class="card-meta">${lamar.nama_pelamar} · ${lamar.email_pelamar}</p>
              </div>
              <span class="badge ${statusClass}">${lamar.status_lamaran.toUpperCase()}</span>
            </div>
            <div class="applicant-message">${lamar.pesan_pelamar}</div>
            <div class="job-card-actions">${actions}</div>
          </div>
        `;
      }).join('');
    })
    .catch(() => {
      wadahLamaran.innerHTML = '<div class="empty-state"><p>Gagal memuat lamaran.</p></div>';
    });
};

loadPekerjaan();
loadLamaran();

window.ubahStatusLamaran = function (id_lamaran, status_baru) {
  const dataKirim = new FormData();
  dataKirim.append('id_lamaran', id_lamaran);
  dataKirim.append('status_baru', status_baru);

  fetch('api/update_status_lamaran.php', {
    method: 'POST',
    body: dataKirim
  })
    .then(response => response.json())
    .then(data => {
      alert(data.pesan);
      if (data.status === 'sukses') loadPekerjaan();
loadLamaran();
    })
    .catch(() => alert('Gagal memperbarui status lamaran.'));
};
