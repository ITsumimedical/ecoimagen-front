<template>
  <div>
    <v-row>
      <v-col xs="12" sm="12" md="12">
        <v-alert prominent border="left" class="text-center" dense text  type="info" icon="mdi-medication">
          <b>HÁBITOS CAVIDAD ORAL</b>
        </v-alert>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-textarea auto-grow dense label="Respiración bucal" outlined v-model="habitos_cavidad.respiracion_bucal"></v-textarea>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-textarea auto-grow dense label="Succión digital" outlined v-model="habitos_cavidad.succion_digital"></v-textarea>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-textarea auto-grow dense label="Lengua protactil" outlined v-model="habitos_cavidad.lengua_protactil"></v-textarea>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-textarea auto-grow dense label="Onicofagia" outlined v-model="habitos_cavidad.onicofagia"></v-textarea>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-textarea auto-grow dense label="Queilofagia" outlined v-model="habitos_cavidad.queilofagia"></v-textarea>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-textarea auto-grow dense label="Mordisqueo" outlined v-model="habitos_cavidad.mordisqueo"></v-textarea>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-textarea auto-grow dense label="Biberón" outlined v-model="habitos_cavidad.biberon"></v-textarea>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-textarea auto-grow dense label="Chupos" outlined v-model="habitos_cavidad.chupos"></v-textarea>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-textarea auto-grow dense label="Otros" outlined v-model="habitos_cavidad.otros"></v-textarea>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: ['datos', 'resumen'],
  data() {
    return {
      habitos_cavidad: {}
    };
  },

  created() {
    //   this.habitos_cavidad = this.resumen;
        const habitosCavidad = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/habitosCavidadOralComponent');

        if (habitosCavidad) {
            this.habitos_cavidad = { ...habitosCavidad }
        }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    methods:  {
        obtenerDatos() {
            return {
                    datos: this.habitos_cavidad
                };
        }
    }

};
</script>
