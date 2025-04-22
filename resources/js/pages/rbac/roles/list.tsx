import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: 'roles',
    },
];

type Role = {
    id: number;
    name: string;
    permissions: { id: number; name: string }[];
};

type Props = {
    roles: {
        data: Role[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    success?: string;
};

export default function Roles() {
    const { props } = usePage<Props>();
    const { roles, success } = props;
    useEffect(() => {
        if (success) {
            toast.success('Success', {
                description: success,
            });
        }
    }, [success]);
    console.log('Roles:', roles);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="mx-auto w-full max-w-6xl p-6 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-center text-lg font-semibold">Permissions List</CardTitle>

                        <Button className="w-min" onClick={() => router.visit('/permissions/create')}>
                            Create
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Permissions</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.data.length ? (
                                    roles.data.map((role, index) => (
                                        <TableRow key={role.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{role.name}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {role.permissions.map((p) => (
                                                        <Badge
                                                            key={p.id}
                                                            variant="outline"
                                                            className="hover:bg-accent-foreground hover:animate-pulse hover:text-white dark:hover:text-black"
                                                        >
                                                            {p.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        className="cursor-pointer hover:animate-pulse"
                                                        onClick={() => router.visit(`/roles/${role.id}/edit`)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        className="cursor-pointer hover:animate-pulse"
                                                        onClick={() => {
                                                            if (window.confirm('Are you sure you want to delete this role?')) {
                                                                router.delete(`/roles/${role.id}/delete`);
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            No roles found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <Pagination>
                            <PaginationContent>
                                {roles.links.map((link, index) => (
                                    <PaginationItem key={index}>
                                        {link.url ? (
                                            <PaginationLink
                                                href={link.url}
                                                isActive={link.active}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.visit(link.url!);
                                                }}
                                            >
                                                {link.label.replace(/&raquo;|&laquo;/g, '')}
                                            </PaginationLink>
                                        ) : null}
                                    </PaginationItem>
                                ))}
                            </PaginationContent>
                        </Pagination>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
