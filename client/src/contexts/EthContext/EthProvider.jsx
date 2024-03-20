import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
import InventarisArtifact from "../../contracts/Inventaris.json";
import TransaksiArtifact from "../../contracts/Transaksi.json";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(async (inventarisArtifact, transaksiArtifact) => {
    if (inventarisArtifact && transaksiArtifact) {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
      const accounts = await web3.eth.requestAccounts();
      const networkID = await web3.eth.net.getId();
      const inventarisAddress = inventarisArtifact.networks[networkID].address;
      const transaksiAddress = transaksiArtifact.networks[networkID].address;
      const inventarisContract = new web3.eth.Contract(
        inventarisArtifact.abi,
        inventarisAddress
      );
      const transaksiContract = new web3.eth.Contract(
        transaksiArtifact.abi,
        transaksiAddress
      );
      dispatch({
        type: actions.init,
        data: {
          web3,
          accounts,
          networkID,
          inventarisContract,
          transaksiContract,
        },
      });
    }
  }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const inventarisArtifact = InventarisArtifact;
        const transaksiArtifact = TransaksiArtifact;
        init(inventarisArtifact, transaksiArtifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.inventarisArtifact, state.transaksiArtifact);
    };

    events.forEach((e) => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.inventarisArtifact, state.transaksiArtifact]);

  return (
    <EthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
