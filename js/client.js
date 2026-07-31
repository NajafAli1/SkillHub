const namaUser = localStorage.getItem('nama_lengkap');
if (namaUser) {
  document.getElementById('namaPanggilan').textContent = namaUser;
}

const logout = () => {
  fetch('api/logout.php', { method: 'POST' })
    .finally(() => {
      localStorage.clear();
      window.location.href = 'index.html';
    });
};

if (localStorage.getItem('role') !== 'client') {
  alert('Maaf, Anda tidak memiliki akses ke halaman ini.');
  window.location.href = 'index.html';
}

const formatLokerStatus = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'dibuka') return '<span class="badge badge-success">DIBUKA</span>';
  if (normalized === 'ditutup') return '<span class="badge badge-warning">DITUTUP</span>';
  if (normalized === 'selesai') return '<span class="badge badge-info">SELESAI</span>';
  return `<span class="badge badge-primary">${escapeHtml((status || 'UNKNOWN').toUpperCase())}</span>`;
};

document.getElementById('formTambahKerja').addEventListener('submit', function (e) {
  e.preventDefault();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const judul = document.getElementById('judul_pekerjaan');
  const deskripsi = document.getElementById('deskripsi');
  clearFieldError(judul);
  clearFieldError(deskripsi);

  let valid = true;
  if (judul.value.trim().length < 3) {
    showFieldError(judul, 'Judul minimal 3 karakter.');
    valid = false;
  }
  if (deskripsi.value.trim().length < 10) {
    showFieldError(deskripsi, 'Deskripsi minimal 10 karakter.');
    valid = false;
  }
  if (!valid) return;

  const dataKirim = new FormData();
  dataKirim.append('judul_pekerjaan', judul.value.trim());
  dataKirim.append('deskripsi', deskripsi.value.trim());

  setButtonLoading(submitBtn, true, 'Memposting...');

  fetch('api/tambah_pekerjaan.php', {
    method: 'POST',
    body: dataKirim
  })
    .then(response => response.json())
    .then(data => {
      showToast(data.pesan, data.status === 'sukses' ? 'success' : 'error');
      if (data.status === 'sukses') {
        document.getElementById('formTambahKerja').reset();
        loadPekerjaan();
      }
    })
    .catch(() => showToast('Terjadi kesalahan saat menambahkan pekerjaan.', 'error'))
    .finally(() => setButtonLoading(submitBtn, false));
});

const loadPekerjaan = () => {
  const wadah = document.getElementById('daftarPekerjaan');
  wadah.innerHTML = renderSkeletonCards(3);

  fetch('api/get_pekerjaan_client.php')
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        wadah.innerHTML = renderEmptyState('Belum ada pekerjaan yang diposting.', '💼');
        return;
      }

      wadah.innerHTML = data.map((job, index) => `
        <div class="job-card animate-in" style="animation-delay: ${Math.min(index, 8) * 60}ms">
          <div class="job-card-header">
            <div>
              <h4 class="job-card-title">${escapeHtml(job.judul_pekerjaan)}</h4>
              <p class="job-card-desc">${escapeHtml(job.deskripsi)}</p>
            </div>
            ${formatLokerStatus(job.status_loker)}
          </div>
          <div class="job-card-actions">
            <button class="btn btn-danger btn-sm" onclick="hapusPekerjaan(${job.id_pekerjaan})">Hapus</button>
            <button class="btn btn-warning btn-sm" onclick="siapkanEdit(${job.id_pekerjaan}, ${escapeHtml(JSON.stringify(job.judul_pekerjaan))}, ${escapeHtml(JSON.stringify(job.deskripsi))})">Edit</button>
          </div>
        </div>
      `).join('');
    })
    .catch(() => {
      wadah.innerHTML = renderErrorState('Gagal memuat data lowongan.');
    });
};

const hapusPekerjaan = (id_pekerjaan) => {
  if (!confirm('Yakin mau hapus pekerjaan ini?')) return;

  const dataKirim = new FormData();
  dataKirim.append('id_pekerjaan', id_pekerjaan);

  fetch('api/hapus_pekerjaan.php', {
    method: 'POST',
    body: dataKirim
  })
    .then(response => response.json())
    .then(data => {
      showToast(data.pesan, data.status === 'sukses' ? 'success' : 'error');
      if (data.status === 'sukses') loadPekerjaan();
    })
    .catch(() => showToast('Gagal menghapus pekerjaan.', 'error'));
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

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const dataKirim = new FormData();
  dataKirim.append('id_pekerjaan', document.getElementById('edit_id_pekerjaan').value);
  dataKirim.append('judul_pekerjaan', document.getElementById('edit_judul_pekerjaan').value.trim());
  dataKirim.append('deskripsi', document.getElementById('edit_deskripsi').value.trim());

  setButtonLoading(submitBtn, true, 'Menyimpan...');

  fetch('api/edit_pekerjaan.php', {
    method: 'POST',
    body: dataKirim
  })
    .then(response => response.json())
    .then(data => {
      showToast(data.pesan, data.status === 'sukses' ? 'success' : 'error');
      if (data.status === 'sukses') {
        batalEdit();
        loadPekerjaan();
      }
    })
    .catch(() => showToast('Gagal memperbarui pekerjaan.', 'error'))
    .finally(() => setButtonLoading(submitBtn, false));
});

let semuaLamaran = [];

const renderLamaran = (list) => {
  const wadahLamaran = document.getElementById('daftarLamaran');

  if (!Array.isArray(list) || list.length === 0) {
    const noDataAtAll = semuaLamaran.length === 0;
    wadahLamaran.innerHTML = noDataAtAll
      ? renderEmptyState('Belum ada mahasiswa yang melamar.', '📭')
      : renderEmptyState('Tidak ada lamaran yang cocok dengan pencarianmu.', '🔍');
    return;
  }

  wadahLamaran.innerHTML = list.map((lamar, index) => {
    const statusClass = lamar.status_lamaran === 'menunggu' ? 'badge-warning' : lamar.status_lamaran === 'diterima' ? 'badge-success' : 'badge-danger';
    const actions = lamar.status_lamaran === 'menunggu'
      ? `<button class="btn btn-success btn-sm" onclick="ubahStatusLamaran(${lamar.id_lamaran}, 'diterima')">Terima</button>
         <button class="btn btn-danger btn-sm" onclick="ubahStatusLamaran(${lamar.id_lamaran}, 'ditolak')">Tolak</button>`
      : '';

    return `
      <div class="applicant-card animate-in" style="animation-delay: ${Math.min(index, 8) * 60}ms">
        <div class="card-header">
          <div>
            <h4 class="card-title">${escapeHtml(lamar.judul_pekerjaan)}</h4>
            <p class="card-meta">${escapeHtml(lamar.nama_pelamar)} · ${escapeHtml(lamar.email_pelamar)}</p>
          </div>
          <span class="badge ${statusClass}">${escapeHtml(lamar.status_lamaran.toUpperCase())}</span>
        </div>
        <div class="applicant-message">${escapeHtml(lamar.pesan_pelamar)}</div>
        <div class="job-card-actions">${actions}</div>
      </div>
    `;
  }).join('');
};

const applyLamaranFilter = () => {
  const keyword = (document.getElementById('searchLamaran').value || '').trim().toLowerCase();
  const statusFilter = document.getElementById('filterStatusLamaran').value;

  const filtered = semuaLamaran.filter(lamar => {
    const matchesKeyword = !keyword || String(lamar.nama_pelamar || '').toLowerCase().includes(keyword);
    const matchesStatus = statusFilter === 'semua' || lamar.status_lamaran === statusFilter;
    return matchesKeyword && matchesStatus;
  });

  renderLamaran(filtered);
};

const loadLamaran = () => {
  const wadahLamaran = document.getElementById('daftarLamaran');
  wadahLamaran.innerHTML = renderSkeletonCards(2);

  fetch('api/get_lamaran_client.php')
    .then(response => response.json())
    .then(data => {
      semuaLamaran = Array.isArray(data) ? data : [];
      applyLamaranFilter();
    })
    .catch(() => {
      wadahLamaran.innerHTML = renderErrorState('Gagal memuat lamaran.');
    });
};

document.getElementById('searchLamaran').addEventListener('input', debounce(applyLamaranFilter, 250));
document.getElementById('filterStatusLamaran').addEventListener('change', applyLamaranFilter);

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
      showToast(data.pesan, data.status === 'sukses' ? 'success' : 'error');
      if (data.status === 'sukses') {
        loadPekerjaan();
        loadLamaran();
      }
    })
    .catch(() => showToast('Gagal memperbarui status lamaran.', 'error'));
};
