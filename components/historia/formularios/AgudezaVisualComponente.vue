<template>
    <div>
        <v-alert text dense color="info" border="bottom" icon="mdi-eye-arrow-right-outline" class="text-center">
            <b>AGUDEZA VISUAL</b>
        </v-alert>

        <v-col xs="12" sm="6" md="12">
            <v-textarea dense label="Agudeza Visual Ojo Izquierdo" outlined auto-grow
                v-model="agudeza.agudeza_visual_ojo_izquierdo"></v-textarea>
        </v-col>
        <v-col xs="12" sm="6" md="12">
            <v-textarea dense label="Agudeza Visual Ojo Derecho" outlined auto-grow
                v-model="agudeza.agudeza_visual_ojo_derecho"></v-textarea>
        </v-col>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    props:['datos'],
    data() {
        return {
            agudeza: {
                agudeza_visual_ojo_izquierdo: '',
                agudeza_visual_ojo_derecho: ''
            }
        }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    mounted() {
        const datosAgudeza = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/AgudezaVisualComponente');

        if (datosAgudeza) {
           this.agudeza = {...datosAgudeza}
        }
    },
    methods: {
         obtenerDatos() {
            return { datos: this.agudeza };
        },
    }
}
</script>
