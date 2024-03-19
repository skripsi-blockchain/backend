import { EthProvider } from "./contexts/EthContext";
import Pages from "./components/pages";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DataTransaksi from "./components/pages/DataTransaksi";
import StockBarang from "./components/pages/StockBarang";
import PembelianStockBarang from "./components/pages/PembelianStockBarang";
import LaporanKeuangan from "./components/pages/LaporanKeuangan";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <Router>
          <Routes>
            <Route path="/" element={<Pages />} />
            <Route path="/data_transaksi" element={<DataTransaksi />} />
            <Route path="/stock_barang" element={<StockBarang />} />
            <Route
              path="/pembelian_stock_barang"
              element={<PembelianStockBarang />}
            />
            <Route path="/laporan_keuangan" element={<LaporanKeuangan />} />
          </Routes>
        </Router>
      </div>
    </EthProvider>
  );
}

// function MainComponent() {
//   const { connectWallet, disconnect } = useContext(EthContext);

//   const handleConnectWallet = async () => {
//     try {
//       const artifact = require("./contracts/SimpleStorage.json");
//       connectWallet(artifact);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDisconnect = () => {
//     try {
//       disconnect(); // Memanggil fungsi disconnect saat tombol "Disconnect Wallet" diklik
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div id="App">
//       <div className="container">
//         <button onClick={handleDisconnect}>Disconnect Wallet</button>
//         <button onClick={handleConnectWallet}>Connect Wallet</button>
//         {/* Render komponen lain di sini */}
//       </div>
//     </div>
//   );
// }

export default App;
