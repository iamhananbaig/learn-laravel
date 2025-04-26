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
        title: 'Create User',
        href: 'users/create',
    },
];

const FormSchema = z.object({
    name: z.string().min(3, {
        message: 'Name must be at least 3 characters.',
    }),
    email: z.string().email({
        message: 'must be a valid email.',
    }),
    password: z.string().min(6, {
        message: 'must be atleast 6 characters.',
    }),
    confirm_password: z.string().min(6, {
        message: 'must be atleast 6 characters.',
    }),
    banned: z.boolean(),
    roles: z.array(z.number()).optional(),
});

export default function EditUser() {
    // Get server-side errors passed from Inertia response
    const { props } = usePage();
    const serverErrors = props.errors;
    const roles = props.roles as { id: number; name: string }[];

    // Setup react-hook-form with zod validation
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirm_password: '',
            roles: [],
            banned: false,
        },
    });

    // Form submission handler
    function onSubmit(data: z.infer<typeof FormSchema>) {
        router.post(`/users`, data);
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
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Password" {...field} />
                                            </FormControl>
                                            <FormMessage>{form.formState.errors.password?.message || serverErrors?.password}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirm_password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Confirm Password" {...field} />
                                            </FormControl>
                                            <FormMessage>
                                                {form.formState.errors.confirm_password?.message || serverErrors?.confirm_password}
                                            </FormMessage>
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
                                                                    ? 'bg-red-500 data-[state=checked]:bg-red-600'
                                                                    : 'bg-green-500 data-[state=unchecked]:bg-green-600'
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
