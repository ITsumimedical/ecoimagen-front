<template>
  <div>
    <v-data-table v-if="$can('grupoFamiliarEmpleado.listar')" :headers="headers" :search="buscarGrupoFamiliar"
      :items="gruposFamiliares" sort-by="id" dense :loading="loading" loading-text="Cargando..." hide-default-footer
      no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn small v-if="$can('grupoFamiliarEmpleado.crear')" color="boton" class="mb-2 white--text"
            @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-subheader>Grupo familiar</v-subheader>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarGrupoFamiliar" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-card>
            <v-alert text dense border="left" color="blue-rey">{{titulo}}</v-alert>
            <form @submit.prevent="guardarGrupoFamiliar">
              <v-card-text>
                <v-container fluid>
                  <v-row dense>
                    <v-col cols="4" sm="4" md="4">
                      <v-text-field dense v-model="grupoFamiliar.nombre" label="Nombre" :error-messages="errors.nombre">
                      </v-text-field>
                    </v-col>
                    <v-col cols="4" sm="4" md="4">
                      <v-select dense v-model="grupoFamiliar.parentesco" :items="parentescos" label="Parentesco">
                      </v-select>
                    </v-col>
                    <v-col cols="4" sm="4" md="4">
                      <v-text-field dense v-model="grupoFamiliar.celular" label="Celular" :error-messages="errors.celular">
                      </v-text-field>
                    </v-col>
                    <v-col cols="4" sm="4" md="4">
                      <v-text-field dense v-model="grupoFamiliar.telefono" label="Teléfono" :error-messages="errors.telefono">
                      </v-text-field>
                    </v-col>
                    <v-col cols="4" sm="4" md="4">
                      <v-text-field dense v-model="grupoFamiliar.direccion" label="Dirección"
                        :error-messages="errors.direccion">
                      </v-text-field>
                    </v-col>
                    <v-col cols="4" sm="4" md="4">
                      <v-autocomplete dense :items="municipios" v-model="grupoFamiliar.municipio_id"
                        :error-messages="errors.municipio_id" item-text="nombre" item-value="id"
                        label="Municipio residencia"></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="error" @click="close()">
                  Cancelar
                </v-btn>
                <v-btn small color="boton" dark @click="guardarGrupoFamiliar()">
                  Guardar
                </v-btn>
              </v-card-actions>
            </form>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top v-if="$can('grupoFamiliarEmpleado.actualizar')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="editar(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import {
    listarGrupoFamiliar,
    guardarGrupoFamiliar,
    actualizarGrupoFamiliar,
  } from '@/api/grupoFamiliarEmpleados/grupoFamiliarEmpleado'
  import {
    listarMunicipios
  } from "@/api/municipios/municipio";
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('grupoFamiliarEmpleado.listar')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonGrupoFamiliarComponente',
    props: ['empleado_id'],
    data() {
      return {
        parentescos: ['Hijo', 'Padre', 'Abuelo', 'Nieto', 'Hermano', 'Tío'],
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarGrupoFamiliar: '',
        gruposFamiliares: [],
        municipios: [],
        grupoFamiliar: {
          nombre: '',
          celular: '',
          telefono: '',
          direccion: '',
          parentesco: '',
          municipio_id: '',
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          celular: '',
          telefono: '',
          direccion: '',
          parentesco: '',
          municipio_id: '',
        },
        errors: {
          nombre: '',
          celular: '',
          telefono: '',
          direccion: '',
          municipio_id: '',
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
            text: 'Dirección',
            value: 'direccion'
          },
          {
            text: 'Celular',
            value: 'celular'
          },
          {
            text: 'Teléfono',
            value: 'telefono'
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
      this.listarGrupoFamiliar();
      this.listarMunicipios();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear grupo familiar' : 'Editar grupo familiar'
      },
    },

    watch: {
      dialogoBloqueos(val) {
        val || this.cerrarDialogo()
      },
      empleado_id() {
        this.listarGrupoFamiliar();
      }
    },

    methods: {

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.grupoFamiliar = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      listarMunicipios() {
        this.$loadingGetRequest(listarMunicipios()).then(res => {
          this.municipios = res.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      async listarGrupoFamiliar() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarGrupoFamiliar(this.empleado_id))
          this.gruposFamiliares = data.data
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      async guardarGrupoFamiliar() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarGrupoFamiliar(this.grupoFamiliar.id), this.grupoFamiliar)
            this.$toast.success(data.mensaje)
            this.listarGrupoFamiliar()
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
            this.grupoFamiliar.empleado_id = this.empleado_id
            const {
              data
            } = await this.$loadingPostRequest(guardarGrupoFamiliar(), this.grupoFamiliar)
            this.$toast.success(data.mensaje)
            this.listarGrupoFamiliar()
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
        this.editedIndex = this.gruposFamiliares.indexOf(item)
        this.grupoFamiliar = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
