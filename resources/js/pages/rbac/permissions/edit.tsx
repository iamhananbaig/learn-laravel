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
        title: 'Edit Permission',
        href: 'permissions/edit',
    },
];

const FormSchema = z.object({
    name: z.string().refine(
        (val) => {
            return val.trim().split(/\s+/).length === 2;
        },
        {
            message: 'Permission Name must be two words.',
        },
    ),
});

type Permission = {
    id: number;
    name: string;
};

export default function EditPermission() {
    // Get server-side errors passed from Inertia response
    const { props } = usePage<{ permission: Permission; errors: Record<string, string> }>();
    const serverErrors = props.errors;
    const permission = props.permission;

    // Setup react-hook-form with zod validation
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: permission.name || '',
        },
    });

    // Form submission handler
    function onSubmit(data: z.infer<typeof FormSchema>) {
        router.put(`/permissions/${permission.id}`, data);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="m-auto w-full max-w-xl">
                    <CardHeader>
                        <CardTitle className="text-center text-lg font-semibold">Edit Permission</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Permission Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="resource permission" {...field} />
                                            </FormControl>

                                            <FormMessage>{form.formState.errors.name?.message || serverErrors?.name}</FormMessage>
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
