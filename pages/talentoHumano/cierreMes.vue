<template>
  <div>
    <v-card>
      <v-alert type="info" text dense border="left">Proceso cierre de mes contratos empleados</v-alert>
      <v-form>
        <v-col cols="12" sm="3" md="3">
          <v-text-field dense outlined type="date" v-model="cierre.fecha_cierre_mes" label="Fecha cierre de mes">
          </v-text-field>
        </v-col>
      </v-form>
      <v-alert color="warning" dense text outlined border="left" icon="mdi-alert"><b>Anotación importante para el cierre
          de información contractual:</b> El sistema almacenará los detalles de los contratos laborales con el objetivo
        de determinar su estado al finalizar el mes. <v-subheader><b><i>Se sugiere llevar a cabo este procedimiento una
              vez se hayan registrado las novedades de los contratos laborales, utilizando el último día del mes para la
              fecha de cierre.</i></b></v-subheader>
      </v-alert>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="success" @click="cerrarMes()">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
    <br>
    <v-dialog v-model="preload_datos" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Estamos procesando su información
          <v-progress-linear indeterminate color="white" class="mb-0">
          </v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card>
      <template>
        <v-card>
        <v-alert type="info" color="blue-grey" icon="mdi-history" dense text border="left">Listado de meses cerrados</v-alert>
          <v-card-title>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar..." single-line hide-details>
            </v-text-field>
          </v-card-title>
          <v-data-table dense :headers="headers" :items="listaCierres" :search="search"></v-data-table>
        </v-card>
      </template>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'WorkspaceJsonCierreMes',

    data() {
      return {
        search: '',
        headers: [{
          text: 'Fecha cierre de mes',
          sortable: true,
          value: 'fecha_cierre_mes',
        }, ],
        preload_datos: false,
        listaCierres: [],
        cierre: {
          fecha_cierre_mes: '',
        }
      };
    },

    mounted() {
      this.listarCierres()
    },

    methods: {
      cerrarMes() {
        if (this.cierre.fecha_cierre_mes == '') {
          return this.$swal({
            title: "¡No puede ser!",
            text: "Debes ingresar la fecha de cierre de mes. Procura emplear el último día del mes",
            type: "warning",
          });
        }
        this.preload_datos = true
        this.$axios.post("/contrato-empleado/cierreMes", this.cierre).then((res) => {
          this.preload_datos = false
          this.$toast.success('Se ha realizado el cierre del mes correctamente');
        }).catch((error) => {
          console.log(error);
          this.preload_datos = false
        });
      },

      listarCierres() {
        this.$axios.get('/cierre-mes-contrato').then(res => {
          this.listaCierres = res.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },
    },
  };

</script>
