"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormControl, FormMessage } from "@/components/ui/form";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-firebase-auth";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "E-mail é obrigatório" })
    .email({ message: "E-mail inválido" }),
  password: z
    .string()
    .trim()
    .min(1, { message: "Senha é obrigatória" }),
});

const LoginForm = () => {
  const { signIn, authLoading } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const redirectUser = (role: string) => {
    const targetUrl = role === "admin" ? "/dashboard" : "/user-dashboard";
    console.log(`Redirecionando para: ${targetUrl}`);

    // Usar window.location para forçar navegação completa
    window.location.href = targetUrl;
  };

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    console.log("=== INICIANDO LOGIN ===");
    console.log("Email:", values.email);

    const result = await signIn(values.email, values.password);

    console.log("=== RESULTADO DO LOGIN ===");
    console.log("Result completo:", result);
    console.log("Success:", result.success);
    console.log("User:", result.user);
    console.log("User role:", result.user?.role);

    if (result.success && result.user) {
      console.log("=== REDIRECIONANDO ===");
      // Redirecionamento imediato após login bem-sucedido
      redirectUser(result.user.role);
    } else {
      console.log("=== LOGIN FALHOU ===");
      console.log("Motivo:", result.error);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Faça login para continuar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu e-mail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite sua senha"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={authLoading}
              >
                {authLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Entrar"
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LoginForm;
