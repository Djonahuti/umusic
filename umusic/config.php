<?php
// Allow requests from any origin (for dev / public APIs)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle CORS preflight requests early
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load environment variables from .env (optional)
// If you are using a .env file (e.g. in development), place it in the project root.
$dotenvPath = __DIR__ . '/..' . DIRECTORY_SEPARATOR . '.env';
if (file_exists($dotenvPath)) {
    $lines = file($dotenvPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        $parts = explode('=', $line, 2);
        if (count($parts) !== 2) {
            continue;
        }

        $name = trim($parts[0]);
        $value = trim($parts[1]);
        $value = trim($value, "\"'");

        if (getenv($name) === false) {
            putenv("$name=$value");
            $_ENV[$name] = $value;
        }
    }
}

// Enable error display and reporting for debugging (remove or disable in production)
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// Ensure fatal errors are returned as JSON
set_exception_handler(function ($e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
    exit;
});

register_shutdown_function(function () {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => $error['message'], 'file' => $error['file'], 'line' => $error['line']]);
        exit;
    }
});

// Database connection via PDO
// Update path assumptions as needed on cPanel; this file will be deployed to public_html/api/config.php

// Set content type for all API responses
header('Content-Type: application/json');

// Database configuration - Update these with your cPanel PostgreSQL credentials
$dbHost = 'localhost';
$dbName = 'myczroxg_umusic';
$dbUser = 'myczroxg_admin';
$dbPass = 'Xaccount123#$';
// Some cPanel setups require a port (default PostgreSQL port is 5432)
$dbPort = '5432';

// Initialize $pdo as null - will be set if connection succeeds
$pdo = null;

try {
    // Try connecting with port first (common in cPanel)
    $dsn = "pgsql:host=$dbHost;port=$dbPort;dbname=$dbName";
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 5, // 5 second timeout
        PDO::ATTR_EMULATE_PREPARES => false, // Use native prepared statements
    ]);
} catch (PDOException $e) {
    // If connection with port fails, try without port
    try {
        $dsn = "pgsql:host=$dbHost;dbname=$dbName";
        $pdo = new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 5,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (PDOException $e2) {
        // If both fail, return error in consistent format
        http_response_code(500);
        echo json_encode([
            'ok' => false,
            'success' => false,
            'error' => 'Database connection failed',
            'message' => $e2->getMessage()
        ]);
        exit;
    }
}

function json_input() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function ok($data) {
    echo json_encode(['ok' => true, 'data' => $data]);
    exit;
}

function fail($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}


