<template>
  <div>
    <v-card>
      <v-alert text dense border="left" type="info" icon="mdi-file-download-outline">Módulo reportes de histórico
        ordenamiento MEDICAMENTOS</v-alert>
      <v-container fluid>
        <v-row dense>
          <v-col cols="12" sm="3" md="3">
            <v-text-field type="date" dense label="Fecha inicial" v-model="reporte.fecha_inicial"></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field type="date" dense label="Fecha final" v-model="reporte.fecha_final"></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-autocomplete dense label="Estado" v-model="reporte.estado_id" :items="estados" item-text="nombre"
              item-value="id"></v-autocomplete>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn dark small color="success" @click="generarReporte()">Generar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import moment from 'moment';
  export default {
    name: 'WorkspaceJsonReportes',

    data() {
      return {
        reporte: {
          fecha_inicial: moment().format("YYYY-MM-DD"),
          fecha_final: moment().format("YYYY-MM-DD"),
          estado_id: 3,
        },
        estados: [{
          nombre: 'PENDIENTE',
          id: 3
        }, {
          nombre: 'INADECUADO',
          id: 20
        }, {
          nombre: 'NEGADO',
          id: 21
        }, {
          nombre: 'ANULADO',
          id: 5
        }, {
          nombre: 'APROBADO SIN AUTORIZACIÓN',
          id: 1
        }, {
          nombre: 'APROBADO CON AUTORIZACIÓN',
          id: 4
        }],
      };
    },

    methods: {
      generarReporte() {
        if (!this.reporte.fecha_final || !this.reporte.fecha_inicial || !this.reporte.estado_id) {
          return this.$swal({
            title: "¡Error!",
            text: "Deber determinar un rango de fechas y un estado para generar el reporte",
            type: "error",
          });
        }
        this.$axios({
          method: 'post',
          params: {
            fecha_inicial: this.reporte.fecha_inicial,
            fecha_final: this.reporte.fecha_final,
            estado_id: this.reporte.estado_id
          },
          url: '/ordenamiento/exportarMedicamentos',
          responseType: 'blob',
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');

          a.download = 'medicamentos.xlsx';
          a.href = url;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.clear();
        }).catch(err => {
          console.log(err)
        })
      },
    },
  };

</script>
