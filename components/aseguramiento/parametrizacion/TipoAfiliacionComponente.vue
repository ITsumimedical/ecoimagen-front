<template>
  <div>
    <v-card>
      <!-- tabla -->
      <v-data-table dense :headers="headersAfiliaciones" :items="afiliacion" :search="buscar" class="elevation-1"
        :loading="loading" loading-text="Cargando..." no-data-text="Sin datos para mostrar">
        <template v-slot:top>
          <v-card-title>
            <v-toolbar flat>
              <v-btn small color="boton" dark class="mb-2" @click="dialogAfiliacion = true">
                Crear Tipo Afiliación
              </v-btn>
              <v-spacer></v-spacer>
              <v-text-field dense v-model="buscar" append-icon="mdi-magnify" label="Buscar..." single-line hide-details>
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
          <v-btn small color="warning" @click="editItemAfiliacion(item)">
            Editar
          </v-btn>
          <v-btn small color="error" @click="deleteItemAfiliacion(item)">
            {{editedItem.estado == true ? 'Inactivar':'Activar'}}
          </v-btn>
        </template>
      </v-data-table>

      <!-- dialogo de crear o editar -->
      <v-dialog v-model="dialogAfiliacion" max-width="500px">
        <v-card :loading="loading" :disabled="loading">
          <v-alert text outlined dense type="info">
            {{ formTitleAfiliacion }}
          </v-alert>
          <v-container>
            <v-col cols="12" sm="12" md="12">
              <v-text-field v-model="editedItem.nombre" label="Nombre" dense :error-messages="errors.nombre">
              </v-text-field>
            </v-col>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small color="error" dark @click="closeAfiliacion()">
              Cancelar
            </v-btn>
            <v-btn small color="success" dark @click="guardarAfiliacion()">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- dialogo de cambiar estado -->
      <v-dialog v-model="dialogDeleteAfiliacion" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">¿Deseas {{editedItem.estado == true ? 'Inactivar':'Activar'}} este tipo de
            afiliacion?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" dark @click="closeDelete()">Cancel</v-btn>
            <v-btn color="boton" dark @click="deleteItemConfirmAfiliacion(editedItem)">
              {{editedItem.estado == true ? 'Inactivar':'Activar'}}</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
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
        dialogDeleteAfiliacion: false,
        dialogAfiliacion: false,
        loading: false,
        afiliacion: [],
        buscar: null,
        headersAfiliaciones: [{
            text: 'Id',
            align: 'center',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Nombre',
            align: 'center',
            sortable: false,
            value: 'nombre',
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
        },
      };
    },

    computed: {

      formTitleAfiliacion() {
        return this.editedIndex === -1 ? 'Crear Tipo Afiliación' : 'Editar Tipo Afiliación'
      }

    },

    created() {
      this.listarTipoAfiliaciones()
    },

    methods: {

      // funciones de tipos de afiliacion

      /**
       * Funcion para listar
       * @param paginacion.page int
       * @return array
       * @author kobatime
       */
      listarTipoAfiliaciones() {
        this.$axios.get('/tipo-afiliacion/').then(res => {
          this.afiliacion = res.data.data;
        })
      },

      /**
       * Funcion para guardar y actualizar
       * @param editedItem object
       * @param editedIndex int
       * @return object
       * @author kobatime
       */
      async guardarAfiliacion() {
        this.loading = true
        if (this.editedIndex > -1) {
          await this.$axios.put('/tipo-afiliacion/' + this.editedItem.id, this.editedItem).then(res => {
            this.loading = false
            this.closeAfiliacion()
            this.listarTipoAfiliaciones()
          }).catch(error => {
            this.loading = false
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.Error(error.response.data)
            }
          })
        } else {
          await this.$axios.post('/tipo-afiliacion/crear', this.editedItem).then(res => {
            this.closeAfiliacion()
            this.listarTipoAfiliaciones()
            this.loading = false
          }).catch(error => {
            this.loading = false
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.Error(error.response.data)
            }
          })
        }
      },

      /**
       * Funcion para abrir modal de inactivar
       * @param item object
       * @return object
       * @author kobatime
       */
      deleteItemAfiliacion(item) {
        this.editedIndex = this.afiliacion.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDeleteAfiliacion = true
      },

      /**
       * Funcion para abrir modal de editar
       * @param item object
       * @return object
       * @author kobatime
       */
      editItemAfiliacion(item) {
        this.editedIndex = this.afiliacion.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogAfiliacion = true
      },

      /**
       * Funcion para inactivar o activar el tipo de afiliaciones
       * @param item object
       * @return boolean
       * @author kobatime
       */
      deleteItemConfirmAfiliacion(item) {
        if (item.estado == false) {
          item['estado'] = true
        } else {
          item['estado'] = false
        }
        this.$axios.put('/tipo-afiliacion/estado/' + item.id, item).then(res => {
          this.closeAfiliacion()
          this.listarTipoAfiliaciones()
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        })
      },

      /**
       * Cerrar dialogo
       * @return string
       * @author kobatime
       */
      closeAfiliacion() {
        this.dialogAfiliacion = false
        this.dialogDeleteAfiliacion = false
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
