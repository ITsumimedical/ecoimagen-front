<template>
    <div>
        <v-alert text dense color="blue" border="left" class="text-center"
            icon="mdi-account-convert-outline"><b>SUCESIÓN EVOLUTIVA DEL
                DESARROLLO</b></v-alert>
        <v-container>
            <v-row dense>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea label="Sucesión evolutiva de la conducta motriz-perceptiva-intelectual" dense outlined
                        auto-grow v-model="formSucesion.sucesion_evolutiva_conducta"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea label="Sucesión evolutiva de lenguaje" v-model="formSucesion.sucesion_evolutiva_lenguaje" dense outlined auto-grow></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea label="Sucesión evolutiva de área cognitiva" dense outlined auto-grow v-model="formSucesion.sucesion_evolutiva_area"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-textarea label="Sucesión evolutiva de la conducta personal - social (adaptativa)" v-model="formSucesion.sucesion_evolutiva_conducta_personal" dense outlined
                        auto-grow></v-textarea>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    props: ['datos'],
    data() {
        return {
            formSucesion: {
                sucesion_evolutiva_conducta: '',
                sucesion_evolutiva_lenguaje: '',
                sucesion_evolutiva_area: '',
                sucesion_evolutiva_conducta_personal: '',
                consulta_id: this.datos.id
            },
            loading: false
        }
    },

    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },

    mounted() {
        const sucesionEvolutiva = this.obtenerDatosPorConsulta(this.datos.id, 'SucesionEvolutiva/Model/SucesionEvolutiva', 'historia/formularios/SucesionEvolutiva');

        if (sucesionEvolutiva) {
            this.formSucesion = { ...sucesionEvolutiva }
        } else {
            this.cargarDatos();
        }
    },

    methods: {
        obtenerDatos() {
                return {
                    datos: this.formSucesion
                };
            },


        cargarDatos() {
        this.$axios.get(`sucesion/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
          this.formSucesion = {
            ...this.formSucesion,
            ...res.data
          }
        }).catch(error => {
          console.log(error);
          this.$toast.error('Error al cargar los datos');
        });
      },
    }
}
</script>
