export const state = () => ({

        municipios :[],
        entidades: []

})

export const mutations = {
        cargarMunicipios(state, consulta){
            state.municipios = consulta;
        },

        cargarEntidades(state, consulta){
            state.entidades = consulta
        }
};

export const actions = {
        listarMunicipio({commit}) {
            this.$axios
                .get("/municipios/listar")
                .then((res) => {
                    const carga = res.data
                    commit('cargarMunicipios', carga)
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar los municipios");
                })
                
        },
        listarEntidades({commit}){
            this.$axios
                .get("/entidad/listar")
                .then((res) => {
                    const carga = res.data;
                    commit('cargarEntidades',carga)
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar las entidades");
                })
                
            
        }

    }

