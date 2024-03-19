import React from "react";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import useEth from "../../contexts/EthContext/useEth";
import { useState, useEffect } from "react";

const StockBarang = () => {
  const {
    state: { contract, accounts },
  } = useEth();

  const [items, setItems] = useState("");
  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [stok, setStok] = useState("");
  const [harga, setHarga] = useState("");

  const [editFormData, setEditFormData] = useState({
    id: "",
    kode: "",
    nama: "",
    stok: "",
    harga: "",
  });

  const fetchData = async () => {
    if (contract) {
      try {
        const itemCount = await contract.methods.getItemCount().call();
        const itemData = [];
        for (let i = 0; i < itemCount; i++) {
          const item = await contract.methods.getItem(i).call();
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
    // Mengambil data dari kontrak cerdas
    fetchData();
  }, [contract]);

  const handleSubmit = async (e) => {
    console.log(nama);
    e.preventDefault();
    if (!contract) {
      console.error("Contract not loaded");
      return;
    }
    try {
      await contract.methods
        .addItem(kode, nama, parseInt(stok), parseInt(harga))
        .send({ from: accounts[0] });
      fetchData();
      // Reset form fields after successful addition
      setKode("");
      setNama("");
      setStok("");
      setHarga("");
      console.log("Item added successfully");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    console.log("hapus");
    if (!contract) {
      console.error("Contract not loaded");
      return;
    }
    try {
      await contract.methods.deleteItem(id).send({ from: accounts[0] });
      fetchData(); // Refresh data after deletion
      console.log("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const handleEditItem = (item) => {
    setEditFormData({
      id: item.id,
      kode: item.kode,
      nama: item.nama,
      stok: item.stok,
      harga: item.harga,
    });
  };

  const editItem = async () => {
    try {
      await contract.methods
        .editItem(
          editFormData.id,
          editFormData.kode,
          editFormData.nama,
          editFormData.stok,
          editFormData.harga
        )
        .send({ from: accounts[0] });
      console.log("Item edited successfully");
      fetchData(); // Refresh data after editing
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  // Handler untuk mengubah nilai form input
  const handleInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  console.log(editFormData);

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div id="page-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="page-header" style={{ fontWeight: "bold" }}>
                DATA STOK BARANG
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
            <style>
              {`
              @media (max-width: 1200px) {
                  .col-lg-1 {
                      margin-top: 10px;
                  }

                  .col-lg-3 {
                      margin-top: 5px;
                  }
              }

              @media (max-width: 767px) {
                  .nav-item {
                      margin-top: 5.2vh;
                  }
              }

              .nav-item {
                  margin-top: 1vh;
              }
            `}
            </style>
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
                placeholder="Nama Barang"
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
                data-target="#barang"
              >
                Tambah Barang
              </button>
            </div>
            <div
              className="modal fade"
              id="barang"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="barangModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4
                      className="modal-title"
                      id="barangModalLabel"
                      style={{ fontWeight: "bold" }}
                    >
                      Tambah Barang
                    </h4>
                  </div>
                  <div className="modal-body">
                    <form id="barangForm" onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="kodeBarang">Kode Barang:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="kodeBarang"
                          name="kodeBarang"
                          value={kode}
                          onChange={(e) => setKode(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="namaBarang">Nama Barang:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="namaBarang"
                          name="namaBarang"
                          value={nama}
                          onChange={(e) => setNama(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="jumlahBarang">Jumlah Barang:</label>
                        <input
                          type="number"
                          className="form-control"
                          id="jumlahBeli"
                          name="jumlahBeli"
                          value={stok}
                          onChange={(e) => setStok(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="hargaSatuan">Harga Satuan:</label>
                        <input
                          type="number"
                          className="form-control"
                          id="hargaSatuan"
                          name="hargaSatuan"
                          value={harga}
                          onChange={(e) => setHarga(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
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
                    </form>
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
                      <th scope="col">Kode Barang</th>
                      <th scope="col">Nama Barang</th>
                      <th scope="col">Jumlah Barang</th>
                      <th scope="col">Harga Satuan</th>
                      {/* <th scope="col">Total Harga</th> */}
                      <th scope="col">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Sample row, you can dynamically populate this part using your data */}
                    {items &&
                      items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.kode}</td>
                          <td>{item.nama}</td>
                          <td>{item.stok}</td>
                          <td>{item.harga}</td>
                          <td>
                            <button
                              className="btn"
                              style={{
                                backgroundColor: "#056DE7",
                                color: "white",
                              }}
                              onClick={() => handleEditItem(item)}
                            >
                              <i
                                className="fas fa-pencil-alt"
                                data-toggle="modal"
                                data-target="#editBarang"
                              ></i>
                            </button>
                            {/* delete stok barang */}
                            <button
                              className="btn"
                              style={{
                                marginLeft: "10px",
                                backgroundColor: "red",
                                color: "white",
                              }}
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <i className="fa fa-trash" aria-hidden="true"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    {/* Add more rows as needed */}
                  </tbody>
                </table>
                <div
                  className="modal fade"
                  id="editBarang"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="editBarangLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h4
                          className="modal-title"
                          id="barangModalLabel"
                          style={{ fontWeight: "bold" }}
                        >
                          Edit Stok Barang
                        </h4>
                      </div>
                      <div className="modal-body">
                        <form
                          id="barangForm"
                          onSubmit={(e) => {
                            e.preventDefault();
                            editItem();
                          }}
                        >
                          <div className="form-group">
                            <label htmlFor="kodeBarang">Kode Barang:</label>
                            <input
                              type="text"
                              className="form-control"
                              id="kodeBarang"
                              value={editFormData.kode}
                              onChange={handleInputChange}
                              name="kodeBarang"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="namaBarang">Nama Barang:</label>
                            <input
                              type="text"
                              className="form-control"
                              id="namaBarang"
                              value={editFormData.nama}
                              onChange={handleInputChange}
                              name="namaBarang"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="jumlahBarang">Jumlah Barang:</label>
                            <input
                              type="number"
                              className="form-control"
                              id="jumlahBeli"
                              value={editFormData.stok}
                              onChange={handleInputChange}
                              name="jumlahBeli"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="hargaSatuan">Harga Satuan:</label>
                            <input
                              type="number"
                              className="form-control"
                              id="hargaSatuan"
                              name="hargaSatuan"
                              value={editFormData.harga}
                              onChange={handleInputChange}
                              required
                            />
                          </div>

                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick="submitTransaksi()"
                          >
                            Submit
                          </button>
                        </form>
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

export default StockBarang;
