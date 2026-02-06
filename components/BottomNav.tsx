"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Briefcase, MapPin } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/schedule", label: "Plan", icon: Calendar },
    { href: "/packing", label: "Pack", icon: Briefcase },
    { href: "/spots", label: "Spots", icon: MapPin },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="z-50 shrink-0 relative">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-white/20 shadow-lg" />

            <div className="relative flex justify-around items-center h-20 pb-4 safe-area-bottom">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex flex-col items-center justify-center p-2 w-16 transition-colors duration-300",
                                isActive ? "text-primary" : "text-muted hover:text-foreground/80"
                            )}
                        >
                            <item.icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 1.5}
                                className={clsx("transition-transform duration-300", isActive && "scale-110")}
                            />
                            <span className="text-[10px] font-medium mt-1 tracking-wide">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
