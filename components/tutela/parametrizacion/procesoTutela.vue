<template>
  <div>
    <!-- tabla de datos -->
    <v-data-table :headers="headers" :items="procesoListar" dense class="elevation-1" 
      loading-text="Cargando..." no-data-text="No hay información que mostrar" :search="buscar" hide-default-footer>

      <!-- boton de crear -->
      <template v-slot:top>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="12" md=9>
              <v-text-field v-model="buscar" dense label="Buscador"  outlined></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-btn color="success" class="ma-2" small dark @click="dialogo = true">
                Crear proceso
                <v-icon right dark>
                  mdi-plus-circle-outline
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </template>

      <template v-slot:[`item.estado`]="{ item }">
        <v-chip :color="chipEstado(item.estado)" small dark>{{ item.estado == true ? 'Activo' : 'Inactivo' }}</v-chip>
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
            <v-icon small color="error" v-bind="attrs" v-on="on" @click="actualizarEstado(item)">
              mdi-delete
            </v-icon>
          </template>
          <span>Cambiar estado</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <!-- dialogo de crear o editar -->
    <v-dialog v-model="dialogo" max-width="500px">
      <v-card >
        <v-alert type="info" border="left" dense text>{{ formTitle }}</v-alert>
        <v-form v-model="esValido">
        <v-container>
          <v-text-field dense v-model="proceso.nombre" label="Nombre" :error-messages="errors.nombre" :rules="[validaciones.requerido, validaciones.letras]">
          </v-text-field>
          <v-row justify="center">
            <v-spacer></v-spacer>
            <v-col cols="auto" md="auto">
              <v-btn color="error" dark small @click="cerrar(),limpiardata(),limpiarError()">
                Cancelar
              </v-btn>
              <v-btn color="success" dark small @click="guardarActualizar()">
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
      if (!$can('accionConstitucional.proceso')) {
        return redirect('/');
      }
    },
    name: 'proceso-tutelas',
    data: () => ({
      
      buscar: {
        nombre: null,
      },
      
      procesoListar: [],
      editedItem: [],
      dialogo: false,
      dialogDelete: false,
      editedIndex: -1,
      errors: {
        nombre: '',
      },
      defecto: {
        nombre: '',
      },
      proceso: {
        nombre: '',
      },
      buscar: '',
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
        },
      ],
      esValido : false,
      validaciones:{
        requerido: v=> !!v || 'Este campo no puede estar vacío',
        letras: v => /^[a-z\s]+$/i.test(v) || 'Este campo solo puede contener letras'
      }
    }),

    created() {
      this.listarProcesos();
    },

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Crear Proceso' : 'Editar Proceso'
      },
    },

    methods: {
      ...mapActions('app', ['setPreload']),
      listarProcesos() {
        this.setPreload(true)
        this.$axios.get('proceso-tutela/listar?' ).then(res => {
          this.procesoListar = res.data.data
          
          
        }).catch(error => {
          this.ErrorEntrada(error.response.data)
          
        }).finally(()=>{
          this.setPreload(false)
        })
      },

      /**
       * cerrar modales
       * @author kobatime
       */
      cerrar() {
        this.dialogo = false
        this.dialogDelete = false
        this.$nextTick(() => {
          this.proceso = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiardata()
      },

      /**
       * cerrar modales
       * @param object item
       * @return object actuacion
       * @author kobatime
       */
      modalEditar(item) {
        this.editedIndex = this.procesoListar.indexOf(item)
        this.proceso = Object.assign({}, item)
        this.dialogo = true
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

      async guardarActualizar() {
        if (this.esValido == false) {
          return this.$toast.error('Debe diligenciar el campo')
        }
        const data = {
          nombre : this.proceso.nombre.toUpperCase()
        }
        if (this.editedIndex > -1) {
          this.$axios.put('proceso-tutela/' + this.proceso.id, data).then(res => {
            this.$toast.success(res.data.mensaje)
            this.listarProcesos()
            this.limpiarError()
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
          
          this.$axios.post('proceso-tutela', data).then(res => {
            this.$toast.success(res.data.mensaje)
            this.limpiarError()
            this.listarProcesos()
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

      ErrorEntrada(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(',')
          }
        }
      },

      limpiardata() {
        for (const key in this.tipoRequerimiento) {
          this.tipoRequerimiento[key] = ''
        }
        for (const key in this.editar) {
          this.editar[key] = ''
        }
      },

      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },

      chipEstado(estado) {
        if (estado == true) return 'green'
        else if (estado == false) return 'error'
        else return 'warning'
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
          title: "Desea cambiarle el estado?",
          text: "Al aceptar este mensaje, se realizara el cambio del estado",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar",
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            if (item.estado == true) {
              item['estado'] = false
            } else {
              item['estado'] = true
            }
            this.$axios.put('proceso-tutela/estado/' + item.id, item).then(res => {
              this.$toast.success(res.data.mensaje)
              this.listarProcesos()
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
