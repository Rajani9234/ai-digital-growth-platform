<?php
// ============================================================
// API: Get Partner Dashboard Data (referrals + earnings)
// Method : GET
// URL    : /backend/api/get-referrals.php?code=JTRAHUL1234
//       or /backend/api/get-referrals.php?phone=9876543210
// ============================================================

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$code  = trim(strip_tags($_GET['code']  ?? ''));
$phone = trim(strip_tags($_GET['phone'] ?? ''));

if (!$code && !$phone) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Provide referral code or phone number']);
    exit;
}

$db = getDB();

// ── 1. Find partner ──────────────────────────────────────
if ($code) {
    $stmt = $db->prepare("SELECT * FROM referral_partners WHERE referral_code = ?");
    $stmt->bind_param('s', $code);
} else {
    $stmt = $db->prepare("SELECT * FROM referral_partners WHERE phone = ?");
    $stmt->bind_param('s', $phone);
}

$stmt->execute();
$partner = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$partner) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Partner not found']);
    $db->close();
    exit;
}

// ── 2. Get conversions ───────────────────────────────────
$stmt = $db->prepare(
    "SELECT * FROM referral_conversions WHERE partner_id = ? ORDER BY created_at DESC"
);
$stmt->bind_param('i', $partner['id']);
$stmt->execute();
$conversions = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();
$db->close();

// ── 3. Respond ───────────────────────────────────────────
echo json_encode([
    'success' => true,
    'partner' => [
        'id'              => $partner['id'],
        'name'            => $partner['full_name'],
        'phone'           => $partner['phone'],
        'email'           => $partner['email'],
        'city'            => $partner['city'],
        'referral_code'   => $partner['referral_code'],
        'referral_link'   => "https://jhatechsolutions.in/ref/{$partner['referral_code']}",
        'total_referrals' => (int)$partner['total_referrals'],
        'total_earnings'  => (float)$partner['total_earnings'],
        'status'          => $partner['status'],
        'joined_on'       => $partner['created_at'],
    ],
    'conversions' => $conversions,
]);
