<template>
  <v-form ref="HistoriaOftalmologia" lazy-validation>
    <v-container fluid>
      <v-alert text dense border="left" type="info" icon="mdi-eye" class="text-center"><b>AGUDEZA VISUAL</b></v-alert>
      <v-card color="lighten-1" class="mb-5" height="auto">
        <v-layout row wrap>
          <v-flex xs6 sm6 class="px-5">
            <v-autocomplete :items="agudezas" v-model="oftamologia.avcc_ojoderecho" label="AVCC OJO DERECHO">
            </v-autocomplete>
          </v-flex>
          <v-flex xs6 sm6 class="px-5">
            <v-autocomplete :items="agudezas" v-model="oftamologia.avcc_ojoizquierdo" label="AVCC OJO IZQUIERDO">
            </v-autocomplete>
          </v-flex>
          <v-flex xs6 sm6 class="px-5">
            <v-autocomplete :items="agudezas" v-model="oftamologia.avsc_ojoderecho" label="AVSC OJO DERECHO">
            </v-autocomplete>
          </v-flex>
          <v-flex xs6 sm6 class="px-5">
            <v-autocomplete :items="agudezas" v-model="oftamologia.avsc_ojoizquierdo" label="AVSC OJO IZQUIERDO">
            </v-autocomplete>
          </v-flex>
          <v-flex xs6 sm6 class="px-5">
            <v-text-field v-model="oftamologia.ph_ojoderecho" label="PH OJO DERECHO">
            </v-text-field>
          </v-flex>
          <v-flex xs6 sm6 class="px-5">
            <v-text-field v-model="oftamologia.ph_ojoizquierdo" label="PH OJO IZQUIERDO">
            </v-text-field>
          </v-flex>
        </v-layout>
      </v-card>
      <v-alert text dense border="left" type="info" icon="mdi-eye" class="text-center"><b>MOTILIDAD OCULAR</b></v-alert>
      <v-card color="lighten-1" class="mb-5" height="auto">
        <v-layout row wrap>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow v-model="oftamologia.motilidad_ojoderecho" label="OJO DERECHO"></v-textarea>
          </v-flex>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow v-model="oftamologia.covert_ojoderecho" label="COVER TEST DERECHO">
            </v-textarea>
          </v-flex>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow v-model="oftamologia.motilidad_ojoizquierdo" label="OJO IZQUIERDO">
            </v-textarea>
          </v-flex>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow v-model="oftamologia.covert_ojoizquierdo" label="COVER TEST IZQUIERDO">
            </v-textarea>
          </v-flex>
        </v-layout>
      </v-card>
      <v-alert text dense border="left" type="info" icon="mdi-eye" class="text-center"><b>BIOMICROSCOPIA</b></v-alert>
      <v-card color="lighten-1" class="mb-5" height="auto">
        <v-layout row wrap>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow v-model="oftamologia.biomicros_ojoderecho" label="OJO DERECHO">
            </v-textarea>
          </v-flex>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow v-model="oftamologia.biomicros_ojoizquierdo" label="OJO IZQUIERDO">
            </v-textarea>
          </v-flex>
        </v-layout>
      </v-card>
      <v-alert text dense border="left" type="info" icon="mdi-eye" class="text-center"><b>PRESION INTRAOCULAR</b>
      </v-alert>
      <v-card color="lighten-1" class="mb-5" height="auto">
        <v-layout row wrap>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow v-model="oftamologia.presionintra_ojoderecho" label="OJO DERECHO">
            </v-textarea>
          </v-flex>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow v-model="oftamologia.presionintra_ojoizquierdo" label="OJO IZQUIERDO">
            </v-textarea>
          </v-flex>
        </v-layout>
      </v-card>
      <v-alert text dense border="left" type="info" icon="mdi-eye" class="text-center"><b>GIONIOSCOPIA</b></v-alert>
      <v-card color="lighten-1" class="mb-5" height="auto">
        <v-layout row wrap>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow v-model="oftamologia.gionios_ojoderecho" label="OJO DERECHO">
            </v-textarea>
          </v-flex>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow v-model="oftamologia.gionios_ojoizquierdo" label="OJO IZQUIERDO">
            </v-textarea>
          </v-flex>
        </v-layout>
      </v-card>
      <v-alert text dense border="left" type="info" icon="mdi-eye" class="text-center"><b>FONDO DE OJOS</b></v-alert>
      <v-card color="lighten-1" class="mb-5" height="auto">
        <v-layout row wrap>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow v-model="oftamologia.fondo_ojoderecho" label="OJO DERECHO">
            </v-textarea>
          </v-flex>
          <v-flex xs6 sm6 class="px-5">
            <v-textarea auto-grow v-model="oftamologia.fondo_ojoizquierdo" label="OJO IZQUIERDO">
            </v-textarea>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex';
  export default {
    name: "HistoriaOftalmologia",
    props: ['datos','resumen'],
    created() {
        const datosOftalmologia = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/HistoriaOftalmologia');

        if (datosOftalmologia) {
            this.oftamologia = { ...datosOftalmologia }
        }
      // this.fetchOftamologia();
    //   this.oftamologia = this.resumen;
    },
    data() {
      return {
        agudezas: ['20/20', '20/30', '20/40', '20/50', '20/60', '20/70', '20/80', '20/100', '20/200', '20/400',
          'PL', 'NPL'
        ],

        oftamologia: {
          avcc_ojoderecho: '',
          avcc_ojoizquierdo: '',
          avsc_ojoderecho: '',
          avsc_ojoizquierdo: '',
          ph_ojoderecho: '',
          ph_ojoizquierdo: '',
          motilidad_ojoderecho: '',
          covert_ojoderecho: '',
          motilidad_ojoizquierdo: '',
          covert_ojoizquierdo: '',
          biomicros_ojoderecho: '',
          biomicros_ojoizquierdo: '',
          presionintra_ojoderecho: '',
          presionintra_ojoizquierdo: '',
          gionios_ojoderecho: '',
          gionios_ojoizquierdo: '',
          fondo_ojoderecho: '',
          fondo_ojoizquierdo: '',
        }
      }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    methods: {
      validarErrores() {
        return [];
      },

      obtenerDatos() {
                return {
                    datos: this.oftamologia
                };
            },

      // fetchOftamologia() {
      //     this.$axios.post('/api/cita/getoftamologia/' + this.datosCita.cita_paciente_id)
      //         .then(res => {
      //             if (res.data) {
      //                 this.oftamologia = res.data
      //             }
      //         })
      //         .catch(err => console.log(err.response));
      // },

    }
  }

</script>
