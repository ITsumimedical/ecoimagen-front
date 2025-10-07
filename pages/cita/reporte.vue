<template>
  <div>
    <v-card>
      <v-alert dense text outlined type="info" class="text-center"><b>Reporte de citas</b></v-alert>
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field type="date" label="Fecha rango desde" dense v-model="reporte.fecha_inicio"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field type="date" label="Fecha rango hasta" dense v-model="reporte.fecha_fin"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-autocomplete dense :items="entidades" item-text="nombre" item-value="id" v-model="reporte.entidad_id"
                label="Determinar entidad">
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="descargarReporte()" small color="success">Descargar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  import moment from 'moment';
  export default {
    name: 'WorkspaceJsonReporte',

    data() {
      return {
        reporte: {
          fecha_inicio: '',
          fecha_fin: '',
          entidad_id: '',
        },
        entidades: [],
        diferencia: null,
      };
    },

    mounted() {
      this.listarEntidades();
    },

    methods: {

      listarEntidades() {
        this.$axios.get("/entidad/listar").then((res) => {
          this.entidades = res.data;
        }).catch((error) => {
          console.log(error);
        });
      },

      descargarReporte() {
        if (this.reporte.fecha_inicio == '' || this.reporte.fecha_fin == '') {
          return this.$swal({
            title: "¡No puede ser!",
            text: "Debe determinar un rango de fechas para poder realizar la descarga",
            type: "error",
          });
        }
        this.calcularDias()
        if (this.diferencia > 30) {
          return this.$swal({
            title: "¡No puede ser!",
            text: "El reporte sólo puede ser por un rango máximo de 30 días",
            type: "error",
          });
        }
        // this.$axios.post('/', this.reporte).then(res => {
        //   const blob = new Blob([res.data], {
        //     type: "text/plain"
        //   });
        //   const url = window.URL.createObjectURL(blob);
        //   const a = document.createElement('a');
        //   const regex = /-/gi;
        //   a.download = this.reporte.entidad_id + '.TXT'
        //   a.href = url;
        //   document.body.appendChild(a);
        //   a.click();
        //   document.body.removeChild(a);
        // }).catch(error => {
        //   console.log(error);
        // })
      },

      calcularDias() {
        var fechaInicio = moment(this.reporte.fecha_inicio);
        var fechaFin = moment(this.reporte.fecha_fin);

        var diff = fechaFin - fechaInicio;

        this.diferencia = diff / (1000 * 60 * 60 * 24)

        return diff
      }
    },

  };

</script>

<style lang="scss" scoped>

</style>
