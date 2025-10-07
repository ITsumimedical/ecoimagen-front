<template>
  <div>
    <v-data-table :headers="headers" :search="buscarEvaluacion" :items="evaluacionesPruebas" class="elevation-1"
      :loading="loading" loading-text="Cargando..." no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarEvaluacion" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <!-- PERIODO INDUCCIÓN ESPECÍFICA -->
        <v-dialog v-model="dialog" max-width="1000px" persistent>
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo">
                <span class="black--text text-h5">Crear evaluación periodo de prueba</span>
              </v-card-title>
              <form @submit.prevent="guardarPeriodo">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="8">
                        <v-autocomplete :error-messages="errors.empleado_evaluado_id" :items="listaEmpleados"
                          :item-text="concatenar" item-value="id" v-model="evaluacion.empleado_evaluado_id"
                          label="Empleado evaluado" dense>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="evaluacion.fecha_evaluacion" dense
                          :error-messages="errors.fecha_evaluacion" label="Fecha de evaluación" type="date">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea v-model="evaluacion.descripcion_experiencia_empresa" dense
                          :error-messages="errors.descripcion_experiencia_empresa"
                          label="¿Cómo ha sido tu experiencia con nosotros en Sumimedical?">
                        </v-textarea>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea v-model="evaluacion.descripcion_experiencia_induccion" dense
                          :error-messages="errors.descripcion_experiencia_induccion"
                          label="¿Cómo ha sido tu experiencia con la induccion especifica?">
                        </v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cerrar
                  </v-btn>
                  <v-btn small color="boton" dark @click="guardarPeriodo()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
      </template>
    </v-data-table>
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
    name: 'WorkspaceJsonevaluacionPeriodoPruebas',
    data() {
      return {
        loading: false,
        dialog: false,
        buscarEvaluacion: '',
        evaluacionesPruebas: [],
        listaEmpleados: [],
        evaluacion: {
          empleado_evaluado_id: '',
          fecha_evaluacion: '',
          usuario_registra_id: '',
          descripcion_experiencia_empresa: '',
          descripcion_experiencia_induccion: '',
        },
        editedIndex: -1,
        defecto: {
          empleado_evaluado_id: '',
          fecha_evaluacion: null,
          fecha_fin_induccion: null,
          descripcion_experiencia_empresa: '',
          descripcion_experiencia_induccion: '',
        },
        errors: {
          empleado_evaluado_id: '',
          fecha_evaluacion: null,
          descripcion_experiencia_empresa: '',
          descripcion_experiencia_induccion: '',
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
            text: 'Fecha de la evaluación',
            value: 'fecha_evaluacion'
          },
          {
            text: 'Empleado evaluado',
            value: 'evaluado_nombre'
          },
          {
            text: 'Documento empleado evaluado',
            value: 'evaluado_documento'
          },
          {
            text: 'Cargo evaluado',
            value: 'evaluado_cargo'
          },
          {
            text: 'Sede evaluado',
            value: 'evaluado_sede'
          },
          {
            text: 'Empleado evaluador',
            value: 'evaluador_nonbre'
          },
          {
            text: 'Acciones',
            value: 'actions',
            align: 'center',
            sortable: false
          },
        ],
      };
    },

    mounted() {
      this.listarEvaluacion();
      this.listarEmpleados();
    },

    methods: {

      concatenar(listarEmpleados) {
        return `${listarEmpleados.documento} - ${listarEmpleados.nombre_completo}`;
      },

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.evaluacion = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      listarEvaluacion() {
        this.$axios.get('/evaluaciones-periodos-pruebas/listar').then(res => {
          this.evaluacionesPruebas = res.data.data
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

      guardarPeriodo() {
        this.evaluacion.usuario_registra_id = this.$store.state.auth.usuario.id
        if (this.editedIndex > -1) {
          this.$axios.put('/evaluaciones-periodos-pruebas/' + this.evaluacion.id, this.evaluacion).then(res => {
            this.$toast.success(res.data.mensaje)
            this.dialog = false
            this.listarEvaluacion()
          }).catch(error => {
            if (error.response.data.mensaje) {
              this.$toast.error('Se ha actualizado el periodo de evaluación periodo prueba correctamente!.')
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })
        } else {
          this.limpiarError()
          this.$axios.post('/evaluaciones-periodos-pruebas/crear', this.evaluacion).then(res => {
            this.$toast.success('Se ha creado el periodo de evaluación periodo prueba correctamente!.')
            this.dialog = false
            this.listarEvaluacion()
            this.consultar()
          }).catch(error => {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })
        }
        this.listarEvaluacion()
      },

      listarCompromisos() {
        this.$axios.get('/compromisos-inducciones-especificas/' + this.evaluacion.id).then(res => {
          this.listaCompromisos = res.data.data
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        })
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

    },
  };

</script>
