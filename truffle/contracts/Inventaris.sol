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

}
