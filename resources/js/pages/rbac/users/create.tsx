import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Role',
        href: 'roles/create',
    },
];

const FormSchema = z.object({
    name: z.string().min(3, {
        message: 'Role Name must be at least 3 characters.',
    }),
    permissions: z.array(z.number()).optional(),
});

export default function CreateRole() {
    // Get server-side errors passed from Inertia response
    const { props } = usePage();
    const serverErrors = props.errors;
    const permissions = props.permissions as { id: number; name: string }[];
    const groupedPermissions = groupPermissions(permissions);

    // Setup react-hook-form with zod validation
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            permissions: [],
        },
    });

    // Form submission handler
    function onSubmit(data: z.infer<typeof FormSchema>) {
        router.post('/roles', data);
    }

    function groupPermissions(permissions: { id: number; name: string }[]) {
        const grouped: Record<string, { id: number; name: string; label: string }[]> = {};

        permissions.forEach((perm) => {
            const label = perm.name.replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

            const groupKey = label.split(' ').pop() ?? 'Other';

            if (!grouped[groupKey]) {
                grouped[groupKey] = [];
            }

            grouped[groupKey].push({ ...perm, label });
        });

        return grouped;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="m-auto w-full max-w-xl">
                    <CardHeader>
                        <CardTitle className="text-center text-lg font-semibold">Create Role</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Role Name" {...field} />
                                            </FormControl>

                                            <FormMessage>{form.formState.errors.name?.message || serverErrors?.name}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="permissions"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Permissions</FormLabel>
                                            <div className="space-y-4">
                                                {Object.entries(groupedPermissions).map(([group, groupPerms]) => (
                                                    <div key={group}>
                                                        <h4 className="mb-1 font-semibold">{group}</h4>
                                                        <div className="flex flex-wrap gap-4">
                                                            {groupPerms.map((perm) => {
                                                                const isChecked = field.value?.includes(perm.id) ?? false;

                                                                return (
                                                                    <label key={perm.id} className="flex items-center space-x-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isChecked}
                                                                            onChange={(e) => {
                                                                                if (e.target.checked) {
                                                                                    field.onChange([...(field.value ?? []), perm.id]);
                                                                                } else {
                                                                                    field.onChange(
                                                                                        (field.value ?? []).filter((id) => id !== perm.id),
                                                                                    );
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span>{perm.label}</span>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
