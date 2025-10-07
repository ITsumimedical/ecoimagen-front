<template>
  <div>
    <v-data-table :headers="headers" :search="buscarMascota" :items="mascotas" sort-by="id" class="elevation-1"
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-subheader>Mascotas</v-subheader>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarMascota" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="1000px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo">
                <span class="black--text text-h5">{{titulo}}</span>
              </v-card-title>
              <form @submit.prevent="guardarMascota">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="4" sm="4" md="4">
                        <v-text-field v-model="mascotaEmpleado.nombre" label="Nombre" :error-messages="errors.nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="4" sm="4" md="4">
                        <v-text-field v-model="mascotaEmpleado.raza" label="Raza" :error-messages="errors.raza">
                        </v-text-field>
                      </v-col>
                      <v-col cols="4" sm="4" md="4">
                        <v-text-field v-model="mascotaEmpleado.especie" label="Especie"
                          :error-messages="errors.especie">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn color="boton" dark @click="guardarMascota()">
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
  </div>
</template>

<script>
  import {
    listarMascota,
    guardarMascota,
    actualizarMascota,
  } from '@/api/mascotaEmpleados/mascotaEmpleado'
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonMascotasEmpleadosComponente',
    props: ['empleado_id'],
    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarMascota: '',
        mascotas: [],
        mascotaEmpleado: {
          nombre: '',
          raza: '',
          especie: '',
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          raza: '',
          especie: '',
        },
        errors: {
          nombre: '',
          raza: '',
          especie: '',
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
            text: 'Raza',
            value: 'raza'
          },
          {
            text: 'Especie',
            value: 'especie'
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
      this.listarMascota();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear mascota' : 'Editar mascota'
      },
    },

    watch: {
      dialogoBloqueos(val) {
        val || this.cerrarDialogo()
      },
      empleado_id() {
        this.listarMascota();
      }
    },

    methods: {

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.mascotaEmpleado = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      listarTipoDocumento() {
        this.$loadingGetRequest(listarTipoDocumento()).then(res => {
          this.tipoDocumento = res.data.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      async listarMascota() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarMascota(this.empleado_id))
          this.mascotas = data.data
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      async guardarMascota() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarMascota(this.mascotaEmpleado.id), this.mascotaEmpleado)
            this.$toast.success(data.mensaje)
            this.listarMascota()
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
            this.mascotaEmpleado.empleado_id = this.empleado_id
            const {
              data
            } = await this.$loadingPostRequest(guardarMascota(), this.mascotaEmpleado)
            this.$toast.success(data.mensaje)
            this.listarMascota()
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
        this.editedIndex = this.mascotas.indexOf(item)
        this.mascotaEmpleado = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
