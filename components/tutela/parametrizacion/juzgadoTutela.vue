<template>
  <div>
    <v-data-table :headers="headers" dense :items="juzgadolistar" class="elevation-1" :loading="loading"
      disable-pagination loading-text="Cargando..." no-data-text="Sin datos para mostrar" hide-default-footer>
      <template v-slot:[`item.estado`]="{ item }">
        <v-chip :color="chipEstado(item.estado)" small dark>{{ item.estado == true ? 'Activo' : 'Inactivo' }}</v-chip>
      </template>
      <template v-slot:top>
        <v-card-text>
          <v-row>
            <v-col cols="6" sm="6" md="4">
              <v-text-field v-model="buscarJuzgado.nombre" dense label="Nombre" outlined></v-text-field>
            </v-col>
            
              <v-col md="1" lg="1" xl="1" sm="2" xs="2" cols>
                <v-btn dark small color="primary" class="ma-2" @click="listarJuzgado()">Buscar
                </v-btn>
              </v-col>
              <v-col md="1" lg="1" xl="1" sm="2" xs="2" cols>
                <v-btn dark color="warning" class="ma-2" small
                  @click="buscarJuzgado.nombre = null, listarJuzgado()">Limpiar

                </v-btn>
              </v-col>
              <v-col md="2" lg="2" xl="2" sm="2" xs="2" cols>
                <v-btn color="success" class="ma-2" small dark @click="dialogo = true">
                  Crear juzgado
                  <v-icon right>
                    mdi-plus-circle-outline
                  </v-icon>
                </v-btn>
              </v-col>

            
          </v-row>
        </v-card-text>
      </template>
      <!-- boton de editar -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="warning" v-bind="attrs" v-on="on" small @click="modalEditar(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="error" v-bind="attrs" v-on="on" small @click="actualizarEstado(item)">
              mdi-delete
            </v-icon>
          </template>
          <span>Cambiar estado</span>

        </v-tooltip>
      </template>
    </v-data-table>
    <v-row no-gutters>
      <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9" @input="listarJuzgado()">
        </v-pagination>
      </v-col>
      <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small @change="listarJuzgado()">
        </v-select>
      </v-col>
    </v-row>

    <!-- dialogo de crear o editar -->
    <v-dialog v-model="dialogo" max-width="1000px">
      <v-card :loading="loading" :disabled="loading">
        <v-alert text dense border="left" type="info">{{ formTitle }}</v-alert>
        <v-form v-model="esValido">
        <v-container>
          <v-text-field v-model="juzgado.nombre" label="Nombre" dense :error-messages="errors.nombre" :rules="[validaciones.requerido, validaciones.letras]">
          </v-text-field>
          <v-row justify="center">
            <v-spacer></v-spacer>
            <v-col cols="auto" md="auto">
              <v-btn color="error" small dark @click="cerrar(),limpiardata(),limpiarError()">
                Cancel
              </v-btn>
              <v-btn small color="boton" dark @click="guardarJuzgado()">
                Guardar
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      </v-card>
    </v-dialog>


  </div>
</template>
<script>
import { mapActions } from 'vuex';

  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('accionConstitucional.juzgado')) {
        return redirect('/');
      }
    },
    name: 'juzgado',
    data: () => ({
      pagina: 1,
        total: 0,
        opcionActual: 5,
        opciones: [5, 10, 20, 50, 100],
      buscarJuzgado: {
        nombre: null,
      },
      items: [],
      loading: false,
      juzgadolistar: [],
      dialogo: false,
      dialogoEditar: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        estados: null,
      },
      errors: {
        nombre: '',
        dias: '',
      },
      defecto: {
        nombre: '',
      },
      juzgado: {
        nombre: '',
      },
      headers: [{
          text: 'id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        {
          text: 'Nombre',
          value: 'nombre'
        },
        {
          text: 'Estado',
          value: 'estado'
        },
        {
          text: 'Acciones',
          value: 'actions'
        }
      ],
      esValido : false,
      validaciones:{
        requerido: v=> !!v || 'Este campo no puede estar vacío',
        letras: v => /^[a-z\s]+$/i.test(v) || 'Este campo solo puede contener letras'
      },
    }),

    created() {
      this.listarJuzgado();
    },
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Creación de juzgado' : 'Actualización de juzgado'
      },
    },

    methods: {
      ...mapActions('app',['setPreload']),

      /**
       * listar juzgado
       * @return objeto juzgadolistar
       * @author kobatime
       */
      listarJuzgado() {
        this.setPreload(true)
        this.$axios.post('juzgado/listar?page=' + this.pagina + '&cant=' + this.opcionActual,{nombre:this.buscarJuzgado.nombre}).then(res => {
          this.juzgadolistar = res.data.data
          this.total = res.data.last_page
          
        }).catch(error => {
          
          this.$toast.error(error.response.data.error)
        }).finally(()=>{
          this.setPreload(false)
        })
      },

      /**
       * Buscar juzgado
       * @return object juzgadolistar
       * @author kobatime
       */
      // buscarJuzgados() {
      //   this.loading = true
      //   this.$axios.post('/juzgado/buscar/', this.buscarJuzgado).then(res => {
      //     this.juzgadolistar = res.data.data
      //     this.loading = false
      //   }).catch(error => {
      //     this.loading = false
      //     this.$toast.error(error.response.data.error)
      //   })
      // },

      /**
       * guarar o actualizar juzgado
       * @param object juzgado,
       * @param int juzgado.id
       * @return estado
       * @author kobatime
       */
      guardarJuzgado() {
        if (this.esValido == false) {
          return this.$toast.error('Debe diligenciar todos los campos')
        }

        const data = {
          nombre : this.juzgado.nombre.toUpperCase()
        }
        if (this.editedIndex > -1) {
          this.$axios.put('/juzgado/' + this.juzgado.id, data).then(res => {
            this.$toast.success(res.data.mensaje)
            this.listarJuzgado()
            this.limpiardata()
            this.cerrar()
          }).catch(error => {
            if (error.response.data.error) {
              this.$toast.error(error.response.data.error)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })
        } else {
          this.$axios.post('juzgado/crear', data).then(res => {
            this.$toast.success(res.data.mensaje)
            this.limpiarError()
            this.listarJuzgado()
            this.cerrar()
          }).catch(error => {
            if (error.response.data.error) {
              this.$toast.error(error.response.data.error)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })
        }
      },

      /**
       * listado de errores
       * @param object errors,
       * @return object errors
       * @author kobatime
       */
      ErrorEntrada(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(',')
          }
        }
      },

      /**
       * limpiar errores
       * @return object juzgados
       * @author kobatime
       */
      limpiardata() {
        for (const key in this.juzgado) {
          this.juzgado[key] = ''
        }
      },

      /**
       * limpiar errores
       * @return object juzgados
       * @author kobatime
       */
      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },

      /**
       * cerrar modales
       * @return object juzgadolistar
       * @author kobatime
       */
      cerrar() {
        this.dialogo = false
        this.$nextTick(() => {
          this.juzgado = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiardata()
      },

      /**
       * cerrar modales
       * @param object item
       * @return object juzgado
       * @author kobatime
       */
      modalEditar(item) {
        this.editedIndex = this.juzgadolistar.indexOf(item)
        this.juzgado = Object.assign({}, item)
        this.dialogo = true
      },

      chipEstado(estado) {
        if (estado == true) return 'green'
        else if (estado == false) return 'error'
        else return 'warning'
      },

      /**
       * Funcion para abrir modal de inactivar
       * @param item object
       * @return object
       * @author kobatime
       */
      deleteItem(item) {
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      /**
       *actualizar juzgado estado
       * @param object juzgado,
       * @param int juzgado.id
       * @return estado
       * @author kobatime
       */
      actualizarEstado(item) {
        this.$swal({
          title: "¿Desea cambiarle el estado?",
          text: "Al aceptar este mensaje, se realizara el cambio del estado",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar",
        }).then((result) => {
          if (result.value) {
            if (item.estado == true) {
              item['estado'] = false
            } else {
              item['estado'] = true
            }
            this.$axios.put('/juzgado/' + item.id, item).then(res => {
              this.$toast.success(res.data.mensaje)
              this.listarJuzgado()
              this.limpiardata()
              this.dialogDelete = false
            }).catch(error => {
              if (error.response.data.error) {
                this.$toast.error(error.response.data.error)
              } else if (error.response.data) {
                this.ErrorEntrada(error.response.data)
              }
            })
          }
        });
      }
    },
  }

</script>
