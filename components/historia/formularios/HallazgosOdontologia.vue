<template>
  <div>
    <v-form ref="HallazgosOdontologia" lazy-validation>
      <v-col cols="12" sm="12" md="12">
        <v-alert
          class="text-center"
          dense
          text
          outlined
          type="info"
          icon="mdi-book-open-page-variant"
        >
          <b>HALLAZGOS</b></v-alert
        >
        <v-row dense>
          <v-col cols="12" sm="12" md="6">
            <v-textarea
              outlined
              auto-grow
              v-model="hallazgos.hallazgos_clinicos"
              label="Hallazgos clínicos"
              required
              :rules="[
                (v) => !!v || 'El campo Hallazgos clínicos es requerido',
              ]"
            ></v-textarea>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-textarea
              outlined
              auto-grow
              v-model="hallazgos.hallazgos_radiograficos"
              label="Hallazgos radiográficos"
              required
              :rules="[
                (v) => !!v || 'El campo Hallazgos radiográficos es requerido',
              ]"
            ></v-textarea
          ></v-col>
        </v-row>
      </v-col>
    </v-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: "HallazgosOdontologia",
  props: ["datos", "resumen"],
  data() {
    return {
      hallazgos: {
        hallazgos_clinicos: "",
        hallazgos_radiograficos: "",
      },
    };
  },
  created() {
    //   this.hallazgos = this.resumen
    const datosHallzgos = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/HallazgosOdontologia');

    if (datosHallzgos) {
        this.hallazgos = { ...datosHallzgos }
    }
  },
  computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
  methods: {

    validarErrores() {
      return this.$refs.HallazgosOdontologia.validate();
    },

    obtenerDatos() {
        return {
            datos: this.hallazgos
        };
    },
  },
};
</script>
