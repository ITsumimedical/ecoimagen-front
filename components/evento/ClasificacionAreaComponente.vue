<template>
  <div>
    <v-data-table :headers="headers" :search="buscarClasificacionArea" :items="clasificaciones" sort-by="id"
      class="elevation-1" :loading="loading" loading-text="Cargando..." hide-default-footer
      no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon right>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarClasificacionArea" label="Buscar" append-icon="mdi-magnify" hide-details
            single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-card>
            <v-alert text border="left" dense type="info">{{titulo}}</v-alert>
            <form @submit.prevent="guardarClasificacion">
              <v-card-text>
                <v-container fluid>
                  <v-row dense>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="clasificacion.nombre" dense label="Nombre" :error-messages="errors.nombre">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-autocomplete :items="sucesos" dense v-model="clasificacion.suceso_id"
                        :error-messages="errors.suceso_id" item-text="nombre" item-value="id" label="Suceso">
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small @click="close()">
                  Cancelar
                </v-btn>
                <v-btn color="boton" small dark @click="guardarClasificacion()">
                  Guardar
                </v-btn>
              </v-card-actions>
            </form>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
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
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7"
          @input="listarClasificaciones()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    listarClasificaciones,
    guardarClasificacion,
    actualizarClasificacion,
  } from '@/api/clasificacionesAreas/clasificacionArea'
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonClasificacionAreaComponente',

    data() {
      return {
        time: null,
        menu2: false,
        menu1: false,
        modal2: false,
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarClasificacionArea: '',
        clasificaciones: [],
        sucesos: [],
        clasificacion: {
          nombre: '',
          suceso_id: '',
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          suceso_id: '',
        },
        errors: {
          nombre: '',
          suceso_id: '',
        },
        paginate: {
          total: 0,
          page: 1
        },
        headers: [{
            text: 'Id',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Suceso',
            value: 'nombreSuceso'
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
      this.listarClasificaciones()
      this.listarSucesos()
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear clasificación de área' : 'Actualizar clasificación de área'
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
          this.clasificacion = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      async listarClasificaciones() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarClasificaciones(this.paginate.page))
          this.clasificaciones = data.data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      listarSucesos() {
        this.$axios.get('/sucesos/listar').then(res => {
          this.sucesos = res.data.data;
        })
      },

      async guardarClasificacion() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarClasificacion(this.clasificacion.id), this.clasificacion)
            this.$toast.success(data.mensaje)
            this.listarClasificaciones()
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
            } = await this.$loadingPostRequest(guardarClasificacion(), this.clasificacion)
            this.$toast.success(data.mensaje)
            this.listarClasificaciones()
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
        this.editedIndex = this.clasificaciones.indexOf(item)
        this.clasificacion = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
