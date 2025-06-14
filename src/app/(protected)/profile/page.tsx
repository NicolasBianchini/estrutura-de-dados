"use client";

import { Edit, Mail, User, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PageContainer,
    PageContent,
    PageDescription,
    PageHeader,
    PageHeaderContent,
    PageTitle,
} from "@/components/ui/page-container";
import { useAuth } from "@/hooks/use-firebase-auth";

const ProfilePage = () => {
    const { userData } = useAuth();

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Meu Perfil</PageTitle>
                    <PageDescription>
                        Visualize e gerencie suas informações pessoais.
                    </PageDescription>
                </PageHeaderContent>
            </PageHeader>

            <PageContent>
                <div className="max-w-2xl space-y-6">
                    {/* Informações Pessoais */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />
                                Informações Pessoais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                                    <p className="text-sm mt-1">{userData?.name || "Não informado"}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">E-mail</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm">{userData?.email || "Não informado"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Edit className="h-4 w-4" />
                                    Editar Informações
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informações da Conta */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5 text-blue-600" />
                                Informações da Conta
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tipo de Conta</label>
                                    <p className="text-sm mt-1 capitalize">
                                        {userData?.role === "admin" ? "Administrador" : "Usuário"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Data de Cadastro</label>
                                    <p className="text-sm mt-1">
                                        {userData?.createdAt
                                            ? new Date(userData.createdAt).toLocaleDateString('pt-BR')
                                            : "Não informado"
                                        }
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Última Atualização</label>
                                <p className="text-sm mt-1">
                                    {userData?.updatedAt
                                        ? new Date(userData.updatedAt).toLocaleDateString('pt-BR')
                                        : "Não informado"
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Configurações de Segurança */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5 text-blue-600" />
                                Segurança
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Senha</label>
                                <p className="text-sm mt-1 text-muted-foreground">••••••••</p>
                            </div>

                            <div className="pt-4 border-t space-y-2">
                                <Button variant="outline" className="flex items-center gap-2 w-full md:w-auto">
                                    <Edit className="h-4 w-4" />
                                    Alterar Senha
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </PageContent>
        </PageContainer>
    );
};

export default ProfilePage; 