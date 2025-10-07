<template>
  <v-form ref="higieneOral" lazy-validation>
    <div>
      <v-row>
        <v-col xs="12" sm="12" md="12">
          <v-alert border="left" class="text-center" dense text outlined type="info" icon="mdi-medication">
            <b>HÁBITOS HIGIENE ORAL</b></v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete dense label="Frecuencia de cepillado" outlined :items="cepillado" required
            :rules="[v => !!v || 'El campo Frecuencia de cepillado es requerido']"
            v-model="higiene_oral.frecuencia_cepillado">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete dense label="¿Quién realiza la higiene?" outlined :items="realizaHigiene" required
            :rules="[v => !!v || 'El campo quien realiza la higiene es requerido']"
            v-model="higiene_oral.realiza_higiene">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-textarea auto-grow dense label="¿Uso de crema dental?" outlined hint="Describa su uso de la crema dental"
            v-model="higiene_oral.uso_crema_dental">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-textarea auto-grow dense label="¿Uso de seda dental?" outlined hint="Describa su uso de la seda dental"
            v-model="higiene_oral.uso_seda_dental">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-textarea auto-grow dense label="¿Uso de enjuague bucal?" outlined hint="Describa el uso del enjuague bucal"
            v-model="higiene_oral.uso_enjuague_bucal">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-textarea auto-grow dense label="¿Uso de apartología ortopédica?" outlined
            hint="Describa la aparatología ortopédica que usa" v-model="higiene_oral.uso_aparatologia_ortopedica">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-textarea auto-grow dense label="¿Uso de adimentos protésicos removibles?" outlined
            hint="Describa los adimentos protésicos que usa" v-model="higiene_oral.uso_adimentos_protesicos_removibles">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-textarea auto-grow dense label="Higiene de los aparatos o prótesis" outlined
            hint="Describa el hígiene de los aparatos o protesis del paciente"
            v-model="higiene_oral.higiene_aparatos_protesis">
          </v-textarea>
        </v-col>
      </v-row>
    </div>
  </v-form>
</template>
<script>
import { mapGetters } from 'vuex';
  export default {
    name: "higieneOral",
    props: ['datos', 'resumen'],

    data() {
      return {
        cepillado: [
          'Ninguna',
          '1 vez al día',
          '2 veces al día',
          '3 veces al día',
          '4 veces al día',
          'Más'
        ],
        realizaHigiene: ['Él o ella misma(a)', 'Cuidador'],
        higiene_oral: {}
      }
    },

    created() {
    //   this.higiene_oral = this.resumen;
        const habitosHigiene = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/habitosHigieneOralComponent');

        if (habitosHigiene) {
            this.higiene_oral = { ...habitosHigiene }
        }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    methods: {
        obtenerDatos() {
                return {
                    datos: this.higiene_oral
                };
            },
      validarErrores() {
        return this.$refs.higieneOral.validate();
      }
    }
  }

</script>
