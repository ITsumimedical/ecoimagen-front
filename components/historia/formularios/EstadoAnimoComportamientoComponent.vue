<template>
    <div>
        <v-col cols="12" sm="12" md="12">
            <v-alert color="info" border="left" dense text icon="mdi-brain" class="text-center"><b>NEUROPSICOLOGÍA</b></v-alert>
        </v-col>
        <v-textarea outlined auto-grow name="input-7-4" v-model="form.estado_animo_comportamiento"
            label="ESTADO ANIMO COMPORTAMIENTO">
        </v-textarea>
        <v-textarea outlined auto-grow name="input-7-4" v-model="form.actividades_basicas_instrumentales"
            label="ACTIVIDADES BÁSICAS E INSTRUMENTALES DE LA VIDA DIARIA">
        </v-textarea>
        <v-textarea outlined auto-grow name="input-7-4" v-model="form.composicion_familiar"
            label="COMPOSICIÓN FAMILIAR">
        </v-textarea>
        <v-textarea outlined auto-grow name="input-7-4" v-model="form.evolucion_pruebas" label="EVOLUCIÓN Y PRUEBAS">
        </v-textarea>
        <v-textarea outlined auto-grow name="input-7-4" v-model="form.nivel_pre_morbido" label="NIVEL PRE MÓRBIDO">
        </v-textarea>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'WorkspaceJsonEstadoAnimoComportamientoComponent',
    props: ['datos'],
    data() {
        return {
            form: {
                estado_animo_comportamiento: null,
                composicion_familiar: null,
                evolucion_pruebas: null,
                nivel_pre_morbido: null,
                consulta_id: this.datos.id,
            }
        };
    },

    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    mounted() {
        const estadoAnimo = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Neuropsicologia/Models/Neuropsicologia', 'historia/formularios/EstadoAnimoComportamientoComponent');

        if (estadoAnimo) {
            this.form = { ...estadoAnimo }
        } else {
            this.cargarDatos();
        }
    },

    methods: {
        obtenerDatos() {
                return {
                    datos: this.form
                };
            },

        cargarDatos() {
        this.$axios.get(`historia/neuropsicologia/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
          this.form = {
            ...this.form,
            ...res.data
          }
        }).catch(error => {
          console.log(error);
          this.$toast.error('Error al cargar los datos');
        });
      },
    }
};

</script>
