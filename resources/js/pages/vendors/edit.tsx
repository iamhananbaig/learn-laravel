import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Vendors',
        href: 'vendors/edit',
    },
];

const FormSchema = z.object({
    name: z.string().min(3, {
        message: 'Vendor Name must be at least 3 characters.',
    }),
    ntn: z.string().min(3, {
        message: 'NTN must be at least 3 characters.',
    }),
    status: z.boolean(),
});

type Vendor = {
    id: number;
    name: string;
    ntn: string;
    status: boolean;
};

export default function EditPermission() {
    // Get server-side errors passed from Inertia response
    const { props } = usePage<{ vendor: Vendor; errors: Record<string, string> }>();
    const serverErrors = props.errors;
    const vendor = props.vendor;

    // Setup react-hook-form with zod validation
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: vendor.name,
            ntn: vendor.ntn,
            status: Boolean(vendor.status),
        },
    });

    // Form submission handler
    function onSubmit(data: z.infer<typeof FormSchema>) {
        router.put(`/vendors/${vendor.id}`, data);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vendors" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="m-auto w-full max-w-xl">
                    <CardHeader>
                        <CardTitle className="text-center text-lg font-semibold">Edit Vendor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vendor Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Vendor Name" {...field} />
                                            </FormControl>
                                            <FormMessage>{form.formState.errors.name?.message || serverErrors?.name}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="ntn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>NTN / CNIC</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Vendor's NTN / CNIC" {...field} />
                                            </FormControl>
                                            <FormMessage>{form.formState.errors.ntn?.message || serverErrors?.ntn}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => {
                                        const isActive = field.value;

                                        return (
                                            <FormItem className="flex flex-col space-y-2">
                                                <FormLabel>Status</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center gap-4">
                                                        <Switch
                                                            checked={isActive}
                                                            onCheckedChange={field.onChange}
                                                            className={
                                                                isActive
                                                                    ? 'bg-green-500 data-[state=checked]:bg-green-600'
                                                                    : 'bg-red-500 data-[state=unchecked]:bg-red-600'
                                                            }
                                                        />
                                                        <span className={isActive ? 'text-green-700' : 'text-red-700'}>
                                                            {isActive ? 'Active' : 'Disabled'}
                                                        </span>
                                                    </div>
                                                </FormControl>
                                                <FormMessage>{form.formState.errors.status?.message || serverErrors?.status}</FormMessage>
                                            </FormItem>
                                        );
                                    }}
                                />

                                <Button type="submit">Update</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
