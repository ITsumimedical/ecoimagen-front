<template>
  <div>
    <v-data-table :headers="headers" :items="actuacionlistar" dense class="elevation-1" :loading="loading"
      loading-text="Cargando..." no-data-text="Sin datos para mostrar" :search="buscar" hide-default-footer>
      <template v-slot:top>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="12" md=9>
              <v-text-field v-model="buscar" dense label="Buscador" outlined></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-btn color="success" class="ma-2" small dark @click="dialogo = true">
                Crear actuación
                <v-icon right dark>
                  mdi-plus-circle-outline
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </template>

      <!-- boton de editar y eliminar -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="warning" v-bind="attrs" v-on="on" small @click="modalEditar(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
        
          <!-- <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="error" v-bind="attrs" v-on="on" small @click="eliminarItem(item)">
              mdi-delete
            </v-icon>
          </template>
          <span>Eliminar</span>
        </v-tooltip> -->

      </template>
    </v-data-table>

    <!-- dialogo de crear o editar -->
    <v-dialog v-model="dialogo" max-width="700px">
      <v-card :loading="loading" :disabled="loading">
        <v-alert text dense border="left" type="info">{{ formTitle }}</v-alert>
        <v-form v-model="esValido">
        <v-container>
          <v-text-field v-model="actuacion.nombre" label="Nombre" dense :error-messages="errors.nombre" :rules="[validaciones.requerido, validaciones.letras]">
          </v-text-field>
          <v-row justify="center">
            <v-spacer></v-spacer>
            <v-col cols="auto" md="auto">
              <v-btn small color="error" dark @click="cerrar(),limpiardata(),limpiarError()">
                Cancelar
              </v-btn>
              <v-btn small color="boton" dark @click="guardarTipo()">
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
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'TipoActuacion',
    data: () => ({
      paginate: {
        total: 0,
        page: 1
      },
      buscar: {
        nombre: null,
      },
      items: [],
      loading: false,
      actuacionlistar: [],
      dialogo: false,
      dialogoEditar: false,
      dialogDelete: false,
      editedIndex: -1,
      errors: {
        nombre: '',
      },
      defecto: {
        nombre: '',
      },
      actuacion: {
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
          text: 'Acciones',
          value: 'actions'
        }
      ],
      esValido: false,
      validaciones:{
        requerido: v=> !!v || 'Este campo no puede estar vacío',
        letras: v => /^[a-z\s]+$/i.test(v) || 'Este campo solo puede contener letras'
      }
    }),

    created() {
      this.listarActuacion();
    },
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Crear tipo actuación' : 'Editar tipo actuación'
      },
    },

    methods: {
      ...mapActions('app',['setPreload']),
      eliminarItem(par){
        this.$swal({
          title: "¿Desea eliminar la actuación?",
          text: "Al aceptar eliminará la actuación de la lista",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar",
          cancelButtonText: 'Cancelar'
        }).then((res)=>{
          console.log(res,par)
        })
        
      },
      /**
       * listar areas
       * @return objeto actuacionlistar
       * @author kobatime
       */
      listarActuacion() {
        this.setPreload(true)
        this.$axios.get('tipo-actuacion').then(res => {
          this.actuacionlistar = res.data
          
        }).catch(error => {
          
          this.$toast.error(error.response.data.error)
        }).finally(()=>{
          this.setPreload(false)
        })
      },

      /**
       * guarar o actualizar area
       * @param object areas,
       * @param int areas.id
       * @return estado
       * @author kobatime
       */
      guardarTipo() {
        if (this.esValido == false) {
          return this.$toast.error('Debe diligenciar todos los campos')
        }
        const data = {
          nombre : this.actuacion.nombre.toUpperCase()
        }
        if (this.editedIndex > -1) {
          this.$axios.put('tipo-actuacion/' + this.actuacion.id, data).then(res => {
            this.$toast.success(res.data.mensaje)
            this.listarActuacion()
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
          this.$axios.post('tipo-actuacion/crear', data).then(res => {
            this.$toast.success(res.data.mensaje)
            this.limpiarError()
            this.listarActuacion()
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
       * limpiar
       * @return object actuacion
       * @author kobatime
       */
      limpiardata() {
        for (const key in this.actuacion) {
          this.actuacion[key] = ''
        }
      },

      /**
       * limpiar errores
       * @return object areas
       * @author kobatime
       */
      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },

      /**
       * cerrar modales
       * @return object jarealistar
       * @author kobatime
       */
      cerrar() {
        this.dialogo = false
        this.$nextTick(() => {
          this.actuacion = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiardata()
      },

      /**
       * cerrar modales
       * @param object item
       * @return object areas
       * @author kobatime
       */
      modalEditar(item) {
        this.editedIndex = this.actuacionlistar.indexOf(item)
        this.actuacion = Object.assign({}, item)
        this.dialogo = true
      },

    },
  }

</script>
