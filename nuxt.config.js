import colors from "vuetify/es5/util/colors";

export default {
	// Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
	ssr: false,

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		titleTemplate: "%s - Salud",
		title: "Horus-health",
		meta: [
			{charset: "utf-8"},
			{name: "viewport", content: "width=device-width, initial-scale=1"},
			{hid: "description", name: "description", content: ""},
			{name: "format-detection", content: "telephone=no"},
		],
		link: [{rel: "icon", type: "image/x-icon", href: "/favicon.ico"}],
	},

	publicRuntimeConfig: {
		API_REPORTES_URL: process.env.API_REPORTES_URL || "https://reportes.horus-health.com/reporte",
		API_REPORTES_TOKEN: process.env.API_REPORTES_TOKEN || "",
		PUSHER_KEY: process.env.PUSHER_KEY || "",
		PUSHER_CHANNEL: process.env.PUSHER_CHANNEL || "",
		PROJECT_NAME: process.env.PROJECT_NAME || "Horus Health",
		HORUS_VOICE_API_URL: process.env.HORUS_VOICE_API_URL || "http://localhost:8000",
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		"@/plugins/loading-request.js",
		"@/plugins/adjuntos.js",
		"@/plugins/menu.js",
		"@/plugins/can.js",
		"@/plugins/localStorage.js",
		"@/plugins/axios.js",
		"@/plugins/inactivity.js",
		'~/plugins/socket.js',
		"@/plugins/formatPesos.js",
        { src: "@/plugins/vuex_persistente.js", ssr: false }
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/vuetify
		"@nuxtjs/vuetify",
		// Manejo de fechas
		"@nuxtjs/moment",
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/axios
		"@nuxtjs/axios",
		// https://go.nuxtjs.dev/pwa
		"@nuxtjs/pwa",
		//NOTIFICACIONES
		"@nuxtjs/toast",
		//NOTIFICACIONES CONDICIONALES
		"nuxt-sweetalert2",
		//reCaptcha
		"@nuxtjs/recaptcha",
		"@nuxtjs/dotenv"
	],

	toast: {
		positionClass: "toast-top-right",
		progressBar: true,
		duration: 3000,
	},

	moment: {
		defaultTimezone: "America/Bogota",
		defaultLocale: "es",
		locales: ["es"],
	},

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {
		// Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
		baseURL: process.env.API_URL,
	},

	// PWA module configuration: https://go.nuxtjs.dev/pwa
	pwa: {
		manifest: {
			lang: "es",
		},
	},

	// Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
	vuetify: {
		customVariables: ["~/assets/variables.scss"],
		theme: {
			dark: false,
			themes: {
				dark: {
					primario: "#0d78c0",
					success: "#213C70",
					warning: "#F6B332",
					sumimedical: "#74bc1f",
					boton: "#06213A",
					info: "#215370ff",
					editar: "#bc7708ff",
					alerta: "#FF5252",
					titulo: "#0075c9ff",
					card: "#E1F5FE",
				},
				light: {
					primario: "#06213A",
					sumimedical: "#378e37ff",
					boton: "#2e8231ff",
					info: "#1c78b6ff",
					editar: colors.amber.base,
					alerta: "#FF5252",
					titulo: "#8eb7e3ff",
					card: "#abd9edff",
				},
			},
		},
	},
	recaptcha: {
		siteKey: process.env.SITE_KEY,
		size: "invisible",
		hideBadge: true,
		version: 2,
	},
	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {},
};
