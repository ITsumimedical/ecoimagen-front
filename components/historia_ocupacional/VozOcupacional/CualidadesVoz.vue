<template>
  <v-container grid-list-md fluid class="pa-0">
    <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">CUALIDADES DE LA VOZ</v-alert>
    <v-layout row wrap>
        <v-col cols="12" sm="12">
          <v-layout row wrap>
            <v-col cols="12" sm="3">
              <v-radio-group v-model="voz.timbre" label="TIMBRE">
                <v-radio v-for="n in Calidad" :key="n" :label="`${n}`" :value="n" color="primary">
                </v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" sm="3">
              <v-radio-group v-model="voz.intensidad" label="INTENSIDAD">
                <v-radio v-for="n in Intensidad" :key="n" :label="`${n}`" :value="n" color="primary">
                </v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" sm="3">
              <v-radio-group v-model="voz.tono" label="TONO">
                <v-radio v-for="n in Tono" :key="n" :label="`${n}`" :value="n" color="primary">
                </v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" sm="3">
              <v-radio-group v-model="voz.cierre_glotico" label="CIERRE GLOTICO">
                <v-radio v-for="n in Glotico" :key="n" :label="`${n}`" :value="n" color="primary">
                </v-radio>
              </v-radio-group>
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
      // this.fetchVoz();
    },
    data() {
      return {
        Calidad: ['Normal', 'Disfonico', 'Nasalizado'],
        Intensidad: ['Normal', 'Disminuida', 'Aumentada'],
        Tono: ['Normal', 'Hipertonico', 'Hipotonico'],
        Glotico: ['Completo', 'Incompleto'],
        voz: {
          timbre: '',
          intensidad: '',
          tono: '',
          cierre_glotico: ''
        },
      }
    },

    methods: {
      // saveRespiracion() {
      //     axios.post('/api/cita/saveSaludocupacional/' + this.datosCita.cita_paciente_id, this.voz).then((
      //         res) => {
      //         this.$alertHistoria('<span style="color:#fff">' + res.data.message + '<span>');
      //         this.$emit('respuestaComponente')
      //         this.fetchVoz()
      //     })
      // },

      // fetchVoz() {
      //     axios.post('/api/cita/getSaludocupacional/' + this.datosCita.cita_paciente_id)
      //         .then(res => {
      //             if (res.data) {
      //                 this.voz = res.data
      //             }
      //         })
      // }


    }
  }

</script>
