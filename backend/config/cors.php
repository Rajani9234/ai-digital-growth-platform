<?php
// ============================================================
// CORS Headers — allow React frontend to call PHP API
// ============================================================

$allowed_origins = [
    'http://localhost:5173',     // Vite dev server
    'http://localhost:3000',     // alternate dev port
    'https://jhatechsolutions.in', // production domain (change as needed)
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Allow any origin during local development — lock this in production!
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
