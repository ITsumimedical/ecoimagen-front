<template>
  <div>
    <v-data-table dense :headers="headers" :search="buscarCargo" :items="cargos" sort-by="id" :loading="loading"
      loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn small v-if="$can('cargo.crear')" color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon right>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon @click="excel" color="success" dark v-bind="attrs" v-on="on">
                mdi-file-excel
              </v-icon>
            </template>
            <span>Exportar cargos</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <!-- <v-text-field v-model="buscarCargo" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field> -->
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert text dense border="left" color="blue-grey">{{titulo}}</v-alert>
              <form @submit.prevent="guardarCargos">
                <v-card-text>
                  <v-container fluid>
                    <v-row dense>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field dense v-model="cargo.nombre" label="Nombre" :error-messages="errors.nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea dense auto-grow v-model="cargo.funciones" label="Funciones"
                          :error-messages="errors.funciones">
                        </v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn small color="boton" dark @click="guardarCargos()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top v-if="$can('cargo.actualizar')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="editar(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <template>
      <div class="text-center">
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarCargos()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    listarCargos,
    guardarCargos,
    actualizarCargos,
  } from '@/api/cargos/cargo'
  import {
    descargarFile
  } from '@/api/descargar'
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('cargo.listar')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonCargosTh',
    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarCargo: '',
        cargos: [],
        cargo: {
          nombre: '',
          funciones: '',
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          funciones: '',
        },
        errors: {
          nombre: '',
          funciones: '',
        },
        paginate: {
          total: 0,
          page: 1
        },
        headers: [{
            text: 'id',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Funciones',
            value: 'funciones'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
      };
    },

    mounted() {
      this.listarCargos();

    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear cargo' : 'Editar cargo'
      },
    },

    watch: {
      dialogoBloqueos(val) {
        val || this.cerrarDialogo()
      }
    },

    methods: {

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.cargo = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      async excel() {
        const response = await this.$axios.get('/cargo/exportar', {
          responseType: 'blob'
        })
        descargarFile(response.data, 'cargosEmpleados.xlsx')
      },

      exportarCargo() {
        this.$axios.get('/cargo/exportar').then(res => {
          this.cargos = res.data.data.data
        }).catch(error => {
          console.log(error)
        })
      },

      async listarCargos() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarCargos(this.paginate.page))
          this.cargos = data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      async guardarCargos() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarCargos(this.cargo.id), this.cargo)
            this.$toast.success(data.mensaje)
            this.listarCargos()
            this.close()
          } catch (error) {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          }
        } else {
          try {
            const {
              data
            } = await this.$loadingPostRequest(guardarCargos(), this.cargo)
            this.$toast.success(data.mensaje)
            this.listarCargos()
            this.close()
          } catch (error) {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          }
        }

      },

      ErrorEntrada(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(',')
          }
        }
      },

      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },

      editar(item) {
        this.editedIndex = this.cargos.indexOf(item)
        this.cargo = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
