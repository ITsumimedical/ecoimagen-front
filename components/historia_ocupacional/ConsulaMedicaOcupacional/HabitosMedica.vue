<template>
  <div>
    <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">HABITOS FUMA</v-alert>
    <v-layout row wrap>
      <v-col cols="12" sm="3" >
        <v-select v-model="habitos.anios_fumador" :items="anosF" label="Años de Fumador">
        </v-select>
      </v-col>
      <v-col cols="12" sm="3" >
        <v-select v-model="habitos.cigarrillos_al_dia" :items="cigarrillos" label="Cigarrillos al día">
        </v-select>
      </v-col>
      <v-col cols="12" sm="3">
        <v-select v-model="habitos.fumo" :items="si_no" label="Fumo"></v-select>
      </v-col>
      <v-col cols="12" sm="3" >
        <v-text-field label="Hace cuanto no fuma" v-model="habitos.hace_cuanto_no_fuma">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="12">
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">HABITOS BEBE ALCOHOL</v-alert>
      </v-col>
      <v-layout row wrap>
        <v-col cols="12" sm="4">
          <v-select v-model="habitos.frecuencia" :items="copas" label="Frecuencia">
          </v-select>
        </v-col>
        <v-col cols="12" sm="4">
          <v-select v-model="habitos.tipo" :items="tipos" label="Tipo">
          </v-select>
        </v-col>
      </v-layout>
      <v-col cols="12" sm="12">
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">SUSTANCIAS PSICO ACTIVAS</v-alert>
      </v-col>
      <v-col cols="12" sm="12">
        <v-textarea auto-grow outlined label="Cuál(es)" v-model="habitos.cuales"></v-textarea>
      </v-col>
      <v-col cols="12" sm="12">
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">PRACTICA DEPORTE O EJERCICIO</v-alert>
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field label="Cuál" v-model="habitos.cual"></v-text-field>
      </v-col>
      <v-col cols="12" sm="4">
        <v-select v-model="habitos.regularidad" :items="regular" label="Regularidad">
        </v-select>
      </v-col>
      <v-col cols="12" sm="12">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" dark smal @click="guardarHabitos()">Guardar</v-btn>
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
      // this.fetchOcupacionale();
    },
    data() {
      return {
        regular: ['diario', '1-3 veces por semana', '1 vez a la semana', 'nunca'],
        tipos: ['RON', 'CERVEZA', 'WHISKY', 'VINO', 'AGUARDIENTE', 'OTROS'],
        copas: ['1-3 COPAS', '3-6 COPAS', 'HASTA EMBRIGARSE'],
        cigarrillos: ['1-5', '5-10', '>10'],
        anosF: ['<1', '1-5', '>5'],
        si_no: ['SI', 'NO'],
        habitos: {
          anios_fumador: '',
          cigarrillos_al_dia: '',
          fumo: '',
          hace_cuanto_no_fuma: '',
          frecuencia: '',
          tipo: '',
          cuales: '',
          cual: '',
          regularidad: '',
        }
      }
    },

    methods: {
      guardarHabitos() {
        this.habitos.consulta_id = this.tipoConsultaOcupacional['id_CONSULTA']
          this.$axios.post('/historia_ocupacional/habito/', this.habitos).then((res) => {
            return console.log('datos', res.data);
              this.$emit('respuestaComponente')
          })
      },
      // async fetchOcupacionale() {
      //     const general = await axios.post('/api/cita/getSaludocupacional/' + this.datosCita
      //         .cita_paciente_id);
      //     this.medicoSaludOcupacional = general.data;
      // },
    }
  }

</script>
<style lang="scss" scoped>

</style>
