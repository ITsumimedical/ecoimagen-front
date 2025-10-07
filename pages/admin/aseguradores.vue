<template>
  <div>
    <v-card>
      <!-- tabla -->
      <v-data-table :headers="headers" :items="asegurador" dense :loading="loading" loading-text="Cargando..."
        no-data-text="Sin datos para mostrar" :search="buscar">
        <template v-slot:top>
          <v-card-title>
            <v-toolbar flat>
              <v-btn color="boton" small dark class="mb-2" @click="dialog = true">
                Crear Asegurador
              </v-btn>
              <v-spacer></v-spacer>
              <v-text-field v-model="buscar" dense append-icon="mdi-magnify" label="buscar" single-line hide-details>
              </v-text-field>
            </v-toolbar>
          </v-card-title>

        </template>
        <!-- Opciones de editar y cambiar estado -->
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip small :color="chipEstado(item.estado)" dark>{{ item.estado == true ? 'Activo' : 'Inactivo' }}</v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn small color="warning" @click="editItem(item)">
            Editar
          </v-btn>
          <v-btn small color="error" @click="deleteItem(item)">
            {{ item.estado == true ? 'Inactivar' : 'Activar' }}
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- form editar y crear -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="titulo black--text">{{ formTitle }}</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field v-model="editedItem.nombre" dense label="Nombre" :error-messages="errors.nombre">
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" small dark @click="close()">
            Cancel
          </v-btn>
          <v-btn color="boton" small dark @click="saveAsegurador()">
            Guardar
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="400px">
      <v-card>
        <!-- activar o inactivar -->
        <v-card-title class="text-h5">¿Deseas {{editedItem.estado == true ? 'Inactivar':'Activar'}} esta entidad?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" small dark @click="closeDelete()">Cancel</v-btn>
          <v-btn color="boton" small dark @click="deleteItemConfirm(editedItem)">
            {{editedItem.estado == true ? 'Inactivar':'Activar'}}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('asegurador.vista')) {
        return redirect('/');
      }
    },
    data: () => ({
      loading: false,
      dialog: false,
      dialogDelete: false,
      headers: [{
          text: 'ID',
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
          text: 'Actions',
          value: 'actions',
          sortable: false
        },
      ],
      asegurador: [],
      entidades: [],
      editedIndex: -1,
      editedItem: {
        nombre: '',
        entidad_id: ''

      },
      defaultItem: {
        nombre: '',
        entidad_id: ''
      },
      errors: {
        nombre: '',
        entidad_id: ''
      },
      buscar: ''
    }),

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Crear Asegurador' : 'Editar Asegurador';
      },
    },

    watch: {
      dialog(val) {
        val || this.close()
      },
      dialogDelete(val) {
        val || this.closeDelete()
      },
    },

    created() {
      this.listarAsegurador()
      this.listarEntidades()
    },

    methods: {

      /**
       * listar asegurador
       * @return objeto asegurador
       * @author kobatime
       */
      listarAsegurador() {
        this.loading = true
        this.$axios.get('/asegurador/').then(res => {
          this.asegurador = res.data.data
          this.loading = false
        }).catch(error => {
          this.loading = false
          console.log(error)
        })
      },

      editItem(item) {
        this.editedIndex = this.asegurador.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.editedItem.entidad_id = parseInt(item.entidad_id)
        this.dialog = true
      },

      deleteItem(item) {
        console.log(item)
        this.editedIndex = this.asegurador.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.editedItem.estado = parseInt(item.estado)
        this.dialogDelete = true
      },

      deleteItemConfirm(item) {
        if (item.estado == true) {
          item['estado'] = false
        } else {
          item['estado'] = true
        }
        this.$axios.put('/asegurador/cambiar-estado/' + item.id, item).then(res => {
          this.$toast.success(res.data.mensaje)
          this.listarAsegurador()
          this.closeDelete()
        }).catch(error => {
          if (error.response.data.error) {
            this.$toast.error(error.response.data.error)
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data)
          }
        })

      },

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete() {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      saveAsegurador() {
        this.limpiarError()
        this.loading = true
        if (this.editedIndex > -1) {
          this.$axios.put('/asegurador/' + this.editedItem.id, this.editedItem).then(res => {
            this.listarAsegurador()
            this.loading = false
            this.close()
          }).catch(error => {
            this.loading = false
            if (error.response.data.error) {
              this.$toast.error(error.response.data.error)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })
        } else {
          this.$axios.post('/asegurador/', this.editedItem).then(res => {
            this.listarAsegurador()
            this.loading = false
            this.close()
          }).catch(error => {
            this.loading = false
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
      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },

      /**
       * Color de estado
       * @return color
       * @author kobatime
       */
      chipEstado(estado) {
        if (estado == true) return 'primary'
        else return 'error'
      },


      /**
       * listar entidades
       * @return objeto entidades
       * @author kobatime
       */
      listarEntidades() {
        this.loading = true
        this.$axios.get('/entidad/').then(res => {
          this.entidades = res.data
          this.loading = false
        }).catch(error => {
          this.loading = false
          console.log(error)
        })
      },

    }
  }

</script>
