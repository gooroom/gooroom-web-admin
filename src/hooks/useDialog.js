import { DialogContext } from "../contexts/dialog";
import { useContext } from "react";

export default function useDialog() {
  const { show, hide } = useContext(DialogContext);
  return { show, hide };
}
