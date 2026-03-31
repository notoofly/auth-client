export const dictionary = {
	en: {
		// SYSTEM
		"SYSTEM.CORE.OK": "System is operational",
		"SYSTEM.CORE.ERROR": "System error occurred",
		"SYSTEM.CORE.TRIGGERED": "System event triggered",
		"SYSTEM.RATE_LIMIT.OK": "Rate limit is within bounds",
		"SYSTEM.RATE_LIMIT.ERROR": "Rate limit error occurred",
		"SYSTEM.RATE_LIMIT.TRIGGERED": "Rate limit has been triggered",
		"SYSTEM.MAINTENANCE.OK": "System maintenance completed",
		"SYSTEM.MAINTENANCE.ERROR": "Maintenance error occurred",
		"SYSTEM.MAINTENANCE.TRIGGERED": "System is under maintenance",

		// USER.ACCOUNT
		"USER.ACCOUNT.CREATED": "Account has been created",
		"USER.ACCOUNT.VERIFIED": "Account has been verified",
		"USER.ACCOUNT.NOT_VERIFIED": "Account is not verified",
		"USER.ACCOUNT.SUSPENDED": "Account has been suspended",
		"USER.ACCOUNT.LOCKED": "Account has been locked",
		"USER.ACCOUNT.DELETED": "Account has been deleted",
		"USER.ACCOUNT.INVALID": "Account is invalid",
		"USER.ACCOUNT.ALREADY_EXISTS": "Account already exists",
		"USER.ACCOUNT.ACTIVATED": "Account has been activated",

		// USER.EMAIL
		"USER.EMAIL.CREATED": "Email has been created",
		"USER.EMAIL.VERIFIED": "Email has been verified",
		"USER.EMAIL.NOT_VERIFIED": "Email is not verified",
		"USER.EMAIL.SUSPENDED": "Email has been suspended",
		"USER.EMAIL.LOCKED": "Email has been locked",
		"USER.EMAIL.DELETED": "Email has been deleted",
		"USER.EMAIL.INVALID": "Email address is invalid",
		"USER.EMAIL.ALREADY_EXISTS": "Email address already exists",
		"USER.EMAIL.ACTIVATED": "Email has been activated",

		// USER.STATUS
		"USER.STATUS.CREATED": "User status created",
		"USER.STATUS.VERIFIED": "User status verified",
		"USER.STATUS.NOT_VERIFIED": "User status not verified",
		"USER.STATUS.SUSPENDED": "User status suspended",
		"USER.STATUS.LOCKED": "User status locked",
		"USER.STATUS.DELETED": "User status deleted",
		"USER.STATUS.INVALID": "User status is invalid",
		"USER.STATUS.ALREADY_EXISTS": "User status already exists",
		"USER.STATUS.ACTIVATED": "User status activated",

		// AUTH.LOGIN
		"AUTH.LOGIN.SUCCESS": "Login successful",
		"AUTH.LOGIN.FAILED": "Login failed",
		"AUTH.LOGIN.INVALID": "Invalid login credentials",
		"AUTH.LOGIN.REQUIRED": "Login is required",
		"AUTH.LOGIN.DISABLED": "Login has been disabled",
		"AUTH.LOGIN.PENDING": "Login is pending",
		"AUTH.LOGIN.VERIFIED": "Login has been verified",
		"AUTH.LOGIN.DENIED": "Login has been denied",
		"AUTH.LOGIN.GRANTED": "Login has been granted",

		// AUTH.LOGOUT
		"AUTH.LOGOUT.SUCCESS": "Logout successful",
		"AUTH.LOGOUT.FAILED": "Logout failed",
		"AUTH.LOGOUT.INVALID": "Invalid logout request",
		"AUTH.LOGOUT.REQUIRED": "Logout is required",
		"AUTH.LOGOUT.DISABLED": "Logout has been disabled",
		"AUTH.LOGOUT.PENDING": "Logout is pending",
		"AUTH.LOGOUT.VERIFIED": "Logout has been verified",
		"AUTH.LOGOUT.DENIED": "Logout has been denied",
		"AUTH.LOGOUT.GRANTED": "Logout has been granted",

		// AUTH.CREDENTIAL
		"AUTH.CREDENTIAL.SUCCESS": "Credential verification successful",
		"AUTH.CREDENTIAL.FAILED": "Credential verification failed",
		"AUTH.CREDENTIAL.INVALID": "Credentials are invalid",
		"AUTH.CREDENTIAL.REQUIRED": "Credentials are required",
		"AUTH.CREDENTIAL.DISABLED": "Credentials have been disabled",
		"AUTH.CREDENTIAL.PENDING": "Credential verification pending",
		"AUTH.CREDENTIAL.VERIFIED": "Credentials have been verified",
		"AUTH.CREDENTIAL.DENIED": "Credential access denied",
		"AUTH.CREDENTIAL.GRANTED": "Credential access granted",

		// AUTH.ACCOUNT
		"AUTH.ACCOUNT.SUCCESS": "Account authentication successful",
		"AUTH.ACCOUNT.FAILED": "Account authentication failed",
		"AUTH.ACCOUNT.INVALID": "Account is invalid",
		"AUTH.ACCOUNT.REQUIRED": "Account is required",
		"AUTH.ACCOUNT.DISABLED": "Account has been disabled",
		"AUTH.ACCOUNT.PENDING": "Account authentication pending",
		"AUTH.ACCOUNT.VERIFIED": "Account has been verified",
		"AUTH.ACCOUNT.DENIED": "Account access denied",
		"AUTH.ACCOUNT.GRANTED": "Account access granted",

		// AUTH.ACCESS
		"AUTH.ACCESS.SUCCESS": "Access granted successfully",
		"AUTH.ACCESS.FAILED": "Access request failed",
		"AUTH.ACCESS.INVALID": "Access request is invalid",
		"AUTH.ACCESS.REQUIRED": "Access is required",
		"AUTH.ACCESS.DISABLED": "Access has been disabled",
		"AUTH.ACCESS.PENDING": "Access request is pending",
		"AUTH.ACCESS.VERIFIED": "Access has been verified",
		"AUTH.ACCESS.DENIED": "Access has been denied",
		"AUTH.ACCESS.GRANTED": "Access has been granted",

		// TOKEN.ACCESS
		"TOKEN.ACCESS.ISSUED": "Access token issued",
		"TOKEN.ACCESS.INVALID": "Access token is invalid",
		"TOKEN.ACCESS.EXPIRED": "Access token has expired",
		"TOKEN.ACCESS.REVOKED": "Access token has been revoked",
		"TOKEN.ACCESS.ROTATED": "Access token has been rotated",
		"TOKEN.ACCESS.REPLAYED": "Access token replay detected",
		"TOKEN.ACCESS.REQUIRED": "Access token is required",
		"TOKEN.ACCESS.VALID": "Access token is valid",

		// TOKEN.REFRESH
		"TOKEN.REFRESH.ISSUED": "Refresh token issued",
		"TOKEN.REFRESH.INVALID": "Refresh token is invalid",
		"TOKEN.REFRESH.EXPIRED": "Refresh token has expired",
		"TOKEN.REFRESH.REVOKED": "Refresh token has been revoked",
		"TOKEN.REFRESH.ROTATED": "Refresh token has been rotated",
		"TOKEN.REFRESH.REPLAYED": "Refresh token replay detected",
		"TOKEN.REFRESH.REQUIRED": "Refresh token is required",
		"TOKEN.REFRESH.VALID": "Refresh token is valid",

		// TOKEN.PREAUTH
		"TOKEN.PREAUTH.ISSUED": "Pre-auth token issued",
		"TOKEN.PREAUTH.INVALID": "Pre-auth token is invalid",
		"TOKEN.PREAUTH.EXPIRED": "Pre-auth token has expired",
		"TOKEN.PREAUTH.REVOKED": "Pre-auth token has been revoked",
		"TOKEN.PREAUTH.ROTATED": "Pre-auth token has been rotated",
		"TOKEN.PREAUTH.REPLAYED": "Pre-auth token replay detected",
		"TOKEN.PREAUTH.REQUIRED": "Pre-auth token is required",
		"TOKEN.PREAUTH.VALID": "Pre-auth token is valid",

		// TOKEN.PASSWORD
		"TOKEN.PASSWORD.ISSUED": "Password token issued",
		"TOKEN.PASSWORD.INVALID": "Password token is invalid",
		"TOKEN.PASSWORD.EXPIRED": "Password token has expired",
		"TOKEN.PASSWORD.REVOKED": "Password token has been revoked",
		"TOKEN.PASSWORD.ROTATED": "Password token has been rotated",
		"TOKEN.PASSWORD.REPLAYED": "Password token replay detected",
		"TOKEN.PASSWORD.REQUIRED": "Password token is required",
		"TOKEN.PASSWORD.VALID": "Password token is valid",

		// SESSION
		"SESSION.CORE.CREATED": "Session has been created",
		"SESSION.CORE.REVOKED": "Session has been revoked",
		"SESSION.CORE.EXPIRED": "Session has expired",
		"SESSION.CORE.NOT_FOUND": "Session not found",

		// MFA.SETUP
		"MFA.SETUP.STARTED": "MFA setup started",
		"MFA.SETUP.COMPLETED": "MFA setup completed",
		"MFA.SETUP.GENERATED": "MFA setup code generated",
		"MFA.SETUP.USED": "MFA setup code used",
		"MFA.SETUP.INVALID": "MFA setup code is invalid",
		"MFA.SETUP.EXHAUSTED": "MFA setup attempts exhausted",

		// MFA.SECRET
		"MFA.SECRET.STARTED": "MFA secret generation started",
		"MFA.SECRET.COMPLETED": "MFA secret generation completed",
		"MFA.SECRET.GENERATED": "MFA secret generated",
		"MFA.SECRET.USED": "MFA secret used",
		"MFA.SECRET.INVALID": "MFA secret is invalid",
		"MFA.SECRET.EXHAUSTED": "MFA secret attempts exhausted",

		// MFA.BACKUP_CODE
		"MFA.BACKUP_CODE.STARTED": "MFA backup code process started",
		"MFA.BACKUP_CODE.COMPLETED": "MFA backup code process completed",
		"MFA.BACKUP_CODE.GENERATED": "MFA backup codes generated",
		"MFA.BACKUP_CODE.USED": "MFA backup code used",
		"MFA.BACKUP_CODE.INVALID": "MFA backup code is invalid",
		"MFA.BACKUP_CODE.EXHAUSTED": "MFA backup codes exhausted",

		// PASSWORD.CORE
		"PASSWORD.CORE.SET": "Password has been set",
		"PASSWORD.CORE.CHANGED": "Password has been changed",
		"PASSWORD.CORE.RESET_REQUESTED": "Password reset requested",
		"PASSWORD.CORE.RESET_COMPLETED": "Password reset completed",
		"PASSWORD.CORE.INVALID": "Password is invalid",
		"PASSWORD.CORE.EXPIRED": "Password has expired",
		"PASSWORD.CORE.TOO_WEAK": "Password is too weak",

		// PASSWORD.TOKEN
		"PASSWORD.TOKEN.SET": "Password token has been set",
		"PASSWORD.TOKEN.CHANGED": "Password token has been changed",
		"PASSWORD.TOKEN.RESET_REQUESTED": "Password token reset requested",
		"PASSWORD.TOKEN.RESET_COMPLETED": "Password token reset completed",
		"PASSWORD.TOKEN.INVALID": "Password token is invalid",
		"PASSWORD.TOKEN.EXPIRED": "Password token has expired",
		"PASSWORD.TOKEN.TOO_WEAK": "Password token is too weak",

		// SECURITY.BRUTE_FORCE
		"SECURITY.BRUTE_FORCE.DETECTED": "Brute force attack detected",
		"SECURITY.BRUTE_FORCE.TRIGGERED": "Brute force protection triggered",
		"SECURITY.BRUTE_FORCE.BLOCKED": "Brute force attack blocked",
		"SECURITY.BRUTE_FORCE.INVALID": "Brute force rule is invalid",
		"SECURITY.BRUTE_FORCE.MISSING": "Brute force configuration missing",
		"SECURITY.BRUTE_FORCE.CREATED": "Brute force rule created",

		// SECURITY.RATE_LIMIT
		"SECURITY.RATE_LIMIT.DETECTED": "Rate limit violation detected",
		"SECURITY.RATE_LIMIT.TRIGGERED": "Rate limit protection triggered",
		"SECURITY.RATE_LIMIT.BLOCKED": "Request blocked by rate limit",
		"SECURITY.RATE_LIMIT.INVALID": "Rate limit rule is invalid",
		"SECURITY.RATE_LIMIT.MISSING": "Rate limit configuration missing",
		"SECURITY.RATE_LIMIT.CREATED": "Rate limit rule created",

		// SECURITY.IP
		"SECURITY.IP.DETECTED": "Suspicious IP detected",
		"SECURITY.IP.TRIGGERED": "IP protection triggered",
		"SECURITY.IP.BLOCKED": "IP address has been blocked",
		"SECURITY.IP.INVALID": "IP address is invalid",
		"SECURITY.IP.MISSING": "IP address is missing",
		"SECURITY.IP.CREATED": "IP rule created",

		// SECURITY.CSRF
		"SECURITY.CSRF.DETECTED": "CSRF attack detected",
		"SECURITY.CSRF.TRIGGERED": "CSRF protection triggered",
		"SECURITY.CSRF.BLOCKED": "Request blocked by CSRF protection",
		"SECURITY.CSRF.INVALID": "CSRF token is invalid",
		"SECURITY.CSRF.MISSING": "CSRF token is missing",
		"SECURITY.CSRF.CREATED": "CSRF token created",

		// DB.CORE
		"DB.CORE.VALIDATION_ERROR": "Database validation error",
		"DB.CORE.TIMEOUT": "Database connection timed out",
		"DB.CORE.FAILED": "Database operation failed",
		"DB.CORE.NOT_FOUND": "Record not found in database",
		"DB.CORE.DUPLICATE": "Duplicate record in database",

		// DB.CONSTRAINT
		"DB.CONSTRAINT.VALIDATION_ERROR": "Database constraint validation error",
		"DB.CONSTRAINT.TIMEOUT": "Database constraint check timed out",
		"DB.CONSTRAINT.FAILED": "Database constraint check failed",
		"DB.CONSTRAINT.NOT_FOUND": "Database constraint not found",
		"DB.CONSTRAINT.DUPLICATE": "Database constraint duplicate detected",

		// DB.CONNECTION
		"DB.CONNECTION.VALIDATION_ERROR": "Database connection validation error",
		"DB.CONNECTION.TIMEOUT": "Database connection timed out",
		"DB.CONNECTION.FAILED": "Database connection failed",
		"DB.CONNECTION.NOT_FOUND": "Database connection not found",
		"DB.CONNECTION.DUPLICATE": "Duplicate database connection detected",

		// OTP
		"OTP.CORE.SENT": "OTP has been sent",
		"OTP.CORE.EXPIRED": "OTP has expired",
		"OTP.CORE.INVALID": "OTP is invalid",
		"OTP.CORE.REQUIRED": "OTP is required",

		// VERIFY.TOKEN
		"VERIFY.TOKEN.EXPIRED": "Verification token has expired",
		"VERIFY.TOKEN.INVALID": "Verification token is invalid",
		"VERIFY.TOKEN.SENT": "Verification token has been sent",

		// DEVICE
		"DEVICE.CORE.REMOVED": "Device has been removed",
		"DEVICE.CORE.REGISTERED": "Device has been registered",
		"DEVICE.CORE.LIMIT_REACHED": "Device registration limit reached",

		// API
		"API.ROUTE.NOT_FOUND": "API route not found",
		"API.ROUTE.ERROR": "API route error occurred",
		"API.VALIDATOR.NOT_FOUND": "API validator not found",
		"API.VALIDATOR.ERROR": "API validation error occurred",

		// TOTP
		"TOTP.CORE.SENT": "TOTP has been sent",
		"TOTP.CORE.EXPIRED": "TOTP has expired",
		"TOTP.CORE.INVALID": "TOTP is invalid",
		"TOTP.CORE.REQUIRED": "TOTP is required",
	},

	es: {
		// SYSTEM
		"SYSTEM.CORE.OK": "El sistema está operativo",
		"SYSTEM.CORE.ERROR": "Ocurrió un error en el sistema",
		"SYSTEM.CORE.TRIGGERED": "Evento del sistema activado",
		"SYSTEM.RATE_LIMIT.OK": "El límite de solicitudes está dentro del rango",
		"SYSTEM.RATE_LIMIT.ERROR": "Error en el límite de solicitudes",
		"SYSTEM.RATE_LIMIT.TRIGGERED": "Se ha activado el límite de solicitudes",
		"SYSTEM.MAINTENANCE.OK": "Mantenimiento del sistema completado",
		"SYSTEM.MAINTENANCE.ERROR": "Error durante el mantenimiento",
		"SYSTEM.MAINTENANCE.TRIGGERED": "El sistema está en mantenimiento",

		// USER.ACCOUNT
		"USER.ACCOUNT.CREATED": "La cuenta ha sido creada",
		"USER.ACCOUNT.VERIFIED": "La cuenta ha sido verificada",
		"USER.ACCOUNT.NOT_VERIFIED": "La cuenta no está verificada",
		"USER.ACCOUNT.SUSPENDED": "La cuenta ha sido suspendida",
		"USER.ACCOUNT.LOCKED": "La cuenta ha sido bloqueada",
		"USER.ACCOUNT.DELETED": "La cuenta ha sido eliminada",
		"USER.ACCOUNT.INVALID": "La cuenta es inválida",
		"USER.ACCOUNT.ALREADY_EXISTS": "La cuenta ya existe",
		"USER.ACCOUNT.ACTIVATED": "La cuenta ha sido activada",

		// USER.EMAIL
		"USER.EMAIL.CREATED": "El correo ha sido creado",
		"USER.EMAIL.VERIFIED": "El correo ha sido verificado",
		"USER.EMAIL.NOT_VERIFIED": "El correo no está verificado",
		"USER.EMAIL.SUSPENDED": "El correo ha sido suspendido",
		"USER.EMAIL.LOCKED": "El correo ha sido bloqueado",
		"USER.EMAIL.DELETED": "El correo ha sido eliminado",
		"USER.EMAIL.INVALID": "La dirección de correo es inválida",
		"USER.EMAIL.ALREADY_EXISTS": "La dirección de correo ya existe",
		"USER.EMAIL.ACTIVATED": "El correo ha sido activado",

		// USER.STATUS
		"USER.STATUS.CREATED": "Estado de usuario creado",
		"USER.STATUS.VERIFIED": "Estado de usuario verificado",
		"USER.STATUS.NOT_VERIFIED": "Estado de usuario no verificado",
		"USER.STATUS.SUSPENDED": "Estado de usuario suspendido",
		"USER.STATUS.LOCKED": "Estado de usuario bloqueado",
		"USER.STATUS.DELETED": "Estado de usuario eliminado",
		"USER.STATUS.INVALID": "Estado de usuario inválido",
		"USER.STATUS.ALREADY_EXISTS": "Estado de usuario ya existe",
		"USER.STATUS.ACTIVATED": "Estado de usuario activado",

		// AUTH.LOGIN
		"AUTH.LOGIN.SUCCESS": "Inicio de sesión exitoso",
		"AUTH.LOGIN.FAILED": "Error al iniciar sesión",
		"AUTH.LOGIN.INVALID": "Credenciales de inicio de sesión inválidas",
		"AUTH.LOGIN.REQUIRED": "Se requiere inicio de sesión",
		"AUTH.LOGIN.DISABLED": "El inicio de sesión ha sido deshabilitado",
		"AUTH.LOGIN.PENDING": "Inicio de sesión pendiente",
		"AUTH.LOGIN.VERIFIED": "Inicio de sesión verificado",
		"AUTH.LOGIN.DENIED": "Inicio de sesión denegado",
		"AUTH.LOGIN.GRANTED": "Inicio de sesión concedido",

		// AUTH.LOGOUT
		"AUTH.LOGOUT.SUCCESS": "Cierre de sesión exitoso",
		"AUTH.LOGOUT.FAILED": "Error al cerrar sesión",
		"AUTH.LOGOUT.INVALID": "Solicitud de cierre de sesión inválida",
		"AUTH.LOGOUT.REQUIRED": "Se requiere cierre de sesión",
		"AUTH.LOGOUT.DISABLED": "El cierre de sesión ha sido deshabilitado",
		"AUTH.LOGOUT.PENDING": "Cierre de sesión pendiente",
		"AUTH.LOGOUT.VERIFIED": "Cierre de sesión verificado",
		"AUTH.LOGOUT.DENIED": "Cierre de sesión denegado",
		"AUTH.LOGOUT.GRANTED": "Cierre de sesión concedido",

		// AUTH.CREDENTIAL
		"AUTH.CREDENTIAL.SUCCESS": "Verificación de credenciales exitosa",
		"AUTH.CREDENTIAL.FAILED": "Verificación de credenciales fallida",
		"AUTH.CREDENTIAL.INVALID": "Las credenciales son inválidas",
		"AUTH.CREDENTIAL.REQUIRED": "Se requieren credenciales",
		"AUTH.CREDENTIAL.DISABLED": "Las credenciales han sido deshabilitadas",
		"AUTH.CREDENTIAL.PENDING": "Verificación de credenciales pendiente",
		"AUTH.CREDENTIAL.VERIFIED": "Las credenciales han sido verificadas",
		"AUTH.CREDENTIAL.DENIED": "Acceso de credenciales denegado",
		"AUTH.CREDENTIAL.GRANTED": "Acceso de credenciales concedido",

		// AUTH.ACCOUNT
		"AUTH.ACCOUNT.SUCCESS": "Autenticación de cuenta exitosa",
		"AUTH.ACCOUNT.FAILED": "Autenticación de cuenta fallida",
		"AUTH.ACCOUNT.INVALID": "La cuenta es inválida",
		"AUTH.ACCOUNT.REQUIRED": "Se requiere una cuenta",
		"AUTH.ACCOUNT.DISABLED": "La cuenta ha sido deshabilitada",
		"AUTH.ACCOUNT.PENDING": "Autenticación de cuenta pendiente",
		"AUTH.ACCOUNT.VERIFIED": "La cuenta ha sido verificada",
		"AUTH.ACCOUNT.DENIED": "Acceso a la cuenta denegado",
		"AUTH.ACCOUNT.GRANTED": "Acceso a la cuenta concedido",

		// AUTH.ACCESS
		"AUTH.ACCESS.SUCCESS": "Acceso concedido exitosamente",
		"AUTH.ACCESS.FAILED": "Solicitud de acceso fallida",
		"AUTH.ACCESS.INVALID": "La solicitud de acceso es inválida",
		"AUTH.ACCESS.REQUIRED": "Se requiere acceso",
		"AUTH.ACCESS.DISABLED": "El acceso ha sido deshabilitado",
		"AUTH.ACCESS.PENDING": "Solicitud de acceso pendiente",
		"AUTH.ACCESS.VERIFIED": "El acceso ha sido verificado",
		"AUTH.ACCESS.DENIED": "El acceso ha sido denegado",
		"AUTH.ACCESS.GRANTED": "El acceso ha sido concedido",

		// TOKEN.ACCESS
		"TOKEN.ACCESS.ISSUED": "Token de acceso emitido",
		"TOKEN.ACCESS.INVALID": "El token de acceso es inválido",
		"TOKEN.ACCESS.EXPIRED": "El token de acceso ha expirado",
		"TOKEN.ACCESS.REVOKED": "El token de acceso ha sido revocado",
		"TOKEN.ACCESS.ROTATED": "El token de acceso ha sido rotado",
		"TOKEN.ACCESS.REPLAYED": "Reproducción de token de acceso detectada",
		"TOKEN.ACCESS.REQUIRED": "Se requiere token de acceso",
		"TOKEN.ACCESS.VALID": "El token de acceso es válido",

		// TOKEN.REFRESH
		"TOKEN.REFRESH.ISSUED": "Token de actualización emitido",
		"TOKEN.REFRESH.INVALID": "El token de actualización es inválido",
		"TOKEN.REFRESH.EXPIRED": "El token de actualización ha expirado",
		"TOKEN.REFRESH.REVOKED": "El token de actualización ha sido revocado",
		"TOKEN.REFRESH.ROTATED": "El token de actualización ha sido rotado",
		"TOKEN.REFRESH.REPLAYED":
			"Reproducción de token de actualización detectada",
		"TOKEN.REFRESH.REQUIRED": "Se requiere token de actualización",
		"TOKEN.REFRESH.VALID": "El token de actualización es válido",

		// TOKEN.PREAUTH
		"TOKEN.PREAUTH.ISSUED": "Token de pre-autenticación emitido",
		"TOKEN.PREAUTH.INVALID": "El token de pre-autenticación es inválido",
		"TOKEN.PREAUTH.EXPIRED": "El token de pre-autenticación ha expirado",
		"TOKEN.PREAUTH.REVOKED": "El token de pre-autenticación ha sido revocado",
		"TOKEN.PREAUTH.ROTATED": "El token de pre-autenticación ha sido rotado",
		"TOKEN.PREAUTH.REPLAYED":
			"Reproducción de token de pre-autenticación detectada",
		"TOKEN.PREAUTH.REQUIRED": "Se requiere token de pre-autenticación",
		"TOKEN.PREAUTH.VALID": "El token de pre-autenticación es válido",

		// TOKEN.PASSWORD
		"TOKEN.PASSWORD.ISSUED": "Token de contraseña emitido",
		"TOKEN.PASSWORD.INVALID": "El token de contraseña es inválido",
		"TOKEN.PASSWORD.EXPIRED": "El token de contraseña ha expirado",
		"TOKEN.PASSWORD.REVOKED": "El token de contraseña ha sido revocado",
		"TOKEN.PASSWORD.ROTATED": "El token de contraseña ha sido rotado",
		"TOKEN.PASSWORD.REPLAYED": "Reproducción de token de contraseña detectada",
		"TOKEN.PASSWORD.REQUIRED": "Se requiere token de contraseña",
		"TOKEN.PASSWORD.VALID": "El token de contraseña es válido",

		// SESSION
		"SESSION.CORE.CREATED": "La sesión ha sido creada",
		"SESSION.CORE.REVOKED": "La sesión ha sido revocada",
		"SESSION.CORE.EXPIRED": "La sesión ha expirado",
		"SESSION.CORE.NOT_FOUND": "Sesión no encontrada",

		// MFA.SETUP
		"MFA.SETUP.STARTED": "Configuración de MFA iniciada",
		"MFA.SETUP.COMPLETED": "Configuración de MFA completada",
		"MFA.SETUP.GENERATED": "Código de configuración MFA generado",
		"MFA.SETUP.USED": "Código de configuración MFA utilizado",
		"MFA.SETUP.INVALID": "El código de configuración MFA es inválido",
		"MFA.SETUP.EXHAUSTED": "Intentos de configuración MFA agotados",

		// MFA.SECRET
		"MFA.SECRET.STARTED": "Generación de secreto MFA iniciada",
		"MFA.SECRET.COMPLETED": "Generación de secreto MFA completada",
		"MFA.SECRET.GENERATED": "Secreto MFA generado",
		"MFA.SECRET.USED": "Secreto MFA utilizado",
		"MFA.SECRET.INVALID": "El secreto MFA es inválido",
		"MFA.SECRET.EXHAUSTED": "Intentos de secreto MFA agotados",

		// MFA.BACKUP_CODE
		"MFA.BACKUP_CODE.STARTED": "Proceso de código de respaldo MFA iniciado",
		"MFA.BACKUP_CODE.COMPLETED": "Proceso de código de respaldo MFA completado",
		"MFA.BACKUP_CODE.GENERATED": "Códigos de respaldo MFA generados",
		"MFA.BACKUP_CODE.USED": "Código de respaldo MFA utilizado",
		"MFA.BACKUP_CODE.INVALID": "El código de respaldo MFA es inválido",
		"MFA.BACKUP_CODE.EXHAUSTED": "Códigos de respaldo MFA agotados",

		// PASSWORD.CORE
		"PASSWORD.CORE.SET": "La contraseña ha sido establecida",
		"PASSWORD.CORE.CHANGED": "La contraseña ha sido cambiada",
		"PASSWORD.CORE.RESET_REQUESTED":
			"Restablecimiento de contraseña solicitado",
		"PASSWORD.CORE.RESET_COMPLETED":
			"Restablecimiento de contraseña completado",
		"PASSWORD.CORE.INVALID": "La contraseña es inválida",
		"PASSWORD.CORE.EXPIRED": "La contraseña ha expirado",
		"PASSWORD.CORE.TOO_WEAK": "La contraseña es demasiado débil",

		// PASSWORD.TOKEN
		"PASSWORD.TOKEN.SET": "El token de contraseña ha sido establecido",
		"PASSWORD.TOKEN.CHANGED": "El token de contraseña ha sido cambiado",
		"PASSWORD.TOKEN.RESET_REQUESTED":
			"Restablecimiento de token de contraseña solicitado",
		"PASSWORD.TOKEN.RESET_COMPLETED":
			"Restablecimiento de token de contraseña completado",
		"PASSWORD.TOKEN.INVALID": "El token de contraseña es inválido",
		"PASSWORD.TOKEN.EXPIRED": "El token de contraseña ha expirado",
		"PASSWORD.TOKEN.TOO_WEAK": "El token de contraseña es demasiado débil",

		// SECURITY.BRUTE_FORCE
		"SECURITY.BRUTE_FORCE.DETECTED": "Ataque de fuerza bruta detectado",
		"SECURITY.BRUTE_FORCE.TRIGGERED": "Protección contra fuerza bruta activada",
		"SECURITY.BRUTE_FORCE.BLOCKED": "Ataque de fuerza bruta bloqueado",
		"SECURITY.BRUTE_FORCE.INVALID": "La regla de fuerza bruta es inválida",
		"SECURITY.BRUTE_FORCE.MISSING": "Configuración de fuerza bruta faltante",
		"SECURITY.BRUTE_FORCE.CREATED": "Regla de fuerza bruta creada",

		// SECURITY.RATE_LIMIT
		"SECURITY.RATE_LIMIT.DETECTED":
			"Violación de límite de solicitudes detectada",
		"SECURITY.RATE_LIMIT.TRIGGERED":
			"Protección de límite de solicitudes activada",
		"SECURITY.RATE_LIMIT.BLOCKED":
			"Solicitud bloqueada por límite de velocidad",
		"SECURITY.RATE_LIMIT.INVALID":
			"La regla de límite de solicitudes es inválida",
		"SECURITY.RATE_LIMIT.MISSING":
			"Configuración de límite de solicitudes faltante",
		"SECURITY.RATE_LIMIT.CREATED": "Regla de límite de solicitudes creada",

		// SECURITY.IP
		"SECURITY.IP.DETECTED": "IP sospechosa detectada",
		"SECURITY.IP.TRIGGERED": "Protección de IP activada",
		"SECURITY.IP.BLOCKED": "La dirección IP ha sido bloqueada",
		"SECURITY.IP.INVALID": "La dirección IP es inválida",
		"SECURITY.IP.MISSING": "La dirección IP no está presente",
		"SECURITY.IP.CREATED": "Regla de IP creada",

		// SECURITY.CSRF
		"SECURITY.CSRF.DETECTED": "Ataque CSRF detectado",
		"SECURITY.CSRF.TRIGGERED": "Protección CSRF activada",
		"SECURITY.CSRF.BLOCKED": "Solicitud bloqueada por protección CSRF",
		"SECURITY.CSRF.INVALID": "El token CSRF es inválido",
		"SECURITY.CSRF.MISSING": "El token CSRF no está presente",
		"SECURITY.CSRF.CREATED": "Token CSRF creado",

		// DB.CORE
		"DB.CORE.VALIDATION_ERROR": "Error de validación en la base de datos",
		"DB.CORE.TIMEOUT": "Tiempo de espera agotado en la base de datos",
		"DB.CORE.FAILED": "Operación de base de datos fallida",
		"DB.CORE.NOT_FOUND": "Registro no encontrado en la base de datos",
		"DB.CORE.DUPLICATE": "Registro duplicado en la base de datos",

		// DB.CONSTRAINT
		"DB.CONSTRAINT.VALIDATION_ERROR":
			"Error de validación de restricción de base de datos",
		"DB.CONSTRAINT.TIMEOUT":
			"Tiempo de espera agotado en restricción de base de datos",
		"DB.CONSTRAINT.FAILED":
			"Verificación de restricción de base de datos fallida",
		"DB.CONSTRAINT.NOT_FOUND": "Restricción de base de datos no encontrada",
		"DB.CONSTRAINT.DUPLICATE":
			"Duplicado de restricción de base de datos detectado",

		// DB.CONNECTION
		"DB.CONNECTION.VALIDATION_ERROR":
			"Error de validación de conexión de base de datos",
		"DB.CONNECTION.TIMEOUT": "Tiempo de espera de conexión agotado",
		"DB.CONNECTION.FAILED": "Conexión a la base de datos fallida",
		"DB.CONNECTION.NOT_FOUND": "Conexión a la base de datos no encontrada",
		"DB.CONNECTION.DUPLICATE":
			"Conexión duplicada a la base de datos detectada",

		// OTP
		"OTP.CORE.SENT": "OTP ha sido enviado",
		"OTP.CORE.EXPIRED": "OTP ha expirado",
		"OTP.CORE.INVALID": "OTP es inválido",
		"OTP.CORE.REQUIRED": "Se requiere OTP",

		// VERIFY.TOKEN
		"VERIFY.TOKEN.EXPIRED": "El token de verificación ha expirado",
		"VERIFY.TOKEN.INVALID": "El token de verificación es inválido",
		"VERIFY.TOKEN.SENT": "El token de verificación ha sido enviado",

		// DEVICE
		"DEVICE.CORE.REMOVED": "El dispositivo ha sido eliminado",
		"DEVICE.CORE.REGISTERED": "El dispositivo ha sido registrado",
		"DEVICE.CORE.LIMIT_REACHED":
			"Se alcanzó el límite de registro de dispositivos",

		// API
		"API.ROUTE.NOT_FOUND": "Ruta de API no encontrada",
		"API.ROUTE.ERROR": "Ocurrió un error en la ruta de API",
		"API.VALIDATOR.NOT_FOUND": "Validador de API no encontrado",
		"API.VALIDATOR.ERROR": "Ocurrió un error de validación de API",

		// TOTP
		"TOTP.CORE.SENT": "TOTP ha sido enviado",
		"TOTP.CORE.EXPIRED": "TOTP ha expirado",
		"TOTP.CORE.INVALID": "TOTP es inválido",
		"TOTP.CORE.REQUIRED": "Se requiere TOTP",
	},

	id: {
		// SYSTEM
		"SYSTEM.CORE.OK": "Sistem berjalan normal",
		"SYSTEM.CORE.ERROR": "Terjadi kesalahan sistem",
		"SYSTEM.CORE.TRIGGERED": "Event sistem terpicu",
		"SYSTEM.RATE_LIMIT.OK": "Batas permintaan dalam batas normal",
		"SYSTEM.RATE_LIMIT.ERROR": "Terjadi kesalahan batas permintaan",
		"SYSTEM.RATE_LIMIT.TRIGGERED": "Batas permintaan telah terpicu",
		"SYSTEM.MAINTENANCE.OK": "Pemeliharaan sistem selesai",
		"SYSTEM.MAINTENANCE.ERROR": "Terjadi kesalahan saat pemeliharaan",
		"SYSTEM.MAINTENANCE.TRIGGERED": "Sistem sedang dalam pemeliharaan",

		// USER.ACCOUNT
		"USER.ACCOUNT.CREATED": "Akun telah dibuat",
		"USER.ACCOUNT.VERIFIED": "Akun telah diverifikasi",
		"USER.ACCOUNT.NOT_VERIFIED": "Akun belum diverifikasi",
		"USER.ACCOUNT.SUSPENDED": "Akun telah ditangguhkan",
		"USER.ACCOUNT.LOCKED": "Akun telah dikunci",
		"USER.ACCOUNT.DELETED": "Akun telah dihapus",
		"USER.ACCOUNT.INVALID": "Akun tidak valid",
		"USER.ACCOUNT.ALREADY_EXISTS": "Akun sudah ada",
		"USER.ACCOUNT.ACTIVATED": "Akun telah diaktifkan",

		// USER.EMAIL
		"USER.EMAIL.CREATED": "Email telah dibuat",
		"USER.EMAIL.VERIFIED": "Email telah diverifikasi",
		"USER.EMAIL.NOT_VERIFIED": "Email belum diverifikasi",
		"USER.EMAIL.SUSPENDED": "Email telah ditangguhkan",
		"USER.EMAIL.LOCKED": "Email telah dikunci",
		"USER.EMAIL.DELETED": "Email telah dihapus",
		"USER.EMAIL.INVALID": "Alamat email tidak valid",
		"USER.EMAIL.ALREADY_EXISTS": "Alamat email sudah digunakan",
		"USER.EMAIL.ACTIVATED": "Email telah diaktifkan",

		// USER.STATUS
		"USER.STATUS.CREATED": "Status pengguna dibuat",
		"USER.STATUS.VERIFIED": "Status pengguna terverifikasi",
		"USER.STATUS.NOT_VERIFIED": "Status pengguna belum terverifikasi",
		"USER.STATUS.SUSPENDED": "Status pengguna ditangguhkan",
		"USER.STATUS.LOCKED": "Status pengguna dikunci",
		"USER.STATUS.DELETED": "Status pengguna dihapus",
		"USER.STATUS.INVALID": "Status pengguna tidak valid",
		"USER.STATUS.ALREADY_EXISTS": "Status pengguna sudah ada",
		"USER.STATUS.ACTIVATED": "Status pengguna diaktifkan",

		// AUTH.LOGIN
		"AUTH.LOGIN.SUCCESS": "Login berhasil",
		"AUTH.LOGIN.FAILED": "Login gagal",
		"AUTH.LOGIN.INVALID": "Kredensial login tidak valid",
		"AUTH.LOGIN.REQUIRED": "Login diperlukan",
		"AUTH.LOGIN.DISABLED": "Login telah dinonaktifkan",
		"AUTH.LOGIN.PENDING": "Login sedang diproses",
		"AUTH.LOGIN.VERIFIED": "Login telah diverifikasi",
		"AUTH.LOGIN.DENIED": "Login ditolak",
		"AUTH.LOGIN.GRANTED": "Login diizinkan",

		// AUTH.LOGOUT
		"AUTH.LOGOUT.SUCCESS": "Logout berhasil",
		"AUTH.LOGOUT.FAILED": "Logout gagal",
		"AUTH.LOGOUT.INVALID": "Permintaan logout tidak valid",
		"AUTH.LOGOUT.REQUIRED": "Logout diperlukan",
		"AUTH.LOGOUT.DISABLED": "Logout telah dinonaktifkan",
		"AUTH.LOGOUT.PENDING": "Logout sedang diproses",
		"AUTH.LOGOUT.VERIFIED": "Logout telah diverifikasi",
		"AUTH.LOGOUT.DENIED": "Logout ditolak",
		"AUTH.LOGOUT.GRANTED": "Logout diizinkan",

		// AUTH.CREDENTIAL
		"AUTH.CREDENTIAL.SUCCESS": "Verifikasi kredensial berhasil",
		"AUTH.CREDENTIAL.FAILED": "Verifikasi kredensial gagal",
		"AUTH.CREDENTIAL.INVALID": "Kredensial tidak valid",
		"AUTH.CREDENTIAL.REQUIRED": "Kredensial diperlukan",
		"AUTH.CREDENTIAL.DISABLED": "Kredensial telah dinonaktifkan",
		"AUTH.CREDENTIAL.PENDING": "Verifikasi kredensial sedang diproses",
		"AUTH.CREDENTIAL.VERIFIED": "Kredensial telah diverifikasi",
		"AUTH.CREDENTIAL.DENIED": "Akses kredensial ditolak",
		"AUTH.CREDENTIAL.GRANTED": "Akses kredensial diizinkan",

		// AUTH.ACCOUNT
		"AUTH.ACCOUNT.SUCCESS": "Autentikasi akun berhasil",
		"AUTH.ACCOUNT.FAILED": "Autentikasi akun gagal",
		"AUTH.ACCOUNT.INVALID": "Akun tidak valid",
		"AUTH.ACCOUNT.REQUIRED": "Akun diperlukan",
		"AUTH.ACCOUNT.DISABLED": "Akun telah dinonaktifkan",
		"AUTH.ACCOUNT.PENDING": "Autentikasi akun sedang diproses",
		"AUTH.ACCOUNT.VERIFIED": "Akun telah diverifikasi",
		"AUTH.ACCOUNT.DENIED": "Akses akun ditolak",
		"AUTH.ACCOUNT.GRANTED": "Akses akun diizinkan",

		// AUTH.ACCESS
		"AUTH.ACCESS.SUCCESS": "Akses berhasil diberikan",
		"AUTH.ACCESS.FAILED": "Permintaan akses gagal",
		"AUTH.ACCESS.INVALID": "Permintaan akses tidak valid",
		"AUTH.ACCESS.REQUIRED": "Akses diperlukan",
		"AUTH.ACCESS.DISABLED": "Akses telah dinonaktifkan",
		"AUTH.ACCESS.PENDING": "Permintaan akses sedang diproses",
		"AUTH.ACCESS.VERIFIED": "Akses telah diverifikasi",
		"AUTH.ACCESS.DENIED": "Akses ditolak",
		"AUTH.ACCESS.GRANTED": "Akses diberikan",

		// TOKEN.ACCESS
		"TOKEN.ACCESS.ISSUED": "Token akses diterbitkan",
		"TOKEN.ACCESS.INVALID": "Token akses tidak valid",
		"TOKEN.ACCESS.EXPIRED": "Token akses telah kedaluwarsa",
		"TOKEN.ACCESS.REVOKED": "Token akses telah dicabut",
		"TOKEN.ACCESS.ROTATED": "Token akses telah dirotasi",
		"TOKEN.ACCESS.REPLAYED": "Penggunaan ulang token akses terdeteksi",
		"TOKEN.ACCESS.REQUIRED": "Token akses diperlukan",
		"TOKEN.ACCESS.VALID": "Token akses valid",

		// TOKEN.REFRESH
		"TOKEN.REFRESH.ISSUED": "Token refresh diterbitkan",
		"TOKEN.REFRESH.INVALID": "Token refresh tidak valid",
		"TOKEN.REFRESH.EXPIRED": "Token refresh telah kedaluwarsa",
		"TOKEN.REFRESH.REVOKED": "Token refresh telah dicabut",
		"TOKEN.REFRESH.ROTATED": "Token refresh telah dirotasi",
		"TOKEN.REFRESH.REPLAYED": "Penggunaan ulang token refresh terdeteksi",
		"TOKEN.REFRESH.REQUIRED": "Token refresh diperlukan",
		"TOKEN.REFRESH.VALID": "Token refresh valid",

		// TOKEN.PREAUTH
		"TOKEN.PREAUTH.ISSUED": "Token pre-autentikasi diterbitkan",
		"TOKEN.PREAUTH.INVALID": "Token pre-autentikasi tidak valid",
		"TOKEN.PREAUTH.EXPIRED": "Token pre-autentikasi telah kedaluwarsa",
		"TOKEN.PREAUTH.REVOKED": "Token pre-autentikasi telah dicabut",
		"TOKEN.PREAUTH.ROTATED": "Token pre-autentikasi telah dirotasi",
		"TOKEN.PREAUTH.REPLAYED":
			"Penggunaan ulang token pre-autentikasi terdeteksi",
		"TOKEN.PREAUTH.REQUIRED": "Token pre-autentikasi diperlukan",
		"TOKEN.PREAUTH.VALID": "Token pre-autentikasi valid",

		// TOKEN.PASSWORD
		"TOKEN.PASSWORD.ISSUED": "Token kata sandi diterbitkan",
		"TOKEN.PASSWORD.INVALID": "Token kata sandi tidak valid",
		"TOKEN.PASSWORD.EXPIRED": "Token kata sandi telah kedaluwarsa",
		"TOKEN.PASSWORD.REVOKED": "Token kata sandi telah dicabut",
		"TOKEN.PASSWORD.ROTATED": "Token kata sandi telah dirotasi",
		"TOKEN.PASSWORD.REPLAYED": "Penggunaan ulang token kata sandi terdeteksi",
		"TOKEN.PASSWORD.REQUIRED": "Token kata sandi diperlukan",
		"TOKEN.PASSWORD.VALID": "Token kata sandi valid",

		// SESSION
		"SESSION.CORE.CREATED": "Sesi telah dibuat",
		"SESSION.CORE.REVOKED": "Sesi telah dicabut",
		"SESSION.CORE.EXPIRED": "Sesi telah kedaluwarsa",
		"SESSION.CORE.NOT_FOUND": "Sesi tidak ditemukan",

		// MFA.SETUP
		"MFA.SETUP.STARTED": "Pengaturan MFA dimulai",
		"MFA.SETUP.COMPLETED": "Pengaturan MFA selesai",
		"MFA.SETUP.GENERATED": "Kode pengaturan MFA dibuat",
		"MFA.SETUP.USED": "Kode pengaturan MFA telah digunakan",
		"MFA.SETUP.INVALID": "Kode pengaturan MFA tidak valid",
		"MFA.SETUP.EXHAUSTED": "Percobaan pengaturan MFA habis",

		// MFA.SECRET
		"MFA.SECRET.STARTED": "Pembuatan rahasia MFA dimulai",
		"MFA.SECRET.COMPLETED": "Pembuatan rahasia MFA selesai",
		"MFA.SECRET.GENERATED": "Rahasia MFA dibuat",
		"MFA.SECRET.USED": "Rahasia MFA telah digunakan",
		"MFA.SECRET.INVALID": "Rahasia MFA tidak valid",
		"MFA.SECRET.EXHAUSTED": "Percobaan rahasia MFA habis",

		// MFA.BACKUP_CODE
		"MFA.BACKUP_CODE.STARTED": "Proses kode cadangan MFA dimulai",
		"MFA.BACKUP_CODE.COMPLETED": "Proses kode cadangan MFA selesai",
		"MFA.BACKUP_CODE.GENERATED": "Kode cadangan MFA dibuat",
		"MFA.BACKUP_CODE.USED": "Kode cadangan MFA telah digunakan",
		"MFA.BACKUP_CODE.INVALID": "Kode cadangan MFA tidak valid",
		"MFA.BACKUP_CODE.EXHAUSTED": "Kode cadangan MFA habis",

		// PASSWORD.CORE
		"PASSWORD.CORE.SET": "Kata sandi telah ditetapkan",
		"PASSWORD.CORE.CHANGED": "Kata sandi telah diubah",
		"PASSWORD.CORE.RESET_REQUESTED": "Permintaan reset kata sandi dikirim",
		"PASSWORD.CORE.RESET_COMPLETED": "Reset kata sandi selesai",
		"PASSWORD.CORE.INVALID": "Kata sandi tidak valid",
		"PASSWORD.CORE.EXPIRED": "Kata sandi telah kedaluwarsa",
		"PASSWORD.CORE.TOO_WEAK": "Kata sandi terlalu lemah",

		// PASSWORD.TOKEN
		"PASSWORD.TOKEN.SET": "Token kata sandi telah ditetapkan",
		"PASSWORD.TOKEN.CHANGED": "Token kata sandi telah diubah",
		"PASSWORD.TOKEN.RESET_REQUESTED":
			"Permintaan reset token kata sandi dikirim",
		"PASSWORD.TOKEN.RESET_COMPLETED": "Reset token kata sandi selesai",
		"PASSWORD.TOKEN.INVALID": "Token kata sandi tidak valid",
		"PASSWORD.TOKEN.EXPIRED": "Token kata sandi telah kedaluwarsa",
		"PASSWORD.TOKEN.TOO_WEAK": "Token kata sandi terlalu lemah",

		// SECURITY.BRUTE_FORCE
		"SECURITY.BRUTE_FORCE.DETECTED": "Serangan brute force terdeteksi",
		"SECURITY.BRUTE_FORCE.TRIGGERED": "Perlindungan brute force aktif",
		"SECURITY.BRUTE_FORCE.BLOCKED": "Serangan brute force diblokir",
		"SECURITY.BRUTE_FORCE.INVALID": "Aturan brute force tidak valid",
		"SECURITY.BRUTE_FORCE.MISSING": "Konfigurasi brute force tidak ditemukan",
		"SECURITY.BRUTE_FORCE.CREATED": "Aturan brute force dibuat",

		// SECURITY.RATE_LIMIT
		"SECURITY.RATE_LIMIT.DETECTED": "Pelanggaran batas permintaan terdeteksi",
		"SECURITY.RATE_LIMIT.TRIGGERED": "Perlindungan batas permintaan aktif",
		"SECURITY.RATE_LIMIT.BLOCKED": "Permintaan diblokir oleh batas kecepatan",
		"SECURITY.RATE_LIMIT.INVALID": "Aturan batas permintaan tidak valid",
		"SECURITY.RATE_LIMIT.MISSING":
			"Konfigurasi batas permintaan tidak ditemukan",
		"SECURITY.RATE_LIMIT.CREATED": "Aturan batas permintaan dibuat",

		// SECURITY.IP
		"SECURITY.IP.DETECTED": "IP mencurigakan terdeteksi",
		"SECURITY.IP.TRIGGERED": "Perlindungan IP aktif",
		"SECURITY.IP.BLOCKED": "Alamat IP telah diblokir",
		"SECURITY.IP.INVALID": "Alamat IP tidak valid",
		"SECURITY.IP.MISSING": "Alamat IP tidak ditemukan",
		"SECURITY.IP.CREATED": "Aturan IP dibuat",

		// SECURITY.CSRF
		"SECURITY.CSRF.DETECTED": "Serangan CSRF terdeteksi",
		"SECURITY.CSRF.TRIGGERED": "Perlindungan CSRF aktif",
		"SECURITY.CSRF.BLOCKED": "Permintaan diblokir oleh perlindungan CSRF",
		"SECURITY.CSRF.INVALID": "Token CSRF tidak valid",
		"SECURITY.CSRF.MISSING": "Token CSRF tidak ditemukan",
		"SECURITY.CSRF.CREATED": "Token CSRF dibuat",

		// DB.CORE
		"DB.CORE.VALIDATION_ERROR": "Kesalahan validasi basis data",
		"DB.CORE.TIMEOUT": "Koneksi basis data habis waktu",
		"DB.CORE.FAILED": "Operasi basis data gagal",
		"DB.CORE.NOT_FOUND": "Data tidak ditemukan di basis data",
		"DB.CORE.DUPLICATE": "Data duplikat di basis data",

		// DB.CONSTRAINT
		"DB.CONSTRAINT.VALIDATION_ERROR": "Kesalahan validasi batasan basis data",
		"DB.CONSTRAINT.TIMEOUT": "Pemeriksaan batasan basis data habis waktu",
		"DB.CONSTRAINT.FAILED": "Pemeriksaan batasan basis data gagal",
		"DB.CONSTRAINT.NOT_FOUND": "Batasan basis data tidak ditemukan",
		"DB.CONSTRAINT.DUPLICATE": "Duplikat batasan basis data terdeteksi",

		// DB.CONNECTION
		"DB.CONNECTION.VALIDATION_ERROR": "Kesalahan validasi koneksi basis data",
		"DB.CONNECTION.TIMEOUT": "Koneksi basis data habis waktu",
		"DB.CONNECTION.FAILED": "Koneksi ke basis data gagal",
		"DB.CONNECTION.NOT_FOUND": "Koneksi basis data tidak ditemukan",
		"DB.CONNECTION.DUPLICATE": "Koneksi basis data duplikat terdeteksi",

		// OTP
		"OTP.CORE.SENT": "OTP telah dikirim",
		"OTP.CORE.EXPIRED": "OTP telah kedaluwarsa",
		"OTP.CORE.INVALID": "OTP tidak valid",
		"OTP.CORE.REQUIRED": "OTP diperlukan",

		// VERIFY.TOKEN
		"VERIFY.TOKEN.EXPIRED": "Token verifikasi telah kedaluwarsa",
		"VERIFY.TOKEN.INVALID": "Token verifikasi tidak valid",
		"VERIFY.TOKEN.SENT": "Token verifikasi telah dikirim",

		// DEVICE
		"DEVICE.CORE.REMOVED": "Perangkat telah dihapus",
		"DEVICE.CORE.REGISTERED": "Perangkat telah terdaftar",
		"DEVICE.CORE.LIMIT_REACHED": "Batas pendaftaran perangkat tercapai",

		// API
		"API.ROUTE.NOT_FOUND": "Rute API tidak ditemukan",
		"API.ROUTE.ERROR": "Terjadi kesalahan pada rute API",
		"API.VALIDATOR.NOT_FOUND": "Validator API tidak ditemukan",
		"API.VALIDATOR.ERROR": "Terjadi kesalahan validasi API",

		// TOTP
		"TOTP.CORE.SENT": "TOTP telah dikirim",
		"TOTP.CORE.EXPIRED": "TOTP telah kedaluwarsa",
		"TOTP.CORE.INVALID": "TOTP tidak valid",
		"TOTP.CORE.REQUIRED": "TOTP diperlukan",
	},
};
