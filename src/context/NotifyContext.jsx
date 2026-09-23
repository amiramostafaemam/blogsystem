import { createContext, useCallback, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotifyContext = createContext();

export function NotifyProvider({ children }) {
  const [toast, setToast] = useState(null);

  // notify("Saved!") or notify("Something broke", "error")
  const notify = useCallback((message, severity = "success") => {
    setToast({ message, severity, key: Date.now() });
  }, []);

  const handleClose = (_, reason) => {
    if (reason !== "clickaway") setToast(null);
  };

  return (
    <NotifyContext.Provider value={notify}>
      {children}
      <Snackbar
        key={toast?.key}
        open={Boolean(toast)}
        autoHideDuration={3500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={toast?.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </NotifyContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotify() {
  return useContext(NotifyContext);
}
