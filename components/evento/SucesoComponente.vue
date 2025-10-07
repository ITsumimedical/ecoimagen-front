<template>
  <div>
    <v-data-table :headers="headers" :search="buscarSuceso" :items="sucesos" sort-by="id" class="elevation-1"
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
          <v-text-field v-model="buscarSuceso" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-card>
            <v-alert dense text border="left" type="info" icon="mdi-download-lock">{{titulo}}</v-alert>
            <form @submit.prevent="guardarSuceso">
              <v-card-text>
                <v-container fluid>
                  <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field dense v-model="suceso.nombre" label="Nombre" :error-messages="errors.nombre">
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
                <v-btn color="boton" small dark @click="guardarSuceso()">
                  Guardar
                </v-btn>
              </v-card-actions>
            </form>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:[`item.estado_id`]="{ item }">
        <v-chip small :color="getColor(item.estado_id)" dark>
          {{ item.estado_id == '1' ? 'Activa' : 'Inactiva' }}
        </v-chip>
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
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="info" class="mr-2" v-bind="attrs" v-on="on" @click="deleteItemConfirm(item)">
              mdi-list-status
            </v-icon>
          </template>
          <span>{{ item.estado_id == 1 ? 'Inactivar' : 'Activar' }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <template>
      <div class="text-center">
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarSucesos()">
        </v-pagination>
      </div>
    </template>

    <v-dialog v-model="dialogDelete" max-width="800px">
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="error" dark @click="closeDelete()">Cancelar</v-btn>
          <v-btn small color="boton" dark @click="deleteItemConfirm(suceso)">
            {{ suceso.estado_id == true ? 'Inactivar' : 'Activar' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {
    listarSucesos,
    guardarSuceso,
    actualizarSuceso,
  } from '@/api/sucesos/suceso'
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonSucesoComponente',

    data() {
      return {
        dialogDelete: false,
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarSuceso: '',
        sucesos: [],
        suceso: {
          nombre: '',
          estado_id: 1,
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
            text: 'Id',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Estado',
            value: 'estado_id',
            sortable: false,
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
      this.listarSucesos();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Creación de suceso' : 'Actualización de suceso'
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
          this.suceso = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      async listarSucesos() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarSucesos(this.paginate.page))
          this.sucesos = data.data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      async guardarSuceso() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarSuceso(this.suceso.id), this.suceso)
            this.$toast.success(data.mensaje)
            this.listarSucesos()
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
            } = await this.$loadingPostRequest(guardarSuceso(), this.suceso)
            this.$toast.success(data.mensaje)
            this.listarSucesos()
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
        this.editedIndex = this.sucesos.indexOf(item)
        this.suceso = Object.assign({}, item)
        this.dialog = true
      },

      deleteItemConfirm(item) {
        return this.$swal({
          title: "¿Está Seguro?",
          text: "Deseas cambiar el estado del suceso",
          type: "question",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirmar",
          cancelButtonText: "Cancelar",
        }).then(async (result) => {
          if (result.value) {
            const request = {
              'estado_id': item.estado_id == 1 ? 2 : 1,
              'nombre': item.nombre,
            };
            this.$axios.put('/sucesos/' + item.id, request).then(res => {
              this.$toast.success(res.data.mensaje)
              this.listarSucesos()
              this.closeDelete()
            }).catch(error => {
              if (error.response.data.error) {
                this.$toast.error(error.response.data.error)
              } else if (error.response.data) {
                this.ErrorEntrada(error.response.data)
              }
            });
          }
        });

      },

      closeDelete() {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.suceso = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      getColor(estado) {
        if (estado == 1) return 'success'
        else return 'error'
      },

    },
  };

</script>
