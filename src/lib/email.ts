import nodemailer from 'nodemailer';

// Verificar se as variáveis de ambiente estão configuradas
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Erro: Variáveis de ambiente EMAIL_USER e/ou EMAIL_PASS não configuradas');
    console.error('Por favor, crie um arquivo .env.local na raiz do projeto com as seguintes variáveis:');
    console.error('EMAIL_USER=seu-email@gmail.com');
    console.error('EMAIL_PASS=sua-senha-de-app');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // Configurações adicionais para melhorar a entrega
    pool: true, // Usar conexões em pool
    maxConnections: 1, // Limitar a uma conexão por vez
    maxMessages: 3, // Limitar mensagens por conexão
    rateDelta: 1000, // Intervalo entre mensagens (1 segundo)
    rateLimit: 3 // Limite de mensagens por segundo
});

interface AppointmentData {
    userName: string;
    userEmail: string;
    lawyerName: string;
    preferredDate: string;
    preferredTime: string;
    description: string;
    notes?: string;
}

export async function sendAppointmentConfirmationEmail(appointment: AppointmentData) {
    console.log('=== Iniciando envio de email ===');
    console.log('Dados do agendamento:', appointment);
    console.log('Configuração do email:', {
        from: process.env.EMAIL_USER,
        to: appointment.userEmail
    });

    const mailOptions = {
        from: {
            name: 'FGJN Advocacia',
            address: process.env.EMAIL_USER || ''
        },
        to: appointment.userEmail,
        subject: 'Confirmação de Consulta - FGJN Advocacia',
        // Adicionar cabeçalhos para melhorar a entrega
        headers: {
            'X-Entity-Ref-ID': `appointment_${Date.now()}`,
            'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
            'Precedence': 'bulk',
            'X-Auto-Response-Suppress': 'OOF, AutoReply'
        },
        // Adicionar texto plano como fallback
        text: `
            Confirmação de Consulta - FGJN Advocacia

            Olá ${appointment.userName},

            Temos o prazer de informar que sua consulta foi confirmada com sucesso.

            Detalhes da Consulta:
            - Advogado: Dr. ${appointment.lawyerName}
            - Data: ${new Date(appointment.preferredDate).toLocaleDateString('pt-BR')}
            - Horário: ${appointment.preferredTime}
            - Descrição do caso: ${appointment.description}

            Informações Importantes:
            - Chegue com 10 minutos de antecedência
            - Traga documentos relevantes ao seu caso
            - Em caso de necessidade de reagendamento, entre em contato com pelo menos 24h de antecedência

            Para reagendar ou cancelar sua consulta, entre em contato conosco:
            Email: ${process.env.EMAIL_USER}

            Este é um email automático, por favor não responda.
            © ${new Date().getFullYear()} FGJN Advocacia. Todos os direitos reservados.
        `,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1a365d; margin: 0;">FGJN Advocacia</h1>
                    <p style="color: #4a5568; margin: 5px 0;">Sua consulta foi confirmada!</p>
                </div>

                <div style="background-color: #f7fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                    <p style="margin: 0 0 15px 0;">Olá <strong>${appointment.userName}</strong>,</p>
                    <p style="margin: 0 0 15px 0;">Temos o prazer de informar que sua consulta foi confirmada com sucesso.</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h2 style="color: #2d3748; font-size: 18px; margin-bottom: 15px;">Detalhes da Consulta</h2>
                    <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px;">
                        <p style="margin: 5px 0;"><strong>Advogado:</strong> Dr. ${appointment.lawyerName}</p>
                        <p style="margin: 5px 0;"><strong>Data:</strong> ${new Date(appointment.preferredDate).toLocaleDateString('pt-BR')}</p>
                        <p style="margin: 5px 0;"><strong>Horário:</strong> ${appointment.preferredTime}</p>
                        <p style="margin: 5px 0;"><strong>Descrição do caso:</strong></p>
                        <p style="margin: 5px 0; padding: 10px; background-color: #fff; border-radius: 4px;">${appointment.description}</p>
                    </div>
                </div>

                <div style="background-color: #ebf8ff; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                    <h3 style="color: #2c5282; font-size: 16px; margin: 0 0 10px 0;">Informações Importantes</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #4a5568;">
                        <li>Chegue com 10 minutos de antecedência</li>
                        <li>Traga documentos relevantes ao seu caso</li>
                        <li>Em caso de necessidade de reagendamento, entre em contato com pelo menos 24h de antecedência</li>
                    </ul>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; color: #4a5568;">Para reagendar ou cancelar sua consulta, entre em contato conosco:</p>
                    <p style="margin: 5px 0; color: #2d3748;"><strong>Email:</strong> ${process.env.EMAIL_USER}</p>
                </div>

                <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #718096;">
                    <p style="margin: 0;">Este é um email automático, por favor não responda.</p>
                    <p style="margin: 5px 0;">© ${new Date().getFullYear()} FGJN Advocacia. Todos os direitos reservados.</p>
                </div>
            </div>
        `
    };

    try {
        console.log('Tentando enviar email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado com sucesso:', info.response);
        return true;
    } catch (error) {
        console.error('Erro detalhado ao enviar email:', error);
        if (error instanceof Error) {
            console.error('Mensagem de erro:', error.message);
            console.error('Stack trace:', error.stack);
        }
        return false;
    }
}

export async function sendAppointmentCancellationEmail(appointment: AppointmentData) {
    console.log('=== Iniciando envio de email de cancelamento ===');
    console.log('Dados do agendamento:', appointment);

    const mailOptions = {
        from: {
            name: 'FGJN Advocacia',
            address: process.env.EMAIL_USER || ''
        },
        to: appointment.userEmail,
        subject: 'Cancelamento de Consulta - FGJN Advocacia',
        headers: {
            'X-Entity-Ref-ID': `cancel_${Date.now()}`,
            'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
            'Precedence': 'bulk',
            'X-Auto-Response-Suppress': 'OOF, AutoReply'
        },
        text: `
            Cancelamento de Consulta - FGJN Advocacia

            Olá ${appointment.userName},

            Informamos que sua consulta foi cancelada.

            Detalhes da Consulta Cancelada:
            - Advogado: Dr. ${appointment.lawyerName}
            - Data: ${new Date(appointment.preferredDate).toLocaleDateString('pt-BR')}
            - Horário: ${appointment.preferredTime}
            ${appointment.notes ? `\nMotivo do Cancelamento:\n${appointment.notes}` : ''}

            Para reagendar sua consulta, entre em contato conosco:
            Email: ${process.env.EMAIL_USER}

            Este é um email automático, por favor não responda.
            © ${new Date().getFullYear()} FGJN Advocacia. Todos os direitos reservados.
        `,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1a365d; margin: 0;">FGJN Advocacia</h1>
                    <p style="color: #4a5568; margin: 5px 0;">Cancelamento de Consulta</p>
                </div>

                <div style="background-color: #f7fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                    <p style="margin: 0 0 15px 0;">Olá <strong>${appointment.userName}</strong>,</p>
                    <p style="margin: 0 0 15px 0;">Informamos que sua consulta foi cancelada.</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h2 style="color: #2d3748; font-size: 18px; margin-bottom: 15px;">Detalhes da Consulta Cancelada</h2>
                    <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px;">
                        <p style="margin: 5px 0;"><strong>Advogado:</strong> Dr. ${appointment.lawyerName}</p>
                        <p style="margin: 5px 0;"><strong>Data:</strong> ${new Date(appointment.preferredDate).toLocaleDateString('pt-BR')}</p>
                        <p style="margin: 5px 0;"><strong>Horário:</strong> ${appointment.preferredTime}</p>
                        ${appointment.notes ? `
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 5px 0;"><strong>Motivo do Cancelamento:</strong></p>
                            <p style="margin: 5px 0; padding: 10px; background-color: #fff; border-radius: 4px;">${appointment.notes}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; color: #4a5568;">Para reagendar sua consulta, entre em contato conosco:</p>
                    <p style="margin: 5px 0; color: #2d3748;"><strong>Email:</strong> ${process.env.EMAIL_USER}</p>
                </div>

                <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #718096;">
                    <p style="margin: 0;">Este é um email automático, por favor não responda.</p>
                    <p style="margin: 5px 0;">© ${new Date().getFullYear()} FGJN Advocacia. Todos os direitos reservados.</p>
                </div>
            </div>
        `
    };

    try {
        console.log('Tentando enviar email de cancelamento...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Email de cancelamento enviado com sucesso:', info.response);
        return true;
    } catch (error) {
        console.error('Erro detalhado ao enviar email de cancelamento:', error);
        if (error instanceof Error) {
            console.error('Mensagem de erro:', error.message);
            console.error('Stack trace:', error.stack);
        }
        return false;
    }
}

export async function sendAppointmentCompletionEmail(appointment: AppointmentData) {
    console.log('=== Iniciando envio de email de conclusão ===');
    console.log('Dados do agendamento:', appointment);

    const mailOptions = {
        from: {
            name: 'FGJN Advocacia',
            address: process.env.EMAIL_USER || ''
        },
        to: appointment.userEmail,
        subject: 'Conclusão de Consulta - FGJN Advocacia',
        headers: {
            'X-Entity-Ref-ID': `complete_${Date.now()}`,
            'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
            'Precedence': 'bulk',
            'X-Auto-Response-Suppress': 'OOF, AutoReply'
        },
        text: `
            Conclusão de Consulta - FGJN Advocacia

            Olá ${appointment.userName},

            Informamos que sua consulta foi concluída.

            Detalhes da Consulta:
            - Advogado: Dr. ${appointment.lawyerName}
            - Data: ${new Date(appointment.preferredDate).toLocaleDateString('pt-BR')}
            - Horário: ${appointment.preferredTime}

            Agradecemos a confiança em nossos serviços. Se precisar de mais assistência, não hesite em entrar em contato.

            Para agendar uma nova consulta ou tirar dúvidas, entre em contato conosco:
            Email: ${process.env.EMAIL_USER}

            Este é um email automático, por favor não responda.
            © ${new Date().getFullYear()} FGJN Advocacia. Todos os direitos reservados.
        `,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1a365d; margin: 0;">FGJN Advocacia</h1>
                    <p style="color: #4a5568; margin: 5px 0;">Conclusão de Consulta</p>
                </div>

                <div style="background-color: #f7fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                    <p style="margin: 0 0 15px 0;">Olá <strong>${appointment.userName}</strong>,</p>
                    <p style="margin: 0 0 15px 0;">Informamos que sua consulta foi concluída.</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h2 style="color: #2d3748; font-size: 18px; margin-bottom: 15px;">Detalhes da Consulta</h2>
                    <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px;">
                        <p style="margin: 5px 0;"><strong>Advogado:</strong> Dr. ${appointment.lawyerName}</p>
                        <p style="margin: 5px 0;"><strong>Data:</strong> ${new Date(appointment.preferredDate).toLocaleDateString('pt-BR')}</p>
                        <p style="margin: 5px 0;"><strong>Horário:</strong> ${appointment.preferredTime}</p>
                    </div>
                </div>

                <div style="background-color: #ebf8ff; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #2c5282;">Agradecemos a confiança em nossos serviços. Se precisar de mais assistência, não hesite em entrar em contato.</p>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; color: #4a5568;">Para agendar uma nova consulta ou tirar dúvidas, entre em contato conosco:</p>
                    <p style="margin: 5px 0; color: #2d3748;"><strong>Email:</strong> ${process.env.EMAIL_USER}</p>
                </div>

                <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #718096;">
                    <p style="margin: 0;">Este é um email automático, por favor não responda.</p>
                    <p style="margin: 5px 0;">© ${new Date().getFullYear()} FGJN Advocacia. Todos os direitos reservados.</p>
                </div>
            </div>
        `
    };

    try {
        console.log('Tentando enviar email de conclusão...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Email de conclusão enviado com sucesso:', info.response);
        return true;
    } catch (error) {
        console.error('Erro detalhado ao enviar email de conclusão:', error);
        if (error instanceof Error) {
            console.error('Mensagem de erro:', error.message);
            console.error('Stack trace:', error.stack);
        }
        return false;
    }
}

export async function sendEmailConfirmation({ userEmail, userName, confirmationUrl }: { userEmail: string, userName: string, confirmationUrl: string }) {
    const mailOptions = {
        from: {
            name: 'FGJN Advocacia',
            address: process.env.EMAIL_USER || ''
        },
        to: userEmail,
        subject: 'Confirmação de Cadastro - FGJN Advocacia',
        text: `Olá ${userName},\n\nPara ativar sua conta, clique no link abaixo:\n${confirmationUrl}\n\nSe você não solicitou este cadastro, ignore este e-mail.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1a365d; margin: 0;">FGJN Advocacia</h1>
                    <p style="color: #4a5568; margin: 5px 0;">Confirmação de Cadastro</p>
                </div>
                <div style="background-color: #f7fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                    <p style="margin: 0 0 15px 0;">Olá <strong>${userName}</strong>,</p>
                    <p style="margin: 0 0 15px 0;">Para ativar sua conta, clique no botão abaixo:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${confirmationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #1a365d; color: #fff; border-radius: 4px; text-decoration: none; font-weight: bold;">Ativar Conta</a>
                    </div>
                    <p style="margin: 0 0 15px 0;">Se você não solicitou este cadastro, ignore este e-mail.</p>
                </div>
                <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #718096;">
                    <p style="margin: 0;">Este é um email automático, por favor não responda.</p>
                    <p style="margin: 5px 0;">© ${new Date().getFullYear()} FGJN Advocacia. Todos os direitos reservados.</p>
                </div>
            </div>
        `
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email de confirmação enviado com sucesso:', info.response);
        return true;
    } catch (error) {
        console.error('Erro ao enviar email de confirmação:', error);
        return false;
    }
} 