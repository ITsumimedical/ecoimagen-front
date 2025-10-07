<template>
  <div>
    <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">REVISION POR
      SISTEMAS
    </v-alert>
    <v-layout row wrap>
      <v-col cols="12" sm="3">
        <v-select v-model="revisionPorSistemas.cabeza_y_orl" :items="refiere" label="Cabeza y orl">
        </v-select>
      </v-col>
      <v-col cols="12" sm="3">
        <v-select v-model="revisionPorSistemas.sistema_neurologico" :items="refiere" label="Sistema neurologico">
        </v-select>
      </v-col>
      <v-col cols="12" sm="3">
        <v-select v-model="revisionPorSistemas.sistema_cardiopulmonar" :items="refiere"
          label="Sistema cardiopulmonar"></v-select>
      </v-col>
      <v-col cols="12" sm="3">
        <v-select v-model="revisionPorSistemas.sistema_digestivo" :items="refiere" label="Sistema digestivo">
        </v-select>
      </v-col>
      <v-col cols="12" sm="3">
        <v-text-field label="sistema_musculo_esqueletico" v-model="revisionPorSistemas.sistema_musculo_esqueletico">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <v-text-field label="sistema_genitourinario" v-model="revisionPorSistemas.sistema_genitourinario">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <v-text-field label="piel_y_faneras" v-model="revisionPorSistemas.piel_y_faneras">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <v-text-field label="otros" v-model="revisionPorSistemas.otros">
        </v-text-field>
      </v-col>
    </v-layout>
      <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">ESPIROMETRIA
      </v-alert>
      <v-col cols="12" sm="5">
        <v-radio-group row label="ESPIROMETRIA" v-model="revisionPorSistemas.espirometria" >
          <v-radio label="SI" value="si" color="success"></v-radio>
          <v-radio label="NO" value="no" color="red"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="12" sm="12" v-if="revisionPorSistemas.espirometria == 'si'">
        <v-textarea name="input-7-1"  auto-grow outlined label="Si espirometría" v-model="revisionPorSistemas.espirometria_si">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="12" v-if="revisionPorSistemas.espirometria == 'no'">
        <v-textarea name="input-7-1" auto-grow outlined label="No espirometría" v-model="revisionPorSistemas.espirometria_no">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="12">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" dark small @click="guardarRevisionSistemas()">Guardar</v-btn>
        </v-card-actions>
      </v-col>
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
      // this.fetchOcupacionale();
    },
    data() {
      return {
        refiere: ['Refiere', 'No refiere'],
        si_no: ['SI', 'NO'],
        revisionPorSistemas: {
          cabeza_y_orl: 'No refiere',
          sistema_neurologico: 'No refiere',
          sistema_cardiopulmonar: 'No refiere',
          sistema_digestivo: 'No refiere',
          sistema_musculo_esqueletico: 'No refiere',
          sistema_genitourinario: 'No refiere',
          piel_y_faneras: 'No refiere',
          otros: 'No refiere',
          espirometria: '',
          espirometria_si: '',
          espirometria_no: '',
        }
      }
    },

    methods: {

      guardarRevisionSistemas() {
        this.revisionPorSistemas.consulta_id = this.tipoConsultaOcupacional['id_CONSULTA']
          this.$axios.post('/historia_ocupacional/revision-sistemas/', this.revisionPorSistemas).then((res) => {
              this.$emit('respuestaComponente')
          })
      },
      // async fetchOcupacionale() {
      //     const general = await axios.post('/api/cita/getSaludocupacional/' + this.datosCita
      //         .cita_paciente_id);
      //     if (!general.data) {
      //         this.medicoSaludOcupacional.cabeza_y_orl = 'No refiere',
      //             this.medicoSaludOcupacional.sistema_neurologico = 'No refiere',
      //             this.medicoSaludOcupacional.sistema_cardiopulmonar = 'No refiere',
      //             this.medicoSaludOcupacional.sistema_digestivo = 'No refiere',
      //             this.medicoSaludOcupacional.sistema_musculo_esqueletico = 'No refiere',
      //             this.medicoSaludOcupacional.sistema_genitourinario = 'No refiere',
      //             this.medicoSaludOcupacional.piel_y_faneras = 'No refiere',
      //             this.medicoSaludOcupacional.otros = 'No refiere'
      //     } else {
      //         this.medicoSaludOcupacional = general.data;
      //     }
      // },
    }
  }

</script>
<style lang="scss" scoped>
  #signature {
    border: double 3px transparent;
    border-radius: 5px;
    background-image: linear-gradient(white, white),
      radial-gradient(circle at top left, #4bc5e8, #9f6274);
    background-origin: border-box;
    background-clip: content-box, border-box;
  }

</style>
