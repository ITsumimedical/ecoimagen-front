<template>
  <div>
    <v-data-table :headers="headers" :search="buscar" dense :items="esquemas" sort-by="id" class="elevation-1"
      :loading="loading" loading-text="Cargando..." no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-col cols="12" sm="12" md="">
            <v-btn small color="boton" class="mb-2 white--text" @click="dialog = true">
              Crear esquema
              <v-icon>
                mdi-plus-circle-outline
              </v-icon>
            </v-btn>
          </v-col>
          <!-- <v-col cols="12" sm="12" md="4">
            <v-btn color="boton" class="mb-2 white--text" @click="dialogDetalle = true">
              crear detalle esquema
              <v-icon>
                mdi-plus-circle-outline
              </v-icon>
            </v-btn>
          </v-col> -->
          <v-spacer></v-spacer>
          <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo black--text">{{titulo}}</v-card-title>
              <form @submit.prevent="guardarEsquema">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="esquema.nombre_esquema" dense label="Nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="esquema.abreviatura_esquema" dense label="Abreviatura">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="esquema.ciclos" dense label="Ciclos">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="esquema.frecuencia_repeat" dense label="Repetición frecuencia">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea v-model="esquema.biografia" dense label="Biografia">
                        </v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" small @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn color="boton" dark small @click="guardarEsquema()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
        <v-dialog v-model="dialogDetalle" max-width="800px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo black--text">Parametrización detalles esquema</v-card-title>
              <form @submit.prevent="guardarEsquema">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="8">
                        <v-autocomplete v-model="detalleEsquema.codesumi_id" :items="medicamentos" item-text="nombre"
                          :search-input.sync="medicamento" no-data-text="Debe ingresar el nombre del medicamento"
                          item-value="id" label="Digita el nombre de medicamento">
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="12" md="4">
                        <v-autocomplete v-model="detalleEsquema.esquema_id" :items="esquemas" item-text="nombre_esquema"
                          item-value="id" label="Esquema">
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-autocomplete v-model="detalleEsquema.unidad_medida" :items="unidadMedida"
                          label="Unidad medida">
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-autocomplete v-model="detalleEsquema.indice_dosis" :items="indiceDosis" label="Indice dosis">
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-autocomplete v-model="detalleEsquema.via" :items="via" label="Via">
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="detalleEsquema.dosis" dense label="Dosis" type="number">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="detalleEsquema.frecuencia" dense label="Frecuencia">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="detalleEsquema.cantidad_aplicaciones" dense label="Cantidad Aplicaciones"
                          type="number">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="detalleEsquema.dias_aplicacion" dense label="Dias Aplicaciones"
                          type="text">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="detalleEsquema.descripcion_dosis" dense label="Descripción Dosis">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea v-model="detalleEsquema.observaciones" dense label="Observaciones">
                        </v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" small @click="closeDetalle()">
                    Cancelar
                  </v-btn>
                  <v-btn color="boton" dark small @click="guardarDetalleEsquema()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
        <v-dialog v-model="dialogoDetalleEsquema" max-width="800px">

          <v-card>
            <v-card-title class="titulo black--text">Detalle esquema</v-card-title>

            <v-col cols="12" sm="12" md="12">
              <v-data-table :headers="headersDetalle" dense :items="obtenerDetalle" sort-by="id" :loading="loading"
                loading-text="Cargando..." no-data-text="Sin datos para mostrar">
                <template v-slot:[`item.actions`]="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="editarDetalle(item)">
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>Editar</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-col>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" small @click="dialogoDetalleEsquema = false">
                Cancelar
              </v-btn>
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
          <span>Editar esquema</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="success"  class="mr-2" v-bind="attrs" v-on="on" @click="dialogDetalle = true,detalleEsquema.esquema_id= item.id">
              mdi-plus-circle-outline
            </v-icon>
          </template>
          <span>Crear detalle esquema</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="info"  class="mr-2" v-bind="attrs" v-on="on" @click="cargarDetalleEsquema(item.detalle_esquema)">
              mdi-folder-information
            </v-icon>
          </template>
          <span>Detalle esquema</span>
        </v-tooltip>
      </template>
      <!-- <template v-slot:[`item.id`]="{ item }">
        <td><a href="javascript:void(0)" @click="cargarDetalleEsquema(item.detalle_esquema)"> {{item.id}}</a></td>
      </template> -->
    </v-data-table>
    <!-- <template>
      <div class="text-center">
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarEsquemas()">
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
    name: 'WorkspaceJsonEsquemas',

    data() {
      return {
        accion: false,
        medicamentos: null,
        medicamento: null,
        loading: false,
        dialog: false,
        dialogoDetalleEsquema: false,
        dialogDetalle: false,
        buscar: '',
        esquemas: [],
        obtenerDetalle: [],
        municipio: [],
        esquema: {
          nombre_esquema: '',
          abreviatura_esquema: '',
          ciclos: '',
          frecuencia_repeat: '',
          biografia: '',

        },
        detalleEsquema: {
          medicamento_id: ''
        },
        editedIndex: -1,
        defecto: {
          nombre_esquema: '',
          abreviatura_esquema: '',
          ciclos: '',
          frecuencia_repeat: '',
          frecuencia_duracion: '',
          biografia: '',
        },
        errors: {
          nombre_esquema: '',
          abreviatura_esquema: '',
          ciclos: '',
          frecuencia_repeat: '',
          frecuencia_duracion: '',
          biografia: '',
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
            text: 'Abreviatura',
            value: 'abreviatura_esquema'
          },
          {
            text: 'Nombre',
            value: 'abreviatura_esquema'
          },
          {
            text: 'Ciclos',
            value: 'ciclos'
          },
          {
            text: 'Frecuencia repetición',
            value: 'frecuencia_repeat'
          },
          {
            text: 'Biografia',
            value: 'biografia'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
        headersDetalle: [{
            text: "Id",
            value: "id"
          },
          {
            text: "Nombre",
            value: "nombre"
          },
          {
            text: "Dosis Teorica",
            value: "dosis"
          },
          {
            text: "Unidad Medida",
            value: "unidad_medida"
          },

          {
            text: "Indice Dosis",
            value: "indice_dosis"
          },
          {
            text: "Vía",
            value: "via"
          },
          {
            text: "Observaciones",
            value: "observaciones"
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
        indiceDosis: ["ISC", "Fija", "N/A"],
        via: ["IM", "IV", "SC", "VO", "N/A"],
        unidadMedida: ["MG", "ML", "UI", "UND"],
      };
    },

    mounted() {
      this.listarEsquemas();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear esquema' : 'Editar esquema'
      },
    },

    watch: {
      dialogoBloqueos(val) {
        val || this.cerrarDialogo()
      },

      medicamento(val) {
        if (val) {
          if (val.length === 4) {
            this.listaCodigosHorus();
          } else if (val.length < 4) {
            this.medicamentos = null;
          }
        } else {
          this.medicamentos = null;

        }
      }
    },

    methods: {

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.esquema = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      listarEsquemas() {
        this.$axios.get('/esquema/listar').then(res => {
          this.esquemas = res.data
        }).catch(e => {
          console.log(e.response)
        })
      },


      async guardarEsquema() {
        // this.limpiarError()
        if (this.editedIndex > -1) {
          this.$axios.put('/esquema/actualizar/' + this.esquema.id, this.esquema).then(res => {
            this.$toast.success('Se actualizo con exito')
            this.dialog = false
            this.listarEsquemas()
          }).catch(error => {
            if (error.response.data.mensaje) {
              // this.$toast.error('Se ha actualizado el periodo de inducción específica correctamente!.')
            } else if (error.response.data) {
              // this.ErrorEntrada(error.response.data)
            }
          })
        } else {
          this.$axios.post('/esquema/crear', this.esquema).then(res => {
            this.$toast.success('Se ha creado el esquema correctamente!.')
            this.dialog = false
            this.listarEsquemas()
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
        this.editedIndex = this.esquemas.indexOf(item)
        this.esquema = Object.assign({}, item)
        this.dialog = true
      },

      listaCodigosHorus() {
        this.preload = true;
        this.$axios.$post('medicamentos/listarVademecum', {
          nombre: this.medicamento
        }).then(res => {
          this.medicamentos = res.map((med) => {
            return {
              id: med.codesumi_id,
              nombre: `${med.codesumi.codigo} - ${med.codesumi.nombre}`
            }
          })
          this.preload = false;
        }).catch(e => {
          e.response
          this.preload = false;
        })
      },

      guardarDetalleEsquema() {
        if (this.accion == true) {
          this.$axios.put('/detalle-esquema/actualizar/' + this.detalleEsquema.id, this.detalleEsquema).then(res => {
            this.$toast.success('Se actualizo con exito')
            this.dialog = false
            this.listarEsquemas()
            this.closeDetalle()
            this.dialogoDetalleEsquema = false
          }).catch(error => {
            if (error.response.data.mensaje) {
              // this.$toast.error('Se ha actualizado el periodo de inducción específica correctamente!.')
            } else if (error.response.data) {
              // this.ErrorEntrada(error.response.data)
            }
          })
        } else {
          this.$axios.post('/detalle-esquema/crear', this.detalleEsquema).then(res => {
            this.$toast.success('Se ha creado el esquema correctamente!.')
            this.dialog = false
            this.listarEsquemas()
            this.closeDetalle()
          }).catch(error => {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })

        }
      },

      closeDetalle() {
        this.dialogDetalle = false
        for (const key in this.detalleEsquema) {
          this.detalleEsquema[key] = ''
        }
        this.accion = false
      },

      cargarDetalleEsquema(detalle) {
        this.dialogoDetalleEsquema = true
        this.obtenerDetalle = detalle
      },

      editarDetalle(item) {
        this.accion = true
        this.detalleEsquema = Object.assign({}, item)
        this.medicamento = item.nombre.slice(0, 5)
        this.listaCodigosHorus()
        this.detalleEsquema.codesumi_id = item.codesumi_id
        this.detalleEsquema.esquema_id = parseInt(item.esquema_id)
        this.dialogDetalle = true
      },

    },
  };

</script>
