"use client";

import { Dialog, DialogContent } from "@mui/material";

interface ModalBaseProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalBase({ open, onClose, children }: ModalBaseProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}