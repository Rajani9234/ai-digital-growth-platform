<?php
// ============================================================
// API: Contact / Pricing Enquiry
// Method : POST
// URL    : /backend/api/contact.php
// ============================================================

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// ── 1. Parse & Validate ──────────────────────────────────
$body = json_decode(file_get_contents('php://input'), true);

if (!$body) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON body']);
    exit;
}

$name         = trim(strip_tags($body['name']          ?? ''));
$phone        = trim(strip_tags($body['phone']         ?? ''));
$email        = trim(strip_tags($body['email']         ?? ''));
$businessType = trim(strip_tags($body['business_type'] ?? ''));
$message      = trim(strip_tags($body['message']       ?? ''));
$source       = trim(strip_tags($body['source']        ?? 'contact_form'));
$planInterest = trim(strip_tags($body['plan_interest'] ?? ''));

if (!$name || !$phone || !$message) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Name, phone and message are required']);
    exit;
}

if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Enter a valid 10-digit Indian mobile number']);
    exit;
}

if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Enter a valid email address']);
    exit;
}

// Whitelist allowed sources
$allowedSources = ['contact_form', 'whatsapp', 'pricing', 'pain_analysis'];
if (!in_array($source, $allowedSources)) {
    $source = 'contact_form';
}

// ── 2. Save to DB ────────────────────────────────────────
$db   = getDB();
$stmt = $db->prepare(
    "INSERT INTO enquiries (name, phone, email, business_type, message, source, plan_interest)
     VALUES (?, ?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param('sssssss', $name, $phone, $email, $businessType, $message, $source, $planInterest);
$stmt->execute();
$enquiryId = $stmt->insert_id;
$stmt->close();
$db->close();

// ── 3. Build WhatsApp deep-link for admin notification ───
$adminMessage = urlencode(
    "📩 New Enquiry!\nName: {$name}\nPhone: {$phone}\nBusiness: {$businessType}\nInterested In: {$planInterest}\nMessage: {$message}"
);
$whatsappLink = "https://wa.me/919999999999?text={$adminMessage}";

// ── 4. Respond ───────────────────────────────────────────
echo json_encode([
    'success'        => true,
    'message'        => 'Enquiry submitted! We will contact you within 24 hours.',
    'enquiry_id'     => $enquiryId,
    'whatsapp_link'  => $whatsappLink,
]);
