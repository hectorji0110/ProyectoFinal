import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
/**
 * Componente: Button
 *
 * @description
 * Este componente genera un botón reutilizable altamente configurable utilizando:
 *
 * El objetivo es tener un componente de botón uniforme, extensible y consistente
 * para toda la aplicación, evitando repetición de clases y permitiendo temas
 * como modo oscuro.
 *
 */
const buttonVariants = cva(
  // Estilos base comunes para todos los botones
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        //  Botón principal naranja
        default:
          "bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600",
        //  Contorno (solo borde naranja, fondo transparente)
        outline:
          "border border-orange-500 text-orange-500 hover:bg-orange-100 dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-900/40 focus-visible:ring-orange-400",
        //  Transparente, ideal para enlaces de menú
        ghost:
          "bg-transparent text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800 focus-visible:ring-orange-400",
        //  Enlace con subrayado
        link: "text-orange-500 underline-offset-4 hover:underline dark:text-orange-400 focus-visible:ring-orange-400",
        //  Acción destructiva
        destructive:
          "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus-visible:ring-red-500",
      },
      size: {
        default: "h-10 px-5 text-sm",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    // Valores por defecto si no se pasan props
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button, buttonVariants };
