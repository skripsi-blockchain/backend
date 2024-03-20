import useEth from "../../contexts/EthContext/useEth";
import Home from "./Home";
import DataTransaksi from "./DataTransaksi";

function Pages() {
  const { state } = useEth();

  return <div>{!state ? <Home /> : <DataTransaksi />}</div>;
}

export default Pages;
