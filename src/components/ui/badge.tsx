import React from "react";

interface BadgeProps {
    children: React.ReactNode
    variant?: 'pale' | 'outline' | 'mint'
    className?: string
}

export function Badge ({ children, variant = 'pale', className = '' }: BadgeProps) {
    const baseStyle = 'inline-flex items-center px-3 py-1 text-xs font-medium rounded-full transition-colors'

    const variants = {
        pale: 'bg-[#def4c6] text-[#1b512d]',
        outline: 'border border-[#e3e8de] text-gray-700 bg-white',
        mint: 'bg-[#73e2a7]/20 text-[#00623f]',
    }
    
    return (
        <span className={`${baseStyle} ${variants[variant]} ${className}`}>
            {children}
        </span>
    )
}
