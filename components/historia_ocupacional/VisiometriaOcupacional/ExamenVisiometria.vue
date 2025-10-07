<template>
  <v-container grid-list-md fluid class="pa-0">
    <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">AGUDEZA VISUAL
    </v-alert>
    <v-layout row wrap>
      <v-flex xs12>
        <v-layout row wrap>
          <v-col cols="12" sm="3">
            <v-text-field v-model="saludVisiometriaOcupacional.avcc_ojoderecho" label="AVCC OJO DERECHO">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field v-model="saludVisiometriaOcupacional.avcc_ojoizquierdo" label="AVCC OJO IZQUIERDO">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field v-model="saludVisiometriaOcupacional.avsc_ojoderecho" label="AVSC OJO DERECHO">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field v-model="saludVisiometriaOcupacional.avsc_ojoizquierdo" label="AVSC OJO IZQUIERDO">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field v-model="saludVisiometriaOcupacional.avscav_ojoizquierdo" label="AVSC Av Cerca OJO IZQUIERDO">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field v-model="saludVisiometriaOcupacional.avscav_ojoderecho" label="AVSC Av Cerca OJO DERECHO">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field v-model="saludVisiometriaOcupacional.avcerca_ojoderecho" label="Av Cerca OJO DERECHO">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field v-model="saludVisiometriaOcupacional.avcerca_ojoizquierdo" label="Av Cerca IZQUIERDO">
            </v-text-field>
          </v-col>
        </v-layout>
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">MOTILIDAD
          OCULAR</v-alert>
          <v-layout row wrap>
            <v-flex xs12 sm12 class="px-5">
              <v-textarea auto-grow outlined v-model="saludVisiometriaOcupacional.motilidad_ocular" label="Motilidad ocular"></v-textarea>
            </v-flex>
          </v-layout>
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">TEST DE
          ESTEREOPSIS</v-alert>
        <v-layout row wrap>
          <v-flex xs12 sm12 class="px-5">
            <v-textarea auto-grow outlined v-model="saludVisiometriaOcupacional.estereopsis" label="ESTEREOPSIS">
            </v-textarea>
          </v-flex>
        </v-layout>
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">TEST DE VISIÓN
          AL COLOR</v-alert>
        <v-layout row wrap>
          <v-flex xs12 sm12 class="px-5">
            <v-textarea auto-grow outlined v-model="saludVisiometriaOcupacional.vision_color" label="VISIÓN AL COLOR">
            </v-textarea>
          </v-flex>
        </v-layout>
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">RETINOSCOPIA
        </v-alert>
        <v-layout row wrap>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow outlined v-model="saludVisiometriaOcupacional.retinoscopia_ojoderecho" label="OJO DERECHO">
            </v-textarea>
          </v-flex>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow outlined v-model="saludVisiometriaOcupacional.retinoscopia_ojoizquierdo" label="OJO IZQUIERDO">
            </v-textarea>
          </v-flex>
        </v-layout>
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">BIOMICROSCOPIA
        </v-alert>
        <v-layout row wrap>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow outlined v-model="saludVisiometriaOcupacional.gionios_ojoderecho" label="OJO DERECHO"></v-textarea>
          </v-flex>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow outlined v-model="saludVisiometriaOcupacional.gionios_ojoizquierdo" label="OJO IZQUIERDO">
            </v-textarea>
          </v-flex>
        </v-layout>
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">FONDO DE OJO
        </v-alert>
        <v-layout row wrap>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow outlined v-model="saludVisiometriaOcupacional.fondo_ojoderecho" label="OJO DERECHO">
            </v-textarea>
          </v-flex>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow outlined v-model="saludVisiometriaOcupacional.fondo_ojoizquierdo" label="OJO IZQUIERDO"></v-textarea>
          </v-flex>
          <v-col cols="12" sm="12">
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" dark small>Guardar</v-btn>
            </v-card-actions>
          </v-col>
        </v-layout>
      </v-flex>
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
      // this.fetchVisiometria();
    },
    data() {
      return {

        agudezas: ['20/20', '20/30', '20/40', '20/50', '20/60', '20/70', '20/80', '20/100', '20/200', '20/400',
          'PL', 'NPL', 'N/A'
        ],
        saludVisiometriaOcupacional: {
          avcc_ojoderecho: '',
          avcc_ojoizquierdo: '',
          avsc_ojoderecho: '',
          avsc_ojoizquierdo: '',
          avscav_ojoizquierdo: '',
          avscav_ojoderecho: '',
          avcerca_ojoderecho: '',
          avcerca_ojoizquierdo: '',
          motilidad_ocular: '',
          estereopsis: '',
          vision_color: '',
          retinoscopia_ojoderecho: '',
          retinoscopia_ojoizquierdo: '',
          gionios_ojoderecho: '',
          gionios_ojoizquierdo: '',
          fondo_ojoderecho: '',
          fondo_ojoizquierdo: '',
          aptitud_laboral_visiomretria: '',
        }
      }
    },

    methods: {
      // saveVisiometria() {
      //     axios.post('/api/cita/saveSaludocupacional/' + this.datosCita.cita_paciente_id, this
      //             .saludVisiometriaOcupacional)
      //         .then((res) => {
      //             this.$alertHistoria('<span style="color:#fff">' + res.data.message + '<span>');
      //             this.$emit('respuestaComponente')
      //         })
      // },

      // fetchVisiometria() {
      //     axios.post('/api/cita/getSaludocupacional/' + this.datosCita.cita_paciente_id)
      //         .then(res => {
      //             if (res.data) {
      //                 this.saludVisiometriaOcupacional = res.data
      //             }
      //         })
      // }

    }
  }

</script>
