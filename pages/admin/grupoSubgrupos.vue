<template>
  <div>
    <v-data-table :headers="headers" :search="buscar" dense :items="grupos" sort-by="id" class="elevation-1" item-key="nombre"
      :loading="loading" loading-text="Cargando..." no-data-text="Sin datos para mostrar" show-expand
      :expanded.sync="expanded">
      <template v-slot:expanded-item="{ headers, item }">
        <td class="pt-4 pb-4" :colspan="headers.length">


          <v-data-table v-if="item.subgrupo.length >0" dense :headers="subHeaders" :items="item.subgrupo" item-key="id"
            sort-by="name" hide-default-footer disable-pagination>
            <template v-slot:[`item.accion`]="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="editarSubgrupo(item)">
                    mdi-pencil
                  </v-icon>
                </template>
                <span>Editar</span>
              </v-tooltip>
            </template>
          </v-data-table>

        </td>
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
          <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="500px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo black--text">{{titulo}}</v-card-title>
              <form @submit.prevent="guardarGrupos">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="grupo.nombre" dense label="Nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="grupo.codigo" dense label="Codigo">
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
                  <v-btn color="boton" dark small @click="guardarGrupos()">
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
            <v-icon color="info" small class="mr-2" v-bind="attrs" v-on="on" @click="abrirSubgrupo(item)">
              mdi-plus
            </v-icon>
          </template>
          <span>Agregar subgrupo</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <v-dialog v-model="subDialog" max-width="500px" persistent v-if="subDialog">
      <v-card>
              <v-card-title class="titulo black--text" v-if="subGuardar">Crear Subgrupo</v-card-title>
              <v-card-title class="titulo black--text" v-else>Editar Subgrupo</v-card-title>
              <form @submit.prevent="guardarSubgrupos">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="subGrupo.nombre" dense label="Nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="subGrupo.descripcion" dense label="Descripción">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" small @click="subDialog = false">
                    Cancelar
                  </v-btn>
                  <v-btn color="boton" v-if="subGuardar" dark small @click="guardarSubgrupos()">
                    Guardar
                  </v-btn>
                  <v-btn color="boton" v-else dark small @click="EditarSubgrupos()">
                    Editar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
    </v-dialog>
    <!-- <template>
      <div class="text-center">
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarBodegas()">
        </v-pagination>
      </div>
    </template> -->
  </div>
</template>

<script>
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('admin.enter')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonGrupoSubgrupo',

    data() {
      return {
        expanded: [],
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscar: '',
        grupos: [],
        grupo: {
          nombre: '',
          codigo: '',
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          codigo: '',
        },
        defectoSub: {
          nombre: '',
          descripcion: '',
          grupo_id:'',
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
            text: 'Codigo',
            value: 'codigo'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
        subHeaders: [{
            text: 'id',
            value: 'id'
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
            value: 'accion'
          },
        ],
        subGrupo:{

        },
        subGuardar:false,
        subDialog: false
      };
    },

    mounted() {
      this.listarGrupos();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear grupo' : 'Editar grupo'
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
          this.grupo = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        // this.limpiarError()
      },

      listarGrupos() {
        this.$axios.get('/grupos/listar').then(res => {
          this.grupos = res.data
        }).catch(e => {
          console.log(e.response)
        })
      },

      guardarGrupos() {
        // this.limpiarError()
        if (this.editedIndex > -1) {
          this.$axios.put('/grupos/actualizar/' + this.grupo.id, this.grupo).then(res => {
            this.$toast.success('Se actualizo con exito')
            this.dialog = false
            this.listarGrupos()
          }).catch(error => {
            if (error.response.data.mensaje) {
              // this.$toast.error('Se ha actualizado el periodo de inducción específica correctamente!.')
            } else if (error.response.data) {
              // this.ErrorEntrada(error.response.data)
            }
          })
        } else {
          this.$axios.post('/grupos/crear', this.grupo).then(res => {
            this.$toast.success('Se ha creado el grupo correctamente!.')
            this.dialog = false
            this.listarGrupos()
            this.close()
          }).catch(error => {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })

        }

      },


      editar(item) {
        this.editedIndex = this.grupos.indexOf(item)
        this.grupo = Object.assign({}, item)
        this.dialog = true
      },

      editarSubgrupo(item){
        this.subGrupo = Object.assign({}, item)
        this.subGuardar = false;
        this.subDialog = true
      },

      abrirSubgrupo(item){
        this.subGrupo.grupo_id = item.id;
        this.subGuardar = true;
        this.subDialog = true;
      },

      closeSub() {
        this.subDialog = false
        this.$nextTick(() => {
          this.subGrupo = Object.assign({}, this.defectoSub)
        })
      },

      guardarSubgrupos() {

          this.$axios.post('/subgrupos/crear', this.subGrupo).then(res => {
            this.$toast.success('Se ha creado el Subgrupo correctamente!.')
            this.dialog = false
            this.listarGrupos()
            this.closeSub()
          }).catch(error => {
            // if (error.response.data.mensaje) {
            //   this.$toast.error(error.response.data.mensaje)
            // } else if (error.response.data) {
            //   this.ErrorEntrada(error.response.data)
            // }
          })
      },

      EditarSubgrupos(){
        this.$axios.put('/subgrupos/actualizar/' + this.subGrupo.id, this.subGrupo).then(res => {
            this.$toast.success('Se actualizo con exito')
            this.dialog = false
            this.listarGrupos()
            this.closeSub()
          }).catch(error => {
            // if (error.response.data.mensaje) {
            //   // this.$toast.error('Se ha actualizado el periodo de inducción específica correctamente!.')
            // } else if (error.response.data) {
            //   // this.ErrorEntrada(error.response.data)
            // }
          })
      }


    },
  };

</script>
