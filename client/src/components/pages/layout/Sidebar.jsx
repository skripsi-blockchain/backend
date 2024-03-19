import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState(""); // State untuk menyimpan link aktif

  useEffect(() => {
    // Mendapatkan path URL saat ini
    const currentPath = window.location.pathname;

    // Mengatur link aktif berdasarkan path URL saat ini
    setActiveLink(currentPath);
  }, []); // useEffect hanya akan dipanggil sekali saat komponen dimuat pertama kali

  return (
    <aside className="sidebar navbar-default" role="navigation">
      <div
        className="sidebar-nav navbar-collapse"
        style={{ marginLeft: "1vh" }}
      >
        <ul className="nav" id="side-menu">
          <li className={`nav-item ${activeLink === "/" ? "active" : ""}`}>
            <Link
              to={"/"}
              className="nav-link link-dark"
              style={{ color: "black" }}
            >
              <i className="fa fa-tasks"></i> Data Transaksi
            </Link>
          </li>
          <li
            className={`mt-2 nav-item ${
              activeLink === "/stock_barang" ? "active" : ""
            }`}
          >
            <Link
              to={"/stock_barang"}
              className="nav-link link-dark"
              style={{ color: "black" }}
            >
              <i className="fa fa-inbox"></i> Stock Barang
            </Link>
          </li>
          <li
            className={`mt-2 nav-item ${
              activeLink === "/pembelian_stock_barang" ? "active" : ""
            }`}
          >
            <Link
              to={"/pembelian_stock_barang"}
              className="nav-link link-dark"
              style={{ color: "black" }}
            >
              <i className="fa fa-shopping-basket"></i> Pembelian Stock Barang
            </Link>
          </li>
          <li
            className={`mt-2 nav-item ${
              activeLink === "/laporan_keuangan" ? "active" : ""
            }`}
          >
            <Link
              to={"/laporan_keuangan"}
              className="nav-link link-dark"
              style={{ color: "black" }}
            >
              <i className="fa fa-bar-chart"></i> Laporan Keuangan
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
