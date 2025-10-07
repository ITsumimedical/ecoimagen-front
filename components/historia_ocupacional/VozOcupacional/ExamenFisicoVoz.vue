<template>
  <v-container grid-list-md fluid class="pa-0">
            <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">MUSCULATURA LARINGEA</v-alert>
    <v-layout row wrap>
        <v-col cols="12" sm="12">
          <v-layout row wrap>
            <v-col cols="12" sm="3">
              <v-text-field v-model="voz.musculatura_laringea_normal" label="normal" required>
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="3">
              <v-text-field v-model="voz.musculatura_laringea_irritada" label="irritada" required>
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="3">
              <v-text-field v-model="voz.musculatura_laringea_inflamada" label="inflamada" required>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field v-model="voz.musculatura_laringea_placas" label="placas" required>
              </v-text-field>
            </v-col>
          </v-layout>
          <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">MUSCULATURA EXTRALARINGEA</v-alert>
          <v-layout row wrap>
            <v-col cols="12" sm="3">
              <v-text-field v-model="voz.musculatura_extralaringea_dolor_palpar" label="dolor al palpar" required>
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="3">
              <v-text-field v-model="voz.musculatura_extralaringea_dolor_deglutir" label="dolor al deglutir" required>
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="3">
              <v-text-field v-model="voz.musculatura_extralaringea_tono_normal" label="tono normal" required>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field v-model="voz.musculatura_extralaringea_tono_aumentado" label="tono aumentado" required>
              </v-text-field>
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
        voz: {
          musculatura_laringea_normal: '',
          musculatura_laringea_irritada: '',
          musculatura_laringea_inflamada: '',
          musculatura_laringea_placas: '',
          musculatura_extralaringea_dolor_palpar: '',
          musculatura_extralaringea_dolor_deglutir: '',
          musculatura_extralaringea_tono_normal: '',
          musculatura_extralaringea_tono_aumentado: ''
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
