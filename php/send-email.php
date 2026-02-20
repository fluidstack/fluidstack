<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

require_once __DIR__ . '/env-loader.php';
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';
require_once __DIR__ . '/PHPMailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

loadEnv(__DIR__ . '/../.env');

$honeypot = filter_input(INPUT_POST, 'website', FILTER_SANITIZE_SPECIAL_CHARS);
if (!empty($honeypot)) {
    echo json_encode(['success' => true, 'message' => 'Your message has been sent successfully']);
    exit;
}

$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_SPECIAL_CHARS);
$service = filter_input(INPUT_POST, 'service', FILTER_SANITIZE_SPECIAL_CHARS);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_SPECIAL_CHARS);

if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Name, email, and message are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

$serviceLabels = [
    'web' => 'Web Development',
    'mobile' => 'Mobile App',
    'design' => 'UI/UX Design',
    'ecommerce' => 'E-Commerce',
    'domains-email' => 'Domains & Email',
    'brand-identity' => 'Brand Identity',
    'other' => 'Other',
];
$serviceLabel = isset($serviceLabels[$service]) ? $serviceLabels[$service] : $service;

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = getenv('SMTP_HOST');
    $mail->SMTPAuth = true;
    $mail->Username = getenv('SMTP_USERNAME');
    $mail->Password = getenv('SMTP_PASSWORD');

    $encryption = strtolower(getenv('SMTP_ENCRYPTION'));
    if ($encryption === 'tls') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    } elseif ($encryption === 'ssl') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    }

    $port = getenv('SMTP_PORT');
    $mail->Port = $port ? (int)$port : 587;

    $fromEmail = getenv('SMTP_FROM_EMAIL') ?: getenv('SMTP_USERNAME');
    $fromName = getenv('SMTP_FROM_NAME') ?: 'Fluidstack';
    $mail->setFrom($fromEmail, $fromName);

    $toEmail = getenv('SMTP_TO_EMAIL') ?: 'enquiries@fluidstack.com.au';
    $mail->addAddress($toEmail);

    $mail->addReplyTo($email, $name);

    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = "New Contact Form Submission from $name";

    $htmlBody = '
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#333;border-bottom:2px solid #0d6efd;padding-bottom:10px;">New Contact Form Submission</h2>
        <table style="width:100%;border-collapse:collapse;">
            <tr>
                <td style="padding:12px 8px;font-weight:bold;border-bottom:1px solid #eee;width:120px;color:#555;">Name</td>
                <td style="padding:12px 8px;border-bottom:1px solid #eee;">' . htmlspecialchars($name) . '</td>
            </tr>
            <tr>
                <td style="padding:12px 8px;font-weight:bold;border-bottom:1px solid #eee;color:#555;">Email</td>
                <td style="padding:12px 8px;border-bottom:1px solid #eee;"><a href="mailto:' . htmlspecialchars($email) . '">' . htmlspecialchars($email) . '</a></td>
            </tr>';

    if (!empty($phone)) {
        $htmlBody .= '
            <tr>
                <td style="padding:12px 8px;font-weight:bold;border-bottom:1px solid #eee;color:#555;">Phone</td>
                <td style="padding:12px 8px;border-bottom:1px solid #eee;">' . htmlspecialchars($phone) . '</td>
            </tr>';
    }

    if (!empty($service)) {
        $htmlBody .= '
            <tr>
                <td style="padding:12px 8px;font-weight:bold;border-bottom:1px solid #eee;color:#555;">Service</td>
                <td style="padding:12px 8px;border-bottom:1px solid #eee;">' . htmlspecialchars($serviceLabel) . '</td>
            </tr>';
    }

    $htmlBody .= '
            <tr>
                <td style="padding:12px 8px;font-weight:bold;border-bottom:1px solid #eee;color:#555;vertical-align:top;">Message</td>
                <td style="padding:12px 8px;border-bottom:1px solid #eee;">' . nl2br(htmlspecialchars($message)) . '</td>
            </tr>
        </table>
        <p style="color:#999;font-size:12px;margin-top:20px;">This message was sent from the Fluidstack website contact form.</p>
    </div>';

    $mail->Body = $htmlBody;
    $mail->AltBody = "Name: $name\nEmail: $email\nPhone: $phone\nService: $serviceLabel\n\nMessage:\n$message";

    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Your message has been sent successfully']);
} catch (Exception $e) {
    error_log("PHPMailer Error: " . $mail->ErrorInfo);
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again later.']);
}
