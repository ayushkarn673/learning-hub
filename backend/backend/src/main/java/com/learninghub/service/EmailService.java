public void sendOtp(String toEmail, String otp) {

    try {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "LearningHub OTP Verification"
        );

        message.setText(
                "Your OTP is: " + otp
        );

        mailSender.send(message);

        System.out.println(
                "OTP SENT SUCCESSFULLY"
        );

    } catch (Exception e) {

        System.out.println(
                "MAIL ERROR:"
        );

        e.printStackTrace();

        throw new RuntimeException(
                "Failed to send email"
        );
    }
}