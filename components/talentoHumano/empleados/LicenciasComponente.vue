<template>
  <div>
    <v-data-table dense :headers="headers" :search="buscarLicencias" :items="licencias" sort-by="id"
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-subheader>Licencias</v-subheader>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarLicencias" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="1000px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert text dense border="left" color="blue-grey">{{titulo}}</v-alert>
              <form @submit.prevent="guardarLicencia">
                <v-container fluid>
                  <v-row dense>
                    <v-col cols="12" sm="6" md="4">
                      <v-autocomplete dense v-model="licenciaEmpleado.tipo_licencia_id" :items="tiposLicencias"
                        item-text="nombre" item-value="id" label="Tipo de licencia"
                        :error-messages="errors.tipo_licencia_id">
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field dense v-model="licenciaEmpleado.fecha_inicio" :error-messages="errors.fecha_inicio"
                        label="Fecha inicio" type="date">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field dense v-model="licenciaEmpleado.fecha_fin" :error-messages="errors.fecha_fin"
                        label="Fecha fin" type="date">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-textarea dense auto-grow v-model="licenciaEmpleado.observaciones" label="Observaciones"
                        :error-messages="errors.observaciones">
                      </v-textarea>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-textarea dense auto-grow v-model="licenciaEmpleado.motivo" label="Motivo"
                        :error-messages="errors.motivo">
                      </v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn small color="boton" dark @click="guardarLicencia()">
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
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import {
    listarLicencias,
    guardarLicencia,
    actualizarLicencia,
  } from '@/api/licenciasEmpleados/licenciaEmpleado'
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('licenciaEmpleado.listar')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonLicenciaEmpleadosComponente',
    props: ['contrato_id'],
    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarLicencias: '',
        licencias: [],
        tiposLicencias: [],
        licenciaEmpleado: {
          observaciones: '',
          motivo: '',
          fecha_inicio: '',
          fecha_fin: '',
          tipo_licencia_id: '',
        },
        editedIndex: -1,
        defecto: {
          observaciones: '',
          motivo: '',
          fecha_inicio: '',
          fecha_fin: '',
          tipo_licencia_id: '',
        },
        errors: {
          observaciones: '',
          motivo: '',
          fecha_inicio: '',
          fecha_fin: '',
          tipo_licencia_id: '',
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
            text: 'Tipo de licencia',
            value: 'nombreTipoLicencia',
          },
          {
            text: 'Observaciones',
            value: 'observaciones',
          },
          {
            text: 'Motivo',
            value: 'motivo',
          },
          {
            text: 'Fecha de inicio',
            value: 'fecha_inicio',
          },
          {
            text: 'Fecha fin',
            value: 'fecha_fin',
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
      this.listarLicencias();
      this.listarTiposLicencias();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear licencia' : 'Editar licencia'
      },
    },

    watch: {
      dialogoBloqueos(val) {
        val || this.cerrarDialogo()
      },
      contrato_id() {
        this.listarLicencias();
      },
    },

    methods: {

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.licenciaEmpleado = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      async listarLicencias() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarLicencias(this.contrato_id))
          this.licencias = data.data
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      listarTiposLicencias() {
        this.$axios.get('/tipos-licencias/listar').then(res => {
          this.tiposLicencias = res.data.data
        }).catch(error => {
          console.log(error)
        })
      },

      guardarLicencia() {
        this.limpiarError()
        this.licenciaEmpleado.estado_id = 1
        if (this.editedIndex > -1) {
          this.$axios.put('/licencias-empleados/' + this.licenciaEmpleado.id, this.licenciaEmpleado).then(res => {
            this.$toast.success('Se actualizó la licencia exitosamente')
            this.listarLicencias()
            this.close()
          }).catch(error => {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })
        } else {
          this.licenciaEmpleado.contrato_id = this.contrato_id
          this.$axios.post('/licencias-empleados/crear', this.licenciaEmpleado).then(res => {
            this.$toast.success('Se creó la licencia exitosamente')
            this.listarLicencias()
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
        this.editedIndex = this.licencias.indexOf(item)
        this.licenciaEmpleado = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
