<template>
  <div>
    <v-data-table dense :headers="headers" :search="buscarVacacion" :items="vacaciones" sort-by="id"
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:[`item.requiere_reemplazo`]="{ item }">
        <v-chip small :color="chipReemplazo(item.requiere_reemplazo)" dark>
          {{ item.requiere_reemplazo == true ? 'Requiere reemplazo' : 'No requiere reemplazo' }}</v-chip>
      </template>
      <template v-slot:[`item.estado_id`]="{ item }">
        <v-chip small v-if="item.estado_id == 3" :color="getColor(item.estado_id)" dark>
          {{ 'Pendiente autorización' }}
        </v-chip>
        <v-chip small v-if="item.estado_id == 4" :color="getColor(item.estado_id)" dark>
          {{ 'Autorizado' }}
        </v-chip>
        <v-chip small v-if="item.estado_id == 5" :color="getColor(item.estado_id)" dark>
          {{ 'Anulado' }}
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
          <v-subheader>Vacaciones</v-subheader>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarVacacion" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="1000px" persistent>
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert text dense border="left" color="blue-grey">{{titulo}}</v-alert>
              <form @submit.prevent="guardarVacacion">
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-select dense v-model="vacacionEmpleado.anio_periodo" :items="aniosItems" label="Año de periodo"
                        :error-messages="errors.anio_periodo">
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field dense type="number" v-model="vacacionEmpleado.dias_disfrutados" hide-spin-buttons
                        label="Días de disfrute" :error-messages="errors.dias_disfrutados">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field dense type="number" v-model="vacacionEmpleado.dias_pagados" hide-spin-buttons
                        label="Días pagados en dinero" :error-messages="errors.dias_pagados">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field dense v-model="vacacionEmpleado.fecha_inicio_disfrute"
                        :error-messages="errors.fecha_inicio_disfrute" label="Fecha inicio de disfrute" type="date">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field dense v-model="vacacionEmpleado.fecha_fin_disfrute"
                        :error-messages="errors.fecha_fin_disfrute" label="Fecha fin de disfrute" type="date">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field dense v-model="vacacionEmpleado.fecha_incorporacion"
                        :error-messages="errors.fecha_incorporacion" label="Fecha de reincorporación" type="date">
                      </v-text-field>
                    </v-col>
                    <v-col cols="2" sm="2" md="2">
                      <v-checkbox dense v-model="vacacionEmpleado.requiere_reemplazo" label="Requiere reemplazo">
                      </v-checkbox>
                    </v-col>
                  </v-row>
                </v-container>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn small color="boton" dark @click="guardarVacacion()">
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
        <v-tooltip top v-if="$can('vacacionEmpleado.autorizar')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="green" small class="mr-2" v-bind="attrs" v-on="on" @click="autorizar(item)">
              mdi-check
            </v-icon>
          </template>
          <span>Autorizar</span>
        </v-tooltip>
        <v-tooltip top v-if="$can('vacacionEmpleado.anular')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="red" small class="mr-2" v-bind="attrs" v-on="on" @click="anular(item)">
              mdi-block-helper
            </v-icon>
          </template>
          <span>Anular</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import {
    listarVacaciones,
    guardarVacacion,
    actualizarVacacion,
  } from '@/api/vacacionesEmpleados/vacacionEmpleado'
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('vacacionEmpleado.listar')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonVacacionEmpleadosComponente',
    props: ['contrato_id', 'activo'],
    data() {
      return {
        aniosItems: ['2018', '2019', '2020', '2021', '2022', '2023'],
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
        buscarVacacion: '',
        vacaciones: [],
        vacacionEmpleado: {
          fecha_inicio_disfrute: '',
          fecha_fin_disfrute: '',
          fecha_incorporacion: '',
          dias_disfrutados: '',
          dias_pagados: '',
          salario_promedio: '',
          anio_periodo: '',
          requiere_reemplazo: false
        },
        editedIndex: -1,
        defecto: {
          fecha_inicio_disfrute: '',
          fecha_fin_disfrute: '',
          fecha_incorporacion: '',
          dias_disfrutados: '',
          dias_pagados: '',
          salario_promedio: '',
          anio_periodo: '',
          requiere_reemplazo: false
        },
        errors: {
          fecha_inicio_disfrute: '',
          fecha_fin_disfrute: '',
          fecha_incorporacion: '',
          dias_disfrutados: '',
          dias_pagados: '',
          salario_promedio: '',
          anio_periodo: '',
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
            text: 'Fecha inicio disfrute',
            value: 'fecha_inicio_disfrute',
          },
          {
            text: 'Fecha fin disfrute',
            value: 'fecha_fin_disfrute',
          },
          {
            text: 'Fecha reincorporación',
            value: 'fecha_incorporacion',
          },
          {
            text: 'Días disfrutados',
            value: 'dias_disfrutados',
          },
          {
            text: 'Días efectivos en dinero',
            value: 'dias_pagados',
          },
          {
            text: 'Requiere reemplazo',
            value: 'requiere_reemplazo',
            align: 'center'
          },
          {
            text: 'Estado',
            value: 'estado_id',
            align: 'center'
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
      this.listarVacaciones();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear vacación' : 'Editar vacación'
      },
    },

    watch: {
      dialogoBloqueos(val) {
        val || this.cerrarDialogo()
      },
      contrato_id() {
        this.listarVacaciones();
      },
    },

    methods: {

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.vacacionEmpleado = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      async listarVacaciones() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarVacaciones(this.contrato_id))
          this.vacaciones = data.data
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      chipReemplazo(requiere_reemplazo) {
        if (requiere_reemplazo == true) return 'blue'
        else if (requiere_reemplazo == false) return 'blue-grey'
        else return 'warning'
      },

      getColor(estado_id) {
        if (estado_id == 3) return 'orange';
        else if (estado_id == 4) return 'green'
        else if (estado_id == 5) return 'red'
        else return 'red'
      },

      async guardarVacacion() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarVacacion(this.vacacionEmpleado.id), this
              .vacacionEmpleado)
            this.$toast.success(data.mensaje)
            this.listarVacaciones()
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
            this.vacacionEmpleado.contrato_id = this.contrato_id
            this.vacacionEmpleado.estado_id = 3
            const {
              data
            } = await this.$loadingPostRequest(guardarVacacion(), this.vacacionEmpleado)
            this.$toast.success(data.mensaje)
            this.listarVacaciones()
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
        this.editedIndex = this.vacaciones.indexOf(item)
        this.vacacionEmpleado = Object.assign({}, item)
        this.dialog = true
      },

      async autorizar(item) {
        try {
          this.$swal({
            title: "¡Periodo vacacional autorizado!",
            text: ` `,
            timer: 2000,
            type: "success",
          });
          await this.$axios.put('vacacion-empleado/autorizar/' + item.id)
          this.listarVacaciones()
          this.$toast.success('Se ha autorizado el periodo de vacaciones correctamente.')
        } catch (error) {
          console.log(error);
        }
      },

      async anular(item) {
        try {
          this.$swal({
            title: "¡Periodo vacacional anulado!",
            text: ` `,
            timer: 2000,
            type: "success",
          });
          await this.$axios.put('vacacion-empleado/anular/' + item.id)
          this.listarVacaciones()
          this.$toast.success('Se ha anulado el periodo de vacaciones correctamente.')
        } catch (error) {
          console.log(error);
        }
      },

    },
  };

</script>
