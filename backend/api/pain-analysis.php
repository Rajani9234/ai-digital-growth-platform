<?php
// ============================================================
// API: Pain-Point Analysis  →  Gemini AI  →  Save to DB
// Method : POST
// URL    : /backend/api/pain-analysis.php
// ============================================================

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/gemini.php';

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// ── 1. Parse request body ─────────────────────────────────
$body = json_decode(file_get_contents('php://input'), true);

if (!$body) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON body']);
    exit;
}

// ── 2. Validate required fields ──────────────────────────
$required = ['business_name', 'business_type', 'city', 'budget', 'current_challenges'];
foreach ($required as $field) {
    if (empty($body[$field])) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => "Field '$field' is required"]);
        exit;
    }
}

// ── 3. Sanitize inputs ───────────────────────────────────
$form = [
    'business_name'      => trim(strip_tags($body['business_name'])),
    'business_type'      => trim(strip_tags($body['business_type'])),
    'city'               => trim(strip_tags($body['city'])),
    'monthly_revenue'    => trim(strip_tags($body['monthly_revenue']   ?? '')),
    'current_challenges' => array_map('strip_tags', (array)$body['current_challenges']),
    'online_presence'    => trim(strip_tags($body['online_presence']   ?? 'none')),
    'target_audience'    => trim(strip_tags($body['target_audience']   ?? '')),
    'budget'             => trim(strip_tags($body['budget'])),
    'additional_info'    => trim(strip_tags($body['additional_info']   ?? '')),
];

// ── 4. Call Gemini AI ────────────────────────────────────
$prompt    = buildAnalysisPrompt($form);
$aiText    = askGemini($prompt);

// Strip markdown code fences if Gemini wraps in ```json ... ```
$aiText = preg_replace('/^```(?:json)?\s*/i', '', trim($aiText));
$aiText = preg_replace('/\s*```$/', '', $aiText);

$aiReport  = json_decode($aiText, true);

// Fallback if Gemini returns invalid JSON
if (!$aiReport) {
    $aiReport = buildFallbackReport($form);
}

$digitalScore  = (int)($aiReport['digital_score'] ?? 30);
$aiReportJson  = json_encode($aiReport);

// ── 5. Save to MySQL ─────────────────────────────────────
$db   = getDB();
$stmt = $db->prepare(
    "INSERT INTO pain_analysis
        (business_name, business_type, city, monthly_revenue, challenges,
         online_presence, target_audience, budget, additional_info,
         ai_report, digital_score)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);

$challengesJson = json_encode($form['current_challenges']);

$stmt->bind_param(
    'ssssssssssi',
    $form['business_name'],
    $form['business_type'],
    $form['city'],
    $form['monthly_revenue'],
    $challengesJson,
    $form['online_presence'],
    $form['target_audience'],
    $form['budget'],
    $form['additional_info'],
    $aiReportJson,
    $digitalScore
);

$stmt->execute();
$insertId = $stmt->insert_id;
$stmt->close();
$db->close();

// ── 6. Return response ───────────────────────────────────
echo json_encode([
    'success'      => true,
    'id'           => $insertId,
    'report'       => $aiReport,
    'digital_score'=> $digitalScore,
]);

// ── Fallback report if Gemini is unavailable ─────────────
function buildFallbackReport(array $form): array {
    $score = 20;
    if ($form['online_presence'] === 'both')    $score += 50;
    elseif ($form['online_presence'] === 'website') $score += 30;
    elseif ($form['online_presence'] === 'social')  $score += 20;
    $score = min($score, 100);

    return [
        'digital_score'   => $score,
        'summary'         => "{$form['business_name']} is a {$form['business_type']} in {$form['city']}. AI analysis shows significant digital growth opportunities with the right strategy.",
        'challenges'      => [
            ['title' => 'Limited Online Visibility', 'description' => 'Most customers search online before buying. Without a strong presence you are missing them.', 'severity' => 'high'],
            ['title' => 'Competitive Market',        'description' => 'Competitors with digital presence capture leads before they reach you.',                      'severity' => 'high'],
        ],
        'recommendations' => [
            ['priority' => 1, 'title' => 'Professional Website',    'description' => 'A mobile-first website with product catalogue and WhatsApp integration.', 'estimated_impact' => '30–50% more enquiries in 60 days'],
            ['priority' => 2, 'title' => 'Google My Business',      'description' => 'Claim and optimise your GMB profile for local search visibility.',          'estimated_impact' => 'Up to 5x more walk-in customers'],
            ['priority' => 3, 'title' => 'Social Media Marketing',  'description' => 'Weekly posts on Instagram & Facebook to build brand awareness.',            'estimated_impact' => '2x brand reach in 90 days'],
        ],
        'action_plan'     => [
            ['phase' => 'Phase 1 – Foundation', 'timeline' => '2 weeks',  'tasks' => ['Claim Google My Business', 'Set up WhatsApp Business', 'Create social media profiles']],
            ['phase' => 'Phase 2 – Website',    'timeline' => '4 weeks',  'tasks' => ['Design & develop website', 'Add product catalogue', 'SEO optimisation']],
            ['phase' => 'Phase 3 – Growth',     'timeline' => '3 months', 'tasks' => ['Run social media ads', 'Collect Google reviews', 'WhatsApp marketing campaigns']],
        ],
    ];
}
