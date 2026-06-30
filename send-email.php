<?php
// send-email.php - PHPMailer Configuration and Email Sending

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

// Set response header
header('Content-Type: application/json');

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['name']) || !isset($data['email']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Sanitize inputs
$name = trim($data['name']);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$subject = isset($data['subject']) ? trim($data['subject']) : 'Nowa wiadomość z formularza';
$message = trim($data['message']);

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

try {
    // Create PHPMailer instance
    $mail = new PHPMailer(true);

    // SMTP Configuration - Modify these settings based on your email provider
    $mail->isSMTP();
    $mail->Host = 'smtp.example.com';           // Your SMTP host
    $mail->SMTPAuth = true;
    $mail->Username = 'your-email@example.com'; // Your email address
    $mail->Password = 'your-password';           // Your email password or app password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Set timezone
    date_default_timezone_set('Europe/Berlin');

    // Set sender and recipient
    $mail->setFrom('your-email@example.com', 'Sonnen Apotheke - Formularz Kontaktowy');
    $mail->addAddress('your-email@example.com', 'Sonnen Apotheke');
    $mail->addReplyTo($email, $name);

    // Email content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    
    // HTML email body
    $html_body = "
        <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                    .header { background-color: #f4f4f4; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
                    .content { margin: 20px 0; }
                    .field { margin: 15px 0; }
                    .label { font-weight: bold; color: #555; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h2>Nowa wiadomość z formularza kontaktowego</h2>
                    </div>
                    <div class='content'>
                        <div class='field'>
                            <span class='label'>Imię i Nazwisko:</span><br>
                            " . htmlspecialchars($name) . "
                        </div>
                        <div class='field'>
                            <span class='label'>Adres Email:</span><br>
                            " . htmlspecialchars($email) . "
                        </div>
                        <div class='field'>
                            <span class='label'>Temat:</span><br>
                            " . htmlspecialchars($subject) . "
                        </div>
                        <div class='field'>
                            <span class='label'>Wiadomość:</span><br>
                            " . nl2br(htmlspecialchars($message)) . "
                        </div>
                    </div>
                    <div class='footer'>
                        <p>Wiadomość wysłana: " . date('Y-m-d H:i:s') . "</p>
                        <p>Sonnen Apotheke | Dornbachstraße 34 | Telefon: +49 6171 917770</p>
                    </div>
                </div>
            </body>
        </html>
    ";
    
    $mail->Body = $html_body;
    $mail->AltBody = "Imię: $name\nEmail: $email\nTemat: $subject\n\nWiadomość:\n$message";

    // Send email
    if ($mail->send()) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to send email']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Mailer Error: ' . $mail->ErrorInfo]);
}
?>
