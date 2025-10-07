<template>
  <div>
    <v-form>
      <v-row>
        <v-col xs="12" sm="12" md="12">
          <v-alert class="text-center" dense text type="info" icon="mdi-eye-refresh" border="left">
            <b>QUERATOMETRIA</b></v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="6">
            <v-alert text dense color="warning" border="left" class="text-center" icon="mdi-eye-arrow-right-outline"><b>OJO DERECHO</b></v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="6">
            <v-alert text dense color="warning" border="left" class="text-center" icon="mdi-eye-arrow-left-outline"><b>OJO IZQUIERDO</b></v-alert>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-text-field outlined v-model="refraccion.queratometria_od" label="OD" dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-text-field v-model="refraccion.queratometria_oi" outlined  label="OI" dense></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" md="12">
          <v-alert class="text-center" dense text type="info" icon="mdi-eye-plus" border="left">
            <b>REFRACCION</b></v-alert>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-text-field outlined v-model="refraccion.refraccion_od" label="OD" dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-text-field outlined v-model="refraccion.refraccionav_od" label="AV" dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-text-field v-model="refraccion.refraccion_oi" outlined  label="OI" dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-text-field v-model="refraccion.refraccionav_oi" outlined  label="AV" dense></v-text-field>
        </v-col>
        <v-col xs="12" sm="12" md="12">
          <v-alert class="text-center" dense text type="info" icon="mdi-eye-check" border="left">
            <b>SUBJETIVO</b></v-alert>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-text-field v-model="refraccion.subjetivo_od"  outlined  label="OD" dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-text-field v-model="refraccion.subjetivoav_od" outlined  label="AV" dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-text-field v-model="refraccion.subjetivo_oi" outlined  label="OI" dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-text-field v-model="refraccion.subjetivoav_oi" outlined  label="AV" dense></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {

  props: ['datos', 'resumen'],
  data() {
    return {
      refraccion: {}
    }
  },

  created() {
        const datosRefraccion = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/RefraccionSubjetivo');

        if (datosRefraccion) {
            this.refraccion = {...datosRefraccion}
        }
  },
  computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
  methods: {
    obtenerDatos() {
            return { datos: this.refraccion };
        },
    validarErrores() {
              return [];
            },
  }
}
</script>
