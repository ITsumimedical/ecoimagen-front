<template>
  <v-container grid-list-md fluid class="pa-0">
    <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">CONCEPTO DE APTITUD
      LABORAL</v-alert>
    <v-layout row wrap>
      <v-col cols="12" sm="12">
        <v-layout row wrap>
          <v-col cols="12" sm="12">
            <v-autocomplete :items="aptitud" v-model="conducta.aptitud_laboral_psicologia"
              label="CONCEPTO DE APTITUD LABORAL">
            </v-autocomplete>
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete :items="[
									'Consulta SST', 'No aplica'
								]" label="Finalidad" append-icon="mdi-magnify" v-model="conducta.Finalidad"></v-autocomplete>
          </v-col>
        </v-layout>
        <!-- <v-btn color="primary" round @click="nextFin()">Guardar y terminar</v-btn> -->
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">CONDUCTAS
        </v-alert>
        <v-layout row wrap>
          <v-col cols="12" sm="6">
            <v-textarea label="Recomendaciones Personales" auto-grow outlined v-model="conducta.Planmanejo">
            </v-textarea>
          </v-col>
          <v-col cols="12" sm="6">
            <v-textarea label="Recomendaciones laborales" auto-grow outlined v-model="conducta.Recomendaciones">
            </v-textarea>
          </v-col>
        </v-layout>
        <v-col cols="12" sm="12">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" dark small>Guardar</v-btn>
          </v-card-actions>
        </v-col>
      </v-col>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    name: "",
    props: {
      datosCita: Object
    },
    created() {
      // this.fetchConducta();
    },
    data() {
      return {
        aptitud: ['Sin Recomendaciones Laborales', 'Con Recomendaciones  Laborales',
          'Sin Restricciones  Laborales', 'Con Restricciones Laborales'
        ],
        conducta: {
          Planmanejo: '',
          Recomendaciones: '',
          Destinopaciente: '',
          Finalidad: '',
          aptitud_laboral_psicologia: ''
        },
      }
    },

    methods: {

      // guardarConducta() {
      //     if (this.conducta.Planmanejo == undefined) {
      //         Swal.fire({
      //             icon: 'error',
      //             title: '<span style="color:#000">Plan de manejo debe ser minimo de 5 caracteres !<span>'
      //         })
      //         return;
      //     } else if (this.conducta.Recomendaciones == undefined) {
      //         Swal.fire({
      //             icon: 'error',
      //             title: '<span style="color:#000">Recomendaciones de consulta debe ser minimo de 5 caracteres!<span>'
      //         })
      //         return;
      //     } else if (!this.conducta.Destinopaciente) {
      //         Swal.fire({
      //             icon: 'error',
      //             title: '<span style="color:#000">Destino del paciente es requerido!<span>'
      //         })
      //         return;
      //     } else if (!this.conducta.Finalidad) {
      //         Swal.fire({
      //             icon: 'error',
      //             title: '<span style="color:#000">La FINALIDAD es requerida!<span>'
      //         })
      //         return;
      //     }

      //     axios
      //         .post("/api/conducta/" + this.datosCita.cita_paciente_id + "/final", this.conducta)
      //         .then(res => {
      //             this.$alertHistoria('<span style="color:#fff">' + res.data.message + '<span>');
      //             this.$emit('respuestaComponente')
      //         });
      // },

      // fetchConducta() {
      //     axios.post('/api/conducta/' + this.datosCita.cita_paciente_id + '/getConductaByCita')
      //         .then(res => {
      //             if (res.data) {
      //                 this.conducta = res.data
      //             }
      //         })

      // }

    }
  }

</script>
