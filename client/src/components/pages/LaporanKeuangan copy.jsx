import React from "react";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";

const LaporanKeuangan = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div id="page-wrapper">
        <div className="container-fluid" style={{ marginTop: "5vh" }}>
          <div className="row">
            <div className="col-lg-2">
              <img
                src="img/laporan_Gambar.png"
                alt=""
                style={{ maxWidth: "100%", height: "12vh" }}
              />
            </div>
            <div className="col-lg-5">
              <div
                className="container-fluid"
                style={{ backgroundColor: "#E6F2FD", height: "100%" }}
              >
                <h5 style={{ marginLeft: "1.5vh", marginTop: "2vh" }}>
                  Total Pemasukan
                </h5>
                <div className="row" style={{ paddingBottom: "5%" }}>
                  <div className="col-lg-2" style={{ marginLeft: "2vh" }}>
                    <img
                      src="img/up.png"
                      style={{ maxWidth: "100%", height: "4.6vh" }}
                      alt=""
                    />
                  </div>
                  <div
                    className="col-lg-6"
                    style={{ textAlign: "left", marginTop: "-1vh" }}
                  >
                    <h2 style={{ fontWeight: "bold" }}>Rp.4.000.000</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div
                className="container-fluid"
                style={{ backgroundColor: "#FFE7E7", height: "100%" }}
              >
                <h5 style={{ marginLeft: "1.5vh", marginTop: "2vh" }}>
                  Total Pemasukan
                </h5>
                <div className="row" style={{ paddingBottom: "5%" }}>
                  <div className="col-lg-2" style={{ marginLeft: "2vh" }}>
                    <img
                      src="img/down.png"
                      style={{ maxWidth: "100%", height: "4.6vh" }}
                      alt=""
                    />
                  </div>
                  <div
                    className="col-lg-6"
                    style={{ textAlign: "left", marginTop: "-1vh" }}
                  >
                    <h2 style={{ fontWeight: "bold" }}>Rp.4.000.000</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: "3vh" }}>
            <div className="col-lg-6">
              <div className="panel panel-default">
                <div className="panel-body">
                  <h5 style={{ textAlign: "center", marginBottom: "3vh" }}>
                    Grafik Pemasukan Pengeluaran
                  </h5>
                  <div
                    style={{
                      textAlign: "right",
                      marginRight: "1vh",
                      marginBottom: "1vh",
                    }}
                  >
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button type="button" className="btn btn-secondary">
                        Harian
                      </button>
                      <button type="button" className="btn btn-secondary">
                        Mingguan
                      </button>
                      <button type="button" className="btn btn-secondary">
                        Bulanan
                      </button>
                    </div>
                  </div>
                  <canvas id="myChart" style={{ width: "100%" }}></canvas>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="panel panel-default">
                <div className="panel-body">
                  <h5 style={{ textAlign: "center", marginBottom: "3vh" }}>
                    Grafik Pemasukan Pengeluaran
                  </h5>
                  <div
                    style={{
                      textAlign: "right",
                      marginRight: "1vh",
                      marginBottom: "1vh",
                    }}
                  >
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button type="button" className="btn btn-secondary">
                        Harian
                      </button>
                      <button type="button" className="btn btn-secondary">
                        Mingguan
                      </button>
                      <button type="button" className="btn btn-secondary">
                        Bulanan
                      </button>
                    </div>
                  </div>
                  <canvas id="myChart2" style={{ width: "100%" }}></canvas>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <h3
                className="page-header"
                style={{ fontWeight: "bold", textAlign: "center" }}
              >
                LAPORAN PEMASUKAN
              </h3>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
              <label htmlFor="searchTanggal1">Tanggal Pembelian</label>
              <input
                type="date"
                className="form-control"
                id="searchTanggal1"
                name="searchTanggal1"
              />
            </div>
            <div className="col-lg-2">
              <label htmlFor="searchTanggal2">Tanggal Pembelian</label>
              <input
                type="date"
                className="form-control"
                id="searchTanggal2"
                name="searchTanggal2"
              />
            </div>
            <div className="col-lg-1">
              <button
                className="btn"
                style={{
                  backgroundColor: "#CA0C0C",
                  color: "white",
                  marginTop: "2.5vh",
                }}
              >
                Terapkan
              </button>
            </div>
            <div className="col-lg-7 text-right">
              <button
                className="btn"
                style={{
                  backgroundColor: "#20564F",
                  color: "white",
                  fontWeight: "bold",
                }}
                onClick={printTable}
              >
                &#x1F5A8; Cetak Barang
              </button>
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
                      <th>Kuantitas</th>
                      <th>Jumlah Transaksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>001</td>
                      <td>23-07-2023</td>
                      <td>5</td>
                      <td>$250.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <footer style={{ textAlign: "center", paddingTop: "2vh" }}>
            <p>2024 &copy; Point of Sale</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

// Function to print table
function printTable() {
  // Clone the table element
  var tableToPrint = document
    .getElementById("dataTables-example")
    .cloneNode(true);

  // Create a new window or tab for printing
  var printWindow = window.open("", "_blank");

  // Add the cloned table to the new window or tab
  printWindow.document.body.appendChild(tableToPrint);

  // Trigger the print dialog
  printWindow.print();
}

export default LaporanKeuangan;
