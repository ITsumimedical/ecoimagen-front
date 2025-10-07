<template>
  <div>
    <template>
      <div class="text-center">
        <v-dialog v-model="preload" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <v-row>
      <v-col cols="12" sm="12" md="12">

        <v-row dense>
          <v-col cols="12" sm="6" md="6">
            <v-card color="red" @click="aplicacionesPendientes=true, aplicaciones=false">
              <v-card-text class="pa-0">
                <v-container class="pa-0">

                  <div class="layout row ma-0">
                    <div class="sm4 xs4 ">
                      <div class="layout column ma-0 justify-center align-center">
                        <v-icon size="76px" color="white" style="opacity: 0.8;">mdi-needle-off</v-icon>
                      </div>
                    </div>
                    <div class="layout column ma-0 justify-center" style="color: white;">
                      <span class="caption">Aplicaciones pendientes</span>
                      <div class="headline">{{ordenes.length}}</div>
                      <span class="caption">Hasta la fecha</span>
                    </div>
                  </div>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-card color="#00b297" @click="aplicacionesPendientes=false, aplicaciones=true">

              <v-card-text class="pa-0">
                <v-container class="pa-0">

                  <div class="layout row ma-0">
                    <div class="sm4 xs4 ">
                      <div class="layout column ma-0 justify-center align-center">
                        <v-icon size="76px" color="white" style="opacity: 0.8;">mdi-needle</v-icon>
                      </div>
                    </div>
                    <div class="layout column ma-0 justify-center" style="color: white;">
                      <span class="caption">Aplicaciones</span>
                      <div class="headline">{{ordenesAgendadas.length}}</div>
                      <span class="caption">Hasta la fecha</span>
                    </div>
                  </div>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-card v-show="aplicacionesPendientes">
        <agendarOncologia/>
      </v-card>

        <!-- <v-row dense v-show="aplicacionesPendientes">
          <v-col cols="12" sm="12" md="12">

            <v-alert dense text border="left" color="primary" icon="mdi-hospital-building" class="text-center">
              <b>Aplicaciones pendientes</b>
            </v-alert>
            <v-data-table dense :headers="headerconsultas" :items="ordenes" class="elevation-1" hide-default-footer
              disable-pagination>
              <template v-slot:[`item.acciones`]="{ item }">
                <td class="text-center">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon color="blue" v-on="on" v-bind="attrs"
                        @click="datosAplicaciones(item.ordenes,item.afiliado,item.id)">
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </template>
                    <span>Aplicaciones</span>
                  </v-tooltip>
                </td>
                <td class="text-center">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon color="success" v-on="on" v-bind="attrs" @click="print(item.id)">
                        <v-icon>mdi-file-document-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Imprimir historia</span>
                  </v-tooltip>
                </td>
              </template>
            </v-data-table>
            <v-row no-gutters>
              <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                <v-pagination v-model="paginaOrden" class="my-4" :length="totalOrden" :total-visible="9"
                  @input="buscarOrdenes">
                </v-pagination>
              </v-col>
              <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                <v-select class="my-4" v-model="opcionActualOrden" :items="opcionesOrden" dense solo small
                  @change="buscarOrdenes">
                </v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-row> -->

        <v-row dense v-show="aplicaciones">
          <v-col cols="12" sm="12" md="12">
            <v-card>

              <v-card-text>
                <v-alert dense text border="left" color="primary" icon="mdi-hospital-building" class="text-center">
                  <b>Aplicaciones</b>
                </v-alert>
                <v-row dense>
                  <v-col cols="12" sm="12" md="6">
                    <v-text-field v-model="fecha_agendamiento" label="Fecha" type="date"
                      @keyup.enter="buscarApiacaiones()">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" class="pa-6">
                    <v-btn color="success" small dark @click="buscarApiacaiones()">Buscar</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-col cols="12" sm="12" md="12" v-if="ordenesAgendadas.length >0">
                <v-data-table dense :headers="headerOrdenesAgendadas" :items="ordenesAgendadas" hide-default-footer
                  disable-pagination>
                  <template v-slot:[`item.estado_id`]="{ item }">
                    <td v-if="item.estado_id == 1">
                      <v-chip small color="success" text-color="white">{{item.estado }}</v-chip>
                    </td>
                    <td v-else-if="item.estado_id == 49" class="text-xs-center">
                      <v-chip small color="success" text-color="white">{{item.estado }}</v-chip>
                    </td>
                    <td v-else-if="item.estado_id == 50" class="text-xs-center">
                      <v-chip small color="red" text-color="white">{{item.estado }}</v-chip>
                    </td>
                    <td v-else-if="item.estado_id == 3">
                      <v-chip color="warning" text-color="white">{{item.estado }}</v-chip>
                    </td>
                    <td v-else-if="item.estado_id == 4">
                      <v-chip color="success" text-color="white">{{item.estado }}</v-chip>
                    </td>
                    <td v-else>
                      <v-chip color="red" small text-color="white">{{item.estado }}</v-chip>
                    </td>
                  </template>
                  <template v-slot:[`item.acciones`]="{ item }">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                          @click="detalleOrdenOrdenadas(item.articulos)">
                          mdi-file-eye-outline
                        </v-icon>
                      </template>
                      <span>Detalle orden</span>
                    </v-tooltip>
                    <v-tooltip top v-if="item.estado_id != 49 && item.estado_id != 50">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="success" class="mr-2" v-bind="attrs" v-on="on" @click="notas(item)">
                          mdi-file-document-edit-outline
                        </v-icon>
                      </template>
                      <span>Notas</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="warning" class="mr-2" v-on="on" v-bind="attrs"
                          @click="print(item.consulta_id)">
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                      </template>
                      <span>Imprimir historia</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on" @click="imprimir(item.id)">
                          mdi-printer
                        </v-icon>
                      </template>
                      <span>Imprimir orden</span>
                    </v-tooltip>
                    <v-tooltip top v-if="item.estado_id != 49 && item.estado_id != 50">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="red" class="mr-2" v-bind="attrs" v-on="on"
                          @click="ordenarAplicaiones(item.consulta_id)">
                          mdi-medical-bag
                        </v-icon>
                      </template>
                      <span>Insumos</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
                <v-row no-gutters>
                  <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                    <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                      @input="buscarApiacaiones">
                    </v-pagination>
                  </v-col>
                  <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                      @change="buscarApiacaiones">
                    </v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="dialogoOrdenes" persistent max-width="1000px">
          <v-card>
            <v-alert dense text outlined color="primary" icon="mdi-order-bool-descending-variant" class="text-center">
              <b>Ordenes</b>
            </v-alert>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" sm="12" md="12">
                  <!-- <v-text-field v-model="buscarFactura" label="Buscar"  append-icon="mdi-magnify">

                </v-text-field> -->
                  <v-data-table dense :headers="headersOrdens" :items="listaOrdenesOncologia"
                    loading-text="Cargando... por favor espere">
                    <template v-slot:[`item.fechaAutorizacion`]="{ item }">
                      <td>
                        {{item.articulos[0].fechaAutorizacion?item.articulos[0].fechaAutorizacion.substring(0,10):"Sin Autorizar" }}
                      </td>
                    </template>
                    <template v-slot:[`item.estado_id`]="{ item }">
                      <td v-if="item.estado_id == 1" class="text-xs-center">
                        <v-chip small color="success" text-color="white">{{item.estado }}</v-chip>
                      </td>
                      <td v-else-if="item.estado_id == 3" class="text-xs-center">
                        <v-chip color="warning" text-color="white">{{item.estado }}</v-chip>
                      </td>
                      <td v-else-if="item.estado_id == 4" class="text-xs-center">
                        <v-chip color="success" text-color="white">{{item.estado }}</v-chip>
                      </td>
                      <td v-else class="text-xs-center">
                        <v-chip color="red" text-color="white">{{item.estado }}</v-chip>
                      </td>
                    </template>
                    <template v-slot:[`item.agendamiento`]="{ item }">
                      <td v-if="item.fecha_agendamiento">{{item.fecha_agendamiento.substring(0,10)}}</td>
                      <td class="text-xs-center" v-else>
                        <v-btn rounded color="primary" small @click="agendar(item.id)" dark>Asignar
                        </v-btn>
                      </td>
                    </template>
                    <template v-slot:[`item.acciones`]="{ item }">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                            @click="detalleOrden(item.articulos)">
                            mdi-file-eye
                          </v-icon>
                        </template>
                        <span>Detalle orden</span>
                      </v-tooltip>
                      <v-tooltip top v-if="aplicaciones">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon color="success" class="mr-2" v-bind="attrs" v-on="on" @click="dialogoNotas =true">
                            mdi-file-document-edit-outline
                          </v-icon>
                        </template>
                        <span>Notas</span>
                      </v-tooltip>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on" @click="imprimir(item.id)">
                            mdi-printer
                          </v-icon>
                        </template>
                        <span>Imprimir orden</span>
                      </v-tooltip>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" @click="cerrarDialogoOrden()">
                Cancelar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogoDetalleOrdenes" persistent max-width="1000px">
          <v-card>
            <v-alert dense text outlined color="primary" icon="mdi-order-bool-descending-variant" class="text-center">
              <b>Detalle orden</b>
            </v-alert>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" sm="12" md="12">
                  <v-data-table dense :headers="headerDetalle" :items="listaDetalleOrden"
                    loading-text="Cargando... por favor espere">
                    <template v-slot:[`item.estado_id`]="{ item }">
                      <td v-if="item.estado_id == 1">
                        <v-chip small color="success" text-color="white">{{item.estado.nombre }}</v-chip>
                      </td>
                      <td v-else-if="item.estado_id == 49" class="text-xs-center">
                        <v-chip small color="success" text-color="white">{{item.estado.nombre }}</v-chip>
                      </td>
                      <td v-else-if="item.estado_id == 50" class="text-xs-center">
                        <v-chip small color="red" text-color="white">{{item.estado.nombre }}</v-chip>
                      </td>
                      <td v-else-if="item.estado_id == 3">
                        <v-chip color="warning" small text-color="white">{{item.estado.nombre }}</v-chip>
                      </td>
                      <td v-else-if="item.estado_id == 4">
                        <v-chip color="success" text-color="white">{{item.estado.nombre }}</v-chip>
                      </td>
                      <td v-else>
                        <v-chip color="red" small text-color="white">{{item.estado.nombre }}</v-chip>
                      </td>
                    </template>
                    <template v-slot:[`item.calculoCantidad`]="{ item }">
                      <td>
                        {{Math.round(item.cantidad_medico)}}
                      </td>
                    </template>
                    <template v-slot:[`item.calculoFrecuencia`]="{ item }">
                      <td>
                        {{item.frecuencia}} / {{item.unidad_tiempo}}
                      </td>
                    </template>
                  </v-data-table>

                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" @click="cerrarDialogoDetalle()">
                Cancelar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogoDetalleOrdenesOrdenadas" persistent max-width="1000px"
          v-if="dialogoDetalleOrdenesOrdenadas">
          <v-card>
            <v-alert dense text outlined color="primary" icon="mdi-order-bool-descending-variant" class="text-center">
              <b>Detalle orden</b>
            </v-alert>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" sm="12" md="12">
                  <v-data-table dense :headers="headerDetalle" :items="listaDetalleOrden">
                    <template v-slot:[`item.estado_id`]="{ item }">
                      <td v-if="item.estado_id == 1">
                        <v-chip small color="success" text-color="white">{{item.estado.nombre }}</v-chip>
                      </td>
                      <td v-else-if="item.estado_id == 49" class="text-xs-center">
                        <v-chip small color="success" text-color="white">{{item.estado.nombre }}</v-chip>
                      </td>
                      <td v-else-if="item.estado_id == 50" class="text-xs-center">
                        <v-chip small color="red" text-color="white" @click="observacionSuspension(item.auditorias[0])">
                          {{item.estado.nombre }}</v-chip>
                      </td>
                      <td v-else-if="item.estado_id == 3">
                        <v-chip color="warning" text-color="white">{{item.estado.nombre }}</v-chip>
                      </td>
                      <td v-else-if="item.estado_id == 4">
                        <v-chip color="success" text-color="white">{{item.estado.nombre }}</v-chip>
                      </td>
                      <td v-else>
                        <v-chip color="red" small text-color="white">{{item.estado.nombre }}</v-chip>
                      </td>
                    </template>
                    <template v-slot:[`item.calculoCantidad`]="{ item }">
                      <td>
                        {{Math.round(item.cantidad_medico)}}
                      </td>
                    </template>
                    <template v-slot:[`item.calculoFrecuencia`]="{ item }">
                      <td>
                        {{item.frecuencia}} / {{item.unidad_tiempo}}
                      </td>
                    </template>
                    <template v-slot:[`item.eliminar`]="{ item }">
                      <td class="text-center"
                        v-if="item.estado_id != 49 && item.estado_id != 50 && listaDetalleOrden[0].estado_id != 30">
                        <v-btn class="mx-2" fab dark x-small color="error" @click="eliminar(item)">
                          <v-icon dark>mdi-close</v-icon>
                        </v-btn>
                      </td>
                    </template>
                  </v-data-table>

                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" small @click="cerrarDialogoDetalleAgendadas()">
                Cancelar
              </v-btn>
              <v-btn color="warning" small @click="finalizarAplicacion()"
                v-if="listaDetalleOrden[0].estado_id != 49 && listaDetalleOrden[0].estado_id != 50 && listaDetalleOrden[0].estado_id != 30">
                Finalizar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogoAgendamiento" max-width="1250px" v-if="dialogoAgendamiento">
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert dense text outlined color="primary" icon="mdi-text-box-multiple-outline" class="text-center">
                <b>Agendamiento</b>
              </v-alert>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <Agendamiento :docuemntoAfiliado="paciente.numero_documento" :enfermeria="true"
                        :orden_id="orden_id" @finalAgendamiento="finalAgendamiento()" />
                    </v-col>

                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small @click="cerrarDialogoAgendamiento()">
                  Cancelar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-container>
        </v-dialog>

        <v-dialog v-model="dialogoObservacionSuspension" width="500px" v-if="dialogoObservacionSuspension">
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert dense text outlined color="primary" icon="mdi-text-box-multiple-outline" class="text-center">
                <b>Auditoria</b>
              </v-alert>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <span><b>Observacion: </b>{{observacionSuspensionText}}
                      </span>
                    </v-col>

                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small @click="dialogoObservacionSuspension=false">
                  Cancelar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-container>
        </v-dialog>

        <v-dialog v-model="dialogoNotas" max-width="1250px" v-if="dialogoNotas">
          <v-container fluid class="pa-0">
            <v-card>

              <v-alert dense text outlined color="primary" icon="mdi-text-box-multiple-outline" class="text-center">
                <b>Notas de enfermeria</b>
                <v-spacer></v-spacer>
              </v-alert>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small @click="cerrarDialogoNotas()">
                  Cerrar
                </v-btn>
              </v-card-actions>

              <v-card-text>

                <v-row>
                  <v-tabs centered show-arrows>
                    <v-tab>
                      <v-icon left>mdi-card-account-details-outline</v-icon>
                      Crear Nota
                    </v-tab>
                    <v-tab>
                      <v-icon left>mdi-card-account-details-outline</v-icon>

                      <v-badge color="primary" :content="listaNotas.length" v-if="listaNotas.length">
                        <b> Historico Notas</b>
                      </v-badge>
                      <v-badge color="primary" content="0" v-else>
                        <b> Historico Notas</b>
                      </v-badge>
                    </v-tab>
                    <v-tab-item>
                      <v-card>
                        <v-card-text>
                          <v-row>
                            <v-col cols="12" sm="6" md="12">
                              <v-textarea dense v-model="formNota.nota" auto-grow label="Nota"></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-textarea dense v-model="formNota.signos_alarma" auto-grow label="Signos de alarma">
                              </v-textarea>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-textarea dense v-model="formNota.cuidados_casa" auto-grow label="Cuidados en casa">
                              </v-textarea>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-textarea dense v-model="formNota.caso_urgencias" auto-grow label="Caso de urgencia">
                              </v-textarea>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-textarea dense v-model="formNota.alimentacion" auto-grow label="Alimentación">
                              </v-textarea>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-textarea dense v-model="formNota.efectos_secundarios" auto-grow
                                label="Efectos secundarios">
                              </v-textarea>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-textarea dense v-model="formNota.habito_higiene" auto-grow label="Habito higiene">
                              </v-textarea>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-textarea dense v-model="formNota.derechos_deberes" auto-grow label="Derechos deberes">
                              </v-textarea>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-textarea dense v-model="formNota.normas_sala_quimioterapia" auto-grow
                                label="Normas sala quimioterapía">
                              </v-textarea>
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="success" dark small @click="guardarNota()">
                            Guardar
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-tab-item>
                    <v-tab-item>
                      <v-card>
                        <v-card-text>
                          <div v-show="listaNotas.length ==0" class="text-xs-center">
                            <h3>Sin Notas</h3>
                          </div>
                          <v-expansion-panels focusable>
                            <v-expansion-panel v-for="item in listaNotas" :key="item.id">
                              <v-expansion-panel-header>
                                <h5>Nota # {{ item.id }} realizada el día {{item.created_at.substring(0,10)}} por
                                  {{item.primer_nombre}} {{ }} {{item.segundo_nombre}} {{ }} {{item.primer_apellido}}
                                  {{ }} {{item.segundo_apellido}}</h5>
                              </v-expansion-panel-header>
                              <v-expansion-panel-content>
                                <div>
                                  <h4>Alimentación</h4>
                                </div>
                                <div>
                                  <p>{{item.alimentacion}}</p>
                                </div>
                                <div>
                                  <h4>Caso de Urgencia</h4>
                                </div>
                                <div>
                                  <p>{{item.caso_urgencias}}</p>
                                </div>
                                <div>
                                  <h4>Cuidados en Casa</h4>
                                </div>
                                <div>
                                  <p>{{item.cuidados_casa}}</p>
                                </div>
                                <div>
                                  <h4>Derechos y Deberes</h4>
                                </div>
                                <div>
                                  <p>{{item.derechos_deberes}}</p>
                                </div>
                                <div>
                                  <h4>Efectos Secundarios</h4>
                                </div>
                                <div>
                                  <p>{{item.efectos_secundarios}}</p>
                                </div>
                                <div>
                                  <h4>Hábitos de Higiene</h4>
                                </div>
                                <div>
                                  <p>{{item.habito_higiene}}</p>
                                </div>
                                <div>
                                  <h4>Normas Sala Quimioterapia</h4>
                                </div>
                                <div>
                                  <p>{{item.normas_sala_quimioterapia}}</p>
                                </div>
                                <div>
                                  <h4>Nota</h4>
                                </div>
                                <div>
                                  <p>{{item.nota}}</p>
                                </div>
                                <div>
                                  <h4>Signos de Alarma</h4>
                                </div>
                                <div>
                                  <p>{{item.signos_alarma}}</p>
                                </div>

                              </v-expansion-panel-content>
                            </v-expansion-panel>

                          </v-expansion-panels>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>
                  </v-tabs>
                </v-row>
              </v-card-text>

            </v-card>
          </v-container>
        </v-dialog>
      </v-col>
      <template>
        <v-col cols="12" sm="12" md="12">
          <ordenamientoComponet :consulta="consulta_id" :habilitarBoton="false" :dialog="ordenamiento"
            @respuestaComponente="respuestaComponente()" />
        </v-col>
      </template>
    </v-row>
  </div>
</template>

<script>
  import ordenamientoComponet from '~/components/ordenamiento/ordenamiento.vue'
  import agendarOncologia from '~/components/agendamientoOncologia/agendamientoOncologia.vue'
  import moment from 'moment'
  import Agendamiento from '~/pages/cita/agendamiento.vue'
  export default {
    name: 'WorkspaceJsonEnfermeria',
    components: {
      Agendamiento,
      ordenamientoComponet,
      agendarOncologia
    },
    data() {
      return {
        observacionSuspensionText: '',
        dialogoAplicaciones: false,
        consulta_id: '',
        ordenamiento: false,
        dialogoDetalleOrdenesOrdenadas: false,
        detalleSeleccionado: [],
        preload: false,
        fecha_agendamiento: moment().format('YYYY-MM-DD'),
        aplicacionesPendientes: false,
        aplicaciones: false,
        ordenes: [],
        ordenesAgendadas: [],
        headerconsultas: [{
            text: "Consulta",
            sortable: false,
            align: "center",
            value: "id"
          }, {
            text: "N.Documento",
            sortable: false,
            align: "center",
            value: "afiliado.numero_documento"
          }, {
            text: "Paciente",
            sortable: false,
            align: "center",
            value: "afiliado.nombre_completo"
          },
          {
            text: "Entidad",
            sortable: false,
            align: "center",
            value: "afiliado.entidad.nombre"
          }, , {
            text: "Esquema",
            sortable: false,
            align: "center",
            value: "nombre_esquema"

          }, {
            text: "Acciones",
            sortable: false,
            align: "",
            value: "acciones"
          }
        ],
        headerOrdenesAgendadas: [{
            text: "Orden",
            sortable: false,
            align: "center",
            value: "id"
          }, {
            text: "N.Documento",
            sortable: false,
            align: "center",
            value: "consulta.afiliado.numero_documento"
          }, {
            text: "Paciente",
            sortable: false,
            align: "center",
            value: "consulta.afiliado.nombre_completo"
          },
          {
            text: "Entidad",
            sortable: false,
            align: "center",
            value: "consulta.afiliado.entidad.nombre"
          },
          {
            text: "Esquema",
            sortable: false,
            align: "center",
            value: "nombre_esquema"

          },
          {
            text: "Ciclos",
            sortable: false,
            align: "center",
            value: "paginacion"
          }, {
            text: "Dia",
            sortable: false,
            align: "center",
            value: "dia"
          }, {
            text: "Estado",
            sortable: false,
            align: "",
            value: "estado_id"
          }, {
            text: "Fecha Agendamiento",
            sortable: false,
            align: "",
            value: "fecha_agendamiento"
          },
          {
            text: "Acciones",
            sortable: false,
            align: "center",
            value: "acciones"
          },

        ],
        headersOrdens: [{
          text: "Orden",
          sortable: false,
          align: "center",
          value: "id"
        }, {
          text: "Ciclos",
          sortable: false,
          align: "center",
          value: "paginacion"
        }, {
          text: "Dia",
          sortable: false,
          align: "center",
          value: "dia"
        }, {
          text: "F.Auditoria",
          sortable: false,
          align: "",
          value: "fechaAutorizacion"
        }, {
          text: "Estado",
          sortable: false,
          align: "",
          value: "estado_id"
        }, {
          text: "Fecha Agendamiento",
          sortable: false,
          align: "",
          value: "agendamiento"
        }, {
          text: "Acciones",
          sortable: false,
          align: "center",
          value: "acciones"
        }],
        headerDetalle: [{
            text: "Id",
            sortable: false,
            align: "center",
            value: "id"
          }, {
            text: "CodeSumi",
            sortable: false,
            align: "center",
            value: "codesumi.codigo"
          }, {
            text: "Medicamento",
            sortable: false,
            align: "center",
            value: "codesumi.nombre"
          }, {
            text: "Via",
            sortable: false,
            align: "center",
            value: "codesumi.via"
          }, {
            text: "Cantidad",
            sortable: false,
            align: "center",
            value: "calculoCantidad"
          }, {
            text: "Frecuencia",
            sortable: false,
            align: "center",
            value: "calculoFrecuencia"
          }, {
            text: "Observación",
            sortable: false,
            align: "center",
            value: "observacion"
          },
          {
            text: "Estado",
            sortable: false,
            align: "center",
            value: "estado_id"
          },
          {
            text: "",
            sortable: false,
            align: "center",
            value: "eliminar"
          }
        ],
        paciente: {

        },
        datos: {

        },
        dialogoObservacionSuspension: false,
        formNota: {},
        dialogoOrdenes: false,
        dialogoDetalleOrdenes: false,
        dialogoAgendamiento: false,
        listaOrdenesOncologia: [],
        dialogoNotas: false,
        listaDetalleOrden: [],
        listaNotas: [],
        orden_id: '',
        pagina: 1,
        total: 0,
        opciones: [5, 10, 20, 50, 100],
        opcionActual: 5,
        paginaOrden: 1,
        totalOrden: 0,
        opcionesOrden: [5, 10, 20, 50, 100],
        opcionActualOrden: 5,
        ordenAgendada_id: ''
      };
    },

    mounted() {
      this.buscarOrdenes()

    },

    methods: {
      buscarOrdenes() {
        this.preload = true;
        this.$axios.$post('/consultas/aplicacionesPendientes?page=' + this.paginaOrden + '&cant=' + this
          .opcionActualOrden).then(res => {
          this.ordenes = res.data;
          this.totalOrden = res.last_page;
          this.preload = false;
        }).catch(e => {
          this.preload = false;
        })
      },

      buscarApiacaiones() {
        this.preload = true;
        this.$axios.$post('/ordenamiento/aplicacionesAgendadas?page=' + this.pagina + '&cant=' + this.opcionActual, {
          fecha_agendamiento: this.fecha_agendamiento
        }).then(res => {
          this.ordenesAgendadas = res.data;
          this.total = res.last_page;
          this.preload = false;
          if (this.ordenesAgendadas.length == 0) {
            this.$toast.error('No hay aplicaciones en esta fecha')
          }
        }).catch(e => {
          this.preload = false;
        })
      },

      datosAplicaciones(ordenes, afiliado, id_consulta) {
        console.log('dfdfd', ordenes);
        this.paciente = afiliado
        this.datos.consulta_padre = id_consulta
        this.listaOrdenesOncologia = ordenes
        this.dialogoOrdenes = true
      },

      detalleOrden(item) {
        this.listaDetalleOrden = item
        this.dialogoDetalleOrdenes = true
      },
      detalleOrdenOrdenadas(item) {
        this.listaDetalleOrden = item
        this.dialogoDetalleOrdenesOrdenadas = true
      },

      cerrarDialogoDetalle() {
        this.dialogoDetalleOrdenes = false
      },
      cerrarDialogoDetalleAgendadas() {
        this.dialogoDetalleOrdenesOrdenadas = false
        this.buscarApiacaiones()
      },

      cerrarDialogoOrden() {
        this.dialogoOrdenes = false
      },

      agendar(item) {
        this.dialogoAgendamiento = true
        this.orden_id = item

      },

      cerrarDialogoAgendamiento() {
        this.dialogoAgendamiento = false
        this.orden_id = ''
      },

      finalAgendamiento() {
        this.dialogoAgendamiento = false
        this.dialogoOrdenes = false
        this.orden_id = ''
        this.buscarOrdenes()
      },

      async print(pdf) {
        await this.$axios.post('pdf', {
          consulta: pdf,
          tipo: 'historia'
        }, {
          responseType: "arraybuffer"
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/pdf"
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        });
      },

      cerrarDialogoNotas() {
        this.dialogoNotas = false
        this.ordenAgendada_id = ''
      },

      notas(item) {
        this.ordenAgendada_id = item.id
        this.listarNotas();
        this.dialogoNotas = true
      },

      listarNotas() {
        this.preload = true;
        this.$axios.$post('/nota_enfermeria/listar', {
          orden_id: this.ordenAgendada_id
        }).then(res => {
          this.listaNotas = res;
          this.preload = false;
        }).catch(e => {
          this.preload = false;
        })
      },

      limpiarFormulario() {
        for (const key in this.formNota) {
          this.formNota[key] = ''
        }
      },

      guardarNota() {
        this.preload = true;
        this.formNota.orden_id = this.ordenAgendada_id
        this.formNota.user_id = this.$store.state.auth.usuario.id
        this.$axios.$post('/nota_enfermeria/guardar', this.formNota).then(res => {
          this.preload = false
          this.listarNotas()
          this.limpiarFormulario()
          this.$toast.success('Nota creada con exito')

        }).catch(e => {
          this.preload = false;
        })
      },

      imprimir(item) {
        const data = {
          id: item,
          tipo: 'medicamento'
        }
        this.$axios.post('pdf', data, {
          responseType: "arraybuffer"
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/pdf"
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        });
      },

      eliminar(index) {
        this.listaDetalleOrden.splice(index, 1)

      },

      ordenarAplicaiones(item) {
        this.consulta_id = parseInt(item)
        // this.dialogoAplicaciones = true
        this.ordenamiento = true

      },

      respuestaComponente() {
        // this.consulta_id =''
        this.ordenamiento = false
        console.log('dfdf');
        ''
      },

      finalizarAplicacion() {
        this.preload = true
        this.$axios.$post('/ordenamiento/finalizarAplicacion', {
          orden_id: this.listaDetalleOrden[0].orden_id,
          orden_articulo: this.listaDetalleOrden
        }).then(res => {
          this.preload = false
          this.cerrarDialogoDetalleAgendadas()
          // this.limpiarFormulario()
          this.$toast.success('Aplicación finalizada con exito')

        }).catch(e => {
          this.preload = false;
        })
      },

      observacionSuspension(auditoria) {
        this.dialogoObservacionSuspension = true
        this.observacionSuspensionText = auditoria.nota_autorizacion
      }
    },
  };

</script>
