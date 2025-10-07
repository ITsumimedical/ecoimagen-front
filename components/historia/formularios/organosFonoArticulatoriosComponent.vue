<template>
  <div>
    <v-card elevation="0">
      <v-container fluid>
        <v-alert dense text border="left" icon="mdi-hospital-box" color="info" class="text-center">
          <b>Organos Fonoarticulatorios</b>
        </v-alert>

        <v-card-text>
          <v-form ref="datosFormulario">
          <v-row dense>
            <v-col cols="12" sm="6" md="6">
              <v-textarea auto-grow label="Lengua" outlined v-model="datosFormulario.lengua" ></v-textarea>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-textarea auto-grow label="Paladar" outlined v-model="datosFormulario.paladar"></v-textarea>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-textarea auto-grow label="Labios" outlined v-model="datosFormulario.labios"></v-textarea>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-textarea auto-grow label="Mucosa" outlined v-model="datosFormulario.mucosa"></v-textarea>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-textarea auto-grow label="Amigdalas Palatinas" outlined
                v-model="datosFormulario.amigdalas_palatinas"></v-textarea>
            </v-col>
          </v-row>
          <hr>

          <v-alert dense text border="left" icon="mdi-eye-circle-outline" color="info" class="text-center">
            <b>Ojos</b>
          </v-alert>

          <v-row dense>
            <v-col cols="12" sm="6" md="6">
              <v-textarea outlined auto-grow label="Tono" v-model="datosFormulario.tono"></v-textarea>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-textarea outlined auto-grow label="Timbre" v-model="datosFormulario.timbre"></v-textarea>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-textarea outlined auto-grow label="Volumen" v-model="datosFormulario.volumen"></v-textarea>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-textarea outlined auto-grow label="Modo Respiratorio"
                v-model="datosFormulario.modo_respiratorio"></v-textarea>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-textarea outlined auto-grow label="Tipo Respiratorio"
                v-model="datosFormulario.tipo_respiratorio"></v-textarea>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-textarea outlined auto-grow label="Evaluacion Postural"
                v-model="datosFormulario.evaluacion_postural"></v-textarea>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-textarea outlined auto-grow label="Rendimiento Vocal"
                v-model="datosFormulario.rendimiento_vocal"></v-textarea>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-textarea outlined auto-grow label="Prueba de glatzel"
                v-model="datosFormulario.prueba_de_glatzel"></v-textarea>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-textarea outlined auto-grow label="Golpe Glotico" v-model="datosFormulario.golpe_glotico"></v-textarea>
            </v-col>
          </v-row>

          <v-alert dense text border="left" icon="mdi-ear-hearing" color="info" class="text-center">
            <b>Oídos</b>
          </v-alert>

          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-textarea outlined auto-grow label="Conducto Auditivo Externo"
                v-model="datosFormulario.conducto_auditivo_externo" :rules="obligatorio"></v-textarea>
            </v-col>

          </v-row>
        </v-form>

        </v-card-text>

      </v-container>
    </v-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    datos: Object,
    ocupacional: Array,
    resumen: Object
  },

  data() {
    return {
      datosFormulario: {
        lengua: "",
        paladar: "",
        labios: "",
        mucosa: "",
        amigdalas_palatinas: "",
        tono: "",
        timbre: "",
        volumen: "",
        modo_respiratorio: "",
        tipo_respiratorio: "",
        evaluacion_postural: "",
        rendimiento_vocal: "",
        prueba_de_glatzel: "",
        golpe_glotico: "",
        conducto_auditivo_externo: "",
      },

      rules: {
        obligatorio: (v) => !!v || "Este campo es obligatorio ",
        minimo: (v) =>
          v.length >= 10 || "Este campo debe tener al menos 10 caracteres ",
      },

      preload: false
    }
  },
  computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
  created() {
    const datosOrganos = this.obtenerDatosPorConsulta(this.datos.id, 'OrganosFonoarticulatorios/Models/OrganosFonoarticulatorios', 'historia/formularios/organosFonoArticulatoriosComponent');

    if (datosOrganos) {
        this.datosFormulario = { ...datosHallzgos }
    }
  },
  methods: {
    obtenerDatos() {
        return {
            datos: this.datosFormulario
        };
    },
  }
}
</script>
