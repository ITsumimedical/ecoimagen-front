<template>
  <div>
    <v-data-table :headers="headers" :items="Responsablelistar" dense class="elevation-1" :loading="loading"
      loading-text="Cargando..." no-data-text="Sin datos para mostrar" hide-default-footer>
      <template v-slot:[`item.estado`]="{ item }">
        <v-chip small :color="getColor(item.estado)">
          {{ item.estado == '1' ? 'Activo' : 'Inactivo' }}</v-chip>
      </template>
      <template v-slot:top>
        <v-card-text>
          <v-row>
            <v-col md="3" lg="3" xl="3" sm="6" cols>
              <v-autocomplete dense v-model="filtro.proceso_id" :items="procesoAll" item-text="nombre" item-value="id"
                label="Proceso" outlined>
              </v-autocomplete>
            </v-col>

            <!-- <v-col md="3" lg="3" xl="3" sm="6" cols>
              <v-autocomplete dense :items="usersAll" item-text="nombre_completo" item-value="id"
                v-model="filtro.user_id" label="Nombre Empleado" outlined>
              </v-autocomplete>
            </v-col> -->

            <v-col md="3" lg="3" xl="3" sm="6" cols>
              <v-text-field dense v-model="filtro.correo" label="Correo" outlined>
              </v-text-field>
            </v-col>
            
              <v-col md="1" lg="1" xl="1" sm="2" xs="2" cols>

                <v-btn dark small class="ma-2" color="primary" @click="listarResponsable()">Buscar</v-btn>
              </v-col>
              <v-col md="1" lg="1" xl="1" sm="2" xs="2" cols>
                <v-btn dark small class="ma-2" color="warning" @click="limpiar()">Limpiar</v-btn>
              </v-col>
              <v-col md="2" lg="2" xl="2" sm="2" xs="2" cols>
                <v-btn color="success" class="ma-2" small dark @click="dialogo = true">
                  Crear responsable<v-icon right dark>
                    mdi-plus-circle-outline</v-icon>
                </v-btn>
              </v-col>

            </v-row>
          
        </v-card-text>


        <!-- dialogo de crear o editar -->
        <v-dialog v-model="dialogo" max-width="700px" persistent>
          <v-card>
            <v-alert type="info" text dense border="left">{{ formTitle }}</v-alert>
            <v-form v-model="esValido">
              <v-container>
                <v-row dense>
                  <v-col cols="12" sm="12" md="12">
                    <v-autocomplete v-if="editedIndex === -1" dense :items="usersAll" :item-text="concatenar"
                      item-value="user_id" v-model="responsable.user_id" :error-messages="errors.user_id"
                      label="Colaborador" :rules="[validaciones.requerido]">
                    </v-autocomplete>
                    <v-autocomplete v-if="editedIndex != -1" dense :items="usersAll" item-text="nombre_completo"
                      item-value="user_id" v-model="responsable.user_id" :error-messages="errors.user_id"
                      label="Usuario" :rules="[validaciones.requerido]">
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-autocomplete :items="procesoAll" dense item-text="nombre" item-value="id"
                      v-model="responsable.proceso_id" :error-messages="errors.proceso_id" label="Proceso" :rules="[validaciones.requerido]">
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="responsable.correo" dense label="Correo de notificación"
                      :error-messages="errors.correo" type="email" :rules="[validaciones.requerido, validaciones.email]">
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" small dark @click="cerrar(), limpiardata(), limpiarError()">Cancelar</v-btn>
              <v-btn color="boton" small dark @click="guardar()">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- editar estado -->
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <!-- activar o inactivar -->
            <v-card-title class="text-h5">¿Deseas {{ editedItem.estado ? 'Inactivar' : 'Activar' }} este responsable?
            </v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" small dark @click="cerrar()">Cancelar</v-btn>
              <v-btn color="boton" small dark @click="cambiarEstado(editedItem)">
                {{ editedItem.estado ? 'Inactivar' : 'Activar' }}</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <!-- boton de editar -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon small color="warning" v-bind="attrs" v-on="on" @click="modalEditar(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon small color="error" v-bind="attrs" v-on="on" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
          <span>Cambiar estado</span>
        </v-tooltip>
      </template>

    </v-data-table>
    <!-- <v-row no-gutters>
      <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9" @input="listarResponsable()">
        </v-pagination>
      </v-col>
      <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small @change="listarResponsable()">
        </v-select>
      </v-col>
    </v-row> -->
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
  name: 'responsable',
  data: () => ({
    usersAll: [],
    procesoAll: [],
    editedIndex: -1,
    dialogo: false,
    dialogDelete: false,
    buscarResponsable: '',
    editedItem: [],
    loading: false,
    Responsablelistar: [],
    filtro: {
      proceso_id: null,
      user_id: null,
      correo: null,
    },
    errors: {
      user_id: '',
      proceso_id: '',
      correo: ''
    },
    responsable: {
      user_id: '',
      proceso_id: '',
      correo: ''
    },
    headers: [{
      text: 'id',
      value: 'id',
    },
    {
      text: 'Proceso',
      value: 'proceso.nombre'
    },
    {
      text: 'Correo',
      value: 'correo'
    },
    {
      text: "Estado",
      value: 'estado'
    },
    {
      text: 'Acciones',
      value: 'actions',
      sortable: false
    },
    ],
    opciones: [5, 10, 15, 20, 50, 100],
    opcionActual: 100,
    pagina: 1,
    total: 0,
    validaciones:{
        email: v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'El correo debe ser válido',
        requerido: v=> !!v || 'Este campo no puede estar vacío',
        numero: v => /^\d+$/.test(v) || 'Este campo solo puede contener numeros',


      },
      esValido : false,
  }),

  mounted() {
    this.listarResponsable();
    this.listarOperadores();
    this.listarProcesos();
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Creación de responsable' : 'actualización de responsable';
    },
  },

  methods: {
    ...mapActions('app', ['setPreload']),

    /**
     * listar Usuarios
     * @return object usersAll
     * @author kobatime
     */
    listarOperadores() {
      this.setPreload(true);
      this.$axios.get('operador/listar').then(res => {
        this.usersAll = res.data
        
      }).catch(error => {
        this.ErrorEntrada(error.response.data)
      }).finally(()=>{
        this.setPreload(false);
      })
    },

    concatenar(listarOperadores) {
      return `${listarOperadores.nombre}  ${listarOperadores.apellido} - ${listarOperadores.documento}`;
    },

    /**
     * listar proceso
     * @return objeto arealistar
     * @author kobatime
     */
    listarProcesos() {
      this.setPreload(true);
      this.$axios.get('/proceso-tutela/listar').then(res => {
        this.procesoAll = res.data.data
        
      }).catch(error => {
        this.ErrorEntrada(error.response.data)
        
      }).finally(()=>{
        this.setPreload(false);
      })
    },


    /**
     * listar responsables
     * @return object Responsablelistar
     * @author kobatime
     */
    listarResponsable() {
      this.setPreload(true);
      this.$axios.post("/responsable-tutela/listar?page=" + this.pagina + "&cant=" + this.opcionActual, this.filtro)
        .then(res => {
          this.Responsablelistar = res.data.data
          this.total = res.data.last_page;
          
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        }).finally(()=>{
          this.setPreload(false);
        })
    },

    /**
     * cerrar modales
     * @param object item
     * @return object juzgado
     * @author kobatime
     */
    modalEditar(item) {
      this.listarOperadores()
      this.editedIndex = this.Responsablelistar.indexOf(item)
      this.responsable = Object.assign({}, item)
      this.responsable.proceso_id = parseInt(this.responsable.proceso_id)
      this.responsable.user_id = parseInt(this.responsable.user_id)
      this.dialogo = true
    },

    /**
     * cerrar modal
     * @return boolean dialogo
     * @author kobatime
     */
    cerrar() {
      this.dialogo = false
      this.dialogDelete = false
      this.editedIndex = -1
      this.limpiardata()
    },


    /**
     * guarar o actualizar responsable
     * @param object responsable,
     * @param int responsable.id
     * @return estado
     * @author kobatime
     */
    guardar() {
      if (this.editedIndex > -1) {
        if (this.esValido == false) {
          return this.$toast.error('Debe diligenciar todos los campos')
        }
        this.$axios.put('/responsable-tutela/' + this.responsable.id, this.responsable).then(res => {
          this.$toast.success(res.data.mensaje)
          this.listarResponsable()
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
        if (this.esValido == false) {
          return this.$toast.error('Debe diligenciar los campos requeridos')
        }
        this.$axios.post('responsable-tutela/guardar', this.responsable).then(res => {
          this.$toast.success(res.data.mensaje)
          this.limpiarError()
          this.listarResponsable()
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
      for (const key in this.responsable) {
        this.responsable[key] = ''
      }
    },

    limpiarError() {
      for (const key in this.errors) {
        this.errors[key] = ''
      }
    },

    getColor(activo) {
      if (activo == '1') return 'success'
      else if (activo == '0') return 'error'
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
     * cambiar estado
     * @param object item
     * @author kobatime
     */
    cambiarEstado(item) {
      this.setPreload(true);
      const data = {
        'proceso_id': parseInt(item.proceso_id),
        'user_id': parseInt(item.user_id),
        'correo': item.correo,
      }
      if (item.estado == true) {
        data.estado = false
      } else {
        data.estado = true
      }
      this.$axios.put('/responsable-tutela/estado/' + item.id, data).then(res => {
        this.$toast.success(res.data.mensaje)
        
        this.listarResponsable()
        this.cerrar()
      }).catch(error => {
        
        if (error.response.data.mensaje) {
          this.$toast.error(error.response.data.mensaje)
        } else if (error.response.data) {
          this.ErrorEntrada(error.response.data)
        }
      }).finally(()=>{
        this.setPreload(false);
      })
    },

    limpiar() {
      this.setPreload(true);
      for (const prop of Object.getOwnPropertyNames(this.filtro)) {
        this.filtro[prop] = null;
      }
      this.setPreload(false);
      this.listarResponsable();
    },

  },
}

</script>
