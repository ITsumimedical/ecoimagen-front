<template>
  <div>
    <v-data-table disable-pagination dense :headers="headers" :items="canales" sort-by="id" :loading="loading" :disable="loading"
      loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:item.nombreEstado="{ item }">
        <v-chip small :color="item.estado_id == 1 ? 'green' : 'red'" dark>
          {{ item.estado_id == 1 ? 'Activo' : 'Inactivo' }}
        </v-chip>
      </template>
      <template v-slot:top>
        <v-card-title>
          <v-col md="5" lg="5" xl="5" sm="6" cols>
            <v-text-field dense v-model="filtro.nombre" label="Nombre" single-line>
            </v-text-field>
          </v-col>
          <v-col md="2" lg="2" xl="2" sm="6" cols>
            <v-btn-toggle background-color="white" dark>
              <v-btn small color="success" @click="listarCanales()">Filtrar</v-btn>
              <v-btn small class="ml-2" color="error" @click="limpiar()">Limpiar</v-btn>
            </v-btn-toggle>
          </v-col>
          <v-spacer></v-spacer>
          <v-btn small color="boton" class="mb-2 white--text" @click="dialog = true">Nuevo<v-icon right>
              mdi-plus-circle-outline</v-icon>
          </v-btn>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="700px" persistent>
          <v-card>
            <v-alert text dense border="left" type="info">{{titulo}}</v-alert>
            <form @submit.prevent="guardarCanal">
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field dense v-model="canal.nombre" label="Nombre" :error-messages="errors.nombre">
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="error" @click="close()">
                  Cancelar
                </v-btn>
                <v-btn small color="boton" dark @click="guardarCanal()">
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
    <v-row no-gutters>
      <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9" @input="listarCanales">
        </v-pagination>
      </v-col>
      <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small @change="listarCanales">
        </v-select>
      </v-col>
    </v-row>
    <template>
      <div class="text-center">
        <v-dialog v-model="preload" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    actualizarCanal,
    guardarCanal,
  } from '@/api/gestionPqrsf/canalPqrsf'
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.pqrsf.menu')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonCanalComponentes',

    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        opciones: [5, 10, 20, 50, 100],
        opcionActual: 5,
        pagina: 1,
        total: 0,
        filtro: {
          nombre: ''
        },
        preload: false,
        canales: [],
        canal: {
          nombre: '',
          estado_id: 1
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
            text: 'id',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Nombre',
            value: 'nombre'
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
        return this.editedIndex === -1 ? 'Crear canal' : 'Editar canal'
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
          this.canal = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      listarCanales() {
        this.loading = true;
        this.$axios.post('/canales-pqrsf/listarTodos?page=' + this.pagina + '&cant=' + this.opcionActual, this.filtro).then(
          res => {
            this.canales = res.data.data
            this.total = res.data.last_page;
            this.loading= false
          }).catch(error => {
            this.loading= false
          this.$toast.error(error.response.data.mensaje)
        })
      },

      limpiar() {
        this.preload = true;
        for (const prop of Object.getOwnPropertyNames(this.filtro)) {
          this.filtro[prop] = null;
        }
        for (const key in this.editedItem) {
          this.editedItem[key] = ''
        }
        this.editedIndex = -1
        this.dialog = false
        this.preload = false;
        this.listarCanales();
      },

      async guardarCanal() {
        this.preload = true
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarCanal(this.canal.id), this.canal)
            this.$toast.success('Se ha actualizado el canal correctamente!.')
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
            } = await this.$loadingPostRequest(guardarCanal(), this.canal)
            this.$toast.success('Se ha creado el canal exitosamente!.')
            this.listarCanales()
            this.close()
          } catch (error) {
            if (error.response.data.mensaje) {
              this.$toast.error('No se ha podido crear el canal')
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          }
        }
        this.preload = false
      },

      ErrorEntrada(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(',')
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
              .post(`canales-pqrsf/cambiarEstado/${item.id}`, {
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

      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },

      editar(item) {
        this.editedIndex = this.canales.indexOf(item)
        this.canal = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
