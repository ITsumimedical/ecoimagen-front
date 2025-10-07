import Swal from "sweetalert2";

export default {
	namespaced: true,
	state: () => ({
		data: null,
		afiliado: null,
		preload: false,
		intentoBuscar: false,
		informacionGeneral: {},
		datosGenerales: {},
		encuestaPsicosocial: {},
		vivienda: {},
	}),

	mutations: {
		setAfiliado(state, afiliado) {
			state.afiliado = afiliado;
		},

		setEncuesta(state, encuesta) {
			state.data = encuesta;
		},

		setPreload(state, valor) {
			state.preload = valor;
		},

        setInformacionGeneral(state, datos) {
			state.informacionGeneral = datos;
		},

		setDatosGenerales(state, datos) {
			state.datosGenerales = datos;
		},

		setEncuestaPsicosocial(state, datos) {
			state.encuestaPsicosocial = datos;
		},
		setVivienda(state, datos) {
			state.vivienda = datos;
		},

		actualizarEstado(state, {
			clave,
			datos
		}) {
			state[clave] = datos;
		},

		setMascotas(state, mascotas) {
			if (!state.vivienda.form) {
				state.vivienda.form = {};
			}
			state.vivienda.form.mascotas = { ...mascotas };
		},
	},

	actions: {
        resetEncuesta({ commit }) {
            commit("setEncuesta", null);
            commit("setAfiliado", null);
        },
		actualizarMascotas({ commit }, mascotas) {
			commit('setMascotas', mascotas);
		},

		guardarDatos({ commit }, { clave, datos }) {
			commit('actualizarEstado', {
				clave,
				datos: datos
			});
		},

		/**
		 * seteamos la encuesta
		 * @param {*} param0
		 * @param {*} afiliado
		 * @returns
		 */
		setEncuesta({commit}, encuesta) {
			commit('setEncuesta', encuesta);
		},


		/**Manuela
		 * Actualiza la encuesta con los datos de la encuesta original
		 * @param {*} param0
		 * @param {*} param1
		 * @returns
		 * 		- Encuesta actualizada
		 */
		async enviarFormulario({ state, commit, dispatch }, { afiliado }) {
			if (!afiliado?.id) {
				return;
			}

			const afiliado_id = afiliado.id;

			try {
				const result = await Swal.fire({
					title: "¿Estás seguro?",
					text: "¿Deseas enviar la encuesta?",
					tpe: "warning",
					showCancelButton: true,
					confirmButtonText: "Sí, enviar",
					cancelButtonText: "Cancelar",
				});
				if (!result.value) return;

				commit("setPreload", true);


				// Hacer una copia de respaldo antes de modificar los datos
				const copiaOriginal = JSON.parse(JSON.stringify({
					afiliado_id,
					...state.data
				}));

				// Actualizar la encuesta con la copia original
				commit("setEncuesta", copiaOriginal);

				let datosFinales = copiaOriginal;

				const encuestaExiste = state.data.id;
				const url = encuestaExiste ?
					`/caracterizacion/actualizar-encuesta/${encuestaExiste}` :
					"/caracterizacion/crear-encuesta";

				await this.$axios({
					method: encuestaExiste ? "put" : "post",
					url,
					data: datosFinales,
				});

				await Swal.fire({
					title: encuestaExiste ? "¡Éxito!" : "¡Listo!",
					text: encuestaExiste ?
						"Caracterización actualizada correctamente." : "Caracterización creada correctamente.",
					type: "success",
					confirmButtonText: "OK",
				});

                dispatch("resetEncuesta");
			} catch (error) {
				this.$toast.error("Ocurrió un error al guardar la encuesta");
			} finally {
				commit("setPreload", false);
			}
		},
	},

};
