<template>
  <div>
    <v-data-table dense :headers="headers" :search="buscarIncapacidad" :items="incapacidades" sort-by="id"
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn small v-if="activo != 0" color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon right>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-subheader>Incapacidades</v-subheader>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarIncapacidad" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="1000px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert text dense border="left" color="blue-grey">{{titulo}}</v-alert>
              <form @submit.prevent="guardarIncapacidad">
                <v-container fluid>
                  <v-row dense>
                    <v-col cols="12" sm="6" md="4">
                      <v-select dense v-model="incapacidadEmpleado.tipo" :error-messages="errors.tipo" :items="itemsTipos"
                        label="Tipo">
                      </v-select>
                    </v-col>
                    <v-col cols="4" sm="4" md="4">
                      <v-autocomplete dense v-model="incapacidadEmpleado.cie10" :items="cie10" :item-text="concatenarCie10"
                        item-value="id" label="Cie10" :error-messages="errors.cie10">
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select dense v-model="incapacidadEmpleado.causa_externa" :items="itemsCausas" label="Causa externa">
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select dense v-model="incapacidadEmpleado.motivo" :items="itemsMotivos" label="Motivo">
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select dense v-model="incapacidadEmpleado.clase" :error-messages="errors.clase" :items="itemsClases"
                        label="Clase">
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" v-if="incapacidadEmpleado.clase == 'Prórroga'">
                      <v-autocomplete dense v-model="incapacidadEmpleado.incapacidad_id" :items="incapacidadesIniciales"
                        :item-text="datosIncapacidadInicial" item-value="id" label="Relación incapacidad inical"
                        :error-messages="errors.incapacidad_id">
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field dense v-model="incapacidadEmpleado.fecha_desde" :error-messages="errors.fecha_desde"
                        label="Fecha inicio" type="date">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field dense v-model="incapacidadEmpleado.fecha_hasta" :error-messages="errors.fecha_hasta"
                        label="Fecha fin" type="date">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-textarea auto-grow dense v-model="incapacidadEmpleado.descripcion" label="Descripción de la incapacidad"
                        :error-messages="errors.descripcion">
                      </v-textarea>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-textarea auto-grow dense v-model="incapacidadEmpleado.recomendaciones" label="Recomendaciones médicas"
                        :error-messages="errors.recomendaciones">
                      </v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn small color="boton" dark @click="guardarIncapacidad()">
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
    listarIncapacidades,
    guardarIncapacidad,
    actualizarIncapacidad,
  } from '@/api/incapacidadesEmpleados/incapacidadEmpleado'
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('incapacidadEmpleado.listar')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonIncapacidadEmpleadosComponente',
    props: ['contrato_id', 'activo'],
    data() {
      return {
        itemsTipos: ['Enfermedad general ambulatoria', 'Enfermedad general hospitalaria',
          'Riesgos profesionales'
        ],
        itemsCausas: ['Ninguna', 'Accidente de trabajo', 'Accidente de tránsito', 'Accidente rábico',
          'Accidente Ofídico', 'Otro tipo de accidente', 'Evento catastrófico', 'Lesión por agresión',
          'Lesión autoinflingida', 'Sospecha maltrato físico', 'Sospecha de abuso sexual',
          'Sospecha violencia sexual', 'Sospecha maltrato sexual', 'Sospecha maltrato emocional',
          'Enfermedad general', 'Enfermedad profesional', 'Otra'
        ],
        itemsMotivos: ['Ninguno', 'Expedición directa', 'Transcripción', 'Reproducción', 'Sustitución'],
        itemsClases: ['Inicial', 'Prórroga'],
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarIncapacidad: '',
        incapacidades: [],
        tipoIncapacidad: [],
        cie10: [],
        incapacidadesIniciales: [],
        incapacidadEmpleado: {
          cie10: '',
          fecha_desde: '',
          fecha_hasta: '',
          tipo: '',
          causa_externa: '',
          descripcion: '',
          clase: '',
          incapacidad_id: '',
          recomendaciones: '',
        },
        editedIndex: -1,
        defecto: {
          cie10: '',
          fecha_desde: '',
          fecha_hasta: '',
          tipo: '',
          causa_externa: '',
          descripcion: '',
          clase: '',
          incapacidad_id: '',
          recomendaciones: '',
        },
        errors: {
          cie10: '',
          fecha_desde: '',
          fecha_hasta: '',
          tipo: '',
          causa_externa: '',
          descripcion: '',
          clase: '',
          incapacidad_id: '',
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
            text: 'Tipo',
            value: 'tipo',
          },
          {
            text: 'Descripción',
            value: 'descripcion',
          },
          {
            text: 'Fecha de inicio',
            value: 'fecha_desde',
          },
          {
            text: 'Fecha fin',
            value: 'fecha_hasta',
          },
          {
            text: 'Días',
            value: 'dias',
          },
          {
            text: 'Clase',
            value: 'clase',
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
      this.listarIncapacidades();
      this.listarCie10();
      this.listarIncapacidadesIniciales();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear incapacidad' : 'Editar incapacidad'
      },
    },

    watch: {
      dialogoBloqueos(val) {
        val || this.cerrarDialogo()
      },
      contrato_id() {
        this.listarIncapacidades();
        this.listarIncapacidadesIniciales();
      },
    },

    methods: {

      concatenarCie10(listarCie10) {
        return `${listarCie10.codigo_cie10} ${listarCie10.nombre}`;
      },

      datosIncapacidadInicial(listarIncapacidades) {
        return `ID: ${listarIncapacidades.id} - Tipo: ${listarIncapacidades.tipo} - Periodo inicio - ${listarIncapacidades.fecha_desde} Fin ${listarIncapacidades.fecha_hasta}`;
      },

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.incapacidadEmpleado = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      async listarIncapacidades() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarIncapacidades(this.contrato_id))
          this.incapacidades = data.data
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      listarCie10() {
        this.$axios.get('/cie10/listar').then(res => {
          this.cie10 = res.data
        }).catch(error => {
          console.log(error)
        })
      },

      listarIncapacidadesIniciales() {
        this.$axios.get('/incapacidad-empleado/listarInicial/' + this.contrato_id).then(res => {
          this.incapacidadesIniciales = res.data.data
        }).catch(error => {
          console.log(error)
        })
      },

      async guardarIncapacidad() {
        this.limpiarError()
        this.incapacidadEmpleado.estado_id = 1
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarIncapacidad(this.incapacidadEmpleado.id), this
              .incapacidadEmpleado)
            this.$toast.success(data.mensaje)
            this.listarIncapacidades()
            this.listarIncapacidadesIniciales()
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
            this.incapacidadEmpleado.contrato_id = this.contrato_id
            const {
              data
            } = await this.$loadingPostRequest(guardarIncapacidad(), this.incapacidadEmpleado)
            this.$toast.success(data.mensaje)
            this.listarIncapacidades()
            this.listarIncapacidadesIniciales()
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
        this.editedIndex = this.incapacidades.indexOf(item)
        this.incapacidadEmpleado = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
