// 1. Data Produk (Tambahkan SKU Anda di bagian 'id')
const products = [
    { id: "01", name: "Link Shopee 1", link: "https://www.link1.com", img: "https://via.placeholder.com/200" },
    { id: "02", name: "Link Shopee 2", link: "https://www.link2.com", img: "https://via.placeholder.com/200" },
    { id: "03", name: "Link Shopee 3", link: "https://www.link3.com", img: "https://via.placeholder.com/200" },
    { id: "350", name: "Bor Cordless X-Power 12V", link: "https://www.link4.com", img: "https://via.placeholder.com/200" },
    { id: "12", name: "Baterai Drone Lipo 350 mAh", link: "https://www.link5.com", img: "https://via.placeholder.com/200" },
    { id: "06", name: "Link Shopee 6", link: "https://www.link6.com", img: "https://via.placeholder.com/200" },
    { id: "07", name: "Link Shopee 7", link: "https://www.link7.com", img: "https://via.placeholder.com/200" },
    { id: "08", name: "Link Shopee 8", link: "https://www.link8.com", img: "https://via.placeholder.com/200" },
    { id: "09", name: "Link Shopee 9", link: "https://www.link9.com", img: "https://via.placeholder.com/200" },
    { id: "10", name: "Link Shopee 10", link: "https://www.link10.com", img: "https://via.placeholder.com/200" },
];

// 2. Seleksi Elemen HTML
const grid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');

// 3. Fungsi untuk Render / Menampilkan Kartu Produk
function renderProducts(data) {
    // Jika hasil pencarian kosong
    if (data.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--default-color);">
                <i class="bi bi-search" style="font-size: 3rem; opacity: 0.3;"></i>
                <p style="margin-top: 15px;">Produk tidak ditemukan. Coba kata kunci lain.</p>
            </div>`;
        return;
    }

    // Render kartu produk
    grid.innerHTML = data.map(item => `
        <div class="affiliate-card">
            <img src="${item.img}" alt="${item.name}" loading="lazy">
            <div class="affiliate-details">
                <span class="product-no">#${item.id}</span>
                <a href="${item.link}" target="_blank" class="product-link">${item.name}</a>
                <a href="${item.link}" target="_blank" class="btn-buy">Beli di Shopee</a>
            </div>
        </div>
    `).join('');
}

// 4. Logika Pencarian Spesifik (Nama vs SKU)
searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();

    const filtered = products.filter(p => {
        // JALUR SKU: Jika input dimulai dengan tanda '#'
        if (val.startsWith('#')) {
            const skuQuery = val.replace('#', ''); // Hapus '#' untuk mencocokkan dengan ID di data
            if (skuQuery === "") return true; // Tampilkan semua jika baru ngetik '#' saja
            return p.id.toLowerCase().includes(skuQuery);
        } 
        
        // JALUR NAMA: Jika input biasa tanpa '#'
        return p.name.toLowerCase().includes(val);
    });

    renderProducts(filtered);
});

// 5. Jalankan Fungsi Pertama Kali saat Halaman Dibuka
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
});