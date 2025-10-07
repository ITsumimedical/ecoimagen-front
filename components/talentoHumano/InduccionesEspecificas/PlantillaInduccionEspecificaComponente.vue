<template>
  <div>
    <v-data-table :headers="headers" :search="buscarPlantilla" :items="plantillas" sort-by="id" class="elevation-1"
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:[`item.permitir_duplicidad`]="{ item }">
        <v-chip :color="chipEstado(item.permitir_duplicidad)" dark>
          {{ item.permitir_duplicidad == '1' ? 'Permite duplicidad' : 'No permite duplicidad' }}</v-chip>
      </template>
      <template v-slot:top>
        <v-card-title>
          <v-btn color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarPlantilla" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo">
                <span class="black--text text-h5">{{titulo}}</span>
              </v-card-title>
              <form @submit.prevent="guardarPlantilla">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field v-model="plantilla.nombre" label="Nombre" :error-messages="errors.nombre">
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
                  <v-btn color="boton" dark @click="guardarPlantilla()">
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
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarPlantillas()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    listarPlantillas,
    guardarPlantilla,
    actualizarPlantilla,
  } from '@/api/plantillasInduccionEspecificas/PlantillaInduccionEspecifica'
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonPlantillaInduccionEspecificaComponente',

    data() {
      return {
        time: null,
        menu2: false,
        menu1: false,
        modal2: false,
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarPlantilla: '',
        plantillas: [],
        plantilla: {
          nombre: '',
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          descripcion: '',
          horas: '',
          permitir_duplicidad: false,
        },
        errors: {
          nombre: '',
          descripcion: '',
          horas: '',
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
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
      };
    },

    mounted() {
      this.listarPlantillas();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear plantilla inducción específica' :
          'Editar plantilla inducción específica'
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
          this.plantilla = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      async listarPlantillas() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarPlantillas(this.paginate.page))
          this.plantillas = data.data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      chipEstado(permitir_duplicidad) {
        if (permitir_duplicidad == '1') return 'green'
        else if (permitir_duplicidad == '0') return 'red'
        else return 'warning'
      },

      async guardarPlantilla() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarPlantilla(this.plantilla.id), this.plantilla)
            this.$toast.success('Se ha actualizado la plantilla de inducción específica exitosamente!.')
            this.listarPlantillas()
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
            } = await this.$loadingPostRequest(guardarPlantilla(), this.plantilla)
            this.$toast.success('Se ha creado el plantilla de inducción específica exitosamente!.')
            this.listarPlantillas()
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
        this.editedIndex = this.plantillas.indexOf(item)
        this.plantilla = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
