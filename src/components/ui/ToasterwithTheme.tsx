"use client";
import { useTheme } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const ToasterwithTheme = () => {
  const { theme } = useTheme();
  return (
    <Toaster
      richColors
      closeButton
      theme={theme === "dark" ? "dark" : "light"}
    />
  );
};

export default ToasterwithTheme;
