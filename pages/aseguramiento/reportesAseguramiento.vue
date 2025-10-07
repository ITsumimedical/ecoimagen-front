<template>
  <div>
    <v-card>
      <v-alert type="info" border="left" dense text>Reportes aseguramiento</v-alert>
      <v-form>
        <v-container fluid>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field type="date" v-model="informe.fecha_desde" label="Fecha desde" dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field type="date" v-model="informe.fecha_hasta" label="Fecha hasta" dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-autocomplete dense v-model="informe.tipo_informe" label="Tipo de informe"></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small dark color="success" @click="generarInforme()">Generar reporte</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'WorkspaceJsonReportesAseguramiento',

    data() {
      return {
        informe: {
          fecha_desde: '',
          fecha_hasta: '',
          tipo_informe: '',
        }
      };
    },

    mounted() {

    },

    methods: {
      generarInforme() {
        if (this.informe.fecha_desde == '' || this.informe.form == '' || this.informe.tipo_informe == '') {
          return this.$toast.error('Debes ingresar un rango de fechas y tipo de informe para iniciar la generación');
        }
      }
    },
  };

</script>
