<template>
  <div>
    <v-data-table :headers="headers" :search="buscarPrestador" :items="prestadores" sort-by="id" dense
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon right>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert text dense border="left" color="blue-grey">{{titulo}}</v-alert>
              <form @submit.prevent="guardarPrestadores">
                <v-card-text>
                  <v-container fluid>
                    <v-row dense>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field dense v-model="prestador.nit" label="Nit" :error-messages="errors.nit">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field dense v-model="prestador.nombre" label="Nombre" :error-messages="errors.nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field dense v-model="prestador.direccion" label="Dirección"
                          :error-messages="errors.direccion">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete :items="tipos" dense v-model="prestador.tipo_prestador_id"
                          :error-messages="errors.tipo_prestador_id" item-text="nombre" item-value="id"
                          label="Tipo entidad"></v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn small color="boton" dark @click="guardarPrestadores()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
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
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarPrestadores()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    listarPrestadores,
    guardarPrestadores,
    actualizarPrestadores,
  } from '@/api/prestadoresTh/PrestadorTh'
  import {
    listarTipoPrestadores
  } from "@/api/tipoPrestadoresTh/tipoPrestadorTh";
  export default {
    name: 'WorkspaceJsonPrestadorTh',

    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarPrestador: '',
        prestadores: [],
        tipos: [],
        prestador: {
          nombre: '',
          nit: '',
          direccion: '',
          tipo_prestador_id: '',
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          nit: '',
          direccion: '',
          tipo_prestador_id: '',
        },
        errors: {
          nombre: '',
          nit: '',
          direccion: '',
          tipo_prestador_id: '',
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
            text: 'Tipo de prestador',
            value: 'tipo_prestador.nombre'
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
      this.listarPrestadores();
      this.listarTipoPrestadores()
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
          this.prestador = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      async listarPrestadores() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarPrestadores(this.paginate.page))
          this.prestadores = data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      listarTipoPrestadores() {
        this.$loadingGetRequest(listarTipoPrestadores()).then(res => {
          this.tipos = res.data.data.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      async guardarPrestadores() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarPrestadores(this.prestador.id), this.prestador)
            this.$toast.success(data.mensaje)
            this.listarPrestadores()
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
            } = await this.$loadingPostRequest(guardarPrestadores(), this.prestador)
            this.$toast.success(data.mensaje)
            this.listarPrestadores()
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
        this.editedIndex = this.prestadores.indexOf(item)
        this.prestador = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
