import { FileItem } from '@/types/git-interface';

export default function updateFileItemChildren(
    tree: FileItem[],
    targetPath: string,
    newChildren: FileItem[]
): FileItem[] {
    return tree.map(item => {
        if (item.path === targetPath && item.type === 'dir') {
            return {
                ...item,
                children: newChildren
            };
        }

        if (item.children) {
            return {
                ...item,
                children: updateFileItemChildren(item.children, targetPath, newChildren)
            };
        }

        return item;
    });
}

