<template>
  <div>
    <!-- Línea de tiempo concurrencia -->
    <v-card elevation="0">

      <!-- titulo -->
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>
            <div class="d-flex align-center">
              <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
              <span>Línea de tiempo</span>
            </div>
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-row dense v-if="datosLinea">
            <v-chip label outlined color="#C62828">Estancia intensivo (UCI): <b>{{datosLinea.dias_estancia_intensivo}}</b>
            </v-chip>
            <v-spacer></v-spacer>
            <v-chip label outlined color="#E65100">Estancia intermedio (UCE): <b>{{datosLinea.dias_estancia_intermedio}}</b>
            </v-chip>
            <v-spacer></v-spacer>
            <v-chip label outlined color="#546E7A">Estancia hospitalización (Básica):
              <b>{{datosLinea.dias_estancia_basicos}}</b></v-chip>
          </v-row>
        </v-toolbar>
      </v-card-title>

      <v-container fluid>

        <!-- buscador -->
        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field v-model="filtro.concurrencia_id" label="Radicado"
              placeholder="Ingrese el número de concurrencia" dense outlined />
          </v-col>
          <v-col cols="12" md="2">
            <v-btn small color="info" @click="buscarConcurrencia()">
              Buscar
            </v-btn>
          </v-col>
        </v-row>

        <!-- afiliado -->
        <v-card outlined v-if="datosLinea">
          <v-alert text dense border="left" color="blue-grey" icon="mdi-account-injury">
            Datos básicos del afiliado concurrente
          </v-alert>
          <v-row dense>
            <v-col cols="6">
              <v-simple-table dense>
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <th class="text-left">Nombre Completo</th>
                      <td>{{ datosLinea.ingreso_concurrencia.afiliado.nombre_completo }}</td>
                    </tr>
                    <tr>
                      <th class="text-left">Edad</th>
                      <td>{{ datosLinea.ingreso_concurrencia.afiliado.edad_cumplida }} años</td>
                    </tr>
                    <tr>
                      <th class="text-left">Género</th>
                      <td>{{ datosLinea.ingreso_concurrencia.afiliado.sexo }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col cols="6">
              <v-simple-table dense>
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <th class="text-left">Documento</th>
                      <td>{{ datosLinea.ingreso_concurrencia.afiliado.numero_documento }}</td>
                    </tr>
                    <tr>
                      <th class="text-left">Fecha de afiliación</th>
                      <td>{{ datosLinea.ingreso_concurrencia.afiliado.fecha_afiliacion }}</td>
                    </tr>
                    <tr>
                      <th class="text-left">Discapacidad</th>
                      <td>{{ datosLinea.ingreso_concurrencia.afiliado.discapacidad }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-card>

        <!-- ingreso concurrencia -->
        <template>
          <v-col cols="12"></v-col>
          <v-card elevation="0" v-if="datosLinea">
            <v-alert text dense border="left" color="blue-grey" icon="mdi-account-arrow-right">Ingreso |
              <small><b>{{datosLinea.ingreso_concurrencia?.user.operador.nombre_completo}}</b></small></v-alert>

            <v-list two-line dense>
              <v-list-item>
                <v-icon color="indigo" left>
                  mdi-calendar-range
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.ingreso_concurrencia.fecha_ingreso.substr(0,10)}}</v-list-item-title>
                  <v-list-item-subtitle>Fecha de ingreso</v-list-item-subtitle>
                </v-list-item-content>

                <v-icon color="indigo" left>
                  mdi-hospital-box-outline
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.ingreso_concurrencia.tipo_hospitalizacion}}</v-list-item-title>
                  <v-list-item-subtitle>Tipo de hospitalización</v-list-item-subtitle>
                </v-list-item-content>

                <v-icon color="indigo" left>
                  mdi-code-json
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.ingreso_concurrencia.codigo_hospitalizacion}}</v-list-item-title>
                  <v-list-item-subtitle>Código de hospitalización</v-list-item-subtitle>
                </v-list-item-content>

                <v-icon color="indigo" left>
                  mdi-doctor
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.ingreso_concurrencia.cie10.Codigo_Nombre}}</v-list-item-title>
                  <v-list-item-subtitle>Diagnóstico de ingreso</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item>

                <v-icon color="indigo" left>
                  mdi-bed-outline
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.ingreso_concurrencia.cama_piso}}</v-list-item-title>
                  <v-list-item-subtitle>Ubicación</v-list-item-subtitle>
                </v-list-item-content>

                <v-icon color="indigo" left>
                  mdi-road-variant
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.ingreso_concurrencia.via_ingreso}}</v-list-item-title>
                  <v-list-item-subtitle>Vía de ingreso</v-list-item-subtitle>
                </v-list-item-content>

                <v-icon color="indigo" left>
                  mdi-hospital-building
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.ingreso_concurrencia.rep.nombre}}</v-list-item-title>
                  <v-list-item-subtitle>Prestador</v-list-item-subtitle>
                </v-list-item-content>

                <v-icon color="indigo" left>
                  mdi-stethoscope
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.ingreso_concurrencia.unidad_funcional}}</v-list-item-title>
                  <v-list-item-subtitle>Unidad funcional</v-list-item-subtitle>
                </v-list-item-content>

              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item>
                <v-icon color="indigo" left>
                  mdi-arrow-u-left-bottom
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.ingreso_concurrencia.reingreso_15_dias}}</v-list-item-title>
                  <v-list-item-subtitle>Reingreso 15 días</v-list-item-subtitle>
                </v-list-item-content>
                <v-icon color="indigo" left>
                  mdi-arrow-u-left-bottom
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.ingreso_concurrencia.reingreso_30_dias}}</v-list-item-title>
                  <v-list-item-subtitle>Reingreso 30 días</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

            </v-list>
            <v-col cols="12"></v-col>
            <v-textarea readonly label="Nota de ingreso" auto-grow dense
              :value="datosLinea.ingreso_concurrencia.nota_seguimiento"></v-textarea>
          </v-card>
        </template>

        <!-- eventos -->
        <template v-if="datosLinea?.ingreso_concurrencia.evento.length > 0">
          <v-alert text dense border="left" color="blue-grey" icon="mdi-alert">Eventos</v-alert>
          <v-row align="center" dense>
            <v-item-group v-model="windowEventos" class="shrink mr-6" mandatory tag="v-flex">
              <v-item v-for="n in datosLinea.ingreso_concurrencia.evento" :key="n.id" v-slot="{ active, toggle }">
                <div>
                  <v-btn :input-value="active" icon @click="toggle">
                    <v-icon>mdi-record</v-icon>
                  </v-btn>
                </div>
              </v-item>
            </v-item-group>

            <v-col v-if="datosLinea?.ingreso_concurrencia?.evento">
              <v-window v-model="windowEventos" class="elevation-1" vertical>
                <v-window-item v-for="n in datosLinea.ingreso_concurrencia.evento" :key="n.id">
                  <v-card elevation="0">
                    <v-card-text>
                      <v-row dense>
                        <v-col cols="12">
                          <v-alert icon="mdi-account-edit" text dense color="info" border="left">
                            {{ n.evento }} | <small><b>{{ n.user.operador.nombre_completo }}</b> |
                              {{ n.created_at.substr(0, 10) }}</small>
                          </v-alert>
                        </v-col>
                      </v-row>
                      <v-textarea dense readonly auto-grow :value="n.observaciones"></v-textarea>
                      <v-row dense>
                        <v-col cols="1">
                          <v-chip small outlined color="info" class="ml-auto">{{ n.tipo_evento }}</v-chip>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-window-item>
              </v-window>
            </v-col>
          </v-row>
        </template>

        <!-- ordenes -->
        <template v-if="datosLinea?.ingreso_concurrencia.orden_concurrencias.length > 0">
          <v-col cols="12"></v-col>
          <v-alert text dense border="left" color="blue-grey" icon="mdi-bell-badge">Ordenamientos</v-alert>
          <v-row align="center" dense>
            <v-item-group v-model="windowOrdenes" class="shrink mr-6" mandatory tag="v-flex">
              <v-item v-for="n in datosLinea.ingreso_concurrencia.orden_concurrencias" :key="n.id"
                v-slot="{ active, toggle }">
                <div>
                  <v-btn :input-value="active" icon @click="toggle">
                    <v-icon>mdi-record</v-icon>
                  </v-btn>
                </div>
              </v-item>
            </v-item-group>

            <v-col v-if="datosLinea?.ingreso_concurrencia?.orden_concurrencias">
              <v-window v-model="windowOrdenes" class="elevation-1" vertical>
                <v-window-item v-for="n in datosLinea.ingreso_concurrencia.orden_concurrencias" :key="n.id">
                  <v-card elevation="0">
                    <v-card-text>
                      <v-row dense>
                        <v-col cols="12">
                          <v-alert icon="mdi-account-edit" text dense color="info" border="left">
                            <small><b>{{ n.user.operador.nombre_completo }}</b> | {{n.created_at.substr(0,10)}}
                            </small>
                          </v-alert>
                        </v-col>
                        <v-col cols="11">
                          <v-text-field dense readonly :value="n.cup.CodigoNombre" label="Servicio"></v-text-field>
                        </v-col>
                        <v-col cols="1">
                          <v-text-field dense readonly :value="n.cantidad" label="Cantidad"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <v-text-field dense readonly :value="n.costo" label="Costo"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-window-item>
              </v-window>
            </v-col>
          </v-row>
        </template>

        <!-- costo evitable -->
        <template v-if="datosLinea?.ingreso_concurrencia.costo_evitable.length > 0">
          <v-col cols="12"></v-col>
          <v-alert text dense border="left" color="blue-grey" icon="mdi-currency-usd-off">Costo evitable</v-alert>
          <v-row align="center" dense>
            <v-item-group v-model="windowOrdenes" class="shrink mr-6" mandatory tag="v-flex">
              <v-item v-for="n in datosLinea.ingreso_concurrencia.costo_evitable" :key="n.id"
                v-slot="{ active, toggle }">
                <div>
                  <v-btn :input-value="active" icon @click="toggle">
                    <v-icon>mdi-record</v-icon>
                  </v-btn>
                </div>
              </v-item>
            </v-item-group>

            <v-col v-if="datosLinea?.ingreso_concurrencia?.costo_evitable">
              <v-window v-model="windowOrdenes" class="elevation-1" vertical>
                <v-window-item v-for="n in datosLinea.ingreso_concurrencia.costo_evitable" :key="n.id">
                  <v-card elevation="0">
                    <v-card-text>
                      <v-row dense>
                        <v-col cols="12">
                          <v-alert icon="mdi-account-edit" text dense color="info" border="left">
                            {{n.costo}} | <b>{{ n.user.operador.nombre_completo }}</b> | {{n.created_at.substr(0, 10)}}
                          </v-alert>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea label="Descripción" readonly dense :value="n.descripcion" auto-grow></v-textarea>
                        </v-col>
                        <v-col cols="2">
                          <v-text-field readonly :value="n.valor" dense label="Valor"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <v-text-field readonly :value="n.objecion" dense label="Objeción"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-window-item>
              </v-window>
            </v-col>
          </v-row>
        </template>

        <!-- costo evitado -->
        <template v-if="datosLinea?.ingreso_concurrencia.costo_evitado.length > 0">
          <v-col cols="12"></v-col>
          <v-alert text dense border="left" color="blue-grey" icon="mdi-currency-usd">Costo evitado</v-alert>
          <v-row align="center" dense>
            <v-item-group v-model="windowOrdenes" class="shrink mr-6" mandatory tag="v-flex">
              <v-item v-for="n in datosLinea.ingreso_concurrencia.costo_evitado" :key="n.id"
                v-slot="{ active, toggle }">
                <div>
                  <v-btn :input-value="active" icon @click="toggle">
                    <v-icon>mdi-record</v-icon>
                  </v-btn>
                </div>
              </v-item>
            </v-item-group>

            <v-col v-if="datosLinea?.ingreso_concurrencia?.costo_evitado">
              <v-window v-model="windowOrdenes" class="elevation-1" vertical>
                <v-window-item v-for="n in datosLinea.ingreso_concurrencia.costo_evitado" :key="n.id">
                  <v-card elevation="0">
                    <v-card-text>
                      <v-row dense>
                        <v-col cols="12">
                          <v-alert icon="mdi-account-edit" text dense color="info" border="left">
                            {{n.costo}} | <b>{{ n.user.operador.nombre_completo }}</b>
                          </v-alert>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea readonly auto-grow dense :value="n.descripcion"></v-textarea>
                        </v-col>
                        <v-col cols="4">
                          <v-text-field readonly dense :value="n.valor"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <h4>
                            <v-chip v-if="n.tipo_alta" small>{{n.tipo_alta}}</v-chip>
                          </h4>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-window-item>
              </v-window>
            </v-col>
          </v-row>
        </template>

        <!-- concurrencia -->
        <template>
          <v-col cols="12"></v-col>
          <v-card elevation="0" v-if="datosLinea">
            <v-alert icon="mdi-bed-clock" text dense border="left" color="blue-grey">Concurrencia |
              <small><b>{{datosLinea.user.operador.nombre_completo}}</b></small></v-alert>

            <v-list two-line dense>
              <v-list-item>
                <v-icon color="indigo" left>
                  mdi-calendar-range
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.fecha_egreso.substr(0,10)}}
                  </v-list-item-title>
                  <v-list-item-subtitle>Fecha de egreso</v-list-item-subtitle>
                </v-list-item-content>

                <v-icon color="indigo" left>
                  mdi-hospital-box-outline
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.destino_egreso}}</v-list-item-title>
                  <v-list-item-subtitle>Destino de egreso</v-list-item-subtitle>
                </v-list-item-content>

                <v-icon color="indigo" left>
                  mdi-virus
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.hospitalizacion_evitable}}</v-list-item-title>
                  <v-list-item-subtitle>hospitalización evitable</v-list-item-subtitle>
                </v-list-item-content>

                <v-icon color="indigo" left>
                  mdi-doctor
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.reporte_patologia_diagnostica}}</v-list-item-title>
                  <v-list-item-subtitle>Reporte patología diagnostica</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item>

                <v-icon color="indigo" left>
                  mdi-currency-usd
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.alto_costo}}</v-list-item-title>
                  <v-list-item-subtitle>Alto costo</v-list-item-subtitle>
                </v-list-item-content>

                <v-icon color="indigo" left>
                  mdi-file-document-alert-outline
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.numero_factura}}</v-list-item-title>
                  <v-list-item-subtitle>Número factura</v-list-item-subtitle>
                </v-list-item-content>

                <v-icon color="indigo" left>
                  mdi-hospital-building
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.cie10.Codigo_Nombre}}</v-list-item-title>
                  <v-list-item-subtitle>Diagnóstico concurrencia</v-list-item-subtitle>
                </v-list-item-content>

                <v-icon color="indigo" left>
                  mdi-stethoscope
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>{{datosLinea.dx_egreso.Codigo_Nombre}}</v-list-item-title>
                  <v-list-item-subtitle>Diagnóstico de egreso</v-list-item-subtitle>
                </v-list-item-content>

              </v-list-item>

              <v-divider inset></v-divider>

            </v-list>
          </v-card>
        </template>

        <!-- seguimientos -->
        <template v-if="datosLinea?.seguimientos.length > 0">
          <v-col cols="12"></v-col>
          <v-alert text dense border="left" color="blue-grey" icon="mdi-magnify-plus-outline">Seguimientos</v-alert>
          <v-row align="center" dense>
            <v-item-group v-model="windowSeguimientos" class="shrink mr-6" mandatory tag="v-flex">
              <v-item v-for="n in datosLinea.seguimientos" :key="n.id" v-slot="{ active, toggle }">
                <div>
                  <v-btn :input-value="active" icon @click="toggle">
                    <v-icon>mdi-record</v-icon>
                  </v-btn>
                </div>
              </v-item>
            </v-item-group>

            <v-col v-if="datosLinea?.seguimientos">
              <v-window v-model="windowSeguimientos" class="elevation-1" vertical>
                <v-window-item v-for="n in datosLinea.seguimientos" :key="n.id">
                  <v-card elevation="0">
                    <v-card-text>
                      <v-row dense>
                        <v-col cols="10">
                          <v-alert icon="mdi-account-edit" text dense color="info" border="left">
                            <small><b>{{ n.usuario_crea.operador.nombre_completo }}</b></small>
                          </v-alert>
                        </v-col>
                        <v-col cols="2">
                          <v-chip outlined color="info" class="ml-auto">{{ n.created_at.substr(0,10) }}</v-chip>
                        </v-col>
                      </v-row>
                      <v-textarea readonly dense :value="n.notas" auto-grow></v-textarea>
                      <template>
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-center" style="color:#2962FF">
                                  NOTA AUDITORÍA ALTO COSTO
                                </th>
                                <v-divider dark inset></v-divider>
                                <th class="text-center" style="color:#2962FF">
                                  NOTA DIRECCIÓN DE SERVICIOS DE SALUD
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <td>{{ n.nota_aac }}</td>
                              <v-divider dark inset></v-divider>
                              <td>{{ n.nota_dss }}</td>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </template>
                    </v-card-text>
                  </v-card>
                </v-window-item>
              </v-window>
            </v-col>
          </v-row>
        </template>

        <!-- cambios -->
        <template v-if="datosLinea?.cambios_concurrencias.length > 0">
          <v-col cols="12"></v-col>
          <v-alert text dense border="left" color="blue-grey" icon="mdi-timeline-alert">Cambios línea temporal</v-alert>
          <v-row align="center" dense>
            <v-item-group v-model="windowCambios" class="shrink mr-6" mandatory tag="v-flex">
              <v-item v-for="n in datosLinea.cambios_concurrencias" :key="n.id" v-slot="{ active, toggle }">
                <div>
                  <v-btn :input-value="active" icon @click="toggle">
                    <v-icon>mdi-record</v-icon>
                  </v-btn>
                </div>
              </v-item>
            </v-item-group>

            <v-col v-if="datosLinea?.cambios_concurrencias">
              <v-window v-model="windowCambios" class="elevation-1" vertical>
                <v-window-item v-for="n in datosLinea.cambios_concurrencias" :key="n.id">
                  <v-card elevation="0">
                    <v-card-text>
                      <v-row dense>
                        <v-col cols="12">
                          <v-alert icon="mdi-account-edit" text dense color="info" border="left">
                            <small><b>{{ n.user.operador.nombre_completo }}</b> | {{n.fecha_aplicacion}}</small>
                          </v-alert>
                        </v-col>
                      </v-row>
                      <h4>{{n.actualizacion}}</h4>
                    </v-card-text>
                  </v-card>
                </v-window-item>
              </v-window>
            </v-col>
          </v-row>
        </template>

      </v-container>

    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'WorkspaceJsonLineaTiempo',

    data() {
      return {
        datosLinea: null,
        filtro: {
          concurrencia_id: null
        },
        windowOrdenes: 0,
        windowEventos: 0,
        windowSeguimientos: 0,
        windowCambios: 0,
      };
    },

    mounted() {

    },

    methods: {
      buscarConcurrencia() {
        this.$axios.post('/linea-tiempo-concurrencia/listarLinea', this.filtro)
          .then(res => {
            this.datosLinea = res.data;
          }).catch(e => {
            console.log(e);
          })
      },
    },
  };

</script>
