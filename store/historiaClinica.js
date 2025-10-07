export default {
    namespaced: true,
    state: {
        datosHistoria: {}
    },
    mutations: {
        SET_DATOS_COMPONENTE(state, { consulta_id, modelo, ruta, datos }) {
            if (!state.datosHistoria[consulta_id]) {
                state.datosHistoria[consulta_id] = {};
            }

            if (!state.datosHistoria[consulta_id][modelo]) {
                state.datosHistoria[consulta_id][modelo] = {};
            }

            state.datosHistoria[consulta_id][modelo][ruta] = datos;
        },

        LIMPIAR_DATOS(state, consulta_id) {
            if (state.datosHistoria[consulta_id]) {
                delete state.datosHistoria[consulta_id];
            }
        }
    },
    actions: {
        guardarDatosComponente({ commit }, { consulta_id, modelo, ruta, datos }) {
            commit('SET_DATOS_COMPONENTE', { consulta_id, modelo, ruta, datos });
        },

        limpiarHistoriaClinica({ commit }, consulta_id) {
            commit('LIMPIAR_DATOS', consulta_id);
        },

        async enviarHistoriaClinica({ state }, consulta_id) {
            try {
                const datosPorModeloYRuta = state.datosHistoria[consulta_id];
                const payload = {};

                for (const modelo in datosPorModeloYRuta) {
                    const rutas = datosPorModeloYRuta[modelo];
                    let datosFusionados = {};

                    for (const ruta in rutas) {
                        datosFusionados = {
                            ...datosFusionados,
                            ...rutas[ruta]
                        };
                    }

                    payload[modelo] = datosFusionados;
                }

                const response = await this.$axios.post(`/historia/finalizar-historia-clinica/${consulta_id}`, payload);
                return response.data;
            } catch (error) {
                console.error('Error al guardar historia clínica:', error);
                throw error;
            }
        }
    },
    getters: {
        obtenerDatosPorConsulta: (state) => (consulta_id, modelo, ruta) => {
            return state.datosHistoria?.[consulta_id]?.[modelo]?.[ruta] || null;
        }
    }


};
