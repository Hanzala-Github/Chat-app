// // import React, { StrictMode } from "react";
// // import { createRoot } from "react-dom/client";
// // import "./index.css";
// // import App from "./App.jsx";
// // import { BrowserRouter } from "react-router-dom";
// // createRoot(document.getElementById("root")).render(
// //   // <StrictMode>
// //   <BrowserRouter>
// //     <App />
// //   </BrowserRouter>
// //   // </StrictMode>
// // );

// import React, { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { BrowserRouter } from "react-router-dom";

// // TanStack Query imports
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { persistQueryClient } from "@tanstack/react-query-persist-client";
// import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

// // Create QueryClient instance
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: false, // helpful while debugging
//     },
//   },
// });

// // Setup localStorage persister
// // const localStoragePersister = createSyncStoragePersister({
// //   storage: window.localStorage,
// // });

// // Enable persistence for queries

// persistQueryClient({
//   queryClient,
//   persister: createSyncStoragePersister({ storage: window.localStorage }),
//   maxAge: 1000 * 60 * 60 * 24,
// });

// createRoot(document.getElementById("root")).render(
//   // <StrictMode>
//   <BrowserRouter>
//     <QueryClientProvider client={queryClient}>
//       <App />
//     </QueryClientProvider>
//   </BrowserRouter>
//   // </StrictMode>
// );

// ..........................................................................//
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

// TanStack Query imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* Optional Devtools (remove in production) */}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
  // </StrictMode>
);
