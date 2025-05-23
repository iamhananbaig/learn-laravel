import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { DateTime } from 'luxon';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: 'permissions',
    },
];

type Permission = {
    id: number;
    name: string;
    created_at: string;
};

type Props = {
    permissions: {
        data: Permission[];
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

export default function Permissions() {
    const { props } = usePage<Props>();
    const { permissions, success } = props;
    useEffect(() => {
        if (success) {
            toast.success('Success', {
                description: success,
            });
        }
    }, [success]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
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
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {permissions.data.length ? (
                                    permissions.data.map((permission, index) => (
                                        <TableRow key={permission.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{permission.name}</TableCell>
                                            <TableCell>
                                                {DateTime.fromISO(permission.created_at, { zone: 'utc' }).toLocal().toFormat('dd-MMM-yyyy hh :mm a')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        className="cursor-pointer"
                                                        onClick={() => router.visit(`/permissions/${permission.id}/edit`)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            if (window.confirm('Are you sure you want to delete this permission?')) {
                                                                router.delete(`/permissions/${permission.id}/delete`);
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
                                            No permissions found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <Pagination>
                            <PaginationContent>
                                {permissions.links.map((link, index) => (
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
