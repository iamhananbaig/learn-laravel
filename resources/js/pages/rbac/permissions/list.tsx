import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Head, router, usePage } from '@inertiajs/react';

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
    console.log('Permissions:', props);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {success && <div className="rounded-md bg-green-100 px-4 py-2 text-green-800">{success}</div>}
                <Card className="m-auto w-full max-w-xl">
                    <CardHeader>
                        <CardTitle className="text-center text-lg font-semibold">Permissions List</CardTitle>

                        <Button className="w-min" onClick={() => router.visit('/permissions/create')}>
                            Create
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <table className="mt-4 w-full table-auto border-collapse border border-gray-200">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Created At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.data.length ? (
                                    permissions.data.map((permission, index) => (
                                        <tr key={permission.id}>
                                            <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                                            <td className="border border-gray-200 px-4 py-2">{permission.name}</td>
                                            <td className="border border-gray-200 px-4 py-2">
                                                {new Date(permission.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-2">
                                                <Button onClick={() => router.visit(`/permissions/${permission.id}/edit`)}>Edit</Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center">
                                            No permissions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <Pagination>
                            <PaginationContent>
                                {/* Previous Button */}
                                {permissions.prev_page_url && (
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={permissions.prev_page_url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.visit(permissions.prev_page_url as string);
                                            }}
                                        />
                                    </PaginationItem>
                                )}

                                {/* Page Numbers with Ellipsis */}
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
                                                {link.label.replace(/&raquo;|&laquo;/g, '')} {/* Clean up special chars */}
                                            </PaginationLink>
                                        ) : (
                                            <span className="px-2">...</span>
                                        )}
                                    </PaginationItem>
                                ))}

                                {/* Next Button */}
                                {permissions.next_page_url && (
                                    <PaginationItem>
                                        <PaginationNext
                                            href={permissions.next_page_url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.visit(permissions.next_page_url as string);
                                            }}
                                        />
                                    </PaginationItem>
                                )}
                            </PaginationContent>
                        </Pagination>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
