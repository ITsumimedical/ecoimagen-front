<template>
  <div>
    <v-data-table :headers="headers" :search="buscarEntidad" :items="entidades" sort-by="id" class="elevation-1"
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn color="boton" v-if="$can('entidadExamenLaboral.crear')" class="mb-2 white--text"
            @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-col cols="6" sm="6" md="6">
            Entidades exámenes laborales
          </v-col>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarEntidad" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo">
                <span class="black--text text-h5">{{titulo}}</span>
              </v-card-title>
              <form @submit.prevent="guardarEntidad">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field dense v-model="entidad.nit" label="Nit" :error-messages="errors.nit">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field dense v-model="entidad.nombre" label="Nombre" :error-messages="errors.nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="2">
                        <v-text-field dense v-model="entidad.telefono" label="Teléfono" :error-messages="errors.telefono">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-textarea auto-grow dense v-model="entidad.direccion" label="Dirección" :error-messages="errors.direccion">
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
                  <v-btn small color="boton" dark @click="guardarEntidad()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top v-if="$can('entidadExamenLaboral.actualizar')">
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
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarEntidades()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    listarEntidades,
    guardarEntidad,
    actualizarEntidad,
  } from '@/api/entidadesExamenesLaborales/entidadExamenLaboral'
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('entidadExamen.listar')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonentidadExamenLaboral',
    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarEntidad: '',
        entidades: [],
        entidad: {
          nombre: '',
          nit: '',
          direccion: '',
          telefono: '',
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          nit: '',
          direccion: '',
          telefono: '',
        },
        errors: {
          nombre: '',
          nit: '',
          direccion: '',
          telefono: '',
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
            text: 'Nit',
            value: 'nit'
          },
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Dirección',
            value: 'direccion'
          },
          {
            text: 'Teléfono',
            value: 'telefono'
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
      this.listarEntidades();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear entidad' : 'Editar entidad'
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
          this.entidad = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      async listarEntidades() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarEntidades(this.paginate.page))
          this.entidades = data.data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      async guardarEntidad() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarEntidad(this.entidad.id), this.entidad)
            this.$toast.success(data.mensaje)
            this.listarEntidades()
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
            } = await this.$loadingPostRequest(guardarEntidad(), this.entidad)
            this.$toast.success(data.mensaje)
            this.listarEntidades()
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
        this.editedIndex = this.entidades.indexOf(item)
        this.entidad = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
