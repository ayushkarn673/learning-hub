package com.learninghub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtp(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject("LearningHub OTP Verification");

        message.setText(
            "Hello!\n\n" +
            "Your OTP for LearningHub registration is:\n\n" +
            "  " + otp + "\n\n" +
            "This OTP is valid for 10 minutes. Do not share it with anyone.\n\n" +
            "— LearningHub Team"
        );

        mailSender.send(message);
    }
}
