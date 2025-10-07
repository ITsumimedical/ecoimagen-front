<template>
  <div>
    <v-tabs centered>
      <v-tab>
        Tipo de Solicitudes
      </v-tab>
      <v-tab @click="listarTipoCanal()">
        Tipo de Canal
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-divider vertical></v-divider>

          <!-- tipo Solicitudes -->
          <v-data-table :headers="headers" :items="tipoSolicitudes" class="elevation-1" :loading="loading"
            loading-text="Cargando..." hide-default-footer>

            <template v-slot:top>
              <v-row justify="center">
                <v-col cols="auto" md="auto">
                  <v-text-field label="Nombre" outlined></v-text-field>
                </v-col>
                <v-col cols="auto" md="auto">
                  <v-text-field label="Estado" outlined></v-text-field>
                </v-col>
                <v-col cols="auto" md="auto">
                  <v-btn color="info" class="ma-2 white--text">
                    filtrar
                    <v-icon right dark>
                      mdi-magnify
                    </v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="auto" md="auto">
                  <v-btn color="success" dark class="ma-2" @click="dialogoSolicitud = true">
                    Crear
                  </v-btn>
                </v-col>
              </v-row>
            </template>

            <template v-slot:[`item.estado`]="{ item }">
              <v-chip :color="getColor(item.estado)">
                {{ item.estado == '1' ? 'Activo' : 'Inactivo' }}</v-chip>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" color="warning" @click="editarSolicitud(item)">
                mdi-pencil
              </v-icon>
              <v-icon small color="error" @click="inactivarSolicitud(item)">
                mdi-delete
              </v-icon>
            </template>

            <template v-slot:no-data>
              No hay información para mostrar
            </template>

          </v-data-table>

          <!-- dialogo de crear o editar -->
          <v-dialog v-model="dialogoSolicitud" max-width="500px">
            <v-card :loading="loading" :disabled="loading">

              <!-- Titulo -->
              <v-card-title class="card white--text">
                <span>{{ formTitle }}</span>
              </v-card-title>

              <!-- formulario -->
              <v-container>
                <v-text-field v-model="editedItem.nombre" label="Nombre" outlined :error-messages="errors.nombre">
                </v-text-field>
                <v-textarea v-model="editedItem.descripcion" label="Descripción" outlined
                  :error-messages="errors.descripcion">
                </v-textarea>
              </v-container>

              <!-- Acciones -->
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" dark @click="cerrar()">
                  Cancel
                </v-btn>
                <v-btn color="boton" dark @click="guardarTipoSolicitud()">
                  Guardar
                </v-btn>
              </v-card-actions>

            </v-card>
          </v-dialog>

          <!-- dialogo para inactivar solicitudes -->
          <v-dialog v-model="dialogoEstado" max-width="500px" persistent>
            <v-card :loading="loading" :disabled="loading">
              <!-- activar o inactivar tipo solicitudes -->
              <v-card-title class="text-h5">¿Deseas {{editedItem.estado == '1'? 'Inactivar':'Activar'}} este tipo de
                novedad?
              </v-card-title>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" dark @click="cerrar()">Cancel</v-btn>
                <v-btn color="boton" dark @click="cambiarEstado(editedItem)">
                  {{editedItem.estado == '1'? 'Inactivar':'Activar'}}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- paginacion -->
          <template>
            <div class="text-center">
              <v-pagination v-model="paginacion.page" :length="paginacion.total" @input="listarTipoSolicitudes()"
                circle>
              </v-pagination>
            </div>
          </template>
        </v-card>
      </v-tab-item>

      <!-- tipo de canales -->
      <v-tab-item>
        <v-card flat>
          <v-divider vertical></v-divider>
          <!-- tipo causa -->
          <v-data-table :headers="headersCanal" :items="tipoCanal" class="elevation-1" :loading="loading"
            loading-text="Cargando..." hide-default-footer>
            <template v-slot:top>
              <v-row justify="center">
                <v-col cols="auto" md="auto">
                  <v-text-field label="Nombre" outlined></v-text-field>
                </v-col>
                <v-col cols="auto" md="auto">
                  <v-text-field label="Estado" outlined></v-text-field>
                </v-col>
                <v-col cols="auto" md="auto">
                  <v-btn color="info" class="ma-2 white--text">
                    filtrar
                    <v-icon right dark>
                      mdi-magnify
                    </v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="auto" md="auto">
                  <v-btn color="success" dark class="ma-2" @click="dialogCanal = true">
                    Crear
                  </v-btn>
                </v-col>
              </v-row>
            </template>
            <template v-slot:[`item.estado`]="{ item }">
              <v-chip :color="getColor(item.estado)" dark>
                {{ item.estado == true ? 'Activo' : 'Inactivo' }}
              </v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" color="warning">
                mdi-pencil
              </v-icon>
              <v-icon small color="error">
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              No hay información para mostrar
            </template>
          </v-data-table>

          <!-- dialogo de crear o editar -->
          <v-dialog v-model="dialogCanal" max-width="500px">
            <v-card :loading="loading" :disabled="loading">
              <v-card-title class="card white--text">
                <span>{{ formTitleCanal }}</span>
              </v-card-title>
              <v-container>
                <v-text-field v-model="editedItem.nombre" label="Nombre" outlined :error-messages="errors.nombre">
                </v-text-field>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" dark>
                  Cancel
                </v-btn>
                <v-btn color="boton" dark>
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogEstadoCanal" max-width="500px">
            <v-card :loading="loading" :disabled="loading">
              <v-card-title class="text-h5">¿Deseas {{editedItem.estado ? 'Inactivar':'Activar'}} este tipo de
                afiliacion?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" dark>Cancel</v-btn>
                <!-- <v-btn color="boton" dark
                  @click="editedItem.estado ? deleteItemConfirmAfiliacion(editedItem):activarItemConfirmAfiliacion(editedItem)">
                  {{editedItem.estado ? 'Inactivar':'Activar'}}</v-btn> -->
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- paginacion tipo canal -->
          <template>
            <div class="text-center">
              <v-pagination v-model="paginacionCanal.page" :length="paginacionCanal.total" @input="listarTipoCanal()" circle>
              </v-pagination>
            </div>
          </template>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
  import {
    listarTipoSolicitudPqrsf,
    guardarTipoSolicitudPqrsf,
    actualizarTipoSolicitudPqrsf,
  } from '@/api/tipoSolicitudPqrsf/tipoSolicitudPqrsf'

  import {
    listarTipoCanalPqrsf,
    guardarTipoCanalPqrsf,
    actualizarTipoCanalPqrsf
  } from '@/api/tipoCanalPqrsf/tipoCanalPqrsf'

  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'parametrizacionPqrsf',
    data: () => ({
      paginacion: {
        total: 0,
        page: 1
      },
      paginacionCanal: {
        total: 0,
        page: 1
      },
      editedIndex: -1,
      buscarTipoSolicitud: '',
      items: [],
      loading: false,
      tipoSolicitudes: [],
      tipoCanal: [],
      dialogoSolicitud: false,
      dialogoEstado: false,
      dialogEstadoCanal: false,
      dialogCanal: false,
      errors: {
        nombre: null,
        descripcion: null,
      },
      editedItem: {
        nombre: null,
        descripcion: null,
      },
      headers: [{
          text: 'id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        {
          text: 'Tipo',
          value: 'nombre'
        },
        {
          text: 'Descripción',
          value: 'descripcion'
        },
        {
          text: "Estado",
          value: 'estado'
        },
        {
          text: 'Acciones',
          value: 'actions',
          sortable: false
        },
      ],
      headersCanal: [{
          text: 'id',
        },
        {
          text: 'Tipo',
        },
        {
          text: 'Descripción',
        },
        {
          text: "Estado",
          value: 'estado'
        },
        {
          text: 'Acciones',
          value: 'actions',
        }
      ]
    }),

    created() {
      this.listarTipoSolicitudes();
    },

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Crear Tipo Solicitud' : 'Editar Tipo Solicitud'
      },

      formTitleCanal() {
        return this.editedIndex === -1 ? 'Crear Tipo Canal' : 'Editar Tipo Canal'
      }
    },

    methods: {

      // funciones para tipo de solicitudes

      /**
       * Funcion para abrir listar tipo de solicitudes
       * @return object
       * @author kobatime
       */
      async listarTipoSolicitudes() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarTipoSolicitudPqrsf(this.paginacion.page))
          this.tipoSolicitudes = data.data.data
          console.log(this.tipoSolicitudes)
          this.paginacion.total = data.data.last_page
          this.paginacion.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      },

      /**
       * Funcion para cerrar el modal de crear o editar solicitudes
       * @return object
       * @author kobatime
       */
      cerrar() {
        this.dialogoSolicitud = false
        this.dialogoEstado = false
        this.limpiardata(),
          this.limpiarError()
      },

      /**
       * Funcion para guardar y actualizar tipo solicitud
       * @param editedItem object
       * @return object
       * @author kobatime
       */
      async guardarTipoSolicitud() {
        this.loading = true
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarTipoSolicitudPqrsf(this.editedItem.id), this.editedItem)
            this.$toast.success(data.mensaje)
            this.limpiarError()
            this.listarTipoSolicitudes()
            this.cerrar()
            this.loading = false
          } catch (error) {
            this.loading = false
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
            } = await this.$loadingPostRequest(guardarTipoSolicitudPqrsf(), this.editedItem)
            this.$toast.success(data.mensaje)
            this.limpiarError()
            this.listarTipoSolicitudes()
            this.cerrar()
            this.loading = false
          } catch (error) {
            this.loading = false
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          }
        }
      },


      /**
       * Funcion para abrir modal de editar
       * @param item object
       * @author kobatime
       */
      editarSolicitud(item) {
        this.editedIndex = this.tipoSolicitudes.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogoSolicitud = true
      },

      /**
       * Funcion para abrir modal de inactivar
       * @param item object
       * @return object
       * @author kobatime
       */
      inactivarSolicitud(item) {
        this.editedIndex = this.tipoSolicitudes.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogoEstado = true
      },

      /**
       * Funcion para cambiar el estado de tipo de solicitud
       * @param item object
       * @return object
       * @author kobatime
       */
      async cambiarEstado(item) {
        try {
          this.solicitud = item
          if (this.solicitud.estado == '1') {
            this.solicitud.estado = false
          } else {
            this.solicitud.estado = true
          }
          const {
            data
          } = await this.$loadingPutRequest(actualizarTipoSolicitudPqrsf(item.id), this.solicitud)
          this.$toast.success(data.mensaje)
          this.listarTipoSolicitudes()
          this.limpiardata()
          this.dialogoEstado = false;
        } catch (error) {
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje)
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data)
          }
        }
      },

      /**
       * Funcion para abrir modal de cambiar estado
       * @param item object
       * @return object
       * @author kobatime
       */
      estadoCambiar(item) {
        this.dialogoEstado = true;
        this.solicitud = item
      },

      //funciones para tipos de canal
 /**
       * Funcion para listar tipo de canal
       * @return object
       * @author kobatime
       */
       async listarTipoCanal() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarTipoCanalPqrsf(this.paginacion.page))
          this.tipoCanal = data.data.data
          console.log(this.tipoCanal)
          this.paginacion.total = data.data.last_page
          this.paginacion.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      },

      // funciones globales

      limpiardata() {
        for (const key in this.editedItem) {
          this.editedItem[key] = ''
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

      getColor(activo) {
        if (activo == '1') return 'success'
        else if (activo == '0') return 'error'
        else return 'warning'
      },




    },
  }

</script>
