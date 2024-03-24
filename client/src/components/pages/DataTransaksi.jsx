// DataTransaksi.js
import React, { useState, useEffect } from "react";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import useEth from "../../contexts/EthContext/useEth";
// import { useState } from "react";
// import useEth from "../../contexts/EthContext/useEth";

const DataTransaksi = () => {
  const {
    state: { inventarisContract, transaksiContract, accounts },
  } = useEth();

  const [items, setItems] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [jumlahBarang, setJumlahBarang] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [selectedTransactionIndex, setSelectedTransactionIndex] =
    useState(null);
  const [selectedTransactionDetail, setSelectedTransactionDetail] = useState({
    kodeTransaksi: "",
    tanggalTransaksi: "",
    totalTransaksi: "",
  });

  const handleTransactionClick = (
    _kodeTransaksi,
    _tanggalTransaksi,
    _totalTransaksi
  ) => {
    setSelectedTransactionIndex(_kodeTransaksi);
    setSelectedTransactionDetail({
      kodeTransaksi: _kodeTransaksi,
      tanggalTransaksi: _tanggalTransaksi,
      totalTransaksi: _totalTransaksi,
    });
    // Fetch item details when a transaction is clicked
    fetchItemDetails(accounts[0], _kodeTransaksi); // Mengirimkan akun pembeli dan kode transaksi
  };

  const fetchDataTransaksi = async () => {
    if (transaksiContract) {
      try {
        const result = await transaksiContract.methods
          .getAllTransactions(accounts[0])
          .call();
        // Merubah objek menjadi array
        setTransactions(result);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
  };

  const fetchItemDetails = async (_buyer, _kodeTransaksi) => {
    try {
      const itemDetails = await transaksiContract.methods
        .getItemDetailsExternal(_buyer, _kodeTransaksi)
        .call();
      setTransactionDetails(itemDetails);
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  // async function fetchDataTransaksi() {
  //   if (transaksiContract) {
  //     // Panggil fungsi getDataTransaksi pada smart contract
  //     const transaksiData = await transaksiContract.methods
  //       .getDataTransaksi(accounts[0])
  //       .call();
  //     setTransactions(transaksiData[0]);
  //     setTransactionDetails(transaksiData[1]);
  //   }
  // }

  const fetchDataItems = async () => {
    if (inventarisContract) {
      try {
        const itemCount = await inventarisContract.methods
          .getItemCount()
          .call();
        const itemData = [];
        for (let i = 0; i < itemCount; i++) {
          const item = await inventarisContract.methods.getItem(i).call();
          itemData.push({
            id: item[0],
            kode: item[1],
            nama: item[2],
            stok: item[3],
            harga: item[4],
          });
        }
        setItems(itemData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchDataItems();
  }, [inventarisContract]);

  useEffect(() => {
    fetchDataTransaksi();
  }, [transaksiContract]);

  const handleTambahBarangKeKeranjang = async () => {
    try {
      await transaksiContract.methods
        .tambahBarangKeKeranjang(selectedItemId, jumlahBarang)
        .send({ from: accounts[0] });
      // Jika berhasil tambah ke keranjang, refresh data barang
      setJumlahBarang(0);
      setSelectedItemId("");
      fetchKeranjang();
      fetchDataTransaksi();
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const [keranjang, setKeranjang] = useState([]);

  const fetchKeranjang = async () => {
    if (transaksiContract) {
      try {
        const keranjangItem = await transaksiContract.methods
          .getDataKeranjang(accounts[0])
          .call();
        setKeranjang(keranjangItem);
      } catch (error) {
        console.error("Error fetching keranjang:", error);
      }
    }
  };
  useEffect(() => {
    fetchKeranjang();
  }, []);

  const selesaikanTransaksi = async () => {
    try {
      await transaksiContract.methods
        .selesaikanTransaksi()
        .send({ from: accounts[0] });
      // Setelah transaksi selesai, perbarui keranjang
      setKeranjang([]);
      console.log("Transaksi berhasil diselesaikan");
      fetchDataTransaksi();
    } catch (error) {
      console.error("Error completing transaction:", error);
    }
  };

  const length = transactions[0] ? transactions[0].length : 0;

  function formatRupiah(amount) {
    // Mengonversi string angka menjadi tipe number
    const numberAmount = parseInt(amount);

    // Mengecek apakah input merupakan angka yang valid
    if (isNaN(numberAmount)) {
      return "Invalid input";
    }

    // Menggunakan Intl.NumberFormat untuk memformat angka ke dalam format Rupiah
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    // Mengembalikan hasil format Rupiah
    return formatter.format(numberAmount);
  }

  function epochToDateTime(epoch) {
    const date = new Date(epoch * 1000);
    return date.toLocaleString();
  }

  console.log(transactionDetails);

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div id="page-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="page-header" style={{ fontWeight: "bold" }}>
                DATA TRANSAKSI PENJUALAN
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3">
              <input
                type="date"
                className="form-control"
                placeholder="Tanggal Pembelian"
                id="searchTanggal"
              />
            </div>
            <div className="col-lg-1">
              <button
                className="btn"
                style={{ backgroundColor: "#CA0C0C", color: "white" }}
              >
                Cari
              </button>
            </div>
            <div className="col-lg-5">
              <input
                type="text"
                className="form-control"
                placeholder="Cari Kode Transaksi"
                id="searchKodeTransaksi"
              />
            </div>
            <div className="col-lg-1">
              <button
                className="btn"
                style={{ backgroundColor: "#CA0C0C", color: "white" }}
              >
                Cari
              </button>
            </div>
            <div className="col-lg-2 text-right">
              <button
                className="btn"
                style={{ backgroundColor: "#20564F", color: "white" }}
                data-toggle="modal"
                data-target="#transaksiModal"
              >
                Tambah Transaksi
              </button>
            </div>
            <div
              className="modal fade"
              id="transaksiModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="transaksiModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-body">
                    <h4
                      className="modal-title"
                      id="transaksiModalLabel"
                      style={{ fontWeight: "bold" }}
                    >
                      TAMBAH TRANSAKSI
                    </h4>
                    <br />
                    <table>
                      <tr>
                        <th> Kode Transaksi </th>
                        <th> : </th>
                        <th> 000001 </th>
                      </tr>
                      <tr>
                        <th> Tanggal Transaksi </th>
                        <th> : </th>
                        <th> 01-03-2024 </th>
                      </tr>
                      <tr>
                        <th> Nama Barang </th>
                        <th> : </th>
                        <th>
                          <select
                            value={selectedItemId}
                            onChange={(e) => setSelectedItemId(e.target.value)}
                          >
                            <option value="">Pilih Barang</option>
                            {items &&
                              items.map((item) => (
                                <option key={item.id} value={item.id - 1}>
                                  {item.nama}
                                </option>
                              ))}
                          </select>
                        </th>
                      </tr>
                      <tr>
                        <th> Jumlah Barang </th>
                        <th> : </th>
                        <th>
                          {" "}
                          <input
                            type="number"
                            placeholder=""
                            value={jumlahBarang}
                            onChange={(e) => setJumlahBarang(e.target.value)}
                          />{" "}
                        </th>
                      </tr>
                    </table>
                    <button
                      className="btn"
                      style={{
                        backgroundColor: "#20564F",
                        color: "white",
                        fontSize: "14px",
                      }}
                      // data-toggle="modal"
                      // data-target="#transaksiModal"
                      onClick={handleTambahBarangKeKeranjang}
                    >
                      Tambah ke Tabel
                    </button>
                    <table className="table" style={{ marginTop: "1vh" }}>
                      <thead
                        className="thead-light"
                        style={{ backgroundColor: "#dddddd" }}
                      >
                        <tr>
                          <th scope="col">Nama Barang</th>
                          <th scope="col">Jumlah</th>
                          <th scope="col">Harga Satuan</th>
                          <th scope="col">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {keranjang.map((item, index) => (
                          <tr key={index}>
                            <th scope="row">{item.namaBarang}</th>
                            <td>{item.jumlah}</td>
                            <td>{item.hargaSatuan}</td>
                            <td>{item.totalHarga}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={selesaikanTransaksi}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      data-dismiss="modal"
                      style={{ marginLeft: "10px" }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="row"
            style={{ marginTop: "2vh", marginBottom: "40vh" }}
          >
            <div className="col-lg-12">
              <div className="table-responsive">
                <table
                  className="table table-striped table-bordered table-hover"
                  id="dataTables-example"
                >
                  <thead>
                    <tr>
                      <th>Kode Transaksi</th>
                      <th>Tanggal</th>
                      <th>Jumlah Transaksi</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(length)].map((_, index) => (
                      <tr key={index}>
                        {/* Kolom 1: Kode */}
                        <td>{transactions[0][index]}</td>
                        {/* Kolom 2: Data pertama */}
                        <td>{epochToDateTime(transactions[1][index])}</td>
                        {/* Kolom 3: Data kedua */}
                        <td>{formatRupiah(transactions[2][index])}</td>
                        <td>
                          <button
                            className="btn"
                            style={{
                              backgroundColor: "#F9E428",
                              color: "white",
                            }}
                            data-toggle="modal"
                            data-target="#myModal"
                            onClick={() =>
                              handleTransactionClick(
                                transactions[0][index],
                                epochToDateTime(transactions[1][index]),
                                formatRupiah(transactions[2][index])
                              )
                            }
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="btn"
                            style={{
                              backgroundColor: "#056DE7",
                              color: "white",
                            }}
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* More rows */}
                  </tbody>
                </table>
                <div
                  className="modal fade"
                  id="myModal"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="transaksiModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-body">
                        <h4
                          className="modal-title"
                          id="transaksiModalLabel"
                          style={{ fontWeight: "bold" }}
                        >
                          Detail Transaksi
                        </h4>
                        <table style={{ marginTop: "2vh" }}>
                          <tr>
                            <th> Kode Transaksi </th>
                            <th> : </th>
                            <th>{selectedTransactionDetail.kodeTransaksi}</th>
                          </tr>
                          <tr>
                            <th> Tanggal Transaksi </th>
                            <th> : </th>
                            <th>
                              {selectedTransactionDetail.tanggalTransaksi}
                            </th>
                          </tr>
                        </table>
                        {selectedTransactionIndex !== null && (
                          <table className="table" style={{ marginTop: "1vh" }}>
                            <thead
                              class="thead-light"
                              style={{ backgroundColor: "#dddddd" }}
                            >
                              <tr>
                                <th scope="col">Nama Barang</th>
                                <th scope="col">Jumlah</th>
                                <th scope="col">Harga Satuan</th>
                                <th scope="col">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {transactionDetails.map((detail, idx) => (
                                <tr key={idx}>
                                  <th scope="col">{detail.namaBarang}</th>
                                  <th scope="col">{detail.jumlah}</th>
                                  <th scope="col">
                                    {formatRupiah(detail.hargaSatuan)}
                                  </th>
                                  <th scope="col">
                                    {formatRupiah(detail.totalHarga)}
                                  </th>
                                </tr>
                              ))}
                              <tr>
                                <th scope="row"></th>
                                <td></td>
                                <td style={{ fontWeight: "bold" }}>
                                  Total Transaksi
                                </td>
                                <td style={{ fontWeight: "bold" }}>
                                  {selectedTransactionDetail.totalTransaksi}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                        <button
                          type="button"
                          className="btn btn-danger"
                          data-dismiss="modal"
                          style={{ marginLeft: "10px" }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer style={{ textAlign: "center", paddingTop: "25vh" }}>
            <p>2024 &copy; Point of Sale</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DataTransaksi;
