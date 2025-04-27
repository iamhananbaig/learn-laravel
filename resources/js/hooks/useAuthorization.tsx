// hooks/useAuthorization.js
import { usePage } from '@inertiajs/react';

export default function useAuthorization() {
    const { props } = usePage();
    const roles = (props.r as string[]) || [];
    const permissions = (props.p as string[]) || [];
    const isSuperuser = roles.includes('superadmin');

    const can = (permission: string) => isSuperuser || permissions.includes(permission);

    return { can };
}
