<template>
  <div>
    <v-dialog v-model="preload" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Procesando Información
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-text>
        <v-alert dense text outlined color="info" class="text-center">Filtros
        </v-alert>
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-text-field label="Desde" type="date" color="primary" dense v-model="filtro.fechaDesde">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field label="Hasta" type="date" color="primary" dense v-model="filtro.fechaHasta">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete :items="tipoSolicitudes" label="Tipo de Solicitud" item-text="nombre"
                  item-value="nombre" v-model="filtro.tipoSolicitud" dense @click="listarTipodeSolicitud()">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-autocomplete :items="departamentos" label="Departamento" item-text="nombre" item-value="id"
                  v-model="filtro.departamento" dense>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-autocomplete :items="municipios" label="Municipio" item-text="nombre" item-value="id"
                  v-model="filtro.municipio" dense>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Documento" dense v-model="filtro.documento">
                </v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="error" @click="limpiarFiltro()">
            Limpiar
          </v-btn>
          <v-btn small color="info" @click="informe()">
            Generar
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('solicitudes.menu')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonInforme',

    data() {
      return {
        preload: false,
        departamentos: [],
        municipios: [],
        tipoSolicitudes: [],
        filtro: {
          fechaDesde: moment().format('YYYY-MM-DD'),
          fechaHasta: moment().format('YYYY-MM-DD'),
          tipoSolicitud: '',
          departamento: '',
          municipio: '',
          documento: '',
        },
      };
    },

    mounted() {
      this.listarDepartamento()
      this.listarMunicipio()
      moment.locale('es');
    },

    methods: {

      listarTipodeSolicitud() {
        this.$axios.get('tipo-solicitud-red-vital/listarActivos').then(res => {
          this.tipoSolicitudes = res.data
        }).catch(e => {})
      },

      listarDepartamento() {
        this.$axios.get('departamento/').then(res => {
          this.departamentos = res.data
        }).catch(e => {})
      },

      listarMunicipio() {
        this.$axios.get('municipios/listar').then(res => {
          this.municipios = res.data
        }).catch(e => {})
      },

      limpiarFiltro() {
        this.filtro.fechaDesde = moment().format('YYYY-MM-DD'),
          this.filtro.fechaHasta = moment().format('YYYY-MM-DD'),
          this.filtro.tipoSolicitud = '',
          this.filtro.departamento = '',
          this.filtro.municipio = '',
          this.filtro.documento = ''
      },

      informe() {
        this.$axios({
          method: 'post',
          params: {
            tipoSolicitud: this.filtro.tipoSolicitud,
            fechaDesde: this.filtro.fechaDesde,
            fechaHasta: this.filtro.fechaHasta,
            departamento: this.filtro.departamento,
            documento: this.filtro.documento,
            municipio: this.filtro.municipio
          },
          url: '/radicacion-online/informe/',
          responseType: 'blob',
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');

          a.download = 'InformeSolicitudes.xlsx';
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

    },
  };

</script>

<style lang="scss" scoped>

</style>
