<template>
  <v-data-table :headers="headers" :search="buscarProgramacion" :items="programacionesMensuales" class="elevation-1"
    :loading="loading" loading-text="Cargando..." no-data-text="Sin datos para mostrar">
    <template v-slot:top>
      <v-card-title>
        <v-btn color="boton" v-if="$can('programacionMensual.crear')" class="mb-2 white--text" @click="dialog = true">
          Nuevo
          <v-icon>
            mdi-plus-circle-outline
          </v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-text-field v-model="buscarProgramacion" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
        </v-text-field>
      </v-card-title>
      <!-- PERIODO DE PROGRAMACIÓN -->
      <v-dialog v-model="dialog" max-width="1000px" persistent>
        <v-container fluid class="pa-0">
          <v-card>
            <v-card-title class="titulo">
              <span class="white--text text-h5">{{titulo}}</span>
            </v-card-title>
            <form @submit.prevent="guardarProgramacion">
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-date-picker flat landscape locale="es" full-width :error-messages="errors.periodo"
                      v-model="programacion.periodo" type="month"></v-date-picker>
                  </v-col>
                </v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete :error-messages="errors.empleado_id" :items="listaEmpleados" :item-text="concatenar"
                    item-value="id" v-model="programacion.empleado_id" label="Empleado" dense>
                  </v-autocomplete>
                </v-col>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="close()">
                  Cerrar
                </v-btn>
                <v-btn color="boton" dark @click="guardarProgramacion()">
                  Guardar
                </v-btn>
              </v-card-actions>
            </form>
          </v-card>
        </v-container>
      </v-dialog>
      <!-- DETALLE DE PROGRAMACIÓN -->
      <v-dialog v-model="dialogoProgramar" max-width="1000px">
        <DetalleProgramacionMensualComponente />
      </v-dialog>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-tooltip top v-if="$can('programacionMensual.actualizar')">
        <template v-slot:activator="{ on, attrs }">
          <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="editar(item)">
            mdi-pencil
          </v-icon>
        </template>
        <span>Editar</span>
      </v-tooltip>
      <v-tooltip top v-if="$can('programacionMensual.actualizar')">
        <template v-slot:activator="{ on, attrs }">
          <v-icon color="success" small class="mr-2" v-bind="attrs" v-on="on" @click="programar(item)">
            mdi-calendar-month-outline
          </v-icon>
        </template>
        <span>Programar</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
  import DetalleProgramacionMensualComponente from '~/components/cuadroTurnos/DetalleProgramacionMensualComponente.vue';
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    components: {
      DetalleProgramacionMensualComponente
    },
    name: 'WorkspaceJsonprogramacionMensual',
    data() {
      return {
        loading: false,
        dialog: false,
        dialogoProgramar: false,
        dialogoEditar: false,
        buscarProgramacion: '',
        turnos: [],
        programacionesMensuales: [],
        listaEmpleados: [],
        programacion: {
          empleado_id: '',
          periodo: '',
          total_horas: 0,
          total_horas_diurnas: 0,
          total_horas_nocturnas: 0
        },
        editedIndex: -1,
        defecto: {
          empleado_id: '',
          periodo: '',
          total_horas: 0,
          total_horas_diurnas: 0,
          total_horas_nocturnas: 0
        },
        errors: {
          empleado_id: '',
          periodo: '',
          total_horas: 0,
          total_horas_diurnas: 0,
          total_horas_nocturnas: 0
        },
        paginate: {
          total: 0,
          page: 1
        },
        headers: [{
            text: 'ID',
            value: 'id'
          },
          {
            text: 'Documento',
            value: 'documento'
          },
          {
            text: 'Empleado',
            value: 'nombre_completo'
          },
          {
            text: 'Sede',
            value: 'sede'
          },
          {
            text: 'Área',
            value: 'area'
          },
          {
            text: 'Periodo',
            value: 'periodo'
          },
          {
            text: 'Total horas',
            value: 'total_horas'
          },
          {
            text: 'Total horas diurnas',
            value: 'total_horas_diurnas'
          },
          {
            text: 'Total horas nocturnas',
            value: 'total_horas_nocturnas'
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
      this.listarProgramacionesMensuales();
      this.listarEmpleados();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear periodo de programación' : 'Editar periodo de programación'
      },
    },

    methods: {

      concatenar(listarEmpleados) {
        return `${listarEmpleados.documento} - ${listarEmpleados.nombre_completo}`;
      },

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.programacion = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      listarProgramacionesMensuales() {
        this.$axios.get('/programaciones-mensuales/listar').then(res => {
          this.programacionesMensuales = res.data.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      listarEmpleados() {
        this.$axios.get('/empleados/listar').then(res => {
          this.listaEmpleados = res.data.data

        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        })
      },

      guardarProgramacion() {
        this.programacion.total_horas = 0
        this.programacion.total_horas_diurnas = 0
        this.programacion.total_horas_nocturnas = 0
        if (this.editedIndex > -1) {
          this.$axios.put('/programaciones-mensuales/' + this.programacion.id, this.programacion).then(res => {
            this.$toast.success(res.data.mensaje)
            this.dialog = false
            this.listarProgramacionesMensuales()
          }).catch(error => {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })
        } else {
          if (this.programacion.periodo == "") {
            this.$toast.error('Debe definir un mes y año para el periodo')
          }
          this.$axios.post('/programaciones-mensuales/crear', this.programacion).then(res => {
            this.$toast.success(res.data.mensaje)
            this.dialog = false
            this.listarProgramacionesMensuales()
          }).catch(error => {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })
        }
        this.listarProgramacionesMensuales()
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
        this.editedIndex = this.programacionesMensuales.indexOf(item)
        this.programacion = Object.assign({}, item)
        this.dialog = true
      },

      programar(item) {
        this.editedIndex = this.programacionesMensuales.indexOf(item)
        this.programacion = Object.assign({}, item)
        this.dialogoProgramar = true
      },

    },
  };

</script>
