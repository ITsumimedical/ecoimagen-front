<template>
  <div>
    <v-data-table dense :headers="headers" :search="buscarAfiliacion" :items="afiliaciones" sort-by="id"
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:[`item.estado`]="{ item }">
        <v-chip small :color="chipEstado(item.estado)" dark>{{ item.estado == '1' ? 'Vigente' : 'No vigente' }}
        </v-chip>
      </template>
      <template v-slot:top>
        <v-card-title>
          <v-btn small v-if="activo != 0" color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon right>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-subheader>Afiliaciones</v-subheader>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarAfiliacion" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="1000px" persistent>
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert text dense border="left" color="blue-grey">{{titulo}}</v-alert>
              <form @submit.prevent="guardarAfiliacionEmpleado">
                <v-card-text>
                  <v-container fluid>
                    <v-row dense>
                      <v-col cols="12" sm="6" md="6">
                        <v-select dense :items="prestadorTh" v-model="afiliacionEmpleado.prestador_id"
                          :error-messages="errors.prestador_id" item-text="nombre" item-value="id"
                          label="Entidad prestadora" @input="listarPrestadorTipo()">
                        </v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="3" v-if="afiliacionEmpleado.prestador_id == 3">
                        <v-select dense v-model="afiliacionEmpleado.clasificacion_riesgo"
                          :items="clasificacionesRiesgos" label="Clasificación de riesgo"
                          :error-messages="errors.clasificacion_riesgo">
                        </v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="3">
                        <v-text-field dense v-model="afiliacionEmpleado.fecha_afiliacion"
                          :error-messages="errors.fecha_afiliacion" label="Fecha afiliación" type="date">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="3">
                        <v-text-field dense v-model="afiliacionEmpleado.fecha_fin_afiliacion"
                          :error-messages="errors.fecha_fin_afiliacion" label="Fecha fin afiliación" type="date">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn small color="boton" dark @click="guardarAfiliacionEmpleado()">
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
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="error" small class="mr-2" v-bind="attrs" v-on="on" @click="desafiliar(item)">
              mdi-close
            </v-icon>
          </template>
          <span>Desafiliar</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import {
    listarAfiliacionEmpleado,
    guardarAfiliacionEmpleado,
    actualizarAfiliacionEmpleado,
  } from '@/api/afiliacionesEmpleados/afiliacionEmpleado'
  import {
    listarPrestadores,
  } from '@/api/prestadoresTh/PrestadorTh';
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('afiliacionEmpleado.listar')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonAfiliacionEmpleadosComponente',
    props: ['contrato_id', 'activo'],
    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarAfiliacion: '',
        afiliaciones: [],
        prestadorTh: [],
        prestador: 3,
        clasificacionesRiesgos: ['I - 0.522', 'II - 1.044', 'III - 2.436', 'IV - 4.350', 'V - 6.960'],
        afiliacionEmpleado: {
          estado: false,
          prestador_id: '',
          fecha_afiliacion: '',
          fecha_fin_afiliacion: '',
          clasificacion_riesgo: '',
        },
        editedIndex: -1,
        defecto: {
          estado: false,
          prestador_id: '',
          fecha_afiliacion: '',
          fecha_fin_afiliacion: '',
          clasificacion_riesgo: '',
        },
        errors: {
          estado: false,
          prestador_id: '',
          fecha_afiliacion: '',
          fecha_fin_afiliacion: '',
          clasificacion_riesgo: '',
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
            text: 'NIT entidad prestadora',
            value: 'nit'
          },
          {
            text: 'Entidad prestadora',
            value: 'prestador'
          },
          {
            text: 'Tipo de prestador',
            value: 'tipoPrestador',
          },
          {
            text: 'Fecha de afiliación',
            value: 'fecha_afiliacion',
          },
          {
            text: 'Fecha fin de afiliación',
            value: 'fecha_fin_afiliacion',
          },
          {
            text: 'vigente',
            value: 'estado',
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
      this.listarAfiliacionEmpleado();
      this.listarPrestadores()
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear afiliación contrato empleado' : 'Editar afiliación contrato empleado'
      },
    },

    watch: {
      contrato_id() {
        this.listarAfiliacionEmpleado();
      }
    },

    methods: {

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.afiliacionEmpleado = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      listarPrestadores() {
        this.$loadingGetRequest(listarPrestadores()).then(res => {
          this.prestadorTh = res.data.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      listarPrestadorTipo() {
        this.$axios.get('/prestador-th/' + this.afiliacionEmpleado.prestador_id).then(res => {
          this.prestador = res.data
        })
      },

      async listarAfiliacionEmpleado() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarAfiliacionEmpleado(this.contrato_id))
          this.afiliaciones = data.data
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      async guardarAfiliacionEmpleado() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarAfiliacionEmpleado(this.afiliacionEmpleado.id), this
              .afiliacionEmpleado)
            this.$toast.success(data.mensaje)
            this.listarAfiliacionEmpleado()
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
            this.afiliacionEmpleado.contrato_id = this.contrato_id
            this.afiliacionEmpleado.estado = 1
            const {
              data
            } = await this.$loadingPostRequest(guardarAfiliacionEmpleado(), this.afiliacionEmpleado)
            this.$toast.success(data.mensaje)
            this.listarAfiliacionEmpleado()
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

      async desafiliar(item) {
        try {
          this.$swal({
            title: "¡Se ha desafiliado el empleado correctamente!",
            text: ` `,
            timer: 2000,
            type: "success",
          });
          await this.$axios.put('afiliacion-empleado/desafiliar/' + item.id)
          this.listarAfiliacionEmpleado()
          this.$toast.success('Se ha desafiliado el empleado de la entidad correctamente.')
        } catch (error) {
          console.log(error);
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
        this.editedIndex = this.afiliaciones.indexOf(item)
        this.afiliacionEmpleado = Object.assign({}, item)
        this.dialog = true
      },

      chipEstado(estado) {
        if (estado == '1') return 'info'
        else if (estado == '0') return 'elerta'
        else return 'elerta'
      },


    },
  };

</script>
