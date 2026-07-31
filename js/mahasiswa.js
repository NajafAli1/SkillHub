const namaUser = localStorage.getItem('nama_lengkap');
if (namaUser) {
  document.getElementById('namaPanggilan').textContent = namaUser;
}

if (localStorage.getItem('role') !== 'mahasiswa') {
  alert('Maaf, halaman ini khusus Mahasiswa!');
  window.location.href = 'index.html';
}

const logout = () => {
  fetch('api/logout.php', { method: 'POST' })
    .finally(() => {
      localStorage.clear();
      window.location.href = 'index.html';
    });
};

const formatLokerStatus = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'dibuka') return '<span class="badge badge-success">DIBUKA</span>';
  if (normalized === 'ditutup') return '<span class="badge badge-warning">DITUTUP</span>';
  if (normalized === 'selesai') return '<span class="badge badge-info">SELESAI</span>';
  return `<span class="badge badge-primary">${escapeHtml((status || 'UNKNOWN').toUpperCase())}</span>`;
};

let semuaLoker = [];

const renderLoker = (jobs) => {
  const wadah = document.getElementById('daftarLoker');

  if (!Array.isArray(jobs) || jobs.length === 0) {
    const noDataAtAll = semuaLoker.length === 0;
    wadah.innerHTML = noDataAtAll
      ? renderEmptyState('Belum ada lowongan yang tersedia.', '💼')
      : renderEmptyState('Tidak ada lowongan yang cocok dengan pencarianmu.', '🔍');
    return;
  }

  wadah.innerHTML = jobs.map((job, index) => {
    const applied = Boolean(job.id_lamaran);
    const isOpen = String(job.status_loker || '').toLowerCase() === 'dibuka';
    const badgeClass = applied ? 'badge-info' : 'badge-primary';
    const badgeText = applied ? 'TERDAFTAR' : 'TERSEDIA';

    let actionHtml;
    if (applied) {
      actionHtml = `<button disabled class="btn btn-ghost btn-sm">Sudah Dilamar</button>`;
    } else if (!isOpen) {
      actionHtml = `<button disabled class="btn btn-ghost btn-sm">Lowongan Ditutup</button>`;
    } else {
      actionHtml = `<button class="btn btn-success btn-sm" onclick="siapkanLamaran(${job.id_pekerjaan})">Lamar Sekarang</button>`;
    }

    return `
      <div class="job-card animate-in" style="animation-delay: ${Math.min(index, 8) * 60}ms">
        <div class="job-card-header">
          <div>
            <h4 class="job-card-title">${escapeHtml(job.judul_pekerjaan)}</h4>
            <p class="job-card-desc">${escapeHtml(job.deskripsi)}</p>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
            ${formatLokerStatus(job.status_loker)}
            ${applied ? `<span class="badge ${badgeClass}">${badgeText}</span>` : ''}
          </div>
        </div>
        <div class="job-card-actions">${actionHtml}</div>
      </div>
    `;
  }).join('');
};

const applyLokerFilter = () => {
  const keyword = (document.getElementById('searchLoker').value || '').trim().toLowerCase();
  const statusFilter = document.getElementById('filterStatusLoker').value;

  const filtered = semuaLoker.filter(job => {
    const matchesKeyword = !keyword
      || String(job.judul_pekerjaan || '').toLowerCase().includes(keyword)
      || String(job.deskripsi || '').toLowerCase().includes(keyword);

    const matchesStatus = statusFilter === 'semua'
      || String(job.status_loker || '').toLowerCase() === statusFilter;

    return matchesKeyword && matchesStatus;
  });

  renderLoker(filtered);
};

const loadLoker = () => {
  const wadah = document.getElementById('daftarLoker');
  wadah.innerHTML = renderSkeletonCards(3);

  fetch('api/get_semua_pekerjaan.php')
    .then(response => response.json())
    .then(data => {
      semuaLoker = Array.isArray(data) ? data : [];
      applyLokerFilter();
    })
    .catch(() => {
      wadah.innerHTML = renderErrorState('Gagal memuat lowongan. Coba muat ulang halaman.');
    });
};

document.getElementById('searchLoker').addEventListener('input', debounce(applyLokerFilter, 250));
document.getElementById('filterStatusLoker').addEventListener('change', applyLokerFilter);

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

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const dataKirim = new FormData();
  dataKirim.append('id_pekerjaan', document.getElementById('lamar_id_pekerjaan').value);
  dataKirim.append('pesan_pelamar', document.getElementById('pesan_pelamar').value.trim());

  setButtonLoading(submitBtn, true, 'Mengirim...');

  fetch('api/lamar_pekerjaan.php', {
    method: 'POST',
    body: dataKirim
  })
    .then(response => response.json())
    .then(data => {
      showToast(data.pesan, data.status === 'sukses' ? 'success' : 'error');
      if (data.status === 'sukses') {
        batalLamar();
        loadLoker();
        loadHistoryLamaran();
      }
    })
    .catch(() => showToast('Gagal mengirim lamaran.', 'error'))
    .finally(() => setButtonLoading(submitBtn, false));
});

const formatStatusBadge = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'diterima') return '<span class="badge badge-success">DITERIMA</span>';
  if (normalized === 'ditolak') return '<span class="badge badge-danger">DITOLAK</span>';
  return '<span class="badge badge-warning">MENUNGGU</span>';
};

const loadHistoryLamaran = () => {
  const wadah = document.getElementById('statusLamaran');
  wadah.innerHTML = renderSkeletonCards(2);

  fetch('api/get_lamaran_mahasiswa.php')
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        wadah.innerHTML = renderEmptyState('Kamu belum melamar pekerjaan apapun.', '📝');
        return;
      }

      wadah.innerHTML = data.map((item, index) => `
        <div class="job-card animate-in" style="animation-delay: ${Math.min(index, 8) * 60}ms">
          <div class="job-card-header">
            <div>
              <h4 class="job-card-title">${escapeHtml(item.judul_pekerjaan)}</h4>
              <p class="job-card-meta">Status lamaran kamu</p>
            </div>
            ${formatStatusBadge(item.status_lamaran)}
          </div>
          <div class="applicant-message">${item.status_lamaran === 'diterima' ? '🎉 Selamat! Lamaranmu diterima. Silakan tunggu email dari client.' : item.status_lamaran === 'ditolak' ? 'Mohon tetap semangat dan coba lowongan lain.' : 'Lamaran sedang diproses oleh client.'}</div>
        </div>
      `).join('');
    })
    .catch(() => {
      wadah.innerHTML = renderErrorState('Gagal memuat status lamaran.');
    });
};

loadLoker();
loadHistoryLamaran();
