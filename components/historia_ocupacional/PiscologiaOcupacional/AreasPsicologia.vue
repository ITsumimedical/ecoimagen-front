<template>
  <div>
    <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">Procesos Cognitivos
      Superiores - Area Cognitiva
    </v-alert>
    <v-layout wrap align-center>
      <v-col cols="12" sm="4">
        <v-textarea auto-grow outlined v-model="psicologiaOcupacional.proceso_cognitivo" label="Percepcion">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="4">
        <v-textarea auto-grow outlined v-model="psicologiaOcupacional.memoria" label="Memoria"></v-textarea>
      </v-col>
      <v-col cols="12" sm="4">
        <v-textarea auto-grow outlined v-model="psicologiaOcupacional.atencion" label="Atencion"></v-textarea>
      </v-col>
      <v-col cols="12" sm="4">
        <v-textarea auto-grow outlined v-model="psicologiaOcupacional.lenguaje" label="Lenguaje"></v-textarea>
      </v-col>
      <v-col cols="12" sm="4">
        <v-textarea auto-grow outlined v-model="psicologiaOcupacional.ubicacion" label="Ubicado en"></v-textarea>
      </v-col>
      <v-col cols="12" sm="4">
        <v-textarea auto-grow outlined v-model="psicologiaOcupacional.estado_mental" label="Estado Mental"></v-textarea>
      </v-col>
      <v-col cols="12" sm="4">
        <v-textarea auto-grow outlined v-model="psicologiaOcupacional.presentacion_personal"
          label="Presentación Personal">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="4">
        <v-textarea auto-grow outlined v-model="psicologiaOcupacional.introspeccion" label="Introspección ">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="4">
        <v-textarea auto-grow outlined v-model="psicologiaOcupacional.prospeccion" label="Prospección "></v-textarea>
      </v-col>
      <v-col cols="12" sm="4">
        <v-textarea auto-grow outlined v-model="psicologiaOcupacional.social" label="Area Social"></v-textarea>
      </v-col>
      <v-col cols="12" sm="4">
        <v-textarea auto-grow outlined v-model="psicologiaOcupacional.familiar" label="Area Familiar"></v-textarea>
      </v-col>
      <v-col cols="12" sm="4">
        <v-textarea auto-grow outlined v-model="psicologiaOcupacional.laboral" label="Area Laboral"></v-textarea>
      </v-col>
      <v-col cols="12" sm="4">
        <v-textarea auto-grow outlined v-model="psicologiaOcupacional.academica" label="Area Academica"></v-textarea>
      </v-col>
      <v-col cols="12" sm="4">
        <v-textarea auto-grow outlined v-model="psicologiaOcupacional.analisis_diagnostico"
          label=" Analisis Diagnostico">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="4">
        <v-textarea auto-grow outlined v-model="psicologiaOcupacional.recoleccion_datos"
          label="Tecnica de Recolección de datos">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="12">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" dark small>Guardar</v-btn>
        </v-card-actions>
      </v-col>
    </v-layout>
  </div>
</template>
<script>
  export default {
    name: "",
    props: {
      datosCita: Object
    },
    created() {
      // this.fetchOcupacional();
    },
    data() {
      return {
        psicologiaOcupacional: {
          proceso_cognitivo: '',
          memoria: '',
          atencion: '',
          lenguaje: '',
          ubicacion: '',
          estado_mental: '',
          presentacion_personal: '',
          introspeccion: '',
          prospeccion: '',
          academica: '',
          laboral: '',
          social: '',
          familiar: '',
          analisis_diagnostico: '',
          recoleccion_datos: '',
        },
      }
    },

    methods: {
      // saveSaludocupacional() {
      //     axios.post('/api/cita/saveSaludocupacional/'+ this.datosCita.cita_paciente_id, this.psicologiaOcupacional).then((
      //         res) => {
      //         this.$alertHistoria('<span style="color:#fff">' + res.data.message + '<span>');
      //         this.$emit('respuestaComponente')
      //     })
      // },
      // fetchOcupacional() {
      //     axios.post('/api/cita/getSaludocupacional/' + this.datosCita.cita_paciente_id)
      //         .then(res => {
      //             if (res.data) {
      //                 this.psicologiaOcupacional = res.data
      //             }
      //         })
      // },


    }
  }

</script>
