import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { HausThemeProvider } from "@daohaus/ui";
import { HAUS_NETWORK_DATA } from "@daohaus/keychain-utils";

import { App } from "./App";
import { lunarDarkTheme } from "./themes/lunar";
import "./App.css";

// import { Buffer } from "buffer";
// // This solves an issue when using WalletConnect and intercept Txs to create dao proposals
// // Related open issue: https://github.com/WalletConnect/walletconnect-monorepo/issues/748
// window.Buffer = window.Buffer || Buffer;

export const supportedNetorks = {
  // "0x5": HAUS_NETWORK_DATA["0x5"],
  // "0x1": HAUS_NETWORK_DATA["0x1"],
  // "0xa": HAUS_NETWORK_DATA["0xa"],
  // "0xaa36a7": HAUS_NETWORK_DATA["0xaa36a7"],
  "0xa4b1": HAUS_NETWORK_DATA["0xa4b1"],
};

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <QueryClientProvider client={queryClient}>

          <HausThemeProvider defaultDark={lunarDarkTheme}>
            <App />
          </HausThemeProvider>

      </QueryClientProvider>
    </HashRouter>
  </React.StrictMode>
);
