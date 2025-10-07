<template>
  <div>
    <template>
      <template>
        <v-card>
           <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Parametrización de agendamiento</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
          <v-tabs grow>
            <v-tab>
              <v-icon left>
                mdi-alert-outline
              </v-icon>
              Novedades
            </v-tab>
            <v-tab>
              <v-icon left>
                mdi-door
              </v-icon>
              Consultorios
            </v-tab>

            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <!-- NOVEDADES -->
                  <v-card-actions>
                    <v-btn small color="success" dark @click="dialog = true">
                      Crear
                    </v-btn>
                  </v-card-actions>
                  <v-data-table dense :headers="headersNovedades" :items-per-page="5" :items="novedades">
                    <template v-slot:[`item.estado_id`]="{ item }">
                      <v-chip small :color="chipEstado(item.estado_id)" dark>
                        {{ item.estado_id == '1' ? 'Activo' : 'Inactivo' }}
                      </v-chip>
                    </template>
                    <template v-slot:[`item.sancion`]="{ item }">
                      <v-chip small :color="chipEstado(item.sancion)" dark>{{ item.sancion == '1' ? 'Si' : 'No' }}
                      </v-chip>
                    </template>
                  </v-data-table>
                  <v-dialog v-model="dialog" max-width="800px">
                    <v-container fluid class="pa-0">
                      <v-card>
                        <v-card-title class="titulo">
                          <span class="black--text text-h5">Novedades</span>
                        </v-card-title>
                        <form @submit.prevent="guardarNovedad">
                          <v-card-text>
                            <v-container>
                              <v-row>
                                <v-col cols="12" sm="6" md="9">
                                  <v-text-field dense v-model="novedad.nombre" label="Nombre"
                                    :error-messages="errores.nombre">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                  <v-switch dense v-model="novedad.sancion" label="Genera sanción">
                                  </v-switch>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                  <v-textarea dense auto-grow v-model="novedad.descripcion" label="Descripción"
                                    :error-messages="errores.descripcion">
                                  </v-textarea>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn small color="red" dark @click="clearErroresNovedades()">
                              Cancelar
                            </v-btn>
                            <v-btn small color="success" dark @click="guardarNovedad()">
                              Guardar
                            </v-btn>
                          </v-card-actions>
                        </form>
                      </v-card>
                    </v-container>
                  </v-dialog>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <ConsultoriosComponente />
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </template>

    </template>
  </div>
</template>

<script>
  import {
    listarNovedad,
    crearNovedad
  } from "@/api/novedadesAgendamientos/novedadAgendamiento";
  import ConsultoriosComponente from '~/components/citas/consultorios/ConsultoriosComponente.vue';
  export default {
    components: {
      ConsultoriosComponente
    },
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
        crearActividad: false,
        crearNovedad: false,
        dialog: false,
        cita: {
          nombre: '',
          especialidade_id: '',
          cantidad_paciente: '',
          tiempo_consulta: '',
          sms: '',
          tipo_cita_id: '',
        },
        novedades: [],
        estadosFk: [],
        estados: [{
            nombre: 'activo',
            estado_id: true
          },
          {
            nombre: 'inactivo',
            estado_id: false
          },
        ],

        headersNovedades: [{
            text: 'Id',
			align: 'start',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Nombre',
            align: 'start',
            sortable: false,
            value: 'nombre',
          },
          {
            text: 'Descripción',
            align: 'start',
            sortable: false,
            value: 'descripcion',
          },
          {
            text: 'Genera sanción',
            align: 'center',
            sortable: false,
            value: 'sancion',
          },
          {
            text: 'Estado',
            value: 'estado_id',
            sortable: false,
          },
        ],
        errores: {
          nombre: ''
        },
        novedad: {
          nombre: '',
          descripcion: '',
          sancion: false,
          estado_id: ''
        },
        erroresActividades: {
          nombre: '',
          especialidad_id: '',
          cantidad_paciente: '',
          tiempo_consulta: '',
          sms: '',
          tipo_cita_id: '',
        },
        citas: [],
        tipoCitas: [],
      };
    },

    created() {
      this.listarNovedad()
      this.listarEstados()
    },
    methods: {

      getColor(estado) {
        if (estado > 400) return 'red'
        else if (estado > 200) return 'orange'
        else if (estado == 0) return 'orange'
        else return 'green'
      },
      // NOVEDADES
      listarNovedad() {
        this.$loadingGetRequest(listarNovedad()).then(res => {
          this.novedades = res.data.data.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      guardarNovedad() {
        this.novedad.estado_id = 1
        this.$loadingPostRequest(crearNovedad(), this.novedad).then(res => {
          this.dialog = false
          this.listarNovedad()
          this.clearNovedad()
        }).catch(e => {
          this.errores = e.response.data
        })
      },

      clearNovedad() {
        for (const key in this.novedad) {
          this.novedad[key] = ''
        }
      },

      clearErroresNovedades() {
        this.dialog = false
        this.clearNovedad()
        for (const key in this.errores) {
          this.errores[key] = ''
        }
      },

      async listarEstados() {
        try {
          const response = await this.$loadingGetRequest('/estados/listar')
          this.estadosFk = response.data.data
        } catch (error) {
          this.$toast.error('No se ha podido cargar los estados!')
        }
      },

      chipEstado(estado_id) {
        if (estado_id == '1') return 'green'
        else if (estado_id == '0') return 'error'
        else return 'warning'
      },

    },
  };

</script>
