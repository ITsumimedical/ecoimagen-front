<template>
  <div>
    <v-form>
      <v-row>
        <v-col xs="12" sm="12" md="12">
          <v-alert class="text-center" dense text type="info" icon="mdi-eye-check-outline" border="left">
            <b>BIOMICROSCOPIA</b></v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="6">
            <v-alert text dense color="warning" border="left" class="text-center" icon="mdi-eye-arrow-right-outline"><b>OJO DERECHO</b></v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="6">
            <v-alert text dense color="warning" border="left" class="text-center" icon="mdi-eye-arrow-left-outline"><b>OJO IZQUIERDO</b></v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-textarea outlined auto-grow  autofocus v-model="oftalmoscopia.biomicroscopiaod"></v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-textarea outlined auto-grow  autofocus v-model="oftalmoscopia.biomicroscopiaoi">
          </v-textarea>
        </v-col>
        <v-col xs="12" sm="12" md="12">
          <v-alert class="text-center" dense text color="info" icon="mdi-eye" border="left">
            <b>PIO</b></v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="6">
            <v-alert text dense color="warning" border="left" class="text-center" icon="mdi-eye-arrow-right-outline"><b>OJO DERECHO</b></v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="6">
            <v-alert text dense color="warning" border="left" class="text-center" icon="mdi-eye-arrow-left-outline"><b>OJO IZQUIERDO</b></v-alert>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-textarea label="OD" v-model="oftalmoscopia.piood" outlined dense auto-grow>
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-textarea label="OI" outlined v-model="oftalmoscopia.piooi" dense auto-grow>
          </v-textarea>
        </v-col>
        <v-col xs="12" sm="12" md="12">
          <v-alert class="text-center" dense text color="blue" icon="mdi-eye-minus-outline" border="left">
            <b>OFTALMOSCOPIA</b></v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="6">
            <v-alert text dense color="warning" border="left" class="text-center" icon="mdi-eye-arrow-right-outline"><b>OJO DERECHO</b></v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="6">
            <v-alert text dense color="warning" border="left" class="text-center" icon="mdi-eye-arrow-left-outline"><b>OJO IZQUIERDO</b></v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-textarea label="OD" v-model="oftalmoscopia.oftalmoscopiaod" outlined dense auto-grow autofocus>
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-textarea label="OI" v-model="oftalmoscopia.oftalmoscopiaoi" outlined dense auto-grow autofocus>
          </v-textarea>
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
      oftalmoscopia: {},
    }
  },
  created() {
        const datosOftalmologia = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/BiomiOftalmoscopia');

        if (datosOftalmologia) {
            this.oftalmoscopia = {...datosOftalmologia}
        }
  },

  computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
  methods: {
    obtenerDatos() {
            return { datos: this.oftalmoscopia };
        },
    validarErrores() {
              return [];
            },
  }
}

</script>
