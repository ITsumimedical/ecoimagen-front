<template>
  <div>
    <v-card elevation="0">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>
            <div class="d-flex align-center">
              <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
              <span>Seguimiento a compromisos del plan individual</span>
            </div>
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
      </v-card-title>
    </v-card>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <template>
          <v-card elevation="0">
            <v-tabs grow>
              <v-tab>
                <v-icon left>
                  mdi-account-check-outline
                </v-icon>
                Evaluación del desempeño
              </v-tab>
              <!-- EVALUACIÓN DEL DESEMPEÑO -->
              <v-tab-item>
                <v-card flat>
                  <v-card-text>
                    <v-subheader><i>El botón de descarga del certificado sólo será habilitado una vez se haya culminado
                        el proceso de evaluación de desempeño</i></v-subheader>
                    <v-card-title>
                      <v-text-field append-icon="mdi-magnify" single-line hide-details></v-text-field>
                    </v-card-title>
                    <v-data-table dense :headers="headers" :items="empleadoProceso">
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-btn small class="mr-2" color="info" @click="modalGestionCompetencia(item.documento)">
                          Seguimiento
                          <v-icon dark right>
                            mdi-file-eye-outline
                          </v-icon>
                        </v-btn>
                        <v-btn v-show="item.resultado != null" small class="mr-2 white--text" color="red"
                          @click="imprimirPdf(item.idEvaluacion)">
                          PDF
                          <v-icon dark right>
                            mdi-folder-download-outline
                          </v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </template>
      </v-col>
    </v-row>
    <template>
      <v-row justify="center">
        <!-- EVALUACIÓN DESEMPEÑO -->
        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card>
            <v-alert border="left" dense color="info">
              <v-btn icon dark @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <span style="color:#fff">EVALUACIÓN DEL DESEMPEÑO</span>
              <v-spacer></v-spacer>
            </v-alert>
            <v-container fluid>
              <v-row dense>
                <v-col class="d-flex" cols="12" sm="4">
                  <v-text-field dense readonly v-model="datosColaborador.nombreColaborador" outlined
                    label="Nombre completo"></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="2">
                  <v-text-field readonly dense v-model="datosColaborador.documento" outlined label="Documento">
                  </v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="2">
                  <v-text-field dense readonly v-model="datosColaborador.genero" outlined label="Sexo"></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="2">
                  <v-text-field readonly dense v-model="datosColaborador.celular" outlined label="celular">
                  </v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="2">
                  <v-text-field readonly dense v-model="datosColaborador.estado_civil" outlined label="Estado civil">
                  </v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field readonly dense v-model="datosColaborador.email_corporativo" outlined
                    label="Correo Institucional"></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field dense readonly v-model="datosColaborador.cargo" outlined label="Cargo"></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-card elevation="0">
                    <v-alert dense text :value="true" type="warning">
                      Compromisos laborales de competencias con calificación inferior a 4 | <i
                        style="color:black">Despliegue cada item para
                        registrar o revisar seguimientos o compromisos por competencia</i>
                    </v-alert>
                    <v-expansion-panels focusable>
                      <v-expansion-panel v-for="(item,i) in empleadoCompromisos" :key="i">
                        <v-expansion-panel-header color="#ECEFF1" @click="buscarSeguimientos(item.clasificacion_id)"
                          class="pa-2 rounded-lg elevation-2">

                          <v-row class="align-center" no-gutters>
                            <v-col cols="12" sm="3">
                              <div class="text-h6 font-weight-bold">Consecutivo:</div>
                              <div class="text-body-2">{{ item.clasificacion_id }}</div>
                            </v-col>

                            <v-col cols="12" sm="3">
                              <div class="text-h6 font-weight-bold">Pilar:</div>
                              <div class="text-body-2">{{ item.pilar }}</div>
                            </v-col>

                            <v-col cols="12" sm="3">
                              <div class="text-h6 font-weight-bold">Competencia:</div>
                              <div class="text-body-2">{{ item.competencia }}</div>
                            </v-col>

                            <v-col cols="12" sm="3">
                              <div class="text-h6 font-weight-bold">Calificación obtenida:</div>
                              <div class="text-body-2">{{ item.calificacion }}</div>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>
                          <v-form>
                            <v-row>
                              <v-col cols="12" sm="6" md="3">
                                <v-autocomplete label="Tiempo de seguimiento" v-model="compromiso.tiempo"
                                  :error-messages="errors.tiempo" :items="['Accion Mejora','Trimestral','Bimestral']">
                                </v-autocomplete>
                              </v-col>
                              <v-col cols="12" sm="6" md="12">
                                <v-textarea auto-grow label="Compromiso | Seguimiento"
                                  hint="Describa el seguimiento o compromiso al que llega con el empleado con el fin de aprobar la competencia"
                                  v-model="compromiso.seguimiento" :error-messages="errors.seguimiento"></v-textarea>
                              </v-col>
                            </v-row>
                            <br>
                            <v-alert dense v-if="!seguimientos.length" text :value="true" type="error">
                              La competencia aún no cuenta con seguimientos
                            </v-alert>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn small color="error" dark @click="limpiarComprimiso()">limpiar formulario
                              </v-btn>
                              <v-btn small color="boton" dark @click="agregarSeguimiento(item.clasificacion_id)">Agregar
                                Seguimiento</v-btn>
                            </v-card-actions>
                            <v-col v-for="(item, index) in seguimientos" :key="index">
                              <v-layout row wrap>
                                <v-col cols="12">
                                  <v-row dense>
                                    <v-col cols="12" sm="6">
                                      <v-icon left color="primary">mdi-human-greeting</v-icon>
                                      <span><b>Seguimiento realizado por:</b>
                                        {{ item.usuario.operador.nombre_completo }}</span>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                      <v-icon left color="primary">mdi-calendar-clock</v-icon>
                                      <span><b>Tiempo del seguimiento:</b> {{ item.tiempo }}</span>
                                    </v-col>
                                  </v-row>

                                  <v-row dense>
                                    <v-col cols="12">
                                      <v-icon left color="primary">mdi-calendar-today</v-icon>
                                      <span><b>Fecha de realización nota compromiso:</b>
                                        {{ item.created_at.substr(0, 10) }}</span>
                                    </v-col>
                                  </v-row>

                                  <v-divider class="my-4"></v-divider>

                                  <v-textarea auto-grow readonly outlined label="Nota de compromiso"
                                    :value="item.seguimiento">
                                  </v-textarea>

                                  <v-divider class="my-4"></v-divider>
                                </v-col>
                              </v-layout>
                            </v-col>
                          </v-form>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </div>
</template>

<script>
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('planSeguimientoIndividual.listar')) {
        return redirect('/');
      }
    },
    name: "WorkspaceJsonPlanSeguimiento",

    data() {
      return {
        dialog: false,
        empleadoProceso: [],
        itemSeguimientoCompromiso: [],
        empleadoCompromisos: [],
        datosJefeInmediato: {
          nombreJefe: "",
          jefeDocumento: "",
          correoJefe: "",
          cargoJefe: "",
          documentoEmpleado: ""
        },
        datosColaborador: {
          nombreColaborador: "",
          documento: "",
          genero: "",
          email_corporativo: "",
          celular: "",
          estado_civil: "",
          cargo: ""
        },
        compromiso: {
          tiempo: null,
          seguimiento: null
        },
        errors: {
          tiempo: '',
          seguimiento: '',
        },
        seguimientos: [],
        headers: [{
            text: "Nombre",
            align: "start",
            filterable: false,
            value: "nombre_completo"
          },
          {
            text: "Documento",
            value: "documento"
          },
          {
            text: "Cargo",
            value: "cargoEmpleado"
          },
          {
            text: "Acciones",
            value: "actions",
            align: 'center',
            sortable: false
          }
        ],
      };
    },

    mounted() {
      this.listarColaboradoresConCompromisos();
    },

    methods: {
      modalGestionCompetencia(documentoEmpleado) {
        this.$axios.get("/empleados/compromisos/" + documentoEmpleado).then(res => {
            this.dialog = true;
            this.empleadoCompromisos = res.data;
            this.datosColaborador.nombreColaborador = res.data[0].nombre_completo;
            this.datosColaborador.documento = res.data[0].documento;
            this.datosColaborador.genero = res.data[0].genero;
            this.datosColaborador.email_corporativo = res.data[0].email_corporativo;
            this.datosColaborador.celular = res.data[0].celular;
            this.datosColaborador.estado_civil = res.data[0].estado_civil;
            this.datosColaborador.cargo = res.data[0].cargo;
          })
          .catch(error => {
            this.$toast.error(error.response.data.mensaje);
          });
      },

      listarColaboradoresConCompromisos() {
        this.$axios.get("/empleados/compromisos-laborales").then(res => {
            this.empleadoProceso = res.data;
            this.datosJefeInmediato.nombreJefe = res.data[0].jefeInmediato;
            this.datosJefeInmediato.jefeDocumento = res.data[0].jefeDocumento;
            this.datosJefeInmediato.correoJefe = res.data[0].correoJefe;
            this.datosJefeInmediato.cargoJefe = res.data[0].cargoJefe;
            this.datosJefeInmediato.documentoEmpleado = res.data[0].documento;
          })
          .catch(error => {
            this.$toast.error(error.response.data.mensaje);
          });
      },

      agregarSeguimiento(id) {
        this.limpiarError()
        this.$axios.post("/seguimiento-compromiso/crear/" + id, this.compromiso).then(res => {
            this.$toast.success(res.data.mensaje);
            this.buscarSeguimientos(id);
            this.limpiarComprimiso();
          })
          .catch(error => {
            this.$toast.error(error.response.data.mensaje);
            this.ErrorEntrada(error.response.data)
          });
      },

      buscarSeguimientos(id) {
        this.$axios.get("/seguimiento-compromiso/listar/" + id).then(res => {
            this.seguimientos = res.data.data;
          })
          .catch(error => {
            this.$toast.erros(error.response.data.mensaje);
          });
      },

      /**
       ** limpiar campos compromiso
       * @return object comprimiso
       */
      limpiarComprimiso() {
        this.compromiso.tiempo = null;
        this.compromiso.seguimiento = null;
        this.$toast.success("Se limpiaron los campos correctamente");
      },

      finalizarSegimiento(id) {
        this.$swal({
          title: '¿Está Seguro?',
          text: "Al aceptar este mensaje, indicará que el empleado aprobó la competencia",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#28a745',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            this.$axios.post('/seguimiento-compromiso/finalizar-Seguimiento/' + id).then(res => {
              this.buscarSeguimientos(id);
              this.$toast.success('Se ha aprobado la competencia');
            })
          }
        })
      },

      imprimirPdf(idEvaluacion) {
        this.$axios({
          method: 'get',
          url: '/evaluacion-desempeno/printfpdf/' + idEvaluacion,
          responseType: 'blob',
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');

          a.download = 'CertificacionEvaluacionDesempenio.pdf';
          a.href = url;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.dialog = false
          this.clear();
        }).catch(err => {
          console.log(err)
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


      chipEstado(estado_id) {
        if (estado_id == '10') return 'info'
        else if (estado_id == '17') return 'green'
        else return 'warning'
      },
    }
  };

</script>
