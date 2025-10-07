<template>
  <div>
    <v-data-table dense :headers="headers" :search="buscarRecomendacion" :items="recomendaciones" sort-by="id"
      class="elevation-1" :loading="loading" loading-text="Cargando..." hide-default-footer
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
          <v-text-field v-model="buscarRecomendacion" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo">
                <span class="black--text text-h5">{{titulo}}</span>
              </v-card-title>
              <form @submit.prevent="guardarRecomendacion">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="8">
                        <v-autocomplete v-model="recomendacion.cup_id" :items="cups" item-text="CodigoNombre"
                          :search-input.sync="cup" item-value="id" label="Cup"></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea dense auto-grow v-model="recomendacion.descripcion" label="Descripción"
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
                  <v-btn small color="boton" dark @click="guardarRecomendacion()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="550px">
          <v-card>
            <v-card-title class="text-h6">¿Deseas {{recomendacion.estado == true ? 'Inactivar':'Activar'}} esta recomendación
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="error" dark @click="closeDelete">Cancelar</v-btn>
              <v-spacer></v-spacer>
              <v-btn small color="boton" dark @click="deleteItemConfirm(recomendacion)">
                {{recomendacion.estado == true ? 'Inactivar':'Activar'}}</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
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
            <v-icon color="info" class="mr-2" v-bind="attrs" v-on="on" @click="deleteItem(item)">
              mdi-list-status
            </v-icon>
          </template>
          <span>{{ item.estado == true ? 'Inactivar' : 'Activar' }}</span>
        </v-tooltip>
      </template>
      <template v-slot:[`item.estado`]="{ item }">
        <v-chip small :color="chipEstado(item.estado)" dark>{{ item.estado == '1' ? 'Activo' : 'Inactivo' }}</v-chip>
      </template>
    </v-data-table>
    <template>
      <v-row no-gutters>
        <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
          <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
            @input="listarRecomendaciones()">
          </v-pagination>
        </v-col>
        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
          <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
            @change="listarRecomendaciones()">
          </v-select>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('panelmedico.atenciones')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonRecomendacionCups',
    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        dialogDelete:false,
        buscarRecomendacion: '',
        recomendaciones: [],
        recomendacion: {
          cup_id: '',
          descripcion: '',
        },
        editedIndex: -1,
        defecto: {
          cup_id: '',
          descripcion: '',
        },
        errors: {
          cup_id: '',
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
            text: 'Cup',
            value: 'cup.CodigoNombre'
          },
          {
            text: 'Descripción',
            value: 'descripcion'
          },
          {
            text: 'Estado',
            value: 'estado'
          },

          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
        pagina: 1,
        total: 0,
        opcionActual: 5,
        opciones: [5, 10, 20, 50, 100],
        cups: null,
        cup: null,
      };
    },

    mounted() {

      this.listarRecomendaciones()
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear recomendación' : 'Editar recomendación'
      },
    },

    watch: {
      dialogoBloqueos(val) {
        val || this.cerrarDialogo()
      },
      cup(val) {
        if (val) {
          if (val.length === 4) {
            this.listaCodigosHorus();
          } else if (val.length < 4) {
            this.cups = null;
          }
        } else {
          this.cups = null;

        }
      }
    },

    methods: {

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.recomendacion = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },



      listarRecomendaciones() {
        this.$axios.post('recomendacion-cups/listar?page=' + this.pagina + '&cantidad=' + this.opcionActual).then(
          res => {
            this.recomendaciones = res.data.data
            this.total = res.data.last_page
          }).catch(e => {
          console.log(e);
        })
      },

      listaCodigosHorus() {
        this.$axios.$post('cup/listar', {
          nombre: this.cup
        }).then(res => {
          this.cups = res.data

        }).catch(e => {
          e.response

        })
      },

      async guardarRecomendacion() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          this.$axios.put('recomendacion-cups/actualizar/' + this.recomendacion.id, this.recomendacion).then(res => {
            this.$toast.success('Se actualizo con exito')
            this.listarRecomendaciones()
            this.close()
          }).catch(error => {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })



        } else {
          this.recomendacion.usuario_realiza_id = this.$store.state.auth.usuario.id
          this.$axios.$post('recomendacion-cups/crear', this.recomendacion)
            .then(res => {
              this.$toast.success('Se creo con exito')
              this.listarRecomendaciones()
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
        this.editedIndex = this.recomendaciones.indexOf(item)
        this.recomendacion = Object.assign({}, item)
        this.cup = item.cup.nombre.slice(0, 5)
        this.listaCodigosHorus()
        this.recomendacion.cup_id = parseInt(item.cup.id)
        this.dialog = true
      },

      deleteItem(item) {
        this.editedIndex = this.recomendaciones.indexOf(item)
        this.recomendacion = Object.assign({}, item)
        this.cup = item.cup.nombre.slice(0, 5)
        this.listaCodigosHorus()
        this.recomendacion.cup_id = parseInt(item.cup.id)
        this.dialogDelete = true
      },

      closeDelete() {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.recomendacion = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
      },

      deleteItemConfirm(item) {
        console.log('dfdf',item);
        if (item.estado == true) {
          item['estado'] = false
        } else {
          item['estado'] = true
        }
        this.$axios.put('/recomendacion-cups/cambiarEstado/' + item.id, item).then(res => {
          this.$toast.success(res.data.mensaje)
          this.listarRecomendaciones()
          this.closeDelete()
        }).catch(error => {

        })
      },

      chipEstado(activo) {
        if (activo == '1') return 'success'
        else if (activo == '0') return 'error'
        else return 'warning'
      },

    },
  };

</script>
