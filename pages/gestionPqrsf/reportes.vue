<template>
  <div>
    <v-card>
      <v-card-text flat>
        <v-col cols="12" sm="12" md="12">
          <v-alert dense text outlined color="info" class="text-center">PQRSF
          </v-alert>
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <v-select :items="pqrsf" label="Selecciona PQRSF" item-text="nombre" item-value="id" v-model="filtro.resolucion">
          </v-select>
        </v-col>

        <v-row>
          <v-col cols="12" sm="12" md="4" v-if="filtro.resolucion === 4">
            <v-autocomplete v-model="filtro.entidad" item-value="id" item-text="nombre" :items="listTipo"
              label="Seleccione Tipo">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="filtro.resolucion === 5">
            <v-text-field  v-model="filtro.cedulaPacientes"  label="Cedula del paciente">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="3" v-if="filtro.resolucion !=1">
            <v-text-field type="date" label="Fecha Desde" v-model="filtro.fechaDesde">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="3" v-if="filtro.resolucion !=1">
            <v-text-field type="date" label="Fecha Hasta" v-model="filtro.fechaHasta">
            </v-text-field>
          </v-col>
          <v-card-actions>
            <v-btn color="orange" small dark @click="generarInforme()"> Descargar
            </v-btn>
          </v-card-actions>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  export default {

    data() {
      return {
        pqrsf: [{
          id: 1,
          nombre: 'Pendientes PQRSF',
          fileName: 'PendientePqrsf'
        }, {
          id: 2,
          nombre: 'Informe Global de PQRSF',
          fileName: 'GlobalPqrsf'
        }, {
          id: 3,
          nombre: 'Reporte de Oportunidad PQRSF',
          fileName: 'OportunidadPqrsf'
        }, {
          id: 4,
          nombre: 'Reporte de conteo PQRSF',
          fileName: 'ConteoPqrsf'
        }, {
          id: 5,
          nombre: 'Reporte de PQRSF por Paciente',
          fileName: 'Historico Paciente Pqrsf'
        }, {
          id: 6,
          nombre: 'Reporte de PQRSF por Usuario',
          fileName: 'Historico Usuario Pqrsf'
        }, {
          id: 7,
          nombre: 'Reporte de PQRSF SuperSalud',
          fileName: 'Informe Supersalud'
        }],

        listTipo: [{
          id: 1,
          nombre: 'Medicamentos'
        }, {
          id: 2,
          nombre: 'Servicio'
        }, {
          id: 3,
          nombre: 'Area'
        }],

        filtro: {
          resolucion: ''
        },
      }
    },

    methods:{

      generarInforme(){
        this.$axios({
          method: 'post',
          params: this.filtro,
          url: '/formularios-pqrsf/reporte',
          responseType: 'blob',
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');

          a.download = 'pqrsf' + '.xlsx';
          a.href = url;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.dialog = false
          this.clear();
        }).catch(err => {
          console.log(err)
        })
      },

    }
  }

</script>
