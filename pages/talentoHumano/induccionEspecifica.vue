<template>
  <div>
    <v-row>
      <v-col v-for="ind in induccionesRealizadas" :key="ind.color" cols="12" sm="3" md="3">
        <Widget :color="ind.color" :icon="ind.icon" :title="ind.title" :subTitle="ind.subTitle"
          :supTitle="ind.supTitle" />
      </v-col>
    </v-row>
    <v-data-table :headers="headers" :search="buscarInduccion" :items="induccionesEspecificas" class="elevation-1"
      :loading="loading" loading-text="Cargando..." no-data-text="Sin datos para mostrar">
      <template v-slot:[`item.estadoBeneficio`]="{ item }">
        <v-chip small v-if="item.activo == 0" :color="getColor(item.activo)" dark>
          {{ 'Cerrado' }}
        </v-chip>
        <v-chip small v-if="item.activo == 1" :color="getColor(item.activo)" dark>
          {{ 'En gestión' }}
        </v-chip>
      </template>
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarInduccion" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <!-- PERIODO INDUCCIÓN ESPECÍFICA -->
        <v-dialog v-model="dialog" max-width="1000px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo">
                <span class="black--text text-h5">Crear periodo de inducción específica</span>
              </v-card-title>
              <form @submit.prevent="guardarInduccion">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="8">
                        <v-autocomplete :error-messages="errors.empleado_id" :items="listaEmpleados"
                          :item-text="concatenar" item-value="id" v-model="induccion.empleado_id" label="Empleado"
                          dense>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="induccion.fecha_inicio_induccion" dense
                          :error-messages="errors.fecha_inicio_induccion" label="Fecha de inicio de la inducción"
                          type="date">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cerrar
                  </v-btn>
                  <v-btn small color="boton" dark @click="guardarInduccion()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
        <!-- DETALLE INDUCCIÓN ESPECÍFICA -->
        <v-dialog v-model="dialogoDetalle" fullscreen>
          <v-container fluid class="pa-0">
            <v-card>
              <v-toolbar dark color="primary">
                <v-btn icon dark @click="dialogoDetalle = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>FORMATO DE VISTO BUENO DE INDUCCIÓN ESPECÍFICA Y ENTRENAMIENTO</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-subheader>Este formato contine los elementos esenciales que usted requiere conocer para la ejecución de
                su cargo y el buen desempeño en su área de trabajo. Usted será el responsable de diligenciar la
                información solicitada y en conjunto con su jefe acordar los espacios para cada actividad.
              </v-subheader>
              <form @submit.prevent="guardarInduccion">
                <v-card-text>
                  <v-container>
                    <v-alert dense type="info" outlined text>
                      <strong>Datos del colaborador</strong>
                    </v-alert>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field :error-messages="errors.nombre_completo" :items="listaEmpleados" readonly
                          item-text="empleadoInducido" v-model="induccion.nombre_completo" outlined label="Empleado"
                          dense>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="induccion.documento" dense readonly :error-messages="errors.documento"
                          outlined label="documento">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="induccion.email_corporativo" dense readonly
                          :error-messages="errors.email_corporativo" outlined label="Correo electrónico">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="induccion.celular" dense readonly :error-messages="errors.celular"
                          outlined label="Celular">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="induccion.fecha_inicio_induccion" dense readonly
                          :error-messages="errors.fecha_inicio_induccion" outlined
                          label="Fecha de inicio de la inducción" type="date">
                        </v-text-field>
                      </v-col>
                      <v-row>
                        <v-subheader>
                          Seleccione las plantillas que apliquen para el empleado
                        </v-subheader>
                        <v-chip-group column color="blue">
                          <v-chip label small filter outlined v-for="(plantilla,plantillas) in plantillas"
                            :key="plantillas" @click="temasDePlantilla(plantilla.id)">
                            {{plantilla.nombre}}
                          </v-chip>
                        </v-chip-group>
                      </v-row>
                    </v-row>
                  </v-container>
                  <v-col cols="12" sm="12" md="12">
                    <v-expansion-panels accordion>
                      <v-expansion-panel v-for="(tema,temasPlantillas) in temasPlantillas" :key="temasPlantillas">
                        <v-expansion-panel-header @click="detalleInduccion.tema_id = tema.id">
                          {{tema.id}} - {{tema.nombre}}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <form @submit.prevent="guardarDetalleInduccion">
                            <v-container>
                              <v-row>
                                <!-- VISTO BUENO INDUCCIÓN ESPECÍFICA -->
                                <v-col cols="12" sm="6" md="10" v-if="tema.plantilla_id == 1">
                                  <v-textarea dense auto-grow v-model="detalleInduccion.descripcion_actividad"
                                    label="Descripción de la actividad" :error-messages="errors.descripcion_actividad">
                                  </v-textarea>
                                </v-col>
                                <v-col cols="12" sm="6" md="2" v-if="tema.plantilla_id == 1 || tema.plantilla_id == 3 || tema.plantilla_id == 4 || tema.plantilla_id == 5 ||
                                 tema.plantilla_id == 6 || tema.plantilla_id == 7 || tema.plantilla_id == 8">
                                  <v-text-field dense v-model="detalleInduccion.fecha_realizacion"
                                    :error-messages="errors.fecha_realizacion" label="Fecha realización" type="date">
                                  </v-text-field>
                                </v-col>
                                <!-- CHECKLIST SISTEMAS -->
                                <v-col cols="12" sm="6" md="6" v-if="tema.plantilla_id == 2">
                                  <v-text-field dense auto-grow v-model="detalleInduccion.usuario_ingreso_plataforma"
                                    label="Usuario ingreso a plataforma"
                                    :error-messages="errors.usuario_ingreso_plataforma">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6" v-if="tema.plantilla_id == 2">
                                  <v-text-field dense auto-grow v-model="detalleInduccion.contrasena_ingreso_plataforma"
                                    label="Contraseña ingreso a plataforma"
                                    :error-messages="errors.contrasena_ingreso_plataforma">
                                  </v-text-field>
                                </v-col>
                                <!-- GESTIÓN DE LA TECNOLOGÍA -->
                                <v-col cols="12" sm="6" md="3" v-if="tema.plantilla_id == 3 || tema.plantilla_id == 4 || tema.plantilla_id == 5 || tema.plantilla_id == 6
                                || tema.plantilla_id == 7 || tema.plantilla_id == 8">
                                  <v-select dense v-model="detalleInduccion.realizado" :items="realizadoItems"
                                    label="Realizado" :error-messages="errors.realizado">
                                  </v-select>
                                </v-col>
                              </v-row>
                              <v-alert dense text type="info">
                                Registro de seguimiento a inducción específica a nombre de:
                                {{$store.state.auth.datosUsuarioLogueado.nombre_completo}}
                              </v-alert>
                            </v-container>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn small color="error" @click="close()">
                                Cerrar
                              </v-btn>
                              <v-btn small color="boton" dark @click="guardarDetalleInduccion()">
                                Guardar
                              </v-btn>
                            </v-card-actions>
                          </form>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-col>
                </v-card-text>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
        <!-- COMPROMISOS INDUCCIÓN ESPECÍFICA -->
        <v-dialog v-model="dialogoCompromisos" fullscreen>
          <v-container fluid class="pa-0">
            <v-card>
              <v-toolbar dark color="primary">
                <v-btn icon dark @click="dialogoCompromisos = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>COMPROMISOS ADQUIRIDOS ORIGINADOS EN LA INDUCCIÓN ESPECÍFICA</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <form @submit.prevent="guardarInduccion">
                <v-card-text>
                  <v-container>
                    <v-alert dense type="info" outlined text>
                      <strong>Datos del colaborador</strong>
                    </v-alert>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field :error-messages="errors.nombre_completo" :items="listaEmpleados" readonly
                          item-text="empleadoInducido" v-model="induccion.nombre_completo" outlined label="Empleado"
                          dense>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="induccion.documento" dense readonly :error-messages="errors.documento"
                          outlined label="documento">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="induccion.email_corporativo" dense readonly
                          :error-messages="errors.email_corporativo" outlined label="Correo electrónico">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="induccion.celular" dense readonly :error-messages="errors.celular"
                          outlined label="Celular">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="induccion.fecha_inicio_induccion" dense readonly
                          :error-messages="errors.fecha_inicio_induccion" outlined
                          label="Fecha de inicio de la inducción" type="date">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <v-col cols="12" sm="12" md="12">
                    <form @submit.prevent="guardarDetalleInduccion">
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-textarea dense auto-grow v-model="compromisoInduccion.compromiso"
                              label="Compromiso adquirido" :error-messages="errors.compromiso"
                              hint="A cada registro de compromiso adquirido se le realizará un seguimiento en el módulo de Plan Seguimiento Individual en el tab de inducciones específicas">
                            </v-textarea>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-select v-model="compromisoInduccion.tiempo_seguimiento"
                              :items="periodicidadSeguimientoItems" label="Periodicidad de seguimiento"
                              :error-messages="errors.tiempo_seguimiento">
                            </v-select>
                          </v-col>
                        </v-row>
                        <v-alert dense text type="info" color="warning">
                          Registro de compromiso a inducción específica a nombre de:
                          {{$store.state.auth.datosUsuarioLogueado.nombre_completo}}
                        </v-alert>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn small color="error" @click="close()">
                            Cerrar
                          </v-btn>
                          <v-btn small color="boton" dark @click="guardarCompromiso()">
                            Guardar
                          </v-btn>
                        </v-card-actions>
                      </v-container>
                    </form>
                    <v-col v-for="(itemSeguimiento, index) in listaCompromisos" :key="index">
                      <v-layout row wrap>
                        <v-col cols="12" sm="12">
                          <span class="layout justify-center">
                            <v-chip small class="ma-2" color="primary" label outlined text-color="black">
                              <v-icon dense small left>
                                mdi-account-badge-outline </v-icon>
                              Empleado registra:
                              <b>{{itemSeguimiento.nombreRegistra}}</b>
                            </v-chip>
                            <v-spacer></v-spacer>
                            <v-chip small class="ma-2" color="primary" label outlined text-color="black">
                              <v-icon dense small left>
                                mdi-calendar-today </v-icon>
                              Fecha de realización:
                              <b>{{itemSeguimiento.created_at}}</b>
                            </v-chip>
                          </span>
                          <br />
                          <span>
                            <v-textarea dense auto-grow readonly outlined label="Nota de compromiso"
                              :value="itemSeguimiento.compromiso">
                            </v-textarea>
                          </span>
                          <v-divider></v-divider>
                        </v-col>
                      </v-layout>
                    </v-col>
                  </v-col>
                </v-card-text>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="info" small class="mr-2" v-bind="attrs" v-on="on" @click="detalle(item)">
              mdi-file-eye-outline
            </v-icon>
          </template>
          <span>Detalle</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="red" small class="mr-2" v-bind="attrs" v-on="on" @click="compromiso(item)">
              mdi-notebook-plus-outline
            </v-icon>
          </template>
          <span>Compromisos</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="success" small class="mr-2" v-bind="attrs" v-on="on" @click="cerrar(item)">
              mdi-check
            </v-icon>
          </template>
          <span>Cerrar</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import Widget from '~/components/widget/Widget.vue'
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('induccionEspecifica.listar')) {
        return redirect('/');
      }
    },
    components: {
      Widget
    },
    name: 'WorkspaceJsoninduccionEspecifica',
    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        dialogoDetalle: false,
        dialogoCompromisos: false,
        buscarInduccion: '',
        periodicidadSeguimientoItems: ['Mensual', 'Bimestral', 'Trimestral', 'No aplica'],
        induccionesEspecificas: [],
        plantillas: [],
        temas: [],
        temasPlantillas: [],
        listaEmpleados: [],
        listaCompromisos: [],
        realizadoItems: ['SI', 'NO', 'NO APLICA'],
        induccionesRealizadas: [{
            color: '#43A047',
            icon: 'mdi-human-male-board-poll',
            title: '0',
            subTitle: 'En gestión',
          },
          {
            color: '#039BE5',
            icon: 'mdi-check-circle-outline',
            title: '0',
            subTitle: 'Cerrado',
          },
        ],
        induccion: {
          empleado_id: null,
          fecha_inicio_induccion: null,
          fecha_fin_induccion: null,
          cumplio_totalidad: false,
          activo: false,
        },
        detalleInduccion: {
          detalle: false,
          descripcion_actividad: null,
          fecha_realizacion: null,
          usuario_ingreso_plataforma: null,
          contrasena_ingreso_plataforma: null,
          realizado: null,
          tema_id: null,
          induccion_especifica_id: null,
        },
        compromisoInduccion: {
          induccion_especifica_id: null,
          usuario_registra_id: null,
          compromiso: null,
          tiempo_seguimiento: null,
        },
        seguimientoCompromiso: {
          compromiso_induccion_especifica_id: null,
          estado_id: 10
        },
        editedIndex: -1,
        defecto: {
          empleado_id: null,
          fecha_inicio_induccion: null,
          fecha_fin_induccion: null,
          cumplio_totalidad: false,
          detalle: false,
          descripcion_actividad: null,
          fecha_realizacion: null,
          usuario_ingreso_plataforma: null,
          contrasena_ingreso_plataforma: null,
          realizado: null,
          tema_id: null,
          induccion_especifica_id: null,
          compromiso: null,
          tiempo_seguimiento: null,
        },
        errors: {
          empleado_id: null,
          fecha_inicio_induccion: null,
          compromiso: null,
          tiempo_seguimiento: null,
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
            text: 'Fecha inicio de la inducción',
            value: 'fecha_inicio_induccion'
          },
          {
            text: 'Empleado inducido',
            value: 'empleadoInducido'
          },
          {
            text: 'Empleado registra inducción',
            value: 'empleadoReporta'
          },
          {
            text: 'Estado',
            sortable: false,
            value: 'estadoBeneficio',
            align: 'center'
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
      this.listarInduccion();
      this.listarEmpleados();
      this.listarPlantillas();
      this.consultar();
    },

    methods: {

      getColor(activo) {
        if (activo == 0) return 'info';
        else if (activo == 1) return 'success'
        else return 'blue'
      },

      concatenar(listarEmpleados) {
        return `${listarEmpleados.documento} - ${listarEmpleados.nombre_completo}`;
      },

      close() {
        this.dialog = false
        this.dialogoDetalle = false
        this.dialogoCompromisos = false
        this.$nextTick(() => {
          this.induccion = Object.assign({}, this.defecto)
          this.detalleInduccion = Object.assign({}, this.defecto)
          this.compromisoInduccion = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      listarInduccion() {
        this.$axios.get('/inducciones-especificas/listar').then(res => {
          this.induccionesEspecificas = res.data.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      listarPlantillas() {
        this.$axios.get('/plantillas-inducciones-especificas/listar').then(res => {
          this.plantillas = res.data.data
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        })
      },

      temasDePlantilla(id) {
        this.$axios.get('/temas-inducciones-especificas/' + id).then(res => {
          this.temasPlantillas = res.data.data
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

      guardarInduccion() {
        this.induccion.activo = 1
        this.induccion.usuario_registra_id = this.$store.state.auth.usuario.id
        if (this.editedIndex > -1) {
          this.$axios.put('/inducciones-especificas/' + this.induccion.id, this.induccion).then(res => {
            this.$toast.success(res.data.mensaje)
            this.dialog = false
            this.listarInduccion()
          }).catch(error => {
            if (error.response.data.mensaje) {
              this.$toast.error('Se ha actualizado el periodo de inducción específica correctamente!.')
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })
        } else {
          this.limpiarError()
          this.$axios.post('/inducciones-especificas/crear', this.induccion).then(res => {
            this.$toast.success('Se ha creado el periodo de inducción específica correctamente!.')
            this.dialog = false
            this.listarInduccion()
            this.consultar()
          }).catch(error => {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })
        }
        this.listarInduccion()
      },

      guardarDetalleInduccion() {
        this.limpiarError()
        this.detalleInduccion.induccion_especifica_id = this.induccion.id
        this.detalleInduccion.usuario_registra_id = this.$store.state.auth.usuario.id
        this.$axios.post('/detalles-inducciones-especificas/crear', this.detalleInduccion).then(res => {
          this.$toast.success('Se ha creado el detalle de inducción específica correctamente!.')
        })
      },

      guardarCompromiso() {
        this.limpiarError()
        this.compromisoInduccion.induccion_especifica_id = this.induccion.id
        this.compromisoInduccion.usuario_registra_id = this.$store.state.auth.usuario.id
        console.log(this.compromisoInduccion);
        this.$axios.post('/compromisos-inducciones-especificas/crear', this.compromisoInduccion).then(res => {
          this.$toast.success('Se ha creado el compromiso de inducción específica correctamente!.')
          this.listarCompromisos()
        }).catch(error => {
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje)
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data)
          }
        })
      },

      listarCompromisos() {
        this.$axios.get('/compromisos-inducciones-especificas/' + this.induccion.id).then(res => {
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

      detalle(item) {
        this.editedIndex = this.induccionesEspecificas.indexOf(item)
        this.induccion = Object.assign({}, item)
        this.dialogoDetalle = true
        this.detalleInduccion.detalle = true
      },

      compromiso(item) {
        this.editedIndex = this.induccionesEspecificas.indexOf(item)
        this.induccion = Object.assign({}, item)
        this.dialogoCompromisos = true
        this.listarCompromisos()
      },

      async cerrar(item) {
        try {
          this.$swal({
            title: "¡Cerrar inducción específica!",
            text: `Se ha cerrado la inducción específica correctamente!.`,
            timer: 2000,
            type: "success",
          });
          await this.$axios.put('inducciones-especificas/cerrar/' + item.id)
          this.listarInduccion()
          this.$toast.success('Se ha cerrado la inducción correctamente.')
          this.consultar()
        } catch (error) {
          console.log(error);
        }
      },

      consultar() {
        this.$axios.get('inducciones-especificas/contadores-inducciones').then(res => {
          this.induccionesRealizadas[0].title = `${res.data[0]}`;
          this.induccionesRealizadas[1].title = `${res.data[1]}`;
        });
      },

    },
  };

</script>

