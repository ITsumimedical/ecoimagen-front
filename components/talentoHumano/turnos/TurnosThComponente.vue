<template>
  <div>
    <v-data-table :headers="headers" :search="buscarTurno" :items="turnos" sort-by="id" class="elevation-1"
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn v-if="$can('turnoTh.crear')" color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon @click="excel" color="success" dark v-bind="attrs" v-on="on">
                mdi-file-excel
              </v-icon>
            </template>
            <span>Exportar turnos</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarTurno" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo">
                <span class="white--text text-h5">{{titulo}}</span>
              </v-card-title>
              <form @submit.prevent="guardarTurno">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="turno.codigo" label="Código" :error-messages="errors.codigo">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="8">
                        <v-text-field v-model="turno.nombre" label="Nombre" :error-messages="errors.nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-menu ref="fechiaInicio" v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                          :return-value.sync="turno.hora_desde" transition="scale-transition" offset-y max-width="290px"
                          min-width="290px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="turno.hora_desde" label="Hora desde"
                              :error-messages="errors.hora_desde" prepend-icon="mdi-clock-time-four-outline" readonly
                              v-bind="attrs" v-on="on">
                            </v-text-field>
                          </template>
                          <v-time-picker v-if="menu2" v-model="turno.hora_desde" full-width
                            @click:minute="$refs.fechiaInicio.save(turno.hora_desde)">
                          </v-time-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-menu ref="fechiaFin" v-model="menu1" :close-on-content-click="false" :nudge-right="40"
                          :return-value.sync="turno.hora_hasta" transition="scale-transition" offset-y max-width="290px"
                          min-width="290px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="turno.hora_hasta" label="Hora hasta"
                              :error-messages="errors.hora_hasta" prepend-icon="mdi-clock-time-four-outline" readonly
                              v-bind="attrs" v-on="on">
                            </v-text-field>
                          </template>
                          <v-time-picker v-if="menu1" v-model="turno.hora_hasta" full-width
                            @click:minute="$refs.fechiaFin.save(turno.hora_hasta)">
                          </v-time-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field type="number" v-model="turno.total_horas" label="Total de horas"
                          :error-messages="errors.total_horas">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field type="number" v-model="turno.horas_diurnas" label="Horas diurnas"
                          :error-messages="errors.horas_diurnas">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field type="number" v-model="turno.horas_nocturnas" label="Horas nocturnas"
                          :error-messages="errors.horas_nocturnas">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn color="boton" dark @click="guardarTurno()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top v-if="$can('turnoTh.actualizar')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="editar(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <template>
      <div class="text-center">
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarTurnos()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    listarTurnos,
    guardarTurno,
    actualizarTurno,
  } from '@/api/turnos/turno'
  import {
    descargarFile
  } from '@/api/descargar'
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonTurnosThComponente',

    data() {
      return {
        time: null,
        menu2: false,
        menu1: false,
        modal2: false,
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarTurno: '',
        turnos: [],
        turno: {
          codigo: '',
          nombre: '',
          hora_desde: '',
          hora_hasta: '',
          total_horas: '',
          horas_diurnas: '',
          horas_nocturnas: '',
        },
        editedIndex: -1,
        defecto: {
          codigo: '',
          nombre: '',
          hora_desde: '',
          hora_hasta: '',
          total_horas: '',
          horas_diurnas: '',
          horas_nocturnas: '',
        },
        errors: {
          codigo: '',
          nombre: '',
          hora_desde: '',
          hora_hasta: '',
          total_horas: '',
          horas_diurnas: '',
          horas_nocturnas: '',
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
            text: 'Código',
            value: 'codigo'
          },
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Hora desde',
            value: 'hora_desde'
          },
          {
            text: 'Hora hasta',
            value: 'hora_hasta'
          },
          {
            text: 'Total de horas',
            value: 'total_horas'
          },
          {
            text: 'Horas diurnas',
            value: 'horas_diurnas'
          },
          {
            text: 'Hora nocturnas',
            value: 'horas_nocturnas'
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
      this.listarTurnos();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear turno' : 'Editar turno'
      },
    },

    watch: {
      dialogoBloqueos(val) {
        val || this.cerrarDialogo()
      }
    },

    methods: {

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.turno = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      async excel() {
        const response = await this.$axios.get('/turno-th/exportar', {
          responseType: 'blob'
        })
        descargarFile(response.data, 'turnosTalentoHumano.xlsx')
      },

      exportarAreaTh() {
        this.$axios.get('/turno-th/exportar').then(res => {
          this.areas = res.data.data.data
        }).catch(error => {
          console.log(error)
        })
      },

      async listarTurnos() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarTurnos(this.paginate.page))
          this.turnos = data.data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      async guardarTurno() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarTurno(this.turno.id), this.turno)
            this.$toast.success(data.mensaje)
            this.listarTurnos()
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
            const {
              data
            } = await this.$loadingPostRequest(guardarTurno(), this.turno)
            this.$toast.success(data.mensaje)
            this.listarTurnos()
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
        this.editedIndex = this.turnos.indexOf(item)
        this.turno = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
