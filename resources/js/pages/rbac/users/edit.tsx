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
        title: 'Edit User',
        href: 'users/edit',
    },
];

const FormSchema = z.object({
    name: z.string().min(3, {
        message: 'Name must be at least 3 characters.',
    }),
    email: z.string().email({
        message: 'must be a valid email.',
    }),
    designation: z.string().min(3, {
        message: 'must be atleast 3 characters.',
    }),
    banned: z.boolean(),
    roles: z.array(z.number()).optional(),
});

export default function EditUser() {
    // Get server-side errors passed from Inertia response
    const { props } = usePage();
    const serverErrors = props.errors;
    const user = props.user as { id: number; name: string; email: string; banned: boolean; designation: string };
    const hasroles = props.hasroles as number[];
    const roles = props.roles as { id: number; name: string }[];

    // Setup react-hook-form with zod validation
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: user.name,
            designation: user.designation,
            email: user.email,
            roles: hasroles,
            banned: Boolean(user.banned),
        },
    });

    // Form submission handler
    function onSubmit(data: z.infer<typeof FormSchema>) {
        router.put(`/users/${user.id}`, data);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="m-auto w-full max-w-xl">
                    <CardHeader>
                        <CardTitle className="text-center text-lg font-semibold">Edit User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Name" {...field} />
                                            </FormControl>

                                            <FormMessage>{form.formState.errors.name?.message || serverErrors?.name}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage>{form.formState.errors.email?.message || serverErrors?.email}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="designation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Designation</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Designation" {...field} />
                                            </FormControl>

                                            <FormMessage>{form.formState.errors.designation?.message || serverErrors?.designation}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="roles"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Roles</FormLabel>
                                            <div className="space-y-4">
                                                <div className="flex flex-wrap gap-4">
                                                    {roles.map((role) => {
                                                        const isChecked = field.value?.includes(role.id) ?? false;
                                                        return (
                                                            <label key={role.id} className="flex items-center space-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            field.onChange([...(field.value ?? []), role.id]);
                                                                        } else {
                                                                            field.onChange((field.value ?? []).filter((id) => id !== role.id));
                                                                        }
                                                                    }}
                                                                />
                                                                <span>{role.name}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="banned"
                                    render={({ field }) => {
                                        const isBanned = field.value;
                                        return (
                                            <FormItem className="flex flex-col space-y-2">
                                                <FormLabel>Ban</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center gap-4">
                                                        <Switch
                                                            checked={isBanned}
                                                            onCheckedChange={field.onChange}
                                                            className={
                                                                isBanned
                                                                    ? 'bg-red-700 data-[state=checked]:bg-red-700'
                                                                    : 'bg-green-700 data-[state=unchecked]:bg-green-700'
                                                            }
                                                        />
                                                        <span className={isBanned ? 'text-red-700' : 'text-green-700'}>
                                                            {isBanned ? 'Banned' : 'Active'}
                                                        </span>
                                                    </div>
                                                </FormControl>
                                                <FormMessage>{form.formState.errors.banned?.message || serverErrors?.banned}</FormMessage>
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
