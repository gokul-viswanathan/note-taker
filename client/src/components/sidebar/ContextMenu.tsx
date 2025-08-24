import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/stores/states';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

type Props = {
    position: { x: number; y: number };
    item: any;
    onClose: () => void;
};

export function CustomContextMenu({ position, item, onClose }: Props) {
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Menu action handlers
    const createFolder = () => {
        console.log('Create Folder', item);
        useStore.getState().setIsCreateFolderOpen?.(true);
    };

    const createFile = () => {
        console.log('Create File');
        //just toggle states,
    };

    const handleDelete = () => {
        console.log('Delete action');

    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>Right click</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>Profile</ContextMenuItem>
                <ContextMenuItem>Billing</ContextMenuItem>
                <ContextMenuItem>Team</ContextMenuItem>
                <ContextMenuItem>Subscription</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );

}

export default CustomContextMenu;
