"use client";

import { useTheme } from "next-themes@0.4.6";
import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: theme === 'dark'
            ? 'bg-slate-800 text-white border-slate-700 shadow-xl'
            : 'bg-white text-slate-900 border-slate-200 shadow-lg',
          title: theme === 'dark' ? 'text-white font-semibold' : 'text-slate-900 font-semibold',
          description: theme === 'dark' ? 'text-slate-300' : 'text-slate-600',
          actionButton: 'bg-[#21DBA4] text-white',
          cancelButton: theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
