<template>
  <div>
    <v-data-table dense :headers="headers" :search="buscarTipoSolicitud" :items="canales" sort-by="id"
      class="elevation-1" :loading="loading" :disable="loading" loading-text="Cargando..." hide-default-footer
      no-data-text="Sin datos para mostrar">
      <template v-slot:item.nombreEstado="{ item }">
        <v-chip small :color="item.estado_id == 1 ? 'green' : 'red'" dark>
          {{ item.estado_id == 1 ? 'Activo' : 'Inactivo' }}
        </v-chip>
      </template>
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarTipoSolicitud" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo">
                <span class="black--text text-h5">{{titulo}}</span>
              </v-card-title>
              <form @submit.prevent="guardarTipoSolicitud">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field dense v-model="tipoSolicitud.nombre" label="Nombre"
                          :error-messages="errors.nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea auto-grow dense v-model="tipoSolicitud.descripcion" label="Descripción"
                          :error-messages="errors.descripcion">
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
                  <v-btn small color="boton" dark @click="guardarTipoSolicitud()">
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

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon :color="item.estado_id == 1 ? 'green' : 'red'" class="mr-2" v-bind="attrs" v-on="on"
              @click="cambiarEstadoCanal(item)">
              {{ item.estado_id == 1 ? 'mdi-toggle-switch-off' : 'mdi-toggle-switch' }}
            </v-icon>
          </template>
          <span>{{ item.estado_id == 1? 'Desactivar' : 'Activar' }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <template>
      <div class="text-center">
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarCanales()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    actualizarTipoSolicitud,
    guardarTipoSolicitud,
  } from '@/api/gestionPqrsf/TipoSolicitudPqrsf'
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.pqrsf.menu')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonTipoSolicitudPqrsfComponentes',

    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarTipoSolicitud: '',
        canales: [],
        tipoSolicitud: {
          nombre: '',
          descripcion: '',
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          descripcion: '',
        },
        errors: {
          nombre: '',
          descripcion: '',
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
            text: 'Estado',
            value: 'nombreEstado'
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
      this.listarCanales();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear tipo de solicitud pqrsf' : 'Editar tipo de solicitud pqrsf'
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
          this.tipoSolicitud = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      listarCanales() {
        this.loading= true;
        this.$axios.get('/tipos-solicitudes-pqrsf/listarTodos').then(res => {
          this.canales = res.data.data
          this.loading = false
        }).catch(error => {
          this.loading = false;
          this.$toast.error(error.response.data.mensaje)
        })
      },

      async guardarTipoSolicitud() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarTipoSolicitud(this.tipoSolicitud.id), this.tipoSolicitud)
            this.$toast.success('Se ha actualizado el tipo de solicitud correctamente!.')
            this.listarCanales()
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
            } = await this.$loadingPostRequest(guardarTipoSolicitud(), this.tipoSolicitud)
            this.$toast.success('Se ha creado el tipo de solicitud exitosamente!.')
            this.listarCanales()
            this.close()
          } catch (error) {
            if (error.response.data.mensaje) {
              this.$toast.error('No se ha podido crear el tipo de solicitud')
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          }
        }

      },

      cambiarEstadoCanal(item) {
        this.$swal({
          title: "Atención!",
          text: "¿Esta seguro de cambiar el estado?",
          type: "info",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            this.preload = true;
            this.$axios
              .post(`tipos-solicitudes-pqrsf/cambiarEstado/${item.id}`, {
                estado_id: item.estado_id ? 1 : 2
              })
              .then(() => {
                this.$swal({
                  title: "Éxito",
                  text: "Se ha cambiado el estado con éxito",
                  type: "success",
                });
                this.listarCanales();
              })
              .catch((error) => {
                this.$toast.error('Error al cambiar el estado')
                console.error(error);
              })
              .finally(() => {
                this.preload = false;
              });
          }
        });
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
        this.editedIndex = this.canales.indexOf(item)
        this.tipoSolicitud = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
