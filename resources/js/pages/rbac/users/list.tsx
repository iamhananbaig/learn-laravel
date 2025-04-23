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
        title: 'Users',
        href: 'users',
    },
];

type User = {
    id: number;
    name: string;
    email: string;
    roles: { name: string }[];
    created_at: string;
};

type Props = {
    users: {
        data: User[];
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

export default function Users() {
    const { props } = usePage<Props>();
    const { users, success } = props;
    console.log(props);

    useEffect(() => {
        if (success) {
            toast.success('Success', {
                description: success,
            });
        }
    }, [success]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="mx-auto w-full max-w-6xl p-6 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-center text-lg font-semibold">Users List</CardTitle>

                        <Button className="w-min" onClick={() => router.visit('/users/create')}>
                            Create
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Roles</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length ? (
                                    users.data.map((user, index) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((r) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                            className="hover:bg-accent-foreground hover:animate-pulse hover:text-white dark:hover:text-black"
                                                        >
                                                            {r.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {DateTime.fromISO(user.created_at, { zone: 'utc' }).toLocal().toFormat('dd-MMM-yyyy')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        className="cursor-pointer hover:animate-pulse"
                                                        onClick={() => router.visit(`/users/${user.id}/edit`)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        className="cursor-pointer hover:animate-pulse"
                                                        onClick={() => {
                                                            if (window.confirm('Are you sure you want to delete this user?')) {
                                                                router.delete(`/users/${user.id}/delete`);
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
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <Pagination>
                            <PaginationContent>
                                {users.links.map((link, index) => (
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
