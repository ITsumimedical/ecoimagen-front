<template>
  <v-container grid-list-md fluid class="pa-0">
      <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked"> RESPIRACIÓN</v-alert>
    <v-layout row wrap>
      <v-col cols="12" sm="12">
          <v-layout row wrap>
            <v-col cols="12" sm="3">
              <v-radio-group v-model="voz.respiracion_modo" label="MODO">
                <v-radio v-for="n in modo" :key="n" :label="`${n}`" :value="n" color="primary">
                </v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" sm="3">
              <v-radio-group v-model="voz.respiracion_tipo" label="TIPO">
                <v-radio v-for="n in tipo" :key="n" :label="`${n}`" :value="n" color="primary">
                </v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" sm="3">
              <v-radio-group v-model="voz.respiracion_fonorespiratoria" label="COORD. FONORESPIRATORIA">
                <v-radio v-for="n in fonorespiratoria" :key="n" :label="`${n}`" :value="n" color="primary"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" sm="3">
              <v-radio-group v-model="voz.perimetros_biaxilar" label="PRUEBA GLATZER">
                <v-radio v-for="n in glatzer" :key="n" :label="`${n}`" :value="n" color="primary">
                </v-radio>
              </v-radio-group>
            </v-col>
          </v-layout>
          <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked"> PERIMETROS</v-alert>
          <v-layout row wrap>
            <v-col cols="12" sm="4">
              <v-text-field v-model="voz.perimetros_xifoideo" label="biaxilar" required>
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field v-model="voz.perimetros_abdominal" label="xifoideo" required>
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field v-model="voz.respiracion_prueba_glatzer" label="abdominal" required>
              </v-text-field>
            </v-col>
          </v-layout>
          <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked"> TIEMPOS DE RESPIRACION</v-alert>
          <v-layout row wrap>
            <v-col cols="12" sm="4">
              <v-text-field v-model="voz.tiempos_respiracion_inspiracion" label="inspiración" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field v-model="voz.tiempos_respiracion_espiracion" label="espiración" required>
              </v-text-field>
            </v-col>
          </v-layout>
        <v-col cols="12" sm="12">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" dark small>Guardar</v-btn>
          </v-card-actions>
        </v-col>
        <!-- <v-btn color="primary" round @click="saveRespiracion()">Guardar y seguir</v-btn> -->
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
        glatzer: ['adecuada', 'inadecuada'],
        fonorespiratoria: ['Normal', 'Discontinua', 'Fuera de fase'],
        tipo: ['Costal Superior', 'Mixto', 'Abdominal'],
        modo: ['Nasal', 'Bucal', 'Mixto'],
        voz: {
          respiracion_modo: '',
          respiracion_tipo: '',
          respiracion_fonorespiratoria: '',
          perimetros_biaxilar: '',
          perimetros_xifoideo: '',
          perimetros_abdominal: '',
          respiracion_prueba_glatzer: '',
          tiempos_respiracion_inspiracion: '',
          tiempos_respiracion_espiracion: ''
        },
      }
    },

    methods: {
      // saveRespiracion() {
      //     axios.post('/api/cita/saveSaludocupacional/' + this.datosCita.cita_paciente_id, this.voz).then((
      //     res) => {
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
