<template>
  <div>
    <v-data-table :headers="headers" :search="buscarCategoriaHistoria" :items="categoriaHistorias" sort-by="id" class="elevation-1"
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn color="boton" class="mb-2 white--text" @click="dialog = true">
            Nueva categorías
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarCategoriaHistoria" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="500px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo">
                <span class="white--text text-h5">{{titulo}}</span>
              </v-card-title>
              <form @submit.prevent="guardarCategoriaHistoria">
                <v-card-text>
                  <v-container>
                    <v-row>

                      <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="categoriaHistoria.nombre" label="Nombre" :error-messages="errors.nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="categoriaHistoria.titulo" label="Título" :error-messages="errors.titulo">
                        </v-text-field>
                      </v-col>
                       <v-col cols="12" sm="12" md="6">
                        <v-autocomplete v-model="categoriaHistoria.orden" :items="orden" label="Orden">
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-autocomplete v-model="categoriaHistoria.especialidades" :items="especialidades" item-text="nombre" item-value="id" label="Especialidad" chips deletable-chips multiple>
                          <template v-slot:item="data">
                            <template >
                              <v-list v-text="data.item.nombre">
                              </v-list>
                            </template>
                          </template>
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn color="boton" dark @click="guardarCategoriaHistoria()">
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
            <v-icon color="success" small class="mr-2" v-bind="attrs" v-on="on" @click="gestion(item)">
              mdi-clipboard-outline
            </v-icon>
          </template>
          <span>Gestión</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <template>
      <div class="text-center">
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarCategoriaHistoria()">
        </v-pagination>
      </div>
    </template>
    <v-dialog v-model="dialogoAgregar" max-width="500px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo">
                <span class="white--text text-h5">Agregar especialidad</span>
              </v-card-title>
              <form @submit.prevent="guardarCategoriaHistoria">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="agregarCita.nombre" label="Nombre" readonly>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-autocomplete v-model="agregarCita.especialidades" :items="especialidades" item-text="nombre" item-value="id" label="Especialidades" chips deletable-chips multiple>
                          <template v-slot:item="data">
                            <template >
                              <v-list v-text="data.item.nombre">
                              </v-list>
                            </template>
                          </template>
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" @click="cerrarDialogo()">
                    Cancelar
                  </v-btn>
                  <v-btn color="boton" dark @click="guardarCategoriaHistoria()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
  </div>
</template>

<script>
  import {
    listarCategoriaHistoria,
    guardarCategoriaHistoria,
    actualizarCategoriaHistoria,
  } from '@/api/historia/categoriaHistoria'
  import {
    listarEspecialidad
  } from '@/api/especialidades/especialidad'
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonCategoriasHistoria',

    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        dialogoAgregar: false,
        buscarCategoriaHistoria: '',
        categoriaHistorias: [],
        especialidades:[],
        agregarCita: {
          especialidades:[],
          nombre:''
        },
        categoriaHistoria: {
          nombre: '',
          especialidades:[],
          titulo:'',
          orden:''
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          titulo:'',
          orden:''
        },
        errors: {
          nombre: '',
          titulo:'',
          orden:''
        },
        paginate: {
          total: 0,
          page: 1
        },
        orden:['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19',
        '20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42',
        '43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65',
        '66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88',
        '89','90','91','92','93','94','95','96','97','98','99','100'],
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
      this.listarCategoriaHistoria();
      this.listarEspecialidad();

    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear categoría historia programa' : 'Editar categoría historia programa'
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
          this.categoriaHistoria = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },


      async listarCategoriaHistoria() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarCategoriaHistoria(this.paginate.page))
          this.categoriaHistorias = data.data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      async guardarCategoriaHistoria() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarCategoriaHistoria(this.categoriaHistoria.id), this.categoriaHistoria)
            this.$toast.success(data.mensaje)
            this.listarCategoriaHistoria()
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
            } = await this.$loadingPostRequest(guardarCategoriaHistoria(), this.categoriaHistoria)
            this.$toast.success(data.mensaje)
            this.listarCategoriaHistoria()
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
        this.editedIndex = this.categoriaHistorias.indexOf(item)
        this.categoriaHistoria = Object.assign({}, item)
        this.dialog = true
      },

      listarEspecialidad() {
        this.$loadingGetRequest(listarEspecialidad()).then(res => {
          this.especialidades = res.data.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      gestion(item){
        this.dialogoAgregar = true
        this.agregarCita.nombre = item.nombre
      },

      cerrarDialogo(){
        this.dialogoAgregar = false
        this.agregarCita.especialidades = []
      }

    },
  };

</script>
