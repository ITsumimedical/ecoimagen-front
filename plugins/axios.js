export default function ({ $axios, redirect, store }) {
	$axios.onError((error) => {
		// if (error.response.status === 503) {
		//     console.log('ojo con eso');
		//     redirect('/mantenimiento')
		// }
	});

	$axios.onRequest((config) => {
		const token = store.getters["auth/tokenAuthenticated"];
		if (
			token &&
			!config.url.includes(
				"https://repositoriohorushealth.nyc3.digitaloceanspaces.com"
			)
		) {
			const tokenPreparado = `Bearer ${token}`;
			config.headers.common["Authorization"] = tokenPreparado;
		}
		return config;
	});
}
