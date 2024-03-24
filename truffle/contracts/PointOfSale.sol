// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Inventaris {
    uint256 public nextItemId = 1; // Menyimpan ID berikutnya yang akan digunakan

    struct Item {
        uint256 id;
        string kode;
        string nama;
        uint256 stok;
        uint256 harga;
    }

    Item[] public items;

    constructor() {
        // Tambahkan beberapa data dummy saat kontrak dibuat
        addItem("IPN123", "IPHONE", 100, 20000000);
        addItem("SAM123", "SAMSUNG", 100, 10000000);
        addItem("XIA123", "XIAOMI", 100, 5000000);
        addItem("OPP123", "OPPO", 100, 6000000);
        addItem("VIV123", "VIVO", 100, 7000000);
        addItem("NOK123", "NOKIA", 100, 4000000);
        addItem("HUA123", "HUAWEI", 100, 15000000);
        addItem("GOO123", "GOOGLE PIXEL", 100, 12000000);
    }

    // Fungsi untuk menambahkan item baru
    function addItem(string memory _kode, string memory _nama, uint256 _stok, uint256 _harga) public {
        Item memory newItem = Item(nextItemId, _kode, _nama, _stok, _harga);
        items.push(newItem);
        nextItemId++; // Meningkatkan ID untuk item berikutnya
    }

    // Fungsi untuk membaca item berdasarkan indeks
    function getItem(uint256 _index) public view returns (uint256, string memory, string memory, uint256, uint256) {
        require(_index < items.length, "Index out of bounds");
        Item memory item = items[_index];
        return (item.id, item.kode, item.nama, item.stok, item.harga);
    }

    // Fungsi untuk mendapatkan jumlah item yang tersedia
    function getItemCount() public view returns (uint256) {
        return items.length;
    }

    // Fungsi untuk mengedit item berdasarkan ID
    function editItem(uint256 _id, string memory _kode, string memory _nama, uint256 _stok, uint256 _harga) public {
        require(_id > 0 && _id <= nextItemId, "Invalid ID");
        for (uint256 i = 0; i < items.length; i++) {
            if (items[i].id == _id) {
                items[i].kode = _kode;
                items[i].nama = _nama;
                items[i].stok = _stok;
                items[i].harga = _harga;
                break;
            }
        }
    }

    function deleteItem(uint256 _id) public {
  require(_id > 0 && _id <= nextItemId, "Invalid ID");

  // Find the index of the item to delete
  uint256 index = find(_id);

  // Check if the item exists before deletion
  if (index != type(uint256).max) {
    // Shift items after the deleted item to the left
    for (uint256 i = index; i < items.length - 1; i++) {
      items[i] = items[i + 1];
    }

    // Decrease the length of the array to remove the last element
    items.pop();
  } else {
    // Item not found, handle the case (optional)
    // You can revert the transaction here or emit an event
  }
}

// Helper function to find the index of the item with the given ID
function find(uint256 _id) internal view returns (uint256) {
  for (uint256 i = 0; i < items.length; i++) {
    if (items[i].id == _id) {
      return i;
    }
  }
  // Return a special value (e.g., type(uint256).max) if not found
  return type(uint256).max;
}

// Fungsi untuk mengurangi stok barang berdasarkan indeks item dan jumlah yang akan dikurangkan
function kurangiStokBarang(uint256 _itemIndex, uint256 _jumlah) public {
    // Memastikan _itemIndex valid
    require(_itemIndex < items.length, "Index item tidak valid");

    // Memastikan jumlah stok mencukupi untuk dikurangkan
    require(items[_itemIndex].stok >= _jumlah, "Stok tidak mencukupi");

    // Mengurangi stok barang
    items[_itemIndex].stok -= _jumlah;
}

}

contract Transaksi {
    struct TransaksiItemDetail {
        string namaBarang;
        uint256 hargaSatuan;
        uint256 jumlah;
        uint256 totalHarga;
    }

    struct TransaksiData {
        uint256 kodeTransaksi;
        uint256 tanggalTransaksi;
        uint256 totalTransaksi;
        uint256 itemCount;
        uint256[] itemIds; // Menambahkan array untuk menyimpan ID item
        mapping(uint256 => TransaksiItemDetail) details; // Menggunakan mapping untuk menyimpan detail transaksi
    }

    event TransaksiSelesai(address indexed buyer, uint256 kodeTransaksi, uint256 tanggalTransaksi, uint256 totalTransaksi, uint256[] itemIds);

    mapping(address => mapping(uint256 => TransaksiData)) private transaksis;
    uint256 private lastTransactionCode = 0;
    Inventaris public inventaris;

    constructor(address _inventarisAddress) {
        inventaris = Inventaris(_inventarisAddress);
        tambahBeberapaTransaksiDummy();
    }

    function tambahDanSelesaikanTransaksi(uint256[] memory _itemIds, uint256[] memory _jumlahs) public {
        require(_itemIds.length == _jumlahs.length, "Panjang array itemIds dan jumlahs harus sama");

        uint256 kodeTransaksi = generateTransactionCode();
        uint256 timestamp = block.timestamp;
        uint256 tanggalTransaksi = timestamp; // Mengambil tanggal (tanpa waktu)

        uint256 totalTransaksi;
        for (uint256 i = 0; i < _itemIds.length; i++) {
            ( , , string memory nama , , uint256 harga) = inventaris.getItem(_itemIds[i]);
            uint256 totalHarga = harga * _jumlahs[i];
            totalTransaksi += totalHarga;

            transaksis[msg.sender][kodeTransaksi].details[_itemIds[i]] = TransaksiItemDetail({
                namaBarang: nama,
                hargaSatuan: harga,
                jumlah: _jumlahs[i],
                totalHarga: totalHarga
            });

            inventaris.kurangiStokBarang(_itemIds[i], _jumlahs[i]);
        }

        transaksis[msg.sender][kodeTransaksi].kodeTransaksi = kodeTransaksi;
        transaksis[msg.sender][kodeTransaksi].tanggalTransaksi = tanggalTransaksi;
        transaksis[msg.sender][kodeTransaksi].totalTransaksi = totalTransaksi;
        transaksis[msg.sender][kodeTransaksi].itemCount = _itemIds.length;
        transaksis[msg.sender][kodeTransaksi].itemIds = _itemIds;

        emit TransaksiSelesai(msg.sender, kodeTransaksi, tanggalTransaksi, totalTransaksi, _itemIds);
    }

    function generateTransactionCode() internal returns (uint256) {
        lastTransactionCode++;
        return lastTransactionCode;
    }

    function getDataTransaksi(address _buyer, uint256 _kodeTransaksi) public view returns (uint256, uint256, uint256[] memory, TransaksiItemDetail[] memory) {
        TransaksiData storage transaksi = transaksis[_buyer][_kodeTransaksi];
        require(transaksi.itemCount > 0, "Transaksi tidak ditemukan");
        return (transaksi.tanggalTransaksi, transaksi.totalTransaksi, transaksi.itemIds, getItemDetails(_buyer, _kodeTransaksi));
    }

    function getItemDetails(address _buyer, uint256 _kodeTransaksi) internal view returns (TransaksiItemDetail[] memory) {
        TransaksiData storage transaksi = transaksis[_buyer][_kodeTransaksi];
        TransaksiItemDetail[] memory details = new TransaksiItemDetail[](transaksi.itemCount);
        for (uint256 i = 0; i < transaksi.itemIds.length; i++) {
            uint256 itemId = transaksi.itemIds[i];
            details[i] = transaksi.details[itemId];
        }
        return details;
    }

    function getItemDetailsExternal(address _buyer, uint256 _kodeTransaksi) external view returns (TransaksiItemDetail[] memory) {
        return getItemDetails(_buyer, _kodeTransaksi);
    }

function getAllTransactions(address _buyer) public view returns (uint256[] memory, uint256[] memory, uint256[] memory, uint256[][] memory, TransaksiItemDetail[][] memory) {
    uint256 validTransactionCount = countValidTransactions(_buyer);

    uint256[] memory transactionCodes = new uint256[](validTransactionCount);
    uint256[] memory transactionDates = new uint256[](validTransactionCount);
    uint256[] memory transactionTotals = new uint256[](validTransactionCount);
    uint256[][] memory transactionItemIds = new uint256[][](validTransactionCount);
    TransaksiItemDetail[][] memory transactionItemDetails = new TransaksiItemDetail[][](validTransactionCount);

    populateTransactionsData(_buyer, transactionCodes, transactionDates, transactionTotals, transactionItemIds, transactionItemDetails);

    return (transactionCodes, transactionDates, transactionTotals, transactionItemIds, transactionItemDetails);
}

function countValidTransactions(address _buyer) internal view returns (uint256) {
    uint256 validTransactionCount = 0;
    for (uint256 i = 1; i <= lastTransactionCode; i++) {
        if (transaksis[_buyer][i].itemCount > 0) {
            validTransactionCount++;
        }
    }
    return validTransactionCount;
}

function populateTransactionsData(address _buyer, uint256[] memory _transactionCodes, uint256[] memory _transactionDates, uint256[] memory _transactionTotals, uint256[][] memory _transactionItemIds, TransaksiItemDetail[][] memory _transactionItemDetails) internal view {
    uint256 currentIndex = 0;
    for (uint256 i = 1; i <= lastTransactionCode; i++) {
        TransaksiData storage transaksi = transaksis[_buyer][i];
        if (transaksi.itemCount > 0) {
            _transactionCodes[currentIndex] = transaksi.kodeTransaksi;
            _transactionDates[currentIndex] = transaksi.tanggalTransaksi;
            _transactionTotals[currentIndex] = transaksi.totalTransaksi;
            _transactionItemIds[currentIndex] = transaksi.itemIds;
            _transactionItemDetails[currentIndex] = getItemDetails(_buyer, i);
            currentIndex++;
        }
    }
}

function tambahBeberapaTransaksiDummy() public {
    // Transaksi 1
    uint256[] memory itemIds1 = new uint256[](2);
    itemIds1[0] = 1; // Contoh ID barang 1
    itemIds1[1] = 2; // Contoh ID barang 2
    uint256[] memory jumlahs1 = new uint256[](2);
    jumlahs1[0] = 3; // Jumlah barang 1
    jumlahs1[1] = 2; // Jumlah barang 2
    tambahDanSelesaikanTransaksi(itemIds1, jumlahs1);

    // Transaksi 2
    uint256[] memory itemIds2 = new uint256[](1);
    itemIds2[0] = 3; // Contoh ID barang 3
    uint256[] memory jumlahs2 = new uint256[](1);
    jumlahs2[0] = 1; // Jumlah barang 3
    tambahDanSelesaikanTransaksi(itemIds2, jumlahs2);

    // Transaksi 3
    uint256[] memory itemIds3 = new uint256[](3);
    itemIds3[0] = 2; // Contoh ID barang 2
    itemIds3[1] = 3; // Contoh ID barang 3
    itemIds3[2] = 4; // Contoh ID barang 4
    uint256[] memory jumlahs3 = new uint256[](3);
    jumlahs3[0] = 2; // Jumlah barang 2
    jumlahs3[1] = 1; // Jumlah barang 3
    jumlahs3[2] = 5; // Jumlah barang 4
    tambahDanSelesaikanTransaksi(itemIds3, jumlahs3);
}
}



// contract Transaksi {
//     struct TransaksiItemDetail {
//         string namaBarang;
//         uint256 hargaSatuan;
//         uint256 jumlah;
//         uint256 totalHarga;
//     }

//     struct TransaksiItem {
//         uint256 kodeTransaksi;
//         uint256 tanggalTransaksi;
//         uint256 totalTransaksi;
//         uint256[] itemIndexes; // Menyimpan indeks item dalam keranjangs
//     }

//     // Event untuk mengonfirmasi transaksi
//     event TransaksiSelesai(address indexed buyer, uint256 kodeTransaksi, uint256 tanggalTransaksi, uint256 totalTransaksi, uint256[] items);

//     Inventaris public inventaris;
//     mapping(address => TransaksiItemDetail[]) private keranjangs;
//     mapping(address => TransaksiItem[]) private transaksis;

//     uint256 private lastTransactionCode = 1;

//     constructor(address _inventarisAddress) {
//         inventaris = Inventaris(_inventarisAddress);
//     }

//     function generateTransactionCode() internal returns (uint256) {
//         // Increment kode transaksi
//         lastTransactionCode++;

//         // Mengembalikan kode transaksi terbaru
//         return lastTransactionCode;
//     }

//     function tambahBarangKeKeranjang(uint256 _itemIndex, uint256 _jumlah) public {
//         require(_jumlah > 0, "Jumlah barang harus lebih dari 0");

//         (, , string memory nama , uint256 stok, uint256 harga) = inventaris.getItem(_itemIndex);
//         require(stok >= _jumlah, "Stok tidak mencukupi");

//         keranjangs[msg.sender].push(TransaksiItemDetail({
//             namaBarang: nama,
//             hargaSatuan: harga,
//             jumlah: _jumlah,
//             totalHarga: harga * _jumlah
//         }));

//         // Kurangi stok barang di inventaris
//         inventaris.kurangiStokBarang(_itemIndex, _jumlah);
//     }

//     function selesaikanTransaksi() public {
//         TransaksiItemDetail[] storage items = keranjangs[msg.sender];
//         require(items.length > 0, "Keranjang kosong");

//         // Menghitung total transaksi
//         uint256 totalTransaksi = 0;
//         for (uint256 i = 0; i < items.length; i++) {
//             totalTransaksi += items[i].totalHarga;
//         }

//         // Mendapatkan kode transaksi dan tanggal transaksi baru
//         uint256 kodeTransaksi = generateTransactionCode();
//         uint256 timestamp = block.timestamp;
//         uint256 tanggalTransaksi = timestamp / (24 * 60 * 60); // Mengambil tanggal (tanpa waktu)

//         // Membuat Transaksi baru
//         TransaksiItem memory transaksiItem = TransaksiItem({
//             kodeTransaksi: kodeTransaksi,
//             tanggalTransaksi: tanggalTransaksi,
//             totalTransaksi: totalTransaksi,
//             itemIndexes: new uint256[](items.length) // Membuat array baru untuk menyimpan indeks item
//         });

//         // Menambahkan indeks item ke Transaksi
//         for (uint256 i = 0; i < items.length; i++) {
//             transaksiItem.itemIndexes[i] = keranjangs[msg.sender].length - 1; // Menggunakan indeks item terakhir dalam keranjangs
//         }

//         // Menambahkan Transaksi ke data transaksi
//         transaksis[msg.sender].push(transaksiItem);

//         // Menghapus semua item dari keranjang
//         delete keranjangs[msg.sender];

//         // Emit event untuk mengonfirmasi transaksi
//         emit TransaksiSelesai(msg.sender, kodeTransaksi, tanggalTransaksi, totalTransaksi, transaksiItem.itemIndexes);
//     }

//     function getDataKeranjang(address _owner) public view returns (TransaksiItemDetail[] memory) {
//         return keranjangs[_owner];
//     }

//     function getDataTransaksi(address _buyer) public view returns (TransaksiItem[] memory) {
//         return transaksis[_buyer];
//     }
// }

// contract Transaksi {
//     struct Keranjang {
//         string namaBarang;
//         uint256 hargaSatuan;
//         uint256 jumlah;
//         uint256 totalHarga;
//     }

//     mapping(address => Keranjang[]) public keranjangs;
//     Inventaris public inventaris;

//     constructor(address _inventarisAddress) {
//         inventaris = Inventaris(_inventarisAddress);
//     }

//     // Fungsi untuk menambahkan barang ke keranjang
//     function tambahBarangKeKeranjang(address _owner, uint256 _itemIndex, uint256 _jumlah) public {
//     (, , string memory nama , uint256 stok, uint256 harga) = inventaris.getItem(_itemIndex);
//     require(stok >= _jumlah, "Stok tidak mencukupi");

//      // Panggil fungsi kurangiStokBarang dari kontrak Inventaris
//     inventaris.kurangiStokBarang(_itemIndex, _jumlah);

//     keranjangs[_owner].push(Keranjang( nama , harga, _jumlah, harga * _jumlah));
// }

// function getDataKeranjang(address _owner) public view returns (Keranjang[] memory) {
//     return keranjangs[_owner];
// }

//     // Fungsi untuk mendapatkan panjang keranjang pengguna
//     function getPanjangKeranjang(address _owner) public view returns (uint256) {
//         return keranjangs[_owner].length;
//     }
// }
