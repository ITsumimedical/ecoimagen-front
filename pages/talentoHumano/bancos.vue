<template>
  <div>
    <v-data-table :headers="headers" :search="buscarBanco" :items="bancos" sort-by="id" class="elevation-1"
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarBanco" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo">
                <span class="black--text text-h5">{{titulo}}</span>
              </v-card-title>
              <form @submit.prevent="guardarBanco">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field v-model="banco.nombre" label="Nombre" :error-messages="errors.nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field v-model="banco.nit" label="NIT" :error-messages="errors.nit">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field v-model="banco.telefono" label="Teléfono">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field v-model="banco.direccion" label="Dirección">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn small color="boton" dark @click="guardarBanco()">
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
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarBancos()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    listarBancos,
    guardarBanco,
    actualizarBanco,
  } from '@/api/bancos/banco'
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonBancos',

    data() {
      return {
        time: null,
        menu2: false,
        menu1: false,
        modal2: false,
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarBanco: '',
        bancos: [],
        banco: {
          nombre: '',
          nit: '',
          telefono: '',
          direccion: '',
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          nit: '',
          telefono: '',
          direccion: '',
        },
        errors: {
          nombre: '',
          nit: '',
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
            text: 'NIT',
            value: 'nit'
          },
          {
            text: 'Teléfono',
            value: 'telefono'
          },
          {
            text: 'Dirección',
            value: 'direccion'
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
      this.listarBancos();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear banco' :
          'Editar banco'
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
          this.banco = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      async listarBancos() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarBancos(this.paginate.page))
          this.bancos = data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      async guardarBanco() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarBanco(this.banco.id), this.banco)
            this.$toast.success('Se ha actualizado el banco exitosamente!.')
            this.listarBancos()
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
            } = await this.$loadingPostRequest(guardarBanco(), this.banco)
            this.$toast.success('Se ha creado el banco exitosamente!.')
            this.listarBancos()
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
        this.editedIndex = this.bancos.indexOf(item)
        this.banco = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
