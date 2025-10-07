<template>
  <div>
    <v-data-table dense :headers="headers" :search="buscarContrato" :items="contratos" sort-by="id" :loading="loading"
      loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:[`item.activo`]="{ item }">
        <v-chip small :color="chipContratoActivo(item.activo)" dark>
          {{ item.activo == '1' ? 'Vigente' : 'No vigente' }}</v-chip>
      </template>
      <template v-slot:top>
        <v-card-title>
          <v-btn small v-if="$can('contratoEmpleado.crear')" color="boton" class="mb-2 white--text"
            @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-subheader>Contratos</v-subheader>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarContrato" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="1000px" persistent>
          <v-container fluid class="pa-0">
            <v-card>
              <form @submit.prevent="guardarContrato">
                <v-container>
                  <v-row>
                    <v-col>
                      <v-alert border="left" type="info" dense text icon="mdi-file-document-edit">Formulario de
                        {{titulo}}</v-alert>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="3" md="3">
                            <v-autocomplete dense :items="tiposContratos" v-model="contrato.tipo_contrato_id"
                              :error-messages="errors.tipo_contrato_id" item-text="nombre" item-value="id"
                              label="Tipo de contrato"></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="3" md="3" v-if="contrato.tipo_contrato_id == 3">
                            <v-text-field dense v-model="contrato.descripcion_obra_labor"
                              label="Obra o labor por la cuál se contrata"
                              hint="Nombre de la obra o labor a la cuál se dirige el contrato del empleado"
                              :error-messages="errors.descripcion_obra_labor">
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3" md="3">
                            <v-text-field dense v-model="contrato.fecha_ingreso" :error-messages="errors.fecha_ingreso"
                              label="Fecha Ingreso" type="date">
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3" md="3">
                            <v-text-field dense v-model="contrato.fecha_vencimiento"
                              :error-messages="errors.fecha_vencimiento" label="Fecha vencimiento" type="date">
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3" md="3">
                            <v-text-field dense v-model="contrato.fecha_retiro" :error-messages="errors.fecha_retiro"
                              label="Fecha retiro" type="date">
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3" md="3">
                            <v-text-field dense v-model="contrato.fecha_fin_periodo_prueba"
                              :error-messages="errors.fecha_fin_periodo_prueba" label="Fecha fin periodo de prueba"
                              type="date">
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3" md="3">
                            <v-autocomplete dense :items="municipios" v-model="contrato.municipio_trabaja_id"
                              :error-messages="errors.municipio_trabaja_id" item-text="nombre" item-value="id"
                              label="Municipio donde labora">
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="8" md="6">
                            <v-autocomplete dense :items="cargos" v-model="contrato.cargo_id"
                              :error-messages="errors.cargo_id" item-text="nombre" item-value="id" label="Cargo">
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="3" md="3">
                            <v-autocomplete dense :items="proyectos" v-model="contrato.proyecto_id"
                              :error-messages="errors.proyecto_id" item-text="nombre" item-value="id" label="Proyecto">
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="3" md="3">
                            <v-text-field dense v-model="contrato.salario" type="number" label="Salario"
                              :error-messages="errors.salario">
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3" md="3">
                            <v-select dense v-model="contrato.jornada" :items="jornadas" label="Jornada"
                              :error-messages="errors.jornada">
                            </v-select>
                          </v-col>
                          <v-col cols="12" sm="3" md="3">
                            <v-text-field dense v-model="contrato.horas" :error-messages="errors.horas" label="Horas">
                            </v-text-field>
                          </v-col>
                          <v-col cols="2" sm="2" md="2">
                            <v-checkbox dense v-model="contrato.prerrogativa" label="Prerrogativa">
                            </v-checkbox>
                          </v-col>
                          <v-col cols="12" sm="3" md="3" v-if="contrato.prerrogativa == true">
                            <v-text-field dense v-model="contrato.fecha_inicio_prerrogativa"
                              :error-messages="errors.fecha_inicio_prerrogativa" label="Fecha inicio prerrogativa"
                              type="date">
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3" md="3" v-if="contrato.prerrogativa == true">
                            <v-text-field dense v-model="contrato.fecha_fin_prerrogativa"
                              :error-messages="errors.fecha_fin_prerrogativa" label="Fecha fin prerrogativa"
                              type="date">
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="12" v-if="contrato.prerrogativa == true">
                            <v-textarea auto-grow dense v-model="contrato.descripcion_prerrogativa"
                              label="Descripción de la prerrogativa" :error-messages="errors.descripcion_prerrogativa">
                            </v-textarea>
                          </v-col>
                        </v-row>
                        <v-alert border="left" dense text color="#78909C">Información bancaria.</v-alert>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field dense v-model="contrato.numero_cuenta_bancaria"
                              label="Número de cuenta bancaria" :error-messages="errors.numero_cuenta_bancaria">
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-autocomplete dense :items="bancos" v-model="contrato.banco_id"
                              :error-messages="errors.banco_id" item-text="nombre" item-value="id"
                              label="Selccione el banco">
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-autocomplete dense :items="tiposCuentas" v-model="contrato.tipo_cuenta_id"
                              :error-messages="errors.tipo_cuenta_id" item-text="nombre" item-value="id"
                              label="Selccione el tipo de cuenta bancaria">
                            </v-autocomplete>
                          </v-col>
                          <v-col v-if="editedIndex > -1" cols="12" sm="12" md="12">
                            <v-alert text dense border="left" color="blue-grey">Información para seguimiento
                            </v-alert>
                            <v-textarea auto-grow dense v-model="historicoContrato.observaciones"
                              label="Observaciones de la actualización"
                              hint="Ingrese el motivo por el cual ha de realizar la actualización de los datos"
                              :error-messages="errors.observaciones">
                            </v-textarea>
                          </v-col>
                          <v-col v-if="editedIndex > -1" cols="3" sm="3" md="3">
                            <v-text-field dense v-model="historicoContrato.fecha_aplicacion_novedad"
                              :error-messages="errors.fecha_fin_prerrogativa" label="Fecha de aplicación de la novedad"
                              type="date">
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                      <v-card-actions>
                        <v-alert type="warning" text dense border="left" v-if="contrato.activo == 0">El contrato se
                          encuentra <b>terminado</b>, por lo tanto no se le pueden realizar modificaciones</v-alert>
                        <v-spacer></v-spacer>
                        <v-btn small color="error" @click="close()">
                          Cancelar
                        </v-btn>
                        <v-btn small v-if="contrato.activo != 0" color="boton" dark @click="guardarContrato()">
                          Guardar
                        </v-btn>
                      </v-card-actions>
                    </v-col>
                  </v-row>
                </v-container>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
        <v-dialog v-model="historicoContratoDialogo" persistent max-width="1000px">
          <v-card>
            <v-col v-if="historicos[0]">
              <v-alert border="left" color="#546E7A" dense text icon="mdi-history">Histórico de actualizaciones
                del contrato laboral</v-alert>
              <template>
                <v-timeline>
                  <v-timeline-item left v-for="n in historicos" :key="n" large>
                    <template v-slot:icon>
                      <v-icon color="white">mdi-account-edit</v-icon>
                    </template>
                    <template v-slot:opposite>
                      <span><b><i>{{n.empleado_registra}}</i></b></span>
                      <v-spacer></v-spacer>
                      <span>
                        <v-icon color="#1565C0">mdi-calendar-end</v-icon> <b>-</b> Fecha y hora de ejecución:
                        <b>{{n.fecha_creacion}}</b>
                      </span><br>
                      <span>
                        <v-icon color="#1565C0">mdi-calendar-badge</v-icon> <b>-</b> Fecha aplicación de la novedad:
                        <b>{{n.fecha_aplicacion_novedad}}</b>
                      </span>
                    </template>
                    <v-card class="elevation-2">
                      <v-alert icon="mdi-circle-edit-outline" color="info" dense text>
                        <b>{{n.accion}}</b>
                      </v-alert>
                      <v-subheader><b>Observaciones de la actualización:</b>{{n.observaciones}}</v-subheader>
                      <v-list dense>
                        <v-list-item two-line>
                          <v-list-item-icon>
                            <v-icon color="#1565C0">mdi-account-cash-outline</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Salario</v-list-item-title>
                            <v-list-item-subtitle>{{n.salario}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-icon>
                            <v-icon color="#1565C0">mdi-human-male-board-poll</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Cargo</v-list-item-title>
                            <v-list-item-subtitle>{{n.nombre_cargo}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-icon>
                            <v-icon color="#1565C0">mdi-target-variant</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Proyecto</v-list-item-title>
                            <v-list-item-subtitle>{{n.nombre_proyecto}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-icon>
                            <v-icon color="#1565C0">mdi-text-box-search-outline</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Tipo contrato</v-list-item-title>
                            <v-list-item-subtitle>{{n.nombre_tipo_contrato}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-icon>
                            <v-icon color="#1565C0">mdi-book-search-outline</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Estado</v-list-item-title>
                            <v-list-item-subtitle>{{n.activo}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-icon>
                            <v-icon color="#1565C0">mdi-calendar-remove</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Fecha fin periodo de prueba
                            </v-list-item-title>
                            <v-list-item-subtitle>{{n.fecha_fin_periodo_prueba}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-icon>
                            <v-icon color="#1565C0">mdi-calendar-plus</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Fecha de ingreso</v-list-item-title>
                            <v-list-item-subtitle>{{n.fecha_ingreso}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-icon>
                            <v-icon color="#1565C0">mdi-calendar-question-outline</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Fecha de retiro</v-list-item-title>
                            <v-list-item-subtitle>{{n.fecha_retiro}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-icon>
                            <v-icon color="#1565C0">mdi-calendar-multiselect-outline</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Fecha de vencimiento</v-list-item-title>
                            <v-list-item-subtitle>{{n.fecha_vencimiento}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-icon>
                            <v-icon color="#1565C0">mdi-store-clock-outline</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Jornada</v-list-item-title>
                            <v-list-item-subtitle>{{n.jornada}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-icon>
                            <v-icon color="#1565C0">mdi-map-marker-circle</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Municipio donde labora</v-list-item-title>
                            <v-list-item-subtitle>{{n.nombre_municipio_trabaja}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-icon>
                            <v-icon color="#1565C0">mdi-piggy-bank-outline</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Número de cuenta bancaria
                            </v-list-item-title>
                            <v-list-item-subtitle>{{n.numero_cuenta_bancaria}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-icon>
                            <v-icon color="#1565C0">mdi-bank-circle-outline</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Tipo de cuenta bancaria</v-list-item-title>
                            <v-list-item-subtitle>{{n.nombre_tipo_cuenta}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-icon>
                            <v-icon color="#1565C0">mdi-hours-12</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>horas</v-list-item-title>
                            <v-list-item-subtitle>{{n.horas}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-icon>
                            <v-icon color="#1565C0">mdi-file-document-remove-outline</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Tipo de terminación</v-list-item-title>
                            <v-list-item-subtitle>{{n.tipo_terminacion}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </template>
            </v-col>
            <v-card-actions>
              <v-alert text dense border="left" type="error" v-if="historicos == ''">Aún no hay registros de históricos
                para este contrato</v-alert>
              <v-spacer></v-spacer>
              <v-btn @click="historicoContratoDialogo = false" small color="red" dark>Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogoIncapacidades" persistent>
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert text dense border="left" color="blue-grey">Gestión de incapacidades</v-alert>
              <form @submit.prevent="guardarContrato">
                <template>
                  <IncapacidadesComponente :contrato_id="contrato.id" :activo="contrato.activo" />
                </template>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cerrar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
        <v-dialog v-model="dialogoVacaciones" persistent max-width="1200px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert text dense border="left" color="blue-grey">Gestión de vacaciones</v-alert>
              <form @submit.prevent="guardarContrato">
                <template>
                  <VacacionesComponente :contrato_id="contrato.id" :activo="contrato.activo" />
                </template>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cerrar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
        <v-dialog v-model="dialogoLicencias" persistent>
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert text dense border="left" color="blue-grey">Gestión de licencias</v-alert>
              <form @submit.prevent="guardarContrato">
                <template>
                  <LicenciasComponente :contrato_id="contrato.id" :activo="contrato.activo" />
                </template>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cerrar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
        <v-dialog v-model="dialogoAfiliaciones" persistent>
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert text dense border="left" color="blue-grey" icon="mdi-file-document-plus">Gestión de afiliaciones
              </v-alert>
              <form @submit.prevent="guardarContrato">
                <template>
                  <AfiliacionesComponente :contrato_id="contrato.id" :activo="contrato.activo" />
                </template>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cerrar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
        <v-dialog v-model="dialogoFirma" persistent max-width="600">
          <v-card>
            <v-alert text dense outlined class="text-center" type="info" icon="mdi-pen">
              <b>Agregar firma empleado</b>
            </v-alert>
            <firmaComponente @cerrarDialogoFirma="cerrarDialogoFirma" :empleado_id_firma="empleado_id_firma" />
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogoTerminarContrato" persistent max-width="900">
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert icon="mdi-file-document-remove-outline" type="info" class="text-center" text dense>
                <strong>PROCESO TERMINACIÓN DE CONTRATO LABORAL</strong>
              </v-alert>
              <form @submit.prevent="terminarContratoLaboral">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete dense readonly :items="tiposContratos" v-model="contrato.tipo_contrato_id"
                          :error-messages="errors.tipo_contrato_id" item-text="nombre" item-value="id"
                          label="Tipo de contrato"></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="8">
                        <v-autocomplete dense readonly :items="cargos" v-model="contrato.cargo_id"
                          :error-messages="errors.cargo_id" item-text="nombre" item-value="id" label="Cargo">
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete dense readonly :items="municipios" v-model="contrato.municipio_trabaja_id"
                          :error-messages="errors.municipio_trabaja_id" item-text="nombre" item-value="id"
                          label="Municipio donde labora">
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete dense readonly :items="proyectos" v-model="contrato.proyecto_id"
                          :error-messages="errors.proyecto_id" item-text="nombre" item-value="id" label="Proyecto">
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field dense readonly v-model="contrato.fecha_ingreso"
                          :error-messages="errors.fecha_ingreso" label="Fecha Ingreso" type="date">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field dense v-model="contrato.fecha_retiro" :error-messages="errors.fecha_retiro"
                          label="Fecha retiro" type="date">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="8">
                        <v-select dense v-model="contrato.tipo_terminacion" :items="tiposTerminacionesItems"
                          label="Tipo de terminación" :error-messages="errors.tipo_terminacion">
                        </v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4" v-if="contrato.tipo_terminacion == 'Terminación de contrato'">
                        <v-select dense v-model="contrato.justa_causa" :items="justaCausaItems" label="Justa causa"
                          :error-messages="errors.justa_causa">
                        </v-select>
                      </v-col>
                      <v-col v-if="contrato.tipo_terminacion != 'Fallecimiento'" cols="12" sm="12" md="12">
                        <v-textarea dense auto-grow v-model="contrato.motivo_terminacion"
                          :error-messages="errors.motivo_terminacion" label="Motivo de terminación">
                        </v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-alert icon="mdi-alert-octagram" type="warning" dense text border="left"><i>El proceso de
                      terminación de contrato
                      <strong>NO</strong> se puede deshacer</i></v-alert>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cerrar
                  </v-btn>
                  <v-btn small v-if="contrato.activo != 0" color="boton" dark @click="terminarContratoLaboral()">
                    Terminar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top v-if="$can('contratoEmpleado.actualizar')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="warning" dense class="mr-2" v-bind="attrs" v-on="on" @click="editar(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
        <v-tooltip top v-if="$can('contratoEmpleado.listar')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="blue-grey" dense class="mr-2" v-bind="attrs" v-on="on" @click="historico(item)">
              mdi-history
            </v-icon>
          </template>
          <span>Histórico de actualizaciones</span>
        </v-tooltip>
        <v-tooltip top v-if="$can('contratoEmpleado.terminarContrato')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="secondary" dense class="mr-2" v-bind="attrs" v-on="on" @click="terminacionContrato(item)">
              mdi-skull-crossbones-outline
            </v-icon>
          </template>
          <span>Terminar</span>
        </v-tooltip>
        <!-- <v-tooltip top v-if="$can('contratoEmpleado.firma')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="purple" dense class="mr-2" v-bind="attrs" v-on="on" @click="firma(item)">
              mdi-file-document-edit-outline
            </v-icon>
          </template>
          <span>Firma</span>
        </v-tooltip> -->
      </template>
      <template v-slot:[`item.gestion`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="success" dense class="mr-2" v-bind="attrs" v-on="on" @click="afiliaciones(item)">
              mdi-badge-account-horizontal-outline
            </v-icon>
          </template>
          <span>Afiliaciones</span>
        </v-tooltip>
        <v-tooltip top v-if="$can('incapacidadEmpleado.listar')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="red" dense class="mr-2" v-bind="attrs" v-on="on" @click="incapacidades(item)">
              mdi-account-injury-outline
            </v-icon>
          </template>
          <span>Incapacidades</span>
        </v-tooltip>
        <v-tooltip top v-if="$can('vacacionEmpleado.listar')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="indigo" dense class="mr-2" v-bind="attrs" v-on="on" @click="vacaciones(item)">
              mdi-beach
            </v-icon>
          </template>
          <span>Vacaciones</span>
        </v-tooltip>
        <v-tooltip top v-if="$can('licenciaEmpleado.listar')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="info" dense class="mr-2" v-bind="attrs" v-on="on" @click="licencias(item)">
              mdi-license
            </v-icon>
          </template>
          <span>Licencias</span>
        </v-tooltip>
      </template>

    </v-data-table>
  </div>
</template>

<script>
  import {
    listarContrato,
    guardarContrato,
    actualizarContrato,
    terminarContrato,
  } from '@/api/contratosEmpleados/contratoEmpleado'
  import {
    listarTiposContratos
  } from "@/api/tipoContratosTh/tipoContratoTh";
  import {
    listarMunicipios
  } from "@/api/municipios/municipio";
  import {
    listarProyectos
  } from "@/api/proyectos/proyecto";
  import firmaComponente from '@/components/talentoHumano/firma.vue';
  import AfiliacionesComponente from './AfiliacionesComponente.vue';
  import IncapacidadesComponente from './IncapacidadesComponente.vue';
  import LicenciasComponente from './LicenciasComponente.vue';
  import VacacionesComponente from './VacacionesComponente.vue';
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('contratoEmpleado.listar')) {
        return redirect('/');
      }
    },
    props: ['empleado_id'],
    components: {
      AfiliacionesComponente,
      IncapacidadesComponente,
      LicenciasComponente,
      VacacionesComponente,
      firmaComponente
    },
    name: 'WorkspaceJsonContratosComponente',
    data() {
      return {
        tiposTerminacionesItems: ['Renuncia', 'Terminación contrato fijo vencimiento de términos',
          'Terminación contrato obra o labor', 'Terminación contrato justa causa', 'Finalización prácticas',
          'Fallecimiento', 'Retiro por Pensión'
        ],
        jornadas: ['Tiempo completo', 'Medio tiempo', 'Horas', 'Disponibilidad'],
        justaCausaItems: ['Con justa causa', 'Sin justa causa'],
        loading: false,
        dialog: false,
        dialogoVacaciones: false,
        dialogoIncapacidades: false,
        dialogoLicencias: false,
        dialogoAfiliaciones: false,
        dialogoTerminarContrato: false,
        dialogoEditar: false,
        historicoContratoDialogo: false,
        buscarContrato: '',
        contratos: [],
        historicos: [],
        tiposContratos: [],
        cargos: [],
        municipios: [],
        tiposCuentas: [],
        bancos: [],
        proyectos: [],
        contrato: {
          tipo_contrato_id: '',
          cargo_id: '',
          municipio_trabaja_id: '',
          proyecto_id: '',
          jornada: '',
          fecha_ingreso: '',
          fecha_retiro: '',
          fecha_fin_periodo_prueba: '',
          salario: '',
          numero_cuenta_bancaria: '',
          tipo_cuenta_id: '',
          banco_id: '',
          fecha_fin_periodo_prueba: '',
          tipo_terminacion: '',
          motivo_terminacion: '',
          justa_causa: '',
          prerrogativa: false,
          fecha_inicio_prerrogativa: '',
          fecha_fin_prerrogativa: '',
          descripcion_prerrogativa: '',
          descripcion_obra_labor: '',
          horas: '',
          fecha_vencimiento: '',
          fecha_aplicacion_novedad: '',
        },
        editedIndex: -1,
        defecto: {
          tipo_contrato_id: '',
          jornada: '',
          cargo_id: '',
          municipio_trabaja_id: '',
          proyecto_id: '',
          fecha_ingreso: '',
          fecha_retiro: '',
          fecha_fin_periodo_prueba: '',
          salario: '',
          numero_cuenta_bancaria: '',
          tipo_cuenta_id: '',
          banco_id: '',
          fecha_fin_periodo_prueba: '',
          tipo_terminacion: '',
          motivo_terminacion: '',
          justa_causa: '',
          prerrogativa: false,
          fecha_inicio_prerrogativa: '',
          fecha_fin_prerrogativa: '',
          descripcion_prerrogativa: '',
          descripcion_obra_labor: '',
          horas: '',
          fecha_vencimiento: '',
        },
        errors: {
          tipo_contrato_id: '',
          jornada: '',
          cargo_id: '',
          municipio_trabaja_id: '',
          proyecto_id: '',
          fecha_ingreso: '',
          fecha_retiro: '',
          fecha_fin_periodo_prueba: '',
          salario: '',
          fecha_fin_periodo_prueba: '',
          tipo_terminacion: '',
          motivo_terminacion: '',
          justa_causa: '',
          fecha_inicio_prerrogativa: '',
          fecha_fin_prerrogativa: '',
          descripcion_prerrogativa: '',
          descripcion_obra_labor: '',
          observaciones: '',
          horas: '',
          fecha_vencimiento: '',
        },
        historicoContrato: {
          accion: '',
          cargo_id: '',
          proyecto_id: '',
          tipo_contrato_id: '',
          salario: '',
          contrato_empleado_id: '',
          observaciones: '',
          user_id: '',
          horas: '',
          fecha_ingreso: '',
          fecha_vencimiento: '',
          fecha_retiro: '',
          fecha_fin_periodo_prueba: '',
          jornada: '',
          activo: '',
          tipo_terminacion: '',
          motivo_terminacion: '',
          justa_causa: '',
          numero_cuenta_bancaria: '',
          municipio_trabaja_id: '',
          tipo_cuenta_id: '',
          banco_id: '',
          fecha_aplicacion_novedad: '',
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
            text: 'Jornada',
            value: 'jornada',
          },
          {
            text: 'Fecha de ingreso',
            value: 'fecha_ingreso',
          },
          {
            text: 'Fecha de retiro',
            value: 'fecha_retiro',
          },
          {
            text: 'Fecha fin periodo prueba',
            value: 'fecha_fin_periodo_prueba',
          },
          {
            text: 'Salario',
            value: 'salario',
          },
          {
            text: 'Vigente',
            value: 'activo',
            align: 'center'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false,
            align: 'center',
          },
          {
            text: 'Gestión',
            value: 'gestion',
            sortable: false,
            align: 'center',
          },
        ],
        dialogoFirma: false,
        empleado_id_firma: ''
      };
    },

    mounted() {
      this.listarContrato();
      this.listarTiposContratos();
      this.listarCargos();
      this.listarMunicipios();
      this.listarProyectos();
      this.listarBancos();
      this.listarTiposCuentasBancarias();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Creación' : 'edición'
      },
    },

    watch: {
      empleado_id() {
        this.listarContrato();
      }
    },

    methods: {

      close() {
        this.dialog = false
        this.dialogoIncapacidades = false
        this.dialogoVacaciones = false
        this.dialogoAfiliaciones = false
        this.dialogoTerminarContrato = false
        this.dialogoLicencias = false
        this.$nextTick(() => {
          this.contrato = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      listarTiposContratos() {
        this.$loadingGetRequest(listarTiposContratos()).then(res => {
          this.tiposContratos = res.data.data.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      listarCargos() {
        this.$axios.get('/cargo/listar').then(res => {
          this.cargos = res.data.data;
        })
      },

      listarMunicipios() {
        this.$loadingGetRequest(listarMunicipios()).then(res => {
          this.municipios = res.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      listarBancos() {
        this.$axios.get('/bancos/listar').then(res => {
          this.bancos = res.data.data;
        })
      },

      listarTiposCuentasBancarias() {
        this.$axios.get('/tipos-cuentas-bancarias/listar').then(res => {
          this.tiposCuentas = res.data.data;
        })
      },

      listarProyectos() {
        this.$loadingGetRequest(listarProyectos()).then(res => {
          this.proyectos = res.data.data.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      listarHistorico() {
        this.$axios.get('/historico-contrato-empleado/' + this.contrato.id).then(res => {
          this.historicos = res.data;
        })
      },

      async terminarContratoLaboral() {
        this.limpiarError()
        this.contrato.activo = 0
        try {
          await this.$loadingPutRequest(terminarContrato(this.contrato.id), this.contrato)
          this.$toast.success('Contrato terminado correctamente')
          this.guardarHistorico()
          this.listarContrato()
          this.close()
        } catch (error) {
          this.contrato.activo = 1
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje)
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data)
          }
          this.listarContrato()
        }

      },

      async listarContrato() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarContrato(this.empleado_id))
          this.contratos = data.data
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      chipContratoActivo(activo) {
        if (activo == '1') return 'info'
        else if (activo == '0') return 'elerta'
        else return 'warning'
      },

      async guardarContrato() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            if (this.historicoContrato.observaciones == '' || this.historicoContrato.fecha_aplicacion_novedad == '') {
              return this.$swal({
                title: "¡No puede ser!",
                text: "Por favor complete el campo de observaciones de la actualización y fecha de aplicación de la novedad para mantener un registro de las acciones llevadas a cabo en relación con el contrato laboral.",
                type: "error",
              });
            }
            const {
              data
            } = await this.$loadingPutRequest(actualizarContrato(this.contrato.id), this.contrato)
            this.guardarHistorico()
            this.$toast.success(data.mensaje)
            this.listarContrato()
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
            this.contrato.empleado_id = this.empleado_id
            this.contrato.activo = 1
            const {
              data
            } = await this.$loadingPostRequest(guardarContrato(), this.contrato)
            this.$toast.success(data.mensaje)
            this.listarContrato()
            this.guardarHistorico(data.id)
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

      guardarHistorico(data) {
        this.historicoContrato.contrato_empleado_id = this.contrato.id
        this.historicoContrato.user_id = this.$store.state.auth.usuario.id
        this.historicoContrato.cargo_id = this.contrato.cargo_id
        this.historicoContrato.proyecto_id = this.contrato.proyecto_id
        this.historicoContrato.tipo_contrato_id = this.contrato.tipo_contrato_id
        this.historicoContrato.salario = this.contrato.salario
        this.historicoContrato.horas = this.contrato.horas
        this.historicoContrato.fecha_ingreso = this.contrato.fecha_ingreso
        this.historicoContrato.fecha_vencimiento = this.contrato.fecha_vencimiento
        this.historicoContrato.fecha_retiro = this.contrato.fecha_retiro
        this.historicoContrato.fecha_fin_periodo_prueba = this.contrato.fecha_fin_periodo_prueba
        this.historicoContrato.fecha_aplicacion_novedad = this.historicoContrato.fecha_aplicacion_novedad
        this.historicoContrato.jornada = this.contrato.jornada
        this.historicoContrato.activo = this.contrato.activo
        this.historicoContrato.tipo_terminacion = this.contrato.tipo_terminacion
        this.historicoContrato.motivo_terminacion = this.contrato.motivo_terminacion
        this.historicoContrato.justa_causa = this.contrato.justa_causa
        this.historicoContrato.numero_cuenta_bancaria = this.contrato.numero_cuenta_bancaria
        this.historicoContrato.municipio_trabaja_id = this.contrato.municipio_trabaja_id
        this.historicoContrato.tipo_cuenta_id = this.contrato.tipo_cuenta_id
        this.historicoContrato.banco_id = this.contrato.banco_id
        if (this.editedIndex > -1) {
          this.historicoContrato.accion = 'Actualización'
        } else {
          this.historicoContrato.accion = 'Creación'
          this.historicoContrato.contrato_empleado_id = data
          this.historicoContrato.observaciones = 'Creación de contrato laboral'
        }
        if (this.historicoContrato.activo == false) {
          this.historicoContrato.accion = 'Terminación'
          this.historicoContrato.observaciones = 'Terminación de contrato laboral'
        }
        this.$axios.post('/historico-contrato-empleado/crear', this.historicoContrato).then(res => {
          // this.listarContrato();
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

      editar(item) {
        this.editedIndex = this.contratos.indexOf(item)
        this.contrato = Object.assign({}, item)
        this.dialog = true
      },

      historico(item) {
        this.editedIndex = this.contratos.indexOf(item)
        this.contrato = Object.assign({}, item)
        this.listarHistorico()
        this.historicoContratoDialogo = true
      },

      incapacidades(item) {
        this.editedIndex = this.contratos.indexOf(item)
        this.contrato = Object.assign({}, item)
        this.dialogoIncapacidades = true
      },

      vacaciones(item) {
        this.editedIndex = this.contratos.indexOf(item)
        this.contrato = Object.assign({}, item)
        this.dialogoVacaciones = true
      },

      licencias(item) {
        this.editedIndex = this.contratos.indexOf(item)
        this.contrato = Object.assign({}, item)
        this.dialogoLicencias = true
      },

      afiliaciones(item) {
        this.editedIndex = this.contratos.indexOf(item)
        this.contrato = Object.assign({}, item)
        this.dialogoAfiliaciones = true
      },

      terminacionContrato(item) {
        this.editedIndex = this.contratos.indexOf(item)
        this.contrato = Object.assign({}, item)
        this.dialogoTerminarContrato = true
      },

      firma(item) {
        console.log('rrrrr', item);
        this.dialogoFirma = true
        this.empleado_id_firma = item.empleado_id
      },

      cerrarDialogoFirma() {
        this.dialogoFirma = false
      }


    },
  };

</script>

<style>
  .left {
    justify-content: left
  }

</style>
