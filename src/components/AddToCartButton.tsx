"use client";

import { useCart, type CartItem } from "@/contexts/CartContext";
import { ShoppingCart, Check } from "lucide-react";

interface AddToCartButtonProps {
  item: Omit<CartItem, "addedAt">;
  className?: string;
  variant?: "primary" | "secondary" | "small";
}

export default function AddToCartButton({ 
  item, 
  className = "", 
  variant = "primary" 
}: AddToCartButtonProps) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(item.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inCart) {
      addToCart(item);
    }
  };

  const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300";
  
  const variantClasses = {
    primary: inCart
      ? "bg-[var(--success)] hover:bg-[var(--success)]/90 text-[var(--bg)] px-8 py-4 rounded-full shadow-lg shadow-[var(--success)]/25 hover:shadow-xl"
      : "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--bg)] px-8 py-4 rounded-full shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5",
    secondary: inCart
      ? "bg-[var(--success)]/10 text-[var(--success)] border-2 border-[var(--success)]/30 px-5 py-2.5 rounded-full"
      : "bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] border-2 border-[var(--btn-secondary-border)] hover:border-[var(--primary)] px-5 py-2.5 rounded-full hover:bg-[var(--btn-secondary-hover)]",
    small: inCart
      ? "bg-[var(--success)] text-[var(--bg)] px-4 py-2 rounded-full text-sm"
      : "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--bg)] px-4 py-2 rounded-full text-sm shadow-md shadow-[var(--primary)]/20 hover:shadow-lg hover:-translate-y-0.5",
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={inCart}
    >
      {inCart ? (
        <>
          <Check className="w-5 h-5" />
          <span>Added to Cart</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}
