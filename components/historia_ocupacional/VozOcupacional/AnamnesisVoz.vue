<template>
  <v-container grid-list-md fluid class="pa-0">
    <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">ANAMNESIS</v-alert>
    <v-layout wrap align-center>
      <v-col cols="12" sm="5">
        <v-text-field outlined dense :value="ocupacional[0].especialidad" label="Tipo de examen" readonly>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <v-text-field outlined dense :value="ocupacional[0].ACTIVIDAD" label="Tipo de consulta" readonly>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="12">
        <v-textarea name="input-7-1" outlined label="Enfermedad Actual" auto-grow value=""
          v-model="data.enfermedad_actual">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="12">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" dark small @click="guardarMotivoConsulta()">Guardar</v-btn>
        </v-card-actions>
      </v-col>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    name: "",
    props: {
      datos: Object,
      ocupacional: Array
    },
    data() {
      return {
        data: {
          enfermedad_actual: '',
        },
      }
    },
    created() {
      this.consultarMotivoOcupacional();
    },
    methods: {

      consultarMotivoOcupacional() {
        const data = {
          consulta_id: this.ocupacional[0].id_CONSULTA
        }
        this.$axios.post('/historia_ocupacional/consultar-motivo', data)
          .then(res => {
            this.data.enfermedad_actual = res.data[0].enfermedad_actual
          });
      },

      guardarMotivoConsulta() {
        if (!this.data.enfermedad_actual) {
          return this.$swal({
            title: "¡El campo enfermedad actual es REQUERIDO!",
            type: "warning",
          });
        } else if (this.data.enfermedad_actual.length < 5) {
          return this.$swal({
            title: "¡El campo enfermedad actual debe ser mayor a 5 caracteres!",
            type: "warning",
          });
        } else if (this.ocupacional[0].id_CONSULTA) {
          this.data.tipo_examen = this.ocupacional[0].especialidad
          this.data.tipo_consulta = this.ocupacional[0].ACTIVIDAD
          this.data.consulta_id = this.ocupacional[0].id_CONSULTA
          this.$axios.post('/historia_ocupacional/motivo', this.data)
            .then(res => {
              this.$toast.success(res.data.mensaje)
              this.$emit('respuestaComponente')
            });
        }
      },


    }
  }

</script>
