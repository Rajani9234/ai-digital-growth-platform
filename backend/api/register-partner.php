<?php
// ============================================================
// API: Register Referral Partner
// Method : POST
// URL    : /backend/api/register-partner.php
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

$name  = trim(strip_tags($body['name']  ?? ''));
$phone = trim(strip_tags($body['phone'] ?? ''));
$email = trim(strip_tags($body['email'] ?? ''));
$city  = trim(strip_tags($body['city']  ?? ''));

if (!$name || !$phone || !$city) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Name, phone and city are required']);
    exit;
}

// Validate Indian mobile number (10 digits, starts with 6-9)
if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Enter a valid 10-digit Indian mobile number']);
    exit;
}

// Validate email if provided
if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Enter a valid email address']);
    exit;
}

// ── 2. Check duplicate phone ─────────────────────────────
$db   = getDB();
$stmt = $db->prepare("SELECT id, referral_code FROM referral_partners WHERE phone = ?");
$stmt->bind_param('s', $phone);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $existing = $result->fetch_assoc();
    $stmt->close();
    $db->close();
    // Return existing partner data — they already registered
    echo json_encode([
        'success'       => true,
        'already_exists'=> true,
        'message'       => 'You are already registered as a referral partner!',
        'referral_code' => $existing['referral_code'],
        'partner_id'    => $existing['id'],
    ]);
    exit;
}
$stmt->close();

// ── 3. Generate unique referral code ─────────────────────
function generateReferralCode(string $name, mysqli $db): string {
    $base = 'JT' . strtoupper(preg_replace('/[^A-Z]/i', '', $name));
    $base = substr($base, 0, 6);

    do {
        $code = $base . rand(1000, 9999);
        $stmt = $db->prepare("SELECT id FROM referral_partners WHERE referral_code = ?");
        $stmt->bind_param('s', $code);
        $stmt->execute();
        $exists = $stmt->get_result()->num_rows > 0;
        $stmt->close();
    } while ($exists);

    return $code;
}

$referralCode = generateReferralCode($name, $db);

// ── 4. Insert into DB ────────────────────────────────────
$stmt = $db->prepare(
    "INSERT INTO referral_partners (full_name, phone, email, city, referral_code)
     VALUES (?, ?, ?, ?, ?)"
);
$stmt->bind_param('sssss', $name, $phone, $email, $city, $referralCode);
$stmt->execute();
$partnerId = $stmt->insert_id;
$stmt->close();
$db->close();

// ── 5. Respond ───────────────────────────────────────────
echo json_encode([
    'success'       => true,
    'already_exists'=> false,
    'message'       => 'Welcome! You are now a JhaTech Referral Partner.',
    'partner_id'    => $partnerId,
    'referral_code' => $referralCode,
    'referral_link' => "https://jhatechsolutions.in/ref/{$referralCode}",
    'partner'       => [
        'name'             => $name,
        'phone'            => $phone,
        'email'            => $email,
        'city'             => $city,
        'referral_code'    => $referralCode,
        'total_referrals'  => 0,
        'total_earnings'   => 0,
    ],
]);
