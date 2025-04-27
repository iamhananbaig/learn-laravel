import { Badge } from '@/components/ui/badge';
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
        title: 'Vendors',
        href: 'vendors',
    },
];

type Vendor = {
    id: number;
    name: string;
    ntn: string;
    status: boolean;
    created_by: { id: number; name: string };
    updated_by: { id: number; name: string };
    created_at: string;
    updated_at: string;
};

type Props = {
    vendors: {
        data: Vendor[];
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

export default function Vendors() {
    const { props } = usePage<Props>();
    const { vendors, success } = props;
    useEffect(() => {
        if (success) {
            toast.success('Success', {
                description: success,
            });
        }
    }, [success]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vendors" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="mx-auto w-full max-w-6xl p-6 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-center text-lg font-semibold">Vendor List</CardTitle>

                        <Button className="w-min" onClick={() => router.visit('/vendors/create')}>
                            Create
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>NTN</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created By</TableHead>
                                    <TableHead>Updated By</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Updated At</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendors.data.length ? (
                                    vendors.data.map((vendor, index) => (
                                        <TableRow key={vendor.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{vendor.name}</TableCell>
                                            <TableCell>{vendor.ntn}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-white hover:animate-pulse ${vendor.status ? 'bg-green-700' : 'bg-red-700'}`}
                                                >
                                                    {vendor.status ? 'Active' : 'Disabled'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{vendor.created_by?.name}</TableCell>
                                            <TableCell>{vendor.updated_by?.name}</TableCell>
                                            <TableCell>
                                                {DateTime.fromISO(vendor.created_at, { zone: 'utc' }).toLocal().toFormat('dd-MMM-yyyy hh:mm')}
                                            </TableCell>
                                            <TableCell>
                                                {DateTime.fromISO(vendor.updated_at, { zone: 'utc' }).toLocal().toFormat('dd-MMM-yyyy hh:mm')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        className="cursor-pointer"
                                                        onClick={() => router.visit(`/vendors/${vendor.id}/edit`)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            if (window.confirm('Are you sure you want to delete this vendor?')) {
                                                                router.delete(`/vendors/${vendor.id}/delete`);
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
                                            No vendors found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <Pagination>
                            <PaginationContent>
                                {vendors.links.map((link, index) => (
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
