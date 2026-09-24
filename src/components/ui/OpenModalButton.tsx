"use client";

import { ReactNode } from 'react';
import { useLeadModal, type LeadModalConfig } from '@/components/Forms/LeadModalContext';
import { Button, ButtonProps } from '@/components/ui/Button';

interface OpenModalButtonProps extends ButtonProps {
    children: ReactNode;
    // The modal owns the shape of its own config; mirroring a subset here meant
    // every new option had to be added in two places.
    config?: LeadModalConfig;
}

export default function OpenModalButton({ children, config, onClick, ...props }: OpenModalButtonProps) {
    const { openModal } = useLeadModal();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        openModal(config);
        if (onClick) onClick(e);
    };

    return (
        <Button onClick={handleClick} {...props}>
            {children}
        </Button>
    );
}
