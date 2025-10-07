<template>
  <v-container grid-list-md fluid class="pa-0">
    <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">MANEJO DE
      RESONADORES</v-alert>
    <v-layout row wrap>
      <v-col cols="12" sm="12">
        <v-layout row wrap>
          <v-flex xs12 md4 class="px-2">
            <v-text-field v-model="voz.lugar_cabeza" label="Cabeza" required></v-text-field>
          </v-flex>

          <v-flex xs12 md4 class="px-2">
            <v-text-field v-model="voz.lugar_frente" label="frente" required></v-text-field>
          </v-flex>

          <v-flex xs12 md4 class="px-2">
            <v-text-field v-model="voz.lugar_nasales" label="nasales" required>
            </v-text-field>
          </v-flex>
          <v-flex xs12 md4 class="px-2">
            <v-text-field v-model="voz.lugar_mejillas" label="mejillas" required></v-text-field>
          </v-flex>
          <v-flex xs12 md4 class="px-2">
            <v-text-field v-model="voz.lugar_cuello" label="cuello" required>
            </v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-textarea outline auto-grow outlined v-model="voz.voz_observaciones" label="OBSERVACIONES">
            </v-textarea>
          </v-flex>
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
        voz: {
          lugar_cabeza: '',
          lugar_frente: '',
          lugar_nasales: '',
          lugar_mejillas: '',
          lugar_cuello: '',
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
