import Dialog from "components/GRComponents/Dialog";
import React, { createContext, useCallback, useState } from "react";

const defaultValue = {
  visible: false,
  canClose: true,
  image: [],
  contentTitle: [],
  content: [],
  description: "",
  hasCheck: false,
  checkMessage: "",
  onConfirm: () => {},
};

export const DialogContext = createContext(defaultValue);

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState(defaultValue);

  const show = useCallback((options) => {
    setDialog({ ...options, visible: true });
  }, []);

  const hide = useCallback(() => {
    setDialog((previous) => ({ ...previous, visible: false }));
  }, []);

  return (
    <DialogContext.Provider value={{ show, hide }}>
      {children}
      <Dialog {...dialog} />
    </DialogContext.Provider>
  );
}
