<template>
  <div>
    <v-card>
      <!-- tabla -->
      <v-data-table dense :headers="headers" :items="subregiones" class="elevation-1" :search="buscar"
        :loading="loading" loading-text="Cargando..." no-data-text="Sin datos para mostrar">
        <template v-slot:top>
          <v-card-title>
            <v-toolbar flat>
              <v-btn small color="boton" dark class="ma-2" @click="dialogo = true,listarDepartamentos()">
                Crear Subregión
              </v-btn>
              <v-spacer></v-spacer>
              <v-text-field v-model="buscar" append-icon="mdi-magnify" label="Buscar..." single-line hide-details>
              </v-text-field>
            </v-toolbar>
          </v-card-title>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn small class="mr-2" color="warning" @click="editItem(item)">
            Editar
          </v-btn>
        </template>
      </v-data-table>
      <!-- dialogo de crear o editar -->
      <v-dialog v-model="dialogo" max-width="500px">
        <v-card :loading="loading" :disabled="loading">
          <v-alert text dense outlined type="info">{{ formTitle }}</v-alert>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field dense v-model="editedItem.nombre" label="Nombre" :error-messages="errors.nombre">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-autocomplete dense :items="departamento" item-text="nombre" item-value="id"
                  v-model="editedItem.departamento_id" label="Asociar Departamento"
                  :error-messages="errors.departamento_id" @change="listarMunicipios(editedItem.departamento_id)">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-autocomplete dense :items="municipio" item-text="nombre" item-value="id" v-model="editedItem.municipio_id"
                  label="Asociar Municipio" :error-messages="errors.municipio_id">
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small color="error" dark @click="close()">
              Cancelar
            </v-btn>
            <v-btn small color="success" dark @click="guardar()">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonParametrizacion',

    data() {
      return {
        dialogDelete: false,
        dialogo: false,
        loading: false,
        departamento: [],
        municipio: [],
        subregiones: [],
        buscar: null,
        headers: [{
            text: 'Id',
            align: 'start',
            sortable: true,
            value: 'id',
          },
          {
            text: 'Subregion',
            value: 'nombre',
          },
          {
            text: 'Codigo DANE',
            value: 'departamento.codigo_dane',
          },
          {
            text: 'Departamento',
            value: 'departamento.nombre',
          },
          {
            text: 'Codigo DANE',
            value: 'municipio.codigo_dane',
          },
          {
            text: 'Municipio',
            value: 'municipio.nombre'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false,
            align: 'center'
          }
        ],
        errors: {
          nombre: null,
          departamento_id: null,
          municipio_id: null,
        },
        desserts: [],
        editedIndex: -1,
        editedItem: {
          nombre: '',
          departamento_id: '',
          municipio_id: ''
        },
        defaultItem: {
          nombre: '',
          departamento_id: '',
          municipio_id: ''
        },
      };
    },

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Crear Subregión' : 'Editar Subregión'
      },
    },

    created() {
      this.listarSubregiones()
    },

    methods: {


      /**
       * listar departamentos
       * @return departamento objeto
       * @author kobatime
       */
      listarDepartamentos() {
        this.$axios.get('/departamento/').then(res => {
          this.departamento = res.data
        }).catch(error => {
          console.log(error)
        })
      },

      /**
       * listar municipio para afiliacion con filer de departamento
       * @param data number
       * @return municipio objeto
       * @author kobatime
       */
      listarMunicipios(data) {
        return this.departamento.filter((item => item.id == data)).map((municipios) => {
          return this.municipio = municipios.municipios
        })
      },


      /**
       * Funcion listar subregiones
       * @return objetc clasifiacion
       * @author kobatime
       */
      listarSubregiones() {
        this.$axios.get('/subregion/').then(res => {
          this.subregiones = res.data;
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        })
      },

      async guardar() {
        this.loading = true
        if (this.editedIndex > -1) {
          await this.$axios.put('/subregion/' + this.editedItem.id, this.editedItem).then(res => {
            this.loading = false
            this.close()
            this.listarSubregiones()
          }).catch(error => {
            this.loading = false
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.Error(error.response.data)
            }
          })
        } else {
          await this.$axios.post('/subregion/', this.editedItem).then(res => {
            this.close()
            this.listarSubregiones()
            this.loading = false
          }).catch(error => {
            this.loading = false
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.Error(error.response.data)
            }
          })
        }
      },

      /**
       * Funcion para abrir modal de editar
       * @param item object
       * @return object
       * @author kobatime
       */
      editItem(item) {
        this.listarDepartamentos()
        this.editedIndex = this.subregiones.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.editedItem.departamento_id = parseInt(item.departamento_id)
        this.listarMunicipios(this.editedItem.departamento_id)
        this.dialogo = true
      },

      /**
       * Cerrar dialogo
       * @return string
       * @author kobatime
       */
      close() {
        this.dialogo = false
        this.limpiarError()
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },


      // funciones globales

      /**
       * Cerrar dialogo de inactivar
       * @return string
       * @author kobatime
       */
      closeDelete() {
        this.dialogDelete = false
        this.limpiarError()
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },


      /**
       * for de errores para los campos
       * @param error array
       * @return errors
       * @author kobatime
       */
      Error(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(',')
          }
        }
      },

      /**
       * for de limpiar errores
       * @param errors array
       * @return errors objetos
       * @author kobatime
       */
      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },


    },
  };

</script>
