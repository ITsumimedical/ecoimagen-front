<template>
  <div>
    <!-- tipo afiliado -->
    <v-data-table dense :headers="headersAfiliado" :items="afiliado" class="elevation-1" :search="buscar"
      :loading="loading" loading-text="Cargando..." no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-toolbar flat>
            <v-btn small color="boton" dark class="ma-2" @click="dialogAfiliado = true">
              Crear Tipo Afiliado
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
        <v-btn small class="mr-2" color="warning" @click="editItemAfiliado(item)">
          Editar
        </v-btn>
        <v-btn small color="error" @click="deleteItemAfiliado(item)">
          {{ item.estado == true ?  'Inactivar' : 'Activar'}}
        </v-btn>
      </template>
    </v-data-table>

    <!-- dialogo de crear o editar -->
    <v-dialog v-model="dialogAfiliado" max-width="800px">
      <v-card :loading="loading" :disabled="loading">
        <v-alert text outlined dense type="info">{{ formTitleAfiliado }}</v-alert>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="6">
              <v-text-field dense v-model="editedItem.nombre" label="Nombre" :error-messages="errors.nombre">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="6">
              <v-autocomplete dense v-model="editedItem.clasificacion_afiliado"
                :error-messages="errors.clasificacion_afiliado" label="Clasificación" :items=clasificacionesItems>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-textarea auto-grow dense v-model="editedItem.descripcion" label="Descripción"
                :error-messages="errors.descripcion">
              </v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="error" dark @click="closeAfiliado()">
            Cancelar
          </v-btn>
          <v-btn small color="boton" dark @click="guardarAfiliado()">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDeleteAfiliado" max-width="500px">
      <v-card :loading="loading" :disabled="loading">
        <v-alert class="text-center" outlined text dense type="warning">¿Deseas
          <b>{{editedItem.estado ? 'Inactivar':'Activar'}}</b> este tipo de novedad?
        </v-alert>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="error" dark @click="closeDelete()">Cancelar</v-btn>
          <v-btn small color="boton" dark
            @click="editedItem.estado ? deleteItemConfirmAfiliado(editedItem):activarItemConfirmAfiliado(editedItem)">
            {{editedItem.estado ? 'Inactivar':'Activar'}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </div>
</template>

<script>
  //tipo afiliado
  import {
    listarTipoAfiliado,
    crearTipoAfiliado,
    actualizarTipoAfiliado,
    actualizarEstadoTipoAfiliado
  } from '@/api/tiposAfiliados/tipoAfiliado';

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
        dialogAfiliado: false,
        dialogDeleteAfiliado: false,
        loading: false,
        afiliado: [],
        clasificacionesItems: ['COTIZANTE', 'BENEFICIARIO'],
        buscar: null,
        headersAfiliado: [{
            text: 'Id',
            align: 'start',
            sortable: false,
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
            value: 'descripcion',
          },
          {
            text: 'Clasificación',
            value: 'clasificacion_afiliado',
          },
          {
            text: 'Estado',
            sortable: false,
            value: 'estado',
            align: 'center',
          },
          {
            text: 'Acciones',
            value: 'actions',
            align: 'center',
            sortable: false
          }
        ],

        errors: {
          nombre: null,
          descripcion: null,
          clasificacion_afiliado: '',
        },
        desserts: [],
        editedIndex: -1,
        editedItem: {
          nombre: '',
          descripcion: '',
          clasificacion_afiliado: '',
        },
        defaultItem: {
          nombre: '',
        },
      };
    },

    computed: {
      formTitleAfiliado() {
        return this.editedIndex === -1 ? 'Crear Tipo Afiliado' : 'Editar Tipo Afiliado'
      },
    },

    created() {
      this.listarTipoAfiliado()
    },

    methods: {

      // funciones afiliado

      /**
       * Funcion para listar
       * @param paginacion.page int
       * @return array
       * @author kobatime
       */
      listarTipoAfiliado() {
        this.$axios.get('/tipo-afiliados/listar').then(res => {
          this.afiliado = res.data.data;
        }).catch(err => {
          console.error(err)
        });
      },

      /**
       * Cerrar dialogo
       * @return string
       * @author kobatime
       */
      closeAfiliado() {
        this.dialogAfiliado = false
        this.limpiarError()
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      /**
       ** Funcion para guardar y actualizar
       * @author kobatime
       */
      async guardarAfiliado() {
        this.loading = true
        if (this.editedIndex > -1) {
          try {
            const data = await this.$loadingPutRequest(actualizarTipoAfiliado(this.editedItem.id), this.editedItem)
            this.loading = false
            this.closeAfiliado()
            this.listarTipoAfiliado()
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
            const data = await this.$loadingPostRequest(crearTipoAfiliado(), this.editedItem)
            this.closeAfiliado()
            this.listarTipoAfiliado()
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
       * Funcion para abrir modal de editar
       * @param item object
       * @return object
       * @author kobatime
       */
      editItemAfiliado(item) {
        this.editedIndex = this.afiliado.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogAfiliado = true
      },

      /**
       * Funcion para abrir modal de inactivar
       * @param item object
       * @return object
       * @author kobatime
       */
      deleteItemAfiliado(item) {
        this.editedIndex = this.afiliado.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDeleteAfiliado = true
      },

      /**
       * Funcion para inactivar el tipo de afiliado
       * @param item object
       * @return boolean
       * @author kobatime
       */
      async deleteItemConfirmAfiliado(item) {
        item['estado'] = false
        await this.$loadingPutRequest(actualizarEstadoTipoAfiliado(item.id), item)
        this.closeDelete()
        this.listarTipoAfiliado()
      },

      /**
       * Funcion para activar el tipo de afiliado
       * @param item object
       * @return boolean
       * @author kobatime
       */
      async activarItemConfirmAfiliado(item) {
        item['estado'] = true
        await this.$loadingPutRequest(actualizarEstadoTipoAfiliado(item.id), item)
        this.closeDelete()
        this.listarTipoAfiliado()
      },



      // funciones globales

      /**
       ** Cerrar dialogo de inactivar
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
       **Funcion para el color de los chips
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
       ** for de errores para los campos
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
       ** for de limpiar errores
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
