import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast border shadow-lg",

          success: "bg-green-600 text-white border-green-500",

          description: "group-[.toast]:text-green-100",

          actionButton: "group-[.toast]:bg-white group-[.toast]:text-green-700",

          cancelButton: "group-[.toast]:bg-green-700 group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
