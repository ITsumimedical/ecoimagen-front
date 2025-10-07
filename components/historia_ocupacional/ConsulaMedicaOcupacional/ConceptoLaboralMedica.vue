<template>
  <div>
    <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">CONCEPTO MÉDICO DE
      APTITUD LABORAL – MEDICO OCUPACIONAL
    </v-alert>
    <v-layout row wrap>
      <v-col cols="12" sm="5">
        <v-autocomplete :items="aptitud" v-model="conducta.aptitud_laboral_medico"
          label="CONCEPTO MÉDICO DE APTITUD LABORAL – MEDICO OCUPACIONAL">
        </v-autocomplete>
      </v-col>
    </v-layout>
    <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">SISTEMAS DE
      VIGILANCIA EPIDEMIOLÓGICO</v-alert>
    <v-layout row wrap>
      <v-col cols="12" sm="5">
        <v-autocomplete :items="epidemiologico" v-model="conducta.vigilancia_epidemiologico"
          label="SISTEMAS DE VIGILANCIA EPIDEMIOLÓGICO">
        </v-autocomplete>
      </v-col>
    </v-layout>
    <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">CONDUCTA</v-alert>
    <v-layout row wrap>
      <v-col cols="12" sm="6">
        <v-textarea label="Plan de manejo" auto-grow outlined v-model="conducta.Planmanejo"></v-textarea>
      </v-col>
      <v-col cols="12" sm="6">
        <v-textarea label="RECOMENDACIONES Y/O RESTRICCIONES LABORALES" auto-grow outlined
          v-model="conducta.Recomendaciones"></v-textarea>
      </v-col>
      <!-- <v-col cols="12" sm="3">
        <v-autocomplete :items="['Control', 'Interconsulta', 'Urgencias', 'Consulta externa prioritaria', 'No aplica'
								]" label="Destino del paciente" append-icon="mdi-magnify" v-model="conducta.Destinopaciente"></v-autocomplete>
      </v-col> -->
      <!-- <v-col cols="12" sm="3">
        <v-text-field label="Finalidad" append-icon="mdi-magnify" v-model="conducta.Finalidad" value="Consulta SST"
          readonly></v-text-field>
      </v-col> -->
      <v-col cols="12" sm="12">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" dark small @click="guardarConducta()">Guardar</v-btn>
        </v-card-actions>
      </v-col>
    </v-layout>
  </div>
</template>
<script>
  export default {
    name: "",
    props: {
      datosCita: Object,
      ocupacional: Array,
      tipoConsultaOcupacional: Object
    },
    created() {
      // this.fetchConducta();
    },
    data() {
      return {
        firmas: false,
        aptitud: ['Sin Recomendaciones Laborales', 'Con Recomendaciones  Laborales',
          'Sin Restricciones  Laborales', 'Con Restricciones Laborales'
        ],
        epidemiologico: ['sistema de vigilancia epidemiológico osteomuscular',
          'sistema de vigilancia epidemiológico voz', 'sistema de vigilancia epidemiológico psicosocial',
          'no aplica'
        ],
        conducta: {
          Planmanejo: '',
          Recomendaciones: '',
          aptitud_laboral_medico: '',
          vigilancia_epidemiologico: ''
        }
      }
    },

    methods: {

      guardarConducta() {
        if (this.conducta.Planmanejo == undefined) {
          return this.$swal({
            title: "¡Plan de manejo debe ser minimo de 5 caracteres!",
            type: "warning",
          });
        } else if (this.conducta.Recomendaciones == undefined) {
          return this.$swal({
            title: "¡Recomendaciones de consulta debe ser minimo de 5 caracteres!",
            type: "warning",
          });
        } 
        this.conducta.consulta_id = this.tipoConsultaOcupacional['id_CONSULTA']
        this.$axios.post('/historia_ocupacional/concepto/', this.conducta)
          .then(res => {
            return console.log('datos', res.data);
            this.$emit('respuestaComponente')
          });
      },

      // fetchConducta() {
      //     axios.post('/api/conducta/' + this.datosCita.cita_paciente_id + '/getConductaByCita')
      //         .then(res => {
      //             if (res.data) {
      //                 this.conducta = res.data
      //             }
      //         })
      //         .catch(err => console.log(err.response));
      // }

    }
  }

</script>
<style>
  #signature {
    border: double 3px transparent;
    border-radius: 5px;
    background-image: linear-gradient(white, white),
      radial-gradient(circle at top left, #4bc5e8, #9f6274);
    background-origin: border-box;
    background-clip: content-box, border-box;
  }

</style>
