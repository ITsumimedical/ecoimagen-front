<template>
  <div>
      <v-row>
        <v-col cols="12" md="12" sm="12">
          <v-col cols="12" md="4" sm="4">
            <v-autocomplete @change="listarSolicitudes" v-model="formSolicitudCompras.bodega_origen_id"
              label="Bodega Solicitante*" :items="listaBodegas" item-text="nombre" item-value="id" required>
            </v-autocomplete>
          </v-col>
          <v-row justify="center">
            <v-col cols="12" md="4" sm="4">
              <v-spacer></v-spacer>
              <v-btn color="success" small rounded v-if="articulos.length > 0" @click="guardarAjuste()">
                Guardar ajuste
              </v-btn>
            </v-col>
          </v-row>
            <v-col cols="12" md="6">
              <v-text-field label="Buscar" v-model="buscarP"></v-text-field>
            </v-col>
          <v-row v-if="formSolicitudCompras.bodega_origen_id">
            <v-col cols="12" md="12">
              <v-data-table v-model="articulos" :headers="articulosAjusteHeader" :items="listaSolicitudes"
                item-key="detalle_id" :search="buscarP" class="elevation-1" show-select :loading="loadingTabla"
                loading-text="Cargando... Por favor espere">
                <template v-slot:[`item.producto`]="{ item }">
                  {{ item.cum_validacion == null?item.producto+'- SIN EXPEDIENTE':item.producto +' - '+item.cum_validacion }}
                </template>
                <template v-slot:[`item.cantidad_inicial`]="props">
                  <v-edit-dialog :return-value.sync="props.item.cantidad_inicial" large persistent
                    cancel-text="Cancelar" save-text="Cambiar">
                    <div>{{ props.item.cantidad_inicial}} <v-icon color="warning" small>mdi-pencil
                      </v-icon>
                    </div>
                    <template v-slot:input>
                      <v-text-field v-model="props.item.cantidad_inicial" single-line></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

    <v-dialog v-model="preload" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Procesando Información
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {
    listarBodegas
  } from "~/api/bodegas/bodegas";
  import ModalProducto from "../../productos/modalProducto.vue";
  export default {
    name: 'WorkspaceJsonAjusteEntrada',
    props: ["tipo"],

    data() {
      return {
        articulos: [],
        listaBodegas: [],
        formSolicitudCompras: {
          bodega_origen_id: null
        },
        loadingTabla: false,
        listaSolicitudes: [],
        dialogDetalle: false,
        articulosAjusteHeader: [{
            text: 'id',
            value: 'id',
            sortable: true,
            align: 'center'
          },
          {
            text: 'Fecha',
            value: 'created_at',
            sortable: true,
            align: 'center'
          },
          {
            text: 'Motivo',
            value: 'descripcion',
            sortable: true,
            align: 'center'
          },
          {
            text: 'Producto',
            value: 'producto',
            sortable: true,
            align: 'center'
          },
          {
            text: 'Lote',
            value: 'lote',
            sortable: true,
            align: 'left'
          },
          {
            text: 'Cantidad',
            value: 'cantidad_inicial',
            sortable: true,
            align: 'left'
          },
          {
            text: 'Observacion',
            value: 'observacion',
            sortable: true,
            align: 'left'
          }
        ],
        preload: false,
        buscarP: ''
      };
    },

    mounted() {
      this.listarBodegas();
    },

    methods: {

      listarBodegas() {
        this.loadingTabla = true;
        this.$loadingGetRequest(listarBodegas(0, 0)).then(res => {
          this.listaBodegas = res.data
          this.loadingTabla = false;
        }).catch(e => {
          console.log(e);
          this.loadingTabla = false;
        })
      },

      listarSolicitudes() {
        this.dialogDetalle = false
        this.loadingTabla = true;

        this.$axios.post('solicitud-bodegas/obtnerAjuste', {
            tipo: this.tipo,
            estado: 3,
            bodega: this.formSolicitudCompras.bodega_origen_id
          })
          .then(res => {
            this.listaSolicitudes = res.data
            this.loadingTabla = false;
          }).catch(e => {
            console.log(e);
            this.loadingTabla = false;
          })
      },

      guardarAjuste() {
        this.preload = true;

        const requestData = {
          bodega_origen_id: this.formSolicitudCompras.bodega_origen_id,
          articulos: this.articulos,
          tipo: this.tipo
        };

        this.$axios.post('/solicitud-bodegas/guardarAjusteSalida', requestData)
          .then(res => {
            this.listarSolicitudes();
            this.articulos = [];
            this.preload = false
          })
          .catch(e => {
            this.$swal({
            title: "Error al guardar ajuste:",
            text: e.response.data,
            type: "warning",
            showCancelButton: false,
            })
          })
          .finally(() => {
            this.preload = false;
          });
      }

      //   guardarAjuste() {
      //     this.preload = true
      //     this.$axios.post('/solicitud-bodegas/guardarAjuste', {
      //         bodega_origen_id: this.formSolicitudCompras.bodega_origen_id,
      //         articulos: this.articulos,
      //         tipo: this.tipo
      //       })
      //       .then(res => {
      //         this.listarSolicitudes()
      //         this.articulos = [];
      //         this.preload = false
      //       }).catch(e => {
      //         console.log(e);
      //         this.preload = false
      //       })
      //   }

    },
  };

</script>

<style lang="scss" scoped>

</style>
