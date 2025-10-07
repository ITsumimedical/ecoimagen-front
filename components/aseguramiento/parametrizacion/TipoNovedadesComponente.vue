<template>
  <div>
    <v-card>
      <!-- tipo novedades -->
      <v-data-table dense :headers="headersNovedad" :items="novedades" class="elevation-1" :search="buscar"
        :loading="loading" loading-text="Cargando..." no-data-text="Sin datos para mostrar">
        <template v-slot:top>
          <v-card-title>
            <v-toolbar flat>
              <v-btn small color="boton" dark class="ma-2" @click="dialog = true">
                Crear Novedad
              </v-btn>
              <v-spacer></v-spacer>
              <v-text-field v-model="buscar" append-icon="mdi-magnify" label="Buscar..." single-line hide-details>
              </v-text-field>
            </v-toolbar>
          </v-card-title>
        </template>
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip small :color="getColor(item.estado)" dark>
            {{ item.estado == true ? 'Activo' : 'Inactivo' }}
          </v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn small class="mr-2" color="warning" @click="editItemNovedades(item)">
            Editar
          </v-btn>
          <v-btn small color="error" @click="deleteItemNovedades(item)">
            {{ item.estado != true ? 'Activar' : 'Inactivar' }}
          </v-btn>
        </template>
      </v-data-table>

      <!-- dialogo de crear o editar -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card :loading="loading" :disabled="loading">
          <v-alert text outlined dense type="info">{{ formTitle }}</v-alert>
          <v-container>
            <v-col cols="12" sm="12" md="12">
              <v-text-field v-model="editedItem.nombre" label="Nombre" dense :error-messages="errors.nombre">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-textarea auto-grow v-model="editedItem.descripcion" label="Descripción" dense
                :error-messages="errors.descripcion">
              </v-textarea>
            </v-col>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small color="error" dark @click="closeNovedad()">
              Cancelar
            </v-btn>
            <v-btn small color="boton" dark @click="guardarNovedad()">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <!-- activar o inactivar tipo novedades -->
          <v-card-title class="text-h5">¿Deseas {{editedItem.estados == true ? 'Inactivar':'Activar'}} este tipo de
            novedad?
          </v-card-title>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" dark @click="closeDelete()">Cancel</v-btn>
            <v-btn color="boton" dark @click="deleteItemConfirmNovedad(editedItem)">
              {{editedItem.estados == true ? 'Inactivar':'Activar'}}</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
  //novedades
  import {
    listarNovedadesAfiliado,
    guardarNovedadesAfiliado,
    actualizarNovedadesAfiliado,
    actualizarEstadoNovedadesAfiliado
  } from '@/api/tipoNovedadesAfiliaciones/tipoNovedadeAfiliaciones';

  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonParametrizacion',

    data() {
      return {
        dialog: false,
        dialogDelete: false,
        loading: false,
        novedades: [],
        buscar: null,
        headersNovedad: [{
            text: 'Id',
            align: 'start',
            sortable: true,
            value: 'id',
          },
          {
            text: 'Nombre',
            align: 'start',
            sortable: false,
            value: 'nombre',
          },
          {
            text: 'Descripción',
            align: 'start',
            sortable: false,
            value: 'descripcion',
          },
          {
            text: 'Estado',
            sortable: false,
            value: 'estado',
            align: 'center'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false,
            align: 'center'
          }
        ],
        paginacion: {
          page: 1,
          total: 0
        },
        errors: {
          nombre: null,
          descripcion: null
        },
        desserts: [],
        editedIndex: -1,
        editedItem: {
          nombre: '',
          descripcion: ''
        },
        defaultItem: {
          nombre: '',
          descripcion: '',
        },
      };
    },

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Crear Novedad' : 'Editar Novedad'
      },
    },

    created() {
      this.listarNovedades()
    },

    methods: {

      // funciones de tipo de novedades

      /**
       * Funcion para listar
       * @param paginacion.page int
       * @return array
       * @author kobatime
       */
      async listarNovedades() {
        const data = await this.$loadingGetRequest(listarNovedadesAfiliado(this.paginacion.page))
        this.paginacion.page = data.data.data.current_page
        this.paginacion.total = data.data.data.last_page
        this.novedades = data.data.data.data;
      },

      /**
       * Funcion para abrir modal de editar
       * @param item object
       * @return object
       * @author kobatime
       */
      editItemNovedades(item) {
        this.editedIndex = this.novedades.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      /**
       * Funcion para abrir modal de inactivar
       * @param item object
       * @return object
       * @author kobatime
       */
      deleteItemNovedades(item) {
        this.editedIndex = this.novedades.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      /**
       * Funcion para inactivar el tipo de novedades
       * @param item object
       * @return boolean
       * @author kobatime
       */
      async deleteItemConfirmNovedad(item) {
        item['estados'] = false
        await this.$loadingPutRequest(actualizarEstadoNovedadesAfiliado(item.id), item)
        this.closeDelete()
        this.listarNovedades()
      },

      /**
       * Funcion para activar el tipo de novedades
       * @param item object
       * @return boolean
       * @author kobatime
       */
      async activarItemConfirmNovedad(item) {
        item['estados'] = true
        await this.$loadingPutRequest(actualizarEstadoNovedadesAfiliado(item.id), item)
        this.closeDelete()
        this.listarNovedades()
      },

      /**
       * Funcion para guardar y actualizar
       * @param editedItem object
       * @param editedIndex int
       * @return object
       * @author kobatime
       */
      async guardarNovedad() {
        this.loading = true
        if (this.editedIndex > -1) {
          try {
            const data = await this.$loadingPutRequest(actualizarNovedadesAfiliado(this.editedItem.id), this
              .editedItem)
            this.listarNovedades()
            this.closeNovedad()
            this.loading = false
          } catch (error) {
            this.loading = false
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.Error(error.response.data)
            }
          }
        } else {
          try {
            const data = await this.$loadingPostRequest(guardarNovedadesAfiliado(), this.editedItem)
            this.listarNovedades()
            this.closeNovedad()
            this.loading = false
          } catch (error) {
            this.loading = false
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.Error(error.response.data)
            }
          }
        }
      },

      /**
       * Cerrar dialogo
       * @return string
       * @author kobatime
       */
      closeNovedad() {
        this.dialog = false
        this.limpiarError()
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      // funciones globales

      /**
       * Cerrar dialogo de inactivar
       * @return string
       * @author kobatime
       */
      closeDelete() {
        this.dialogDelete = false
        this.dialogDeleteAfiliacion = false
        this.dialogDeleteAfiliado = false
        this.limpiarError()
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      /**
       * Funcion para el color de los chips
       * @param estado int
       * @return string
       * @author kobatime
       */
      getColor(estado) {
        if (parseInt(estado) === 1) return 'success'
        else if (parseInt(estado) === 2) return 'error'
        else return 'warning'
      },

      /**
       * for de errores para los campos
       * @param error array
       * @return errors
       * @author kobatime
       */
      Error(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(',')
          }
        }
      },

      /**
       * for de limpiar errores
       * @param errors array
       * @return errors objetos
       * @author kobatime
       */
      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      }


    },
  };

</script>
