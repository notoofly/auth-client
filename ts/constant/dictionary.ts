// =============================================================================
// resources.ts
//
// Single source of truth for all i18n translations.
// Every key is a CodeName derived directly from the OpenAPI spec (DOMAIN.RESOURCE.ACTION).
// Add new languages by adding a new top-level key — partial coverage is fine;
// the ApiClient will fall back to "en" for any missing keys.
// =============================================================================

export const dictionary = {
	// ── English (canonical — must define every key) ────────────────────────────
	en: {
		// AUTH
		"AUTH.ACCESS.DENIED": "Access denied.",
		"AUTH.ACCESS.GRANTED": "Access granted.",
		"AUTH.CREDENTIAL.INVALID": "Invalid credentials.",
		"AUTH.LOGOUT.SUCCESS": "You have been logged out successfully.",

		// DB
		"DB.CONNECTION.FAILED":
			"Database connection failed. Please try again later.",
		"DB.CONSTRAINT.DUPLICATE": "A record with this value already exists.",
		"DB.CORE.NOT_FOUND": "The requested record was not found.",
		"DB.CORE.TIMEOUT": "The database request timed out.",
		"DB.CORE.VALIDATION_ERROR": "Data validation failed.",

		// DEVICE
		"DEVICE.CORE.LIMIT_REACHED":
			"Maximum number of registered devices reached.",
		"DEVICE.CORE.REGISTERED": "This device is already registered.",
		"DEVICE.CORE.REMOVED": "Device removed successfully.",

		// OTP
		"OTP.CORE.EXPIRED": "OTP code has expired. Please request a new one.",
		"OTP.CORE.INVALID": "OTP code is invalid.",
		"OTP.CORE.REQUIRED": "OTP verification is required to continue.",
		"OTP.CORE.SENT": "OTP code has been sent.",

		// PASSWORD
		"PASSWORD.CORE.CHANGED": "Password changed successfully.",
		"PASSWORD.CORE.INVALID": "Current password is incorrect.",
		"PASSWORD.CORE.RESET_COMPLETED": "Password reset completed successfully.",
		"PASSWORD.CORE.RESET_REQUESTED": "Password reset email has been sent.",

		// SECURITY
		"SECURITY.CSRF.CREATED": "CSRF token created.",
		"SECURITY.CSRF.INVALID": "CSRF token is invalid.",
		"SECURITY.CSRF.MISSING": "CSRF token is missing from the request.",

		// SYSTEM
		"SYSTEM.CORE.ERROR":
			"An unexpected system error occurred. Please try again.",

		// TOKEN
		"TOKEN.ACCESS.INVALID": "Access token is invalid or has expired.",
		"TOKEN.PASSWORD.EXPIRED": "Password reset token has expired.",
		"TOKEN.PASSWORD.INVALID": "Password reset token is invalid.",
		"TOKEN.PASSWORD.VALID": "Password reset token is valid.",
		"TOKEN.PREAUTH.EXPIRED": "Pre-authentication token has expired.",
		"TOKEN.PREAUTH.INVALID": "Pre-authentication token is invalid.",
		"TOKEN.REFRESH.INVALID": "Refresh token is invalid.",
		"TOKEN.REFRESH.REPLAYED": "Refresh token has already been used.",

		// TOTP
		"TOTP.CORE.INVALID": "TOTP code is invalid.",
		"TOTP.CORE.REQUIRED": "TOTP verification is required to continue.",

		// USER
		"USER.ACCOUNT.ACTIVATED": "Account activated successfully.",
		"USER.ACCOUNT.ALREADY_EXISTS": "An account with this email already exists.",
		"USER.ACCOUNT.INVALID": "Account is invalid or has been deactivated.",

		// VERIFY
		"VERIFY.TOKEN.EXPIRED": "Verification token has expired.",
		"VERIFY.TOKEN.INVALID": "Verification token is invalid.",
		"VERIFY.TOKEN.SENT": "Verification email has been sent.",
	},

	// ── Bahasa Indonesia ───────────────────────────────────────────────────────
	id: {
		"AUTH.ACCESS.DENIED": "Akses ditolak.",
		"AUTH.ACCESS.GRANTED": "Akses diberikan.",
		"AUTH.CREDENTIAL.INVALID": "Kredensial tidak valid.",
		"AUTH.LOGOUT.SUCCESS": "Anda telah berhasil keluar.",

		"DB.CONNECTION.FAILED": "Koneksi database gagal. Silakan coba lagi.",
		"DB.CONSTRAINT.DUPLICATE": "Data dengan nilai ini sudah ada.",
		"DB.CORE.NOT_FOUND": "Data yang diminta tidak ditemukan.",
		"DB.CORE.TIMEOUT": "Permintaan ke database habis waktu.",
		"DB.CORE.VALIDATION_ERROR": "Validasi data gagal.",

		"DEVICE.CORE.LIMIT_REACHED":
			"Jumlah maksimum perangkat terdaftar telah tercapai.",
		"DEVICE.CORE.REGISTERED": "Perangkat ini sudah terdaftar.",
		"DEVICE.CORE.REMOVED": "Perangkat berhasil dihapus.",

		"OTP.CORE.EXPIRED": "Kode OTP telah kedaluwarsa. Mohon minta kode baru.",
		"OTP.CORE.INVALID": "Kode OTP tidak valid.",
		"OTP.CORE.REQUIRED": "Verifikasi OTP diperlukan untuk melanjutkan.",
		"OTP.CORE.SENT": "Kode OTP telah dikirim.",

		"PASSWORD.CORE.CHANGED": "Kata sandi berhasil diubah.",
		"PASSWORD.CORE.INVALID": "Kata sandi saat ini tidak sesuai.",
		"PASSWORD.CORE.RESET_COMPLETED": "Reset kata sandi berhasil diselesaikan.",
		"PASSWORD.CORE.RESET_REQUESTED": "Email reset kata sandi telah dikirim.",

		"SECURITY.CSRF.CREATED": "Token CSRF dibuat.",
		"SECURITY.CSRF.INVALID": "Token CSRF tidak valid.",
		"SECURITY.CSRF.MISSING": "Token CSRF tidak ada dalam permintaan.",

		"SYSTEM.CORE.ERROR":
			"Terjadi kesalahan sistem yang tidak terduga. Silakan coba lagi.",

		"TOKEN.ACCESS.INVALID": "Token akses tidak valid atau telah kedaluwarsa.",
		"TOKEN.PASSWORD.EXPIRED": "Token reset kata sandi telah kedaluwarsa.",
		"TOKEN.PASSWORD.INVALID": "Token reset kata sandi tidak valid.",
		"TOKEN.PASSWORD.VALID": "Token reset kata sandi valid.",
		"TOKEN.PREAUTH.EXPIRED": "Token pra-autentikasi telah kedaluwarsa.",
		"TOKEN.PREAUTH.INVALID": "Token pra-autentikasi tidak valid.",
		"TOKEN.REFRESH.INVALID": "Refresh token tidak valid.",
		"TOKEN.REFRESH.REPLAYED": "Refresh token sudah pernah digunakan.",

		"TOTP.CORE.INVALID": "Kode TOTP tidak valid.",
		"TOTP.CORE.REQUIRED": "Verifikasi TOTP diperlukan untuk melanjutkan.",

		"USER.ACCOUNT.ACTIVATED": "Akun berhasil diaktifkan.",
		"USER.ACCOUNT.ALREADY_EXISTS": "Akun dengan email ini sudah terdaftar.",
		"USER.ACCOUNT.INVALID": "Akun tidak valid atau telah dinonaktifkan.",

		"VERIFY.TOKEN.EXPIRED": "Token verifikasi telah kedaluwarsa.",
		"VERIFY.TOKEN.INVALID": "Token verifikasi tidak valid.",
		"VERIFY.TOKEN.SENT": "Email verifikasi telah dikirim.",
	},

	// ── 日本語 (partial — falls back to "en" for missing keys) ─────────────────
	ja: {
		"AUTH.ACCESS.DENIED": "アクセスが拒否されました。",
		"AUTH.ACCESS.GRANTED": "アクセスが許可されました。",
		"AUTH.CREDENTIAL.INVALID": "認証情報が無効です。",
		"AUTH.LOGOUT.SUCCESS": "正常にログアウトしました。",

		"OTP.CORE.EXPIRED": "OTPコードの有効期限が切れました。",
		"OTP.CORE.INVALID": "OTPコードが無効です。",
		"OTP.CORE.REQUIRED": "続行するにはOTP認証が必要です。",
		"OTP.CORE.SENT": "OTPコードを送信しました。",

		"SYSTEM.CORE.ERROR": "予期しないシステムエラーが発生しました。",

		"TOKEN.REFRESH.INVALID": "リフレッシュトークンが無効です。",
		"TOKEN.REFRESH.REPLAYED": "リフレッシュトークンはすでに使用されています。",

		"USER.ACCOUNT.ALREADY_EXISTS":
			"このメールアドレスはすでに登録されています。",
	},
} as const;
