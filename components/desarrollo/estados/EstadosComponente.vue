<template>
  <div>
    <v-data-table :headers="headers" :search="buscarEstado" dense :items="estados" sort-by="id" class="elevation-1"
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarEstado" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="500px" persistent>
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo black--text">{{titulo}}</v-card-title>
              <form @submit.prevent="guardarEstados">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="estado.nombre" dense label="Nombre" :error-messages="errors.nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="estado.descripcion" dense label="Descripción"
                          :error-messages="errors.descripcion">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" small @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn color="boton" dark small @click="guardarEstados()">
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
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarEstados()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    listarEstados,
    guardarEstados,
    actualizarEstados
  } from '@/api/estados/estado'
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('estados.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonEstados',

    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarEstado: '',
        estados: [],
        estado: {
          nombre: '',
          descripcion: ''
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          descripcion: ''
        },
        errors: {
          nombre: '',
          descripcion: ''
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
            text: 'Descripción',
            value: 'descripcion'
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
      this.listarEstados();

    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear estado' : 'Editar estado'
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
          this.estado = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      async listarEstados() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarEstados(this.paginate.page))
          this.estados = data.data
          this.paginate.total = data.last_page
          this.paginate.page = data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      async guardarEstados() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarEstados(this.estado.id), this.estado)
            this.$toast.success(data.mensaje)
            this.listarEstados()
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
            } = await this.$loadingPostRequest(guardarEstados(), this.estado)
            this.$toast.success(data.mensaje)
            this.listarEstados()
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
        this.editedIndex = this.estados.indexOf(item)
        this.estado = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
