<template>
  <div>
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
    <v-data-table dense :headers="headers" :search="buscar" :items="areas" sort-by="id" class="elevation-1"
      disable-pagination :loading="loading" loading-text="Cargando..." hide-default-footer
      no-data-text="Sin datos para mostrar">

      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo">
                <span class="black--text text-h5">{{titulo}}</span>
              </v-card-title>
              <form @submit.prevent="guardarResponsable">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field dense v-model="responsable.nombre" label="Nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-autocomplete dense :items="responsables" item-text="correo" multiple chips deletable-chips
                          item-value="id" v-model="responsable.responsable_id" label="Resposable">
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn small color="boton" dark @click="guardarResponsable()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
      </template>
      <template v-slot:[`item.activo`]="{ item }">
        <v-chip small :color="item.activo ? 'green' : 'red'" dark>
          {{ item.activo ? 'Activo' : 'Inactivo' }}
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
            <v-icon :color="item.activo == 1 ? 'green' : 'red'" class="mr-2" v-bind="attrs" v-on="on"
              @click="cambiarEstadoArea(item)">
              {{ item.activo == 1 ? 'mdi-toggle-switch-off' : 'mdi-toggle-switch' }}
            </v-icon>
          </template>
          <span>{{ item.activo == 1? 'Desactivar' : 'Activar' }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-row no-gutters style="background-color: white;">
      <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9" @input="listarAreaResponsable">
        </v-pagination>
      </v-col>
      <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
          @change="listarAreaResponsable()">
        </v-select>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.pqrsf.menu')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonResponsablePqrComponentes',

    data() {
      return {
        preload: false,
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscar: '',
        responsables: [],
        responsable: {
          nombre: '',
          responsable_id: []
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          responsable_id: []
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
            value: 'nombre',
          },
          {
            text: 'Estado',
            value: 'activo',
            align: 'center'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
        areas: [],
        pagina: 1,
        total: 0,
        opcionActual: 5,
        opciones: [5, 10, 20, 50, 100],
      };
    },

    mounted() {
      this.listarAreaResponsable();
      this.listarResponsable();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear area' : 'Editar area'
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
          this.responsable = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
      },

      listarResponsable() {
        this.preload = true
        this.$axios.post('/responsable-pqrsf/listar').then(res => {
          this.responsables = res.data
          this.preload = false
        }).catch(error => {
          this.preload = false
        })
      },

      listarAreaResponsable() {
        this.preload = true
        this.$axios.post('/area-responsable-pqrsf/listarTodo?page=' + this.pagina + '&cant=' + this.opcionActual).then(
          res => {
            this.areas = res.data.data
            this.total = res.data.last_page;
            this.preload = false
          }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
          this.preload = false
        })
      },

      guardarResponsable() {
        if (this.editedIndex > -1) {
          this.preload = true
          this.$axios.put('/area-responsable-pqrsf/actualizar/' + this.responsable.id, this.responsable).then(res => {
            this.$toast.success('Se ha actualiza el area responsable exitosamente!.')
            this.listarAreaResponsable()
            this.close()
            this.preload = false
          }).catch(error => {
            this.preload = false
          })
        } else {
          this.preload = true
          this.$axios.post('/area-responsable-pqrsf/crear', this.responsable).then(res => {
            this.$toast.success('Se ha creado el area  exitosamente!.')
            this.listarAreaResponsable()
            this.close()
            this.preload = false
          }).catch(error => {
            this.preload = false
            if (error.response.data.mensaje) {
              this.$toast.error('No se ha podido crear el responsable')
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })
        }

      },

      cambiarEstadoArea(item) {
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
              .post(`area-responsable-pqrsf/cambiarEstado/${item.id}`, {
                estado_id: item.estado_id ? 1 : 2
              })
              .then(() => {
                this.$swal({
                  title: "Éxito",
                  text: "Se ha cambiado el estado con éxito",
                  type: "success",
                });
                this.listarAreaResponsable();
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


      editar(item) {
        console.log('ite', item);
        this.editedIndex = this.areas.indexOf(item)
        console.log('sdssd', this.editedIndex);
        this.listarResponsable();
        this.responsable = Object.assign({}, item)
        this.responsable.responsable_id = item.responsable
        this.dialog = true
      },


    },
  };

</script>
