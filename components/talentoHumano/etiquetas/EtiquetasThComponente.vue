<template>
  <div>
    <v-data-table :headers="headers" :search="buscarEtiqueta" :items="etiquetas" sort-by="id" class="elevation-1"
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn v-if="$can('turnoTh.crear')" color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon @click="excel" color="success" dark v-bind="attrs" v-on="on">
                mdi-file-excel
              </v-icon>
            </template>
            <span>Exportar etiquetas</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarEtiqueta" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo">
                <span class="white--text text-h5">{{titulo}}</span>
              </v-card-title>
              <form @submit.prevent="guardarEtiqueta">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="etiqueta.nombre" label="Nombre" :error-messages="errors.nombre">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn color="boton" dark @click="guardarEtiqueta()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top v-if="$can('turnoTh.actualizar')">
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
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarEtiquetas()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    listarEtiquetas,
    guardarEtiqueta,
    actualizarEtiqueta,
  } from '@/api/etiquetasTh/etiquetaTh'
  import {
    descargarFile
  } from '@/api/descargar'
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonEtiquetasThComponente',

    data() {
      return {
        time: null,
        menu2: false,
        menu1: false,
        modal2: false,
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarEtiqueta: '',
        etiquetas: [],
        etiqueta: {
          nombre: '',
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
        },
        errors: {
          nombre: '',
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
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
      };
    },

    mounted() {
      this.listarEtiquetas();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear etiqueta' : 'Editar etiqueta'
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
          this.etiqueta = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      async excel() {
        const response = await this.$axios.get('/etiqueta-th/exportar', {
          responseType: 'blob'
        })
        descargarFile(response.data, 'etiquetasTalentoHumano.xlsx')
      },

      exportarAreaTh() {
        this.$axios.get('/etiqueta-th/exportar').then(res => {
          this.areas = res.data.data.data
        }).catch(error => {
          console.log(error)
        })
      },

      async listarEtiquetas() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarEtiquetas(this.paginate.page))
          this.etiquetas = data.data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      async guardarEtiqueta() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarEtiqueta(this.etiqueta.id), this.etiqueta)
            this.$toast.success(data.mensaje)
            this.listarEtiquetas()
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
            } = await this.$loadingPostRequest(guardarEtiqueta(), this.etiqueta)
            this.$toast.success(data.mensaje)
            this.listarEtiquetas()
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
        this.editedIndex = this.etiquetas.indexOf(item)
        this.etiqueta = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
