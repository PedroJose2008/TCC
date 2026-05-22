package br.com.TCC.TCC.controllers;

import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailController {

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/email/enviar/{mensagem}/{destino}")
    public String enviarEmailHtml(@PathVariable String mensagem, @PathVariable String destino) {

        try {

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            // destinatário
            helper.setTo("0001163961@senaimgaluno.com.br");

            // assunto
            helper.setSubject("Teste de Email HTML");

            // conteúdo html
//            String html = ""
//                    + "<div style='font-family:Arial;padding:20px'>"
//                    + "<h1 style='color:#0d6efd'>Email enviado com sucesso</h1>"
//                    + "<p>Olá, este é um email HTML enviado pelo Spring Boot.</p>"
//                    + "<hr>"
//                    + "<b>Sistema:</b> Gestor de Pedidos"
//                    + "</div>";

            helper.setText(mensagem, true);

            // envia email
            mailSender.send(message);

            return "Email enviado com sucesso!";

        } catch (Exception e) {

            e.printStackTrace();

            return "Erro ao enviar email: " + e.getMessage();
        }
    }
}