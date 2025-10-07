<template>
  <div>
    <v-dialog v-model="modalDetalleGestion" max-width="600px">
      <v-card>
        <v-alert
          dense
          text
          border="left"
          icon="mdi-information-outline"
          type="info"
        >
          Detalle Estado Gestion Prestador
        </v-alert>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-timeline v-if="gestiones.length > 0">
                <v-timeline-item
                  v-for="(gestion, index) in gestiones"
                  :key="index"
                  color="info"
                  icon="mdi-check-underline"
                >
                  <v-card>
                    <v-card-title>
                      <div style="display: flex; align-items: center">
                        <v-icon
                          :color="
                            obtenerColorPorTipo(gestion.estado_gestion_id)
                          "
                        >
                          {{
                            obtenerIconoPorTipo(gestion.estado_gestion_id)
                          }}</v-icon
                        >
                        <span style="margin-left: 8px">{{
                          gestion.estado
                        }}</span>
                      </div>
                    </v-card-title>
                    <v-card-text>
                      <div>
                        <div
                          class="font-weight-normal"
                          v-if="gestion.fecha_sugerida"
                        >
                          <strong
                            >Fecha Creación:
                            {{
                              $moment(gestion.created_at).format("DD-MM-YYYY")
                            }}</strong
                          >
                        </div>
                        <div v-if="gestion.fecha_sugerida">
                          <strong
                            >Fecha Sugerida:
                            {{ gestion.fecha_sugerida }}</strong
                          >
                        </div>
                        <div v-if="gestion.fecha_solicitada_afiliado">
                          <strong
                            >Fecha solicitada por el afiliado:
                            {{ gestion.fecha_solicitada_afiliado }}</strong
                          >
                        </div>

                        <div v-if="gestion.observacion">
                          <strong
                            >Observación: {{ gestion.observacion }}</strong
                          >
                        </div>
                        <div v-if="gestion.fecha_cancelacion">
                          <strong
                            >Fecha cancelacion:
                            {{ gestion.fecha_cancelacion }}</strong
                          >
                        </div>
                        <div v-if="gestion.fecha_cancelacion">
                          <strong
                            >Causa cancelación:
                            {{ gestion.causa_cancelacion }}</strong
                          >
                        </div>
                        <div v-if="gestion.motivo_cancelacion">
                          <strong
                            >Motivo cancelacion:
                            {{ gestion.motivo_cancelacion }}</strong
                          >
                        </div>
                        <div v-if="gestion.funcionario_responsable">
                          <strong
                            >Funcionario Responsable:
                            {{ gestion.funcionario_responsable }}</strong
                          >
                        </div>
                        <div v-if="gestion.fecha_asistencia">
                          <strong>
                            Fecha asistencia:
                            {{ gestion.fecha_asistencia }}</strong
                          >
                        </div>
                        <div v-if="gestion.ruta">
                          <v-btn
                            icon
                            color="success"
                            @click="descargarAdjunto(gestion.ruta)"
                          >
                            <v-icon>mdi-file-download</v-icon>
                          </v-btn>
                        </div>
                      </div>
                      <v-col></v-col>
                      <div
                        v-if="
                          gestion.cirujano ||
                          gestion.especialidad ||
                          gestion.fecha_preanestesia
                        "
                      >
                        <v-alert
                          text
                          dense
                          color="warning"
                          icon="mdi-needle"
                          border="left"
                          ><b>Detalles de cirugía</b>
                        </v-alert>

                        <div v-if="gestion.cirujano">
                          <strong>Cirujano: {{ gestion.cirujano }}</strong>
                        </div>

                        <div v-if="gestion.especialidad">
                          <strong
                            >Especialidad: {{ gestion.especialidad }}</strong
                          >
                        </div>

                        <div v-if="gestion.fecha_preanestesia">
                          <strong
                            >Fecha pre-anestesia:
                            {{ gestion.fecha_preanestesia }}</strong
                          >
                        </div>

                        <div v-if="gestion.fecha_cirugia">
                          <strong
                            >Fecha Cirugía: {{ gestion.fecha_cirugia }}</strong
                          >
                        </div>

                        <div v-if="gestion.fecha_ejecucion">
                          <strong
                            >Fecha ejecución:
                            {{ gestion.fecha_ejecucion }}</strong
                          >
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            small
            color="error"
            @click="
              emailEnvio = null;
              datosEnvioEmail = null;
              modalEmail = false;
              modalDetalleGestion = false;
            "
            >Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="modalEmail" persistent max-width="600px">
      <v-card>
        <v-alert
          dense
          text
          border="left"
          icon="mdi-email-arrow-right-outline"
          type="success"
          >Enviar correo electrónico
        </v-alert>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                v-model="emailEnvio"
                label="Correo electrónico"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            small
            color="error"
            @click="
              emailEnvio = null;
              datosEnvioEmail = null;
              modalEmail = false;
            "
            >Cerrar
          </v-btn>
          <v-btn small color="success" @click="SendEmail()">Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <template>
      <div class="text-center">
        <v-dialog v-model="cargando" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>

    <v-card>
      <v-card elevation="0">
        <v-toolbar-title>
          <div class="d-flex align-center">
            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
            <span>HISTÓRICO DE ORDENES <b>(MEDICAMENTOS - SERVICIOS)</b></span>
          </div>
        </v-toolbar-title>
      </v-card>
      <v-container>
        <v-row dense>
          <v-col cols="12" md="3" sm="3">
            <v-autocomplete
              v-model="formFilter.tipo"
              dense
              label="Tipo orden"
              :items="tipos"
              item-value="id"
              item-text="nombre"
              outlined
              @change="(ordenes = []), (total = 0)"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="6" sm="6">
            <v-text-field
              v-model="formFilter.documento"
              dense
              outlined
              label="Número de identificación"
              clearable
              hide-spin-buttons
              @click:clear="limpiar()"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3" sm="3">
            <v-btn
              color="primary"
              @click="buscarOrdenes"
              @keyup.enter="buscarOrdenes"
              >Buscar<v-icon right> mdi-magnify</v-icon>
            </v-btn>
            <!-- <v-btn v-if="$can('exportar.historicos')" small color="success" @click="exportar()">Exportar<v-icon right>
                mdi-download</v-icon>
            </v-btn> -->
          </v-col>
        </v-row>
      </v-container>
      <v-col v-if="ordenes.length > 0">
        <v-alert
          text
          dense
          border="left"
          type="info"
          color="blue-grey"
          icon="mdi-filter-variant"
          ><b>Filtros de búsqueda</b>
        </v-alert>
        <v-row dense>
          <v-col cols="12" sm="2" md="2">
            <v-text-field
              ref="campoOrdenId"
              clearable
              dense
              v-model="formFilter.orden_id"
              label="Número de orden"
              outlined
              @keyup.enter="buscarOrdenes"
              @click:clear="limpiarDatos_Filtros"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="3" v-if="formFilter.tipo == 1">
            <v-text-field
              ref="campoOrdenId"
              dense
              v-model="formFilter.cs_nombre"
              label="Nombre del medicamento"
              outlined
              @keyup.enter="buscarOrdenes()"
              @click:clear="limpiarDatos_Filtros"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="2" md="2" v-if="formFilter.tipo == 2">
            <v-text-field
              ref="campoOrdenId"
              dense
              v-model="formFilter.cp_nombre"
              label="Nombre del servicio CUP"
              outlined
              @keyup.enter="buscarOrdenes()"
              @click:clear="limpiarDatos_Filtros"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="2" md="2">
            <v-text-field
              type="date"
              dense
              v-model="formFilter.fecha_vigencia_desde"
              label="Fecha vigencia desde"
              outlined
              @keyup.enter="buscarOrdenes()"
              @click:clear="limpiarDatos_Filtros"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="2" md="2">
            <v-text-field
              type="date"
              dense
              v-model="formFilter.fecha_vigencia_hasta"
              label="Fecha vigencia hasta"
              outlined
              @keyup.enter="buscarOrdenes()"
              @click:clear="limpiarDatos_Filtros"
            >
            </v-text-field>
          </v-col>
          <v-card-actions class="mb-4">
            <v-spacer></v-spacer>
            <v-btn small @click="buscarOrdenes()" color="info">
              Aplicar filtro
              <v-icon small right>mdi-filter-variant-plus</v-icon>
            </v-btn>
            <v-btn
              small
              color="info"
              :disabled="
                seleccionados.length === 0 ||
                !$can('historico.cambioDireccionamientoMasivo')
              "
              @click="abrirDireccionamiento"
            >
              Cambio direccionamiento masivo
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-actions>
        </v-row>

        <v-data-table
          hide-default-footer
          disable-pagination
          dense
          :search="search"
          no-data-text="No hay registros"
          :headers="
            formFilter.tipo === 1 ? headersMedicamentos : headersServicios
          "
          :items="ordenes"
          class="text-no-wrap"
        >
          <template v-slot:[`item.fechaCreacion`]="{ item }">
            <td class="text-center text-no-wrap">
              {{ item.created_at.substr(0, 10) }}
            </td>
          </template>

          <template v-slot:[`item.fecha_vigencia`]="{ item }">
            <td class="text-center text-no-wrap">{{ item.fecha_vigencia }}</td>
          </template>

          <template v-slot:[`item.dosis`]="{ item }">
            <td>
              {{
                item.dosificacion_medico
                  ? item.dosificacion_medico
                  : `tomar ${item.dosis} ${item.forma} cada ${item.frecuencia} ${item.unidad_tiempo}`
              }}
            </td>
          </template>
          <!-- <template v-slot:[`item.dosis`]="{ item }">
            <td>
              tomar {{ item.dosis }} {{ item.codesumi.unidad_presentacion }} cada
              {{ item.frecuencia }} {{ item.unidad_tiempo }}
            </td>
          </template> -->
          <template v-slot:[`item.seleccionados`]="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-checkbox
                  small
                  class="mr-2"
                  v-on="on"
                  v-bind="attrs"
                  :value="seleccionados.includes(item.id)"
                  @change="cambioCheckbox(item)"
                >
                </v-checkbox>
              </template>
            </v-tooltip>
          </template>

          <template v-slot:[`item.enviado`]="{ item }">
            {{ item.orden.enviado ? "Si" : "No" }}
          </template>

          <template v-slot:[`item.rep.nombre`]="{ item }">
            <v-btn
              text
              @click="modalDialogo(item)"
              :disabled="!$can('actualizar.prestadorServicios')"
            >
              {{
                item.rep_id == null ? "Sin Direccionamiento" : item.rep.nombre
              }}
            </v-btn>
          </template>

          <template v-slot:[`item.prestador`]="{ item }">
            <v-btn
              text
              @click="openDialog(item)"
              :disabled="!$can('actualizar.prestadorServicios')"
            >
              {{ item.rep ? item.rep.nombre : "Sin direccion" }}</v-btn
            >
          </template>
          <template v-slot:[`item.estadoGestionPrestador`]="{ item }">
            <td class="text-center" v-if="item.estado_gestion_prestador">
              <v-chip
                @click="listarGestionPorPrestador(item)"
                :color="obtenerColorPorTipo(item.estado_gestion_prestador.id)"
                small
                >{{ item.estado_gestion_prestador.nombre }}</v-chip
              >
            </td>
            <td v-else>Sin Dato</td>
          </template>
          <template v-slot:[`item.estado`]="{ item }">
            <td class="text-center">
              <v-chip
                small
                v-if="
                  parseInt(item.estado_id) === 1 ||
                  parseInt(item.estado_id) === 4
                "
                color="success"
              >
                {{ item.estado.nombre }}</v-chip
              >
              <v-chip
                small
                v-else-if="parseInt(item.estado_id) === 3"
                color="warning"
                @click="verNota(item.cambio_orden)"
                >{{ item.estado.nombre }}</v-chip
              >
              <v-chip
                small
                v-else-if="parseInt(item.estado_id) === 5"
                color="error"
                @click="verNota(item.cambio_orden)"
              >
                {{ item.estado.nombre }}</v-chip
              >
              <v-chip
                small
                v-else-if="parseInt(item.estado_id) === 20"
                color="error"
                @click="verNota(item.cambio_orden)"
              >
                {{ item.estado.nombre }}</v-chip
              >
              <v-chip
                dark
                small
                v-else-if="parseInt(item.estado_id) === 34"
                color="#26A69A"
                @click="verNota(item.cambio_orden)"
              >
                {{ item.estado.nombre }}</v-chip
              >
              <v-chip
                dark
                small
                v-else-if="parseInt(item.estado_id) === 14"
                color="#AFB42B"
                @click="verNota(item.cambio_orden)"
              >
                {{ item.estado.nombre }}</v-chip
              >
              <v-chip
                dark
                small
                v-else-if="parseInt(item.estado_id) === 10"
                color="#FFA000"
                @click="verNota(item.cambio_orden)"
              >
                {{ item.estado.nombre }}</v-chip
              >
              <v-chip
                small
                v-else-if="parseInt(item.estado_id) === 29"
                color="#303F9F"
                dark
                @click="verNota(item.cambio_orden)"
              >
                {{ item.estado.nombre }}</v-chip
              >
              <v-chip
                small
                v-else-if="parseInt(item.estado_id) === 35"
                color="blue-grey"
                dark
                @click="extenderVigencia(item.id)"
              >
                {{ item.estado.nombre }}</v-chip
              >
              <v-chip
                small
                v-else-if="parseInt(item.estado_id) === 44"
                color="red"
                dark
              >
                {{ item.estado.nombre }}</v-chip
              >
              <v-chip
                small
                v-else-if="parseInt(item.estado_id) === 21"
                color="red"
                dark
              >
                {{ item.estado.nombre }}</v-chip
              >
              <v-chip
                small
                v-else-if="parseInt(item.estado_id) === 57"
                color="red"
                dark
              >
                {{ item.estado.nombre }}</v-chip
              >
              <v-chip
                small
                v-else-if="parseInt(item.estado_id) === 56"
                color="red"
                dark
              >
                {{ item.estado.nombre }}</v-chip
              >
              <v-chip
                small
                v-else-if="parseInt(item.estado_id) === 54"
                color="warning"
                dark
                @click="abrirModalDetallesOrdenUsada(item)"
              >
                {{ item.estado.nombre }}</v-chip
              >
              <v-chip
                small
                v-else-if="parseInt(item.estado_id) === 45"
                color="primary"
                dark
              >
                {{ item.estado.nombre }}</v-chip
              >
            </td>
          </template>
          <template v-slot:[`item.detalles`]="{ item }">
            <v-tooltip
              bottom
              v-if="
                item.estado_id == 1 ||
                item.estado_id == 4 ||
                item.estado_id == 14 ||
                item.estado_id == 21 ||
                item.estado_id == 54
              "
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  color="info"
                  v-on="on"
                  @click="abrirModalDetalle(item)"
                >
                  <v-icon>mdi-file-eye</v-icon>
                </v-btn>
              </template>
              <span>Ver adjuntos</span>
            </v-tooltip>
            <v-tooltip
              bottom
              v-if="
                item.estado_id == 4 ||
                item.estado_id == 20 ||
                item.estado_id == 21 ||
                item.estado_id == 14 ||
                item.estado_id == 54 ||
                item.estado_id == 5
              "
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  color="blue-grey"
                  v-on="on"
                  @click="modaldescripcionAuditoria(item)"
                >
                  <v-icon>mdi-message-bulleted </v-icon>
                </v-btn>
              </template>
              <span>Observaciones de Auditoria</span>
            </v-tooltip>
            <v-badge
              overlap
              bordered
              color="red"
              dot
              v-if="item.cambio_orden.length > 0"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="#D50000"
                    v-on="on"
                    @click="modaldescripcionCambios(item)"
                  >
                    <v-icon>mdi-history </v-icon>
                  </v-btn>
                </template>
                <span>Histórico de cambios</span>
              </v-tooltip>
            </v-badge>
          </template>
          <template v-slot:[`item.detallesMedicamentos`]="{ item }">
            <div class="d-flex justify-center">
              <v-tooltip
                bottom
                v-if="item.estado_id == 20 || item.estado_id == 5"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="blue-grey"
                    v-on="on"
                    @click="modaldescripcionAuditoriaMedicamento(item)"
                  >
                    <v-icon>mdi-message-bulleted </v-icon>
                  </v-btn>
                </template>
                <span>Observaciones de Auditoria</span>
              </v-tooltip>

              <v-tooltip
                bottom
                v-if="
                  item.estado_id == 1 ||
                  item.estado_id == 4 ||
                  item.estado_id == 21 ||
                  item.estado_id == 14 ||
                  item.estado_id == 45 ||
                  item.estado_id == 54
                "
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="info"
                    v-on="on"
                    @click="abrirModalDetalle(item)"
                  >
                    <v-icon>mdi-file-eye</v-icon>
                  </v-btn>
                </template>
                <span>Ver adjuntos</span>
              </v-tooltip>

              <v-tooltip bottom v-if="item.estado_id == 34">
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="purple"
                    v-on="on"
                    @click="verDispensacion(item)"
                  >
                    <v-icon>mdi-package-variant-closed-check</v-icon>
                  </v-btn>
                </template>
                <span>Ver Dispensación</span>
              </v-tooltip>

              <v-tooltip bottom v-if="item.estado_id == 44">
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="error"
                    v-on="on"
                    @click="verSuspension(item)"
                  >
                    <v-icon>mdi-file-document-remove-outline</v-icon>
                  </v-btn>
                </template>
                <span>Detalles de la Suspensión</span>
              </v-tooltip>

              <v-badge
                overlap
                bordered
                color="red"
                dot
                v-if="item.cambio_orden.length > 0"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      color="#D50000"
                      v-on="on"
                      @click="modaldescripcionCambios(item)"
                    >
                      <v-icon>mdi-history </v-icon>
                    </v-btn>
                  </template>
                  <span>Histórico de cambios</span>
                </v-tooltip>
              </v-badge>
            </div>
          </template>
          <template v-slot:[`item.acciones`]="{ item }">
            <td class="text-center">
              <v-tooltip
                bottom
                v-if="
                  item.estado_id == 1 ||
                  item.estado_id == 10 ||
                  item.estado_id == 4 ||
                  item.estado_id == 14 ||
                  item.estado_id == 34 ||
                  item.estado_id == 45 ||
                  item.estado_id == 54
                "
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="green"
                    v-on="on"
                    :disabled="
                      generando ||
                      item.orden.consulta.afiliado.estado_afiliacion_id == 31
                    "
                    @click="imprimir(item)"
                  >
                    <v-icon>mdi-file-download</v-icon>
                  </v-btn>
                </template>
                <span>Imprimir orden</span>
              </v-tooltip>

              <v-tooltip bottom v-if="item.estado_id == 21">
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="blue-grey-dark-4"
                    v-on="on"
                    :disabled="
                      generando ||
                      item.orden.consulta.afiliado.estado_afiliacion_id == 31
                    "
                    @click="
                      abrirDialogFirmaPaciente(
                        item,
                        formFilter.tipo === 1 ? 'Medicamento' : 'Servicio'
                      )
                    "
                  >
                    <v-icon>mdi-cancel</v-icon>
                  </v-btn>
                </template>
                <span>Formato de negación</span>
              </v-tooltip>

              <v-tooltip
                bottom
                v-if="
                  item.estado_id == 57 ||
                  item.estado_id == 56 ||
                  item.estado_id == 14
                "
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="warning"
                    v-on="on"
                    @click="modalAbrir(item)"
                  >
                    <v-icon>mdi-cash</v-icon>
                  </v-btn>
                </template>
                <span>Cobrar</span>
              </v-tooltip>

              <!-- <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn :disabled="generando" v-if="
                      item.orden.consulta.recomendacion_consulta &&
                      item.orden.consulta.recomendacion_consulta.length > 0
                    " dark color="success" v-on="on" text @click="
                      imprimirRecomendacion(
                        item.orden.consulta.id,
                        'recomendacionesConsulta'
                      )
                    ">
                    <v-icon dark>mdi-note-check-outline</v-icon>
                  </v-btn>
                </template>
                <span>Descargar Recomendaciones</span>
              </v-tooltip> -->

              <v-tooltip
                bottom
                v-if="
                  (item.estado_id == 1 ||
                    item.estado_id == 4 ||
                    item.estado_id == 14 ||
                    item.estado_id == 45) &&
                  $can('historico.servicios.anular')
                "
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="error"
                    v-on="on"
                    @click="modalAnularOrden(item)"
                  >
                    <v-icon>mdi-close-circle </v-icon>
                  </v-btn>
                </template>
                <span>Anular</span>
              </v-tooltip>

              <v-tooltip bottom v-if="$can('cambiar.estado.orden')">
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="success"
                    v-on="on"
                    @click="CambiarEstadoOrden(item)"
                  >
                    <v-icon>mdi-swap-horizontal </v-icon>
                  </v-btn>
                </template>
                <span>Cambiar estado de la orden</span>
              </v-tooltip>

              <v-tooltip
                bottom
                v-if="
                  item.estado_id == 1 ||
                  item.estado_id == 4 ||
                  item.estado_id == 14 ||
                  item.estado_id == 45
                "
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="warning"
                    v-on="on"
                    @click="
                      datosEnvioEmail = item;
                      modalEmail = true;
                    "
                  >
                    <v-icon>mdi-email-fast </v-icon>
                  </v-btn>
                </template>
                <span>Enviar Correo</span>
              </v-tooltip>

              <v-tooltip
                bottom
                v-if="
                  !item.orden.enviado &&
                  $can('ordenamiento.enviarFomag') &&
                  formFilter.tipo === 2
                "
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="warning"
                    v-on="on"
                    @click="enviarFomag(item)"
                  >
                    <v-icon>mdi-send</v-icon>
                  </v-btn>
                </template>
                <span>Enviar a fomag</span>
              </v-tooltip>
            </td>
          </template>
          <template v-slot:[`item.anexo`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  color="#1A237E"
                  v-on="on"
                  @click="descargarAnexo3(item)"
                >
                  <v-icon>mdi-download-circle</v-icon>
                </v-btn>
              </template>
              <span
                >Descargar Solicitud de autorización de servicios y tecnologías
                en salud</span
              >
            </v-tooltip>
                      <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  color="#1A237E"
                  v-on="on"
                  @click="descargarAnexo4(item)"
                >
                  <v-icon>mdi-download-circle</v-icon>
                </v-btn>
              </template>
              <span
                >Descargar Autorización de servicios y tecnologías en
                salud</span
              >
            </v-tooltip>
          </template>
          <template v-slot:[`item.certificado`]="{ item }">
            <v-tooltip bottom v-if="item.firma_paciente">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  color="#1A237E"
                  v-on="on"
                  @click="printCertificado(item, 'sumi')"
                >
                  <v-icon>mdi-signature-image</v-icon>
                </v-btn>
              </template>
              <span>Descargar Certificado Sumimedical</span>
            </v-tooltip>
            <v-tooltip bottom v-if="item.firma_paciente">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  color="primary"
                  v-on="on"
                  @click="printCertificado(item, 'synlab')"
                >
                  <v-icon>mdi-signature-image</v-icon>
                </v-btn>
              </template>
              <span>Descargar Certificado Synlab</span>
            </v-tooltip>
          </template>
        </v-data-table>

        <v-row no-gutters>
          <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
            <v-pagination
              v-model="pagina"
              class="my-4"
              :length="total"
              :total-visible="9"
              @input="buscarOrdenes()"
            >
            </v-pagination>
          </v-col>
          <v-col
            md="3"
            lg="3"
            xl="1"
            sm="1"
            class="px-2"
            cols
            style="min-width: 100px"
          >
            <v-select
              class="my-4"
              v-model="opcionActual"
              :items="opciones"
              dense
              solo
              small
              @change="buscarOrdenes()"
            >
            </v-select>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
    <v-dialog persistent width="900px" v-model="dialogoExportar">
      <v-card>
        <v-alert dense text border="left" type="success"
          >Reporte histórico de servicios</v-alert
        >
        <v-container>
          <v-row dense>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                type="date"
                dense
                label="Fecha inicial"
                v-model="reporte.fecha_inicial"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-text-field
                type="date"
                dense
                label="Fecha final"
                v-model="reporte.fecha_final"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-autocomplete
                dense
                label="Estado"
                v-model="reporte.estado_id"
                :items="estados"
                item-text="nombre"
                item-value="id"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark small color="red" @click="dialogoExportar = false"
            >Cerrar</v-btn
          >
          <v-btn dark small color="success" @click="generarReporte()"
            >Generar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      persistent
      width="900px"
      v-model="modalCambiarEstado"
      v-if="modalCambiarEstado"
    >
      <v-card>
        <v-alert dense text border="left" type="success">Acciones</v-alert>
        <v-container>
          <v-row dense>
            <v-col cols="12" sm="6" md="3">
              <v-select
                dense
                v-model="formAuditoria.estado"
                label="Seleccionar acción*"
                :items="estadosActualizar"
                item-text="nombre"
                item-value="id"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-textarea
                dense
                auto-grow
                v-model="formAuditoria.observacion"
                label="Observaciones*"
                rows="2"
              >
              </v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark small color="red" @click="modalCambiarEstado = false"
            >Cerrar</v-btn
          >
          <v-btn dark small color="success" @click="enviarEstado()"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent width="350" v-model="dialogoNota" v-if="dialogoNota">
      <v-card>
        <v-alert dense text border="left" type="success">Nota</v-alert>
        <v-container>
          <v-row dense>
            <v-col cols="12" sm="12" md="12">
              <h5>
                Anulacion realizada el día
                {{ datosNota.created_at.substring(0, 10) }}
              </h5>
              <div>
                <h4>Observación</h4>
              </div>
              <div>
                <p>{{ datosNota.observacion }}</p>
              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark small color="red" @click="dialogoNota = false"
            >Cerrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="ModalPrestadorprestador"
      persistent
      width="550"
      v-if="$can('actualizar.prestadorServicios')"
    >
      <v-card>
        <v-alert border="left" text dense type="info">
          <h4>Modificar prestador</h4>
        </v-alert>
        <v-card-text>
          <v-col cols="12" sm="12" md="12">
            <v-autocomplete
              no-data-text="Cargando ..."
              dense
              v-model="cambioRep.rep_id"
              :items="listaPrestadores"
              item-text="nombre"
              return-object
              label="Prestador*"
            >
            </v-autocomplete>
            <!-- Mostrar el mensaje si listaPrestadores está vacío -->
            <v-alert
              v-if="listaPrestadores.length === 0"
              type="warning"
              dense
              text
            >
              Este cups no se encuentra parametrizado en ningun contrato
            </v-alert>
          </v-col>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            dark
            small
            @click="(ModalPrestadorprestador = false), limpiarData()"
          >
            Cerrar
          </v-btn>
          <v-btn color="success" dark small @click="actualizarRep()">
            Actualizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoDireccionamiento">
      <v-card>
        <v-alert
          class="text-center"
          dense
          text
          outlined
          type="info"
          icon="mdi-checkbox-multiple-marked"
        >
          Cambio de Direccionamiento</v-alert
        >
        <v-card-text>
          <v-col cols="12" sm="12" md="12">
            <v-autocomplete
              no-data-text="Digite el nombre del prestador para inciar la búsqueda"
              :search-input.sync="prestador2"
              dense
              v-model="rep_id"
              :items="prestadores"
              item-text="nombre"
              label="Prestador*"
              item-value="id"
            >
            </v-autocomplete>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogoDireccionamiento = false">
            Cancelar
          </v-btn>
          <v-btn @click="asignarDireccionamiento()" dark color="success"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modalAnularOrdenes" persistent width="550">
      <v-card>
        <v-alert border="left" text dense type="info">
          <h4>Observacion de anulación</h4>
        </v-alert>
        <v-card-text>
          <v-col cols="12" sm="12" md="12">
            <v-textarea
              auto-grow
              v-model="ordenAnular.observacionAnular"
              label="Observación"
              dense
            >
            </v-textarea>
          </v-col>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            dark
            small
            @click="(modalAnularOrdenes = false), limpiarData()"
          >
            Cerrar
          </v-btn>
          <v-btn color="success" dark small @click="anularOrden()">
            Actualizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modaldescricionCambios" persistent width="1200">
      <v-card>
        <v-alert border="left" text dense type="info">
          <h4>Histórico de cambios realizados</h4>
        </v-alert>
        <v-container>
          <v-row dense>
            <v-col cols="12" sm="12" md="12">
              <v-timeline align-top>
                <v-timeline-item
                  v-for="(item, i) in descripcionCambio"
                  :key="i"
                  icon="mdi-message-arrow-left-outline"
                >
                  <v-card color="blue-grey" style="color: white">
                    <v-card-title>
                      {{ item.accion }} - {{ item.created_at.substring(0, 10) }}
                    </v-card-title>
                    <v-card-text class="white text--primary">
                      {{ item.observacion }}
                      <p v-if="item.cantidad_anterior">
                        <b>Cantidad anterior: </b>{{ item?.cantidad_anterior }}
                      </p>
                      <p v-if="item.cup_anterior">
                        <b>Servicio CUP anterior: </b>{{ item?.cup.nombre }}
                      </p>
                      <p v-if="item.rep_anterior_id">
                        <b>prestador anterior: </b>{{ item?.rep.nombre }}
                      </p>
                      <p>
                        <b>Usuario que modifica:</b>
                        {{
                          item?.user?.operador?.nombre_completo ||
                          `sin
                                                nombre`
                        }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" dark small @click="modaldescricionCambios = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modaldescricionAuditoria" persistent width="550">
      <v-card>
        <v-alert border="left" text dense type="info">
          <h4>Observaciones de auditoria</h4>
        </v-alert>
        <v-container>
          <v-row dense>
            <v-col
              v-for="(item, index) in descripcionAuditoria"
              :key="index"
              cols="12"
              sm="12"
              md="12"
            >
              <p>
                <b>Auditoria realizada el día:</b>
                {{ item.created_at.substring(0, 10) }}
              </p>
              <p>
                <b>Realizada por:</b>
                {{ item.user?.operador?.nombre_completo }}
              </p>
              <div>
                <b>Observaciones:</b>
                <p>{{ item.observaciones }}</p>
              </div>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            dark
            small
            @click="modaldescricionAuditoria = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="modaldescricionAuditoriaMedicamento"
      persistent
      width="550"
    >
      <v-card>
        <v-alert border="left" text dense type="info">
          <h4>Observaciones de auditoria</h4>
        </v-alert>
        <v-container>
          <v-row dense>
            <v-col
              v-for="(item, index) in descripcionAuditoria"
              :key="index"
              cols="12"
              sm="12"
              md="12"
            >
              <p>
                <b>Auditoria realizada el día:</b>
                {{ item.created_at.substring(0, 10) }}
              </p>
              <p>
                <b>Realizada por:</b>
                {{ item.user?.operador?.nombre_completo }}
              </p>
              <div>
                <b>Observaciones:</b>
                <p>{{ item.observaciones }}</p>
              </div>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-container>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            dark
            small
            @click="modaldescricionAuditoriaMedicamento = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent width="1500px" v-model="dialogoDetalleOrden">
      <v-card>
        <v-alert dense text border="left" type="success"
          >Detalle de la orden</v-alert
        >
        <v-col cols="12" sm="12" md="12">
          <AfiliadoComponent
            :afiliado="afiliado"
            :modoDetalle="true"
            :modoEdicion="true"
            :mostrarClasificaciones="true"
            @respuestaComponente="componente = null"
          />
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <v-alert dense text border="left" type="success">Adjuntos</v-alert>
          <v-col cols="12" sm="12" md="12">
            <v-data-table
              :headers="filesHeaders"
              :items="listaAdjuntos"
              dense
              no-data-text="El afiliado no tiene adjuntos"
            >
              <template v-slot:[`item.created_at`]="{ item }">
                <td>
                  {{ item.created_at.substring(0, 10) }}
                </td>
              </template>
              <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="primary"
                      class="mr-2"
                      v-bind="attrs"
                      v-on="on"
                      @click="consultarAdjunto(item.ruta)"
                    >
                      mdi-file-document
                    </v-icon>
                  </template>
                  <span>Gestionar</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark small color="red" @click="dialogoDetalleOrden = false"
            >Cerrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="preload" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Procesando Información
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoExtenderVigencia" persistent width="550">
      <v-card>
        <v-alert text dense border="left" icon="mdi-calendar" type="info"
          ><b>Extender vigencia orden</b></v-alert
        >
        <v-container fluid>
          <v-form>
            <v-row dense>
              <v-col cols="12" sm="4" md="4">
                <v-text-field
                  :rules="[fechaAnterior]"
                  type="date"
                  dense
                  v-model="formExtender.fecha_vigencia"
                  label="Nueva fecha de vigencia"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-textarea
                  auto-grow
                  dense
                  v-model="formExtender.observacion"
                  label="Observación"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              small
              color="red"
              @click="dialogoExtenderVigencia = false"
              dark
              >Cerrar</v-btn
            >
            <v-btn small color="success" @click="actualizarVigencia()"
              >Actualizar</v-btn
            >
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="mostrarCobroModal" persistent width="550">
      <v-card>
        <v-alert text dense border="left" icon="mdi-calendar" type="info"
          ><b>Cobro de ordenes</b></v-alert
        >
        <v-container fluid>
          <v-form>
            <v-row dense>
              <v-col cols="12" md="4" sm="6">
                <span>
                  <b>Valor Orden</b>
                  <br />
                  <p>$3400</p>
                </span>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <span>
                  <b>Valor Cita</b>
                  <br />
                  <p>$3400</p>
                </span>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <span>
                  <b>Valor Total</b>
                  <br />
                  <p>$3400</p>
                </span>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-autocomplete
                  :items="['Efectivo', 'Transferencia']"
                  dense
                  v-model="formCobro.pago"
                  label="Metodo de pago"
                >
                </v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6"
                v-if="formCobro.pago == 'Transferencia'"
              >
                <v-text-field
                  dense
                  v-model="formCobro.numero_referencia"
                  label="Numero Referencia"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-textarea
                  auto-grow
                  dense
                  v-model="formCobro.observacion"
                  label="Observación"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small color="red" @click="mostrarCobroModal = false" dark
              >Cerrar</v-btn
            >
            <v-btn small color="success" @click="cobrarOrden()">Cobrar</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCambiarEstadoOrden" max-width="900px" persistent>
      <v-card>
        <v-alert
          text
          dense
          color="success"
          border="left"
          icon="mdi-swap-horizontal"
          ><b>Cambiar estado de la orden</b>
        </v-alert>
        <v-card-text>
          <v-col cols="12" sm="12" md="12">
            <v-autocomplete
              label="Estados"
              outlined
              dense
              :items="estados"
              v-model="estadoSeleccionado"
              item-text="nombre"
              item-value="id"
            >
            </v-autocomplete>
          </v-col>
          <v-col>
            <v-textarea
              label="Observación"
              v-model="observacionCambioEstado"
              dense
              outlined
            ></v-textarea>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="red" dark @click="cerrarDialogCambiarEstado"
            >Cerrar</v-btn
          >
          <v-btn
            color="success"
            small
            @click="cambiarElEstado_orden()"
            :cargando="cargando"
            >Cambiar estado</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="firmaDigitalPaciente" persistent max-width="900px">
      <v-card>
        <v-col cols="12" sm="12" md="12">
          <v-alert
            text
            dense
            color="info"
            border="bottom"
            icon="mdi-lead-pencil"
            ><b
              >Firma del paciente para la orden negada #
              {{ procedimientoSeleccionado?.id }}</b
            ></v-alert
          >
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <div class="firma mb-5">
            <vueSignature width="100%" height="200px" ref="firmaPaciente" />
            <v-btn text @click="limpiarFirmaPaciente()">Limpiar</v-btn>
          </div>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small @click="cerrarDialogOrdenNegada()" dark
            >Cerrar</v-btn
          >
          <v-btn
            color="success"
            small
            @click="
              actualirzarFirmaOrdenNegada(
                procedimientoSeleccionado,
                tipoOrdenNegada
              )
            "
            :loading="loadingFirma"
            >Guardar e imprimir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ModalVerDispensacion
      :mostrarDispensacionModal.sync="mostrarDispensacionModal"
      :ordenArticuloId="ordenArticuloId"
    >
    </ModalVerDispensacion>
    <ModalVerSuspension
      :mostrarSuspensionModal.sync="mostrarSuspensionModal"
      :ordenArticuloId="ordenArticuloId"
    >
    </ModalVerSuspension>

    <ModalDireccionamiento
      :mostrarDireccionamiento.sync="mostrarDireccionamiento"
      :seleccionados="seleccionados"
      :tipo="formFilter.tipo"
      @limpiarSeleccionados="limpiarObjetos"
      @buscar="buscarOrdenes"
    >
    </ModalDireccionamiento>

    <modal-detalles-orden-usada
      :mostrar-modal-detalles-orden-usada.sync="mostrarModalDetallesOrdenUsada"
      :orden-seleccionada="ordenSeleccionada"
    />
  </div>
</template>
<script>
import AfiliadoComponent from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import ModalVerDispensacion from "@/components/historico/ModalVerDispensacion.vue";
import ModalVerSuspension from "@/components/historico/ModalVerSuspension.vue";
import ModalDireccionamiento from "~/components/historico/ModalDireccionamiento.vue";
import vueSignature from "vue-signature";
import { mapActions } from "vuex";
import ModalDetallesOrdenUsada from "@/components/historico/ordenamiento/modalDetallesOrdenUsada.vue";

export default {
  middleware({ $can, redirect }) {
    if (!$can("historico.atenciones.ordenes")) {
      return redirect("/");
    }
  },
  components: {
    AfiliadoComponent,
    ModalVerDispensacion,
    ModalVerSuspension,
    ModalDireccionamiento,
    vueSignature,
    ModalDetallesOrdenUsada,
  },
  name: "historicoOrdenes",
  data: () => ({
    gestiones: [],
    modalDetalleGestion: false,
    colorEstado: {
      50: "warning",
      51: "success",
      58: "success",
      30: "error",
      8: "error",
    },
    seleccionados: [],
    generando: false,
    mostrarDispensacionModal: false,
    mostrarSuspensionModal: false,
    mostrarDireccionamiento: false,
    ordenArticuloId: null,
    estadoSeleccionado: "",
    firmaDigitalPaciente: false,
    loadingNegacion: false,
    pagina: 1,
    total: 0,
    opciones: [5, 10, 20, 50, 100],
    opcionActual: 5,
    datosEnvioEmail: null,
    modalAnularOrdenes: false,
    dialogoDetalleOrden: false,
    modaldescricionAuditoria: false,
    modaldescricionCambios: false,
    mostrarCobroModal: false,
    modaldescricionAuditoriaMedicamento: false,
    listaPrestadores: [],
    datosExtension: "",
    dialogoAnular: false,
    emailEnvio: null,
    modalEmail: false,
    dialogoNota: false,
    preload: false,
    cargando: false,
    dialogoDireccionamiento: false,
    dialogoExtenderVigencia: false,
    observacionCambioEstado: "",
    prestador2: null,
    prestadores: [],
    rep_id: "",
    afiliado: [],
    direccionamiento: {},
    formExtender: {
      fecha_vigencia: "",
      observacion: "",
    },
    formAuditoria: {
      estado: null,
      observacion: null,
    },
    cambioRep: {
      rep_id: null,
    },
    descripcionAuditoria: [],
    descripcionCambio: [],
    ModalPrestadorprestador: false,
    datosNota: {},
    modalCambiarEstado: false,
    dialogoExportar: false,
    search: "",
    focoOrdenId: false,
    dialogCambiarEstadoOrden: false,
    procedimientoSeleccionado: null,
    loadingFirma: false,
    formFilter: {
      documento: "",
      tipo: "",
      orden_id: "",
      fecha_vigencia_desde: "",
      fecha_vigencia_hasta: "",
      cs_nombre: "",
      cp_nombre: "",
    },
    formCobro: {
      pago: null,
      numero_referencia: null,
      observacion: null,
    },
    ordenes: [],
    tipos: [],
    filesHeaders: [
      {
        text: "Nombre",
        align: "center",
        value: "nombre",
      },
      {
        text: "Fecha",
        align: "",
        value: "created_at",
      },
      {
        text: "Adjunto",
        align: "center",
        value: "acciones",
      },
    ],
    headersMedicamentos: [
      {
        text: "",
        align: "center",
        sortable: false,
        value: "seleccionados",
      },
      {
        text: "# Consecutivo",
        align: "center",
        sortable: true,
        value: "id",
      },
      {
        text: "# Orden",
        align: "center",
        sortable: false,
        value: "orden_id",
      },
      {
        text: "Paginacion",
        align: "center",
        sortable: false,
        value: "paginacion",
      },
      {
        text: "Fecha creacion",
        align: "center",
        sortable: true,
        value: "fechaCreacion",
      },
      {
        text: "Fecha vigencia",
        align: "center",
        sortable: true,
        value: "fecha_vigencia",
      },
      {
        text: "Código",
        align: "center",
        sortable: false,
        value: "codigo",
      },
      {
        text: "Nombre",
        align: "center",
        sortable: false,
        value: "nombre",
      },
      {
        text: "Administración",
        align: "center",
        sortable: false,
        value: "via",
      },
      {
        text: "Dosificación",
        align: "center",
        sortable: false,
        value: "dosis",
      },
      {
        text: "Duración",
        align: "center",
        sortable: false,
        value: "duracion",
      },
      {
        text: "# total a dispensar",
        align: "center",
        sortable: false,
        value: "cantidad_mensual_disponible",
      },
      {
        text: "Rep",
        align: "center",
        sortable: false,
        value: "rep.nombre",
      },
      {
        text: "Estado",
        align: "center",
        sortable: false,
        value: "estado",
      },
      {
        text: "Funcionario",
        align: "center",
        sortable: false,
        value: "orden.funcionario.operador.nombre_completo",
      },
      {
        text: "",
        align: "center",
        sortable: false,
        value: "imprimir",
      },
      {
        text: "Acciones",
        align: "center",
        sortable: false,
        value: "acciones",
      },
      {
        text: "Detalles",
        align: "center",
        sortable: false,
        value: "detallesMedicamentos",
      },
      {
        text: "Anexo",
        align: "center",
        sortable: false,
        value: "anexo",
      },
    ],
    headersServicios: [
      {
        text: "",
        align: "center",
        sortable: false,
        value: "seleccionados",
      },
      {
        text: "# Consecutivo",
        align: "center",
        sortable: true,
        value: "id",
      },
      {
        text: "# Orden",
        align: "center",
        sortable: false,
        value: "orden_id",
      },
      {
        text: "Fecha creacion",
        align: "center",
        sortable: true,
        value: "fechaCreacion",
      },
      {
        text: "Fecha vigencia",
        align: "center",
        sortable: true,
        value: "fecha_vigencia",
        thProps: { class: "text-no-wrap" },
      },
      {
        text: "Dirección prestador",
        align: "center",
        value: "prestador",
      },
      {
        text: "Codigo",
        align: "center",
        sortable: false,
        value: "codigo",
      },
      {
        text: "Nombre",
        align: "center",
        sortable: false,
        value: "nombre",
      },
      {
        text: "Cantidad ordenada",
        align: "center",
        sortable: false,
        value: "cantidad",
      },
      {
        text: "Cantidad usada",
        align: "center",
        sortable: false,
        value: "cantidad_usada",
      },
      {
        text: "Enviado a fomag",
        align: "center",
        sortable: false,
        value: "enviado",
      },
      {
        text: "Estado Servicio",
        align: "center",
        sortable: false,
        value: "estado",
      },
      {
        text: "Funcionario",
        align: "center",
        sortable: false,
        value: "orden.funcionario.operador.nombre_completo",
      },
      {
        text: "Estado Gestion Prestador",
        align: "center",
        sortable: false,
        value: "estadoGestionPrestador",
      },
      {
        text: "",
        align: "center",
        sortable: false,
        value: "imprimir",
      },
      {
        text: "Acciones",
        align: "center",
        sortable: false,
        value: "acciones",
      },
      {
        text: "Detalles",
        align: "center",
        sortable: false,
        value: "detalles",
      },
      {
        text: "Anexo",
        align: "center",
        sortable: false,
        value: "anexo",
      },
      {
        text: "Certificado",
        align: "center",
        sortable: false,
        value: "certificado",
      },
    ],
    ordenAnular: {
      observacionAnular: null,
    },
    cupsDireccionar: null,
    tipoOrden: "",
    prestador: "",
    listaAdjuntos: [],
    reporte: {
      fecha_inicial: "",
      fecha_final: "",
      estado_id: "",
    },
    estados: [
      {
        nombre: "PENDIENTE POR AUTORIZAR",
        id: 3,
      },
      {
        nombre: "INADECUADO",
        id: 20,
      },
      {
        nombre: "NEGADO",
        id: 21,
      },
      {
        nombre: "ANULADO",
        id: 5,
      },
      {
        nombre: "APROBADO SIN AUTORIZACIÓN",
        id: 1,
      },
      {
        nombre: "APROBADO CON AUTORIZACIÓN",
        id: 4,
      },
    ],
    estadosActualizar: [
      // {
      //   id: 4,
      //   nombre: "Autorizado"
      // },
      // {
      //   id: 20,
      //   nombre: "Inadecuado"
      // },
      // {
      //   id: 21,
      //   nombre: "Negado"
      // },
      {
        id: 5,
        nombre: "Anulado",
      },
    ],
    fechaAnterior: (value) => {
      const today = new Date().toISOString().split("T")[0];
      return value >= today || "La fecha debe ser hoy o en el futuro";
    },
    mostrarModalDetallesOrdenUsada: false,
    ordenSeleccionada: {},
  }),

  watch: {
    // prestador(val) {
    //   if (val) {
    //     if (val.length === 6) {
    //       this.listarPrestadores();
    //     } else if (val.length < 6) {
    //       this.listaPrestadores = null;
    //     }
    //   } else {
    //     this.listaPrestadores = null;
    //   }
    // },
    prestador2(val) {
      if (val) {
        if (val.length === 6) {
          this.listarPrestadores2();
        } else if (val.length < 6) {
          this.prestadores = null;
        }
      } else {
        this.prestadores = null;
      }
    },
  },

  methods: {
    ...mapActions("app", ["setPreload"]),

    buscarOrdenes() {
      const tipoSeleccionado = this.tipos.find(
        (t) => t.id === this.formFilter.tipo
      );

      if (this.formFilter.tipo == "") {
        return this.$toast.error("Por favor seleccione un tipo de orden");
      }

      if (this.formFilter.documento == "") {
        return this.$toast.error("Por favor ingrese un documento");
      }
      this.cargando = true;
      if (this.formFilter) {
        this.ordenes = [];
        let Data = {
          documento: this.formFilter.documento,
          tipo: this.formFilter.tipo,
          orden_id: this.formFilter.orden_id,
          fecha_vigencia_desde: this.formFilter.fecha_vigencia_desde,
          fecha_vigencia_hasta: this.formFilter.fecha_vigencia_hasta,
          cs_nombre: this.formFilter.cs_nombre,
          cp_nombre: this.formFilter.cp_nombre,
        };
        // this.cargando = false
        this.$axios
          .post(
            `/ordenamiento/historico?page=${this.pagina}&cant=${this.opcionActual}`,
            Data
          )
          .then((res) => {
            this.ordenes = res.data.data;
            this.total = res.data.last_page;
            this.limpiarObjetos();
            if (this.ordenes.length === 0) {
              return this.$swal.fire({
                title: "¡No hay ordenes encontradas!",
                text: `El afilidado no tiene ordenes de tipo: ${tipoSeleccionado.nombre}`,
                type: "warning",
                confirmButtonText: "Aceptar",
              });
            }
            if (
              this.ordenes[0].orden.consulta.afiliado.estado_afiliacion_id == 31
            ) {
              this.$toast.error("Este afiliado se encuentra Retirado");
            }
          })
          .catch((e) => {
            this.$toast.error(e.response.data.error);
          })
          .finally(() => {
            this.cargando = false;
          });
      }
    },

    manejarEnter(event) {
      if (event.key === "Enter" && this.focoOrdenId) {
        this.buscarOrdenes();
      }
    },
    exportar() {
      this.dialogoExportar = true;
    },

    generarReporte() {
      if (
        this.reporte.fecha_final == "" ||
        this.reporte.fecha_inicial == "" ||
        this.reporte.estado_id == ""
      ) {
        return this.$swal({
          title: "¡Error!",
          text: "Deber determinar un rango de fechas y un estado para generar el reporte",
          type: "error",
        });
      }
      this.$axios({
        method: "post",
        params: {
          fecha_inicial: this.reporte.fecha_inicial,
          fecha_final: this.reporte.fecha_final,
          estado_id: this.reporte.estado_id,
        },
        url: "/ordenamiento/exportarServicios",
        responseType: "blob",
      })
        .then((res) => {
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
          });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");

          a.download = "servicios.xlsx";
          a.href = url;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.clear();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    limpiar() {
      for (const key in this.formFilter) {
        this.formFilter[key] = "";
      }
    },

    limpiarDatos_Filtros() {
      (this.ordenes = []),
        (this.formFilter = {
          documento: "",
          tipo: "",
          orden_id: "",
          fecha_vigencia_desde: "",
          fecha_vigencia_hasta: "",
          cs_nombre: "",
          cp_nombre: "",
        });
    },
    tipoOrdenes() {
      this.$axios.get("/ordenamiento/tipos").then((res) => {
        this.tipos = res.data.filter((tipo) => tipo.id !== 5);
      });
    },

    //
    imprimir(item) {
      (this.generando = true), (this.preload = true);
      if (this.formFilter.tipo === 1) {
        this.tipoOrden = "medicamento";
      } else if (this.formFilter.tipo === 2) {
        this.tipoOrden = "servicio";
      } else if (this.formFilter.tipo === 3) {
        this.tipoOrden = "codigoPropio";
      }

      let pdf = {
        tipo: this.tipoOrden,
        id: item.orden_id,
        filtro: item.estado_id,
        detalles: {
          id: item.id,
        },
        documento: this.formFilter.documento,
      };
      this.$axios
        .post("/pdf", pdf, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          this.preload = false;
          this.generando = false;
          let blob = new Blob([res.data], {
            type: "application/pdf",
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        })
        .catch((res) => {
          this.preload = false;
          this.generando = false;
        });
    },

    cambiarEstado(item) {
      this.modalCambiarEstado = true;
      this.formAuditoria.id = item.id;
      if (this.formFilter.tipo === 1) {
        this.formAuditoria.tipo = 1;
      } else {
        this.formAuditoria.tipo = 2;
      }
    },

    enviarEstado() {
      let data = this.formAuditoria;
      if (data.observacion === null || data.estado === null) {
        return this.$swal.fire({
          title: "¡No puede ser!",
          text: "Debe determinar un estado e ingresar una observación",
          type: "error",
          footer: "<p>Por favor valide la información ingresada</p>",
        });
      }
      this.preload = true;
      this.$axios
        .$post("/auditoria/cambiar-auditoria-estado", data)
        .then((res) => {
          this.preload = false;
          this.buscarOrdenes();
          this.modalCambiarEstado = false;
          for (const key in this.formAuditoria) {
            this.formAuditoria[key] = "";
          }
        })
        .catch((e) => {
          this.preload = false;
        });
    },

    actualizarVigencia() {
      this.preload = true;
      let Data = {
        observacion: this.formExtender.observacion,
        fecha_vigencia: this.formExtender.fecha_vigencia,
        orden_procedimiento_id: this.datosExtension,
        accion: "Extención de vigencia de la orden",
        tipo: this.formFilter.tipo,
      };
      this.$axios
        .post("/ordenamiento/actualizarVigencia", Data)
        .then((res) => {
          this.$toast.success(
            "Se ha extendido la vigencia de la orden exitosamente!."
          );
          this.preload = false;
          this.dialogoExtenderVigencia = false;
          this.datosExtension = "";
          this.buscarOrdenes();
        })
        .catch((error) => {
          this.preload = false;
          this.$toast.error("Error al actualizar la vigencia de la ordem");
        });
    },

    verNota(item) {
      if (item) {
        if (item.length > 0) {
          this.datosNota = item[0];
          this.dialogoNota = true;
        }
      }
    },

    imprimirRecomendacion(id, tipo) {
      this.preload = true;
      const data = {
        tipo: tipo,
        consulta: id,
      };
      this.$axios
        .post("pdf", data, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          this.preload = false;
          let blob = new Blob([res.data], {
            type: "application/pdf",
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        })
        .catch((res) => {
          console.log(res);
          this.preload = false;
        });
    },

    imprimirNegacion(procedimientoSeleccionado, tipo) {
      const data = {
        tipo: "formatoNegacion",
        tipoOrden: tipo,
      };
      if (tipo === "Servicio") {
        data.orden_procedimiento = [].concat(procedimientoSeleccionado);
      } else if (tipo === "Medicamento") {
        data.orden_articulo = [].concat(procedimientoSeleccionado);
      }
      this.setPreload(true);
      this.$axios
        .post("pdf", data, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          let blob = new Blob([res.data], {
            type: "application/pdf",
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        })
        .catch((res) => {
          console.log(res);
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
    limpiarFirmaPaciente() {
      this.$refs.firmaPaciente.clear();
    },

    abrirDialogFirmaPaciente(item, tipoOrdenNegada) {
      console.log(item.auditorias?.[0]?.firma_electronica); // Protege el acceso

      if (
        item.auditoria?.[0]?.firma_electronica == null &&
        item.auditorias?.[0]?.firma_electronica == null
      ) {
        this.firmaDigitalPaciente = true;
      } else {
        this.imprimirNegacion(item, tipoOrdenNegada);
      }

      this.procedimientoSeleccionado = item;
      this.tipoOrdenNegada = tipoOrdenNegada;
    },

    actualirzarFirmaOrdenNegada(procedimientoSeleccionado, tipoOrdenNegada) {
      const auditoria =
        procedimientoSeleccionado.auditoria?.[0]?.id ??
        procedimientoSeleccionado.auditorias?.[0]?.id ??
        null;

      const data = {
        firma: this.$refs.firmaPaciente.save(),
        auditoria,
      };
      this.loadingFirma = true;
      this.$axios
        .put("ordenamiento/firmaAfiliadoOrdenNegada", data)
        .then(() => {
          this.$toast.success("Actualizado con éxito");
          this.imprimirNegacion(procedimientoSeleccionado, tipoOrdenNegada);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loadingFirma = false;
        });
    },

    cerrarDialogOrdenNegada() {
      this.firmaDigitalPaciente = false;
      this.$refs.firmaPaciente.clear();
    },
    extenderVigencia(item) {
      this.datosExtension = item;
      this.dialogoExtenderVigencia = true;
    },

    modalAnularOrden(item) {
      this.modalAnularOrdenes = true;
      this.ordenAnular = item;
    },

    modaldescripcionAuditoria(item) {
      this.modaldescricionAuditoria = true;
      this.descripcionAuditoria = item.auditoria;
    },

    modaldescripcionCambios(item) {
      this.modaldescricionCambios = true;
      this.descripcionCambio = item.cambio_orden;
    },

    modaldescripcionAuditoriaMedicamento(item) {
      this.modaldescricionAuditoriaMedicamento = true;
      this.descripcionAuditoria = item.auditorias;
    },

    anularOrden() {
      this.$swal({
        title: "¿Esta seguro que desea anular la orden?",
        text: "Al aceptar este mensaje, se realizara el cambio del estado",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          this.modalAnularOrdenes = false;
          this.preload = true;
          let Data = {
            tipo: this.formFilter.tipo,
            id: this.ordenAnular.id,
            observacion: this.ordenAnular.observacionAnular,
            estado: 5,
          };
          this.$axios
            .post("/auditoria/cambiar-auditoria-estado", Data)
            .then((res) => {
              this.$toast.success(
                "Se cambió el estado de la orden correctamente"
              );
              this.preload = false;
              this.buscarOrdenes();
            })
            .catch((error) => {
              this.preload = false;
              this.$toast.error("Error al cambiar el estado de la orden");
            });
        }
      });
    },

    abrirModalDetalle(item) {
      this.dialogoDetalleOrden = true;
      this.afiliado = item.orden.consulta.afiliado;
      this.buscarAdjuntos(item.orden.consulta.afiliado.id);
    },

    buscarAdjuntos(item) {
      this.preload = true;
      this.$axios
        .post("transcripciones/buscarAdjuntos", {
          afiliado_id: item,
        })
        .then((res) => {
          this.listaAdjuntos = res.data;
          this.preload = false;
        })
        .catch((e) => {
          this.preload = false;
          this.$toast.error(e.response.data.error);
        });
    },

    async consultarAdjunto(ruta) {
      try {
        let adj = await this.$adjuntos(ruta);
        let blob = new Blob([adj[1]], {
          type: adj[0],
        });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        window.open(link.href, "_blank");
      } catch (error) {
        console.log(error.Response);
      }
    },

    listarPrestadores(
      cup_id,
      codigo_propio_id,
      paquete_servicio_id,
      entidad_id,
      tipo
    ) {
      this.setPreload(true);
      this.$axios
        .post("direccionamiento/cambio-direccionamiento", {
          cup_id: cup_id,
          codigo_propio_id: codigo_propio_id,
          paquete_servicio_id: paquete_servicio_id,
          entidad_id: entidad_id,
          tipo: tipo,
        })
        .then((res) => {
          this.setPreload(false);
          this.listaPrestadores = res.data.map((rep) => {
            return {
              id: rep.id,
              nombre: `${rep.prestadores.nit}-${rep.nombre} - ${rep.municipio.nombre}`,
            };
          });
        })
        .catch((e) => {
          this.setPreload(false);
          console.log(e);
        });
    },

    listarPrestadores2() {
      this.preload = true;
      this.$axios
        .post("reps/listar?page=0", {
          prestador: this.prestador2,
        })
        .then((res) => {
          this.preload = false;
          this.prestadores = res.data.map((rep) => {
            return {
              id: rep.id,
              nombre: `${rep.prestadores.nit}-${rep.nombre} - ${rep.municipio.nombre}`,
            };
          });
        })
        .catch((e) => {
          this.preload = false;
          console.log(e);
        });
    },

    openDialog(item) {
      this.ModalPrestadorprestador = true;
      this.cambioRep.id = item.id;
      this.listarPrestadores(
        item.cup_id,
        item.codigo_propio_id,
        item.paquete_servicio_id,
        item.orden.consulta.afiliado.entidad_id,
        this.formFilter.tipo
      );
    },

    actualizarRep() {
      if (this.cambioRep.rep_id == undefined) {
        return this.$swal({
          title: "¡No puede ser!",
          text: "Es necesario que determine un nuevo prestador para actualizar el direccionamiento",
          type: "error",
        });
      }
      this.preload = true;
      this.$axios
        .post("ordenamiento/actualizarRep", {
          id: this.cambioRep.id,
          rep_id: this.cambioRep.rep_id.id,
          tipo: this.formFilter.tipo,
        })
        .then((res) => {
          this.preload = false;
          this.limpiarData();
          this.ModalPrestadorprestador = false;
          this.dialogDetalle = false;
          this.buscarOrdenes();
        })
        .catch((e) => {
          this.preload = false;
          console.log(e);
        });
    },

    limpiarData() {
      for (const key in this.cambioRep) {
        this.cambioRep[key] = null;
      }
    },

    modalDialogo(item) {
      (this.rep_id = ""), (this.dialogoDireccionamiento = true);
      this.direccionamiento.orden_articulos_id = item.id;
    },

    asignarDireccionamiento() {
      this.$axios
        .post("ordenamiento/asignarDireccionamiento", {
          orden_articulos_id: this.direccionamiento.orden_articulos_id,
          rep_id: this.rep_id,
        })
        .then((res) => {
          this.$swal({
            title: "Orden direccionada con exito.",
            type: "success",
          });
          this.buscarOrdenes();
          this.dialogoDireccionamiento = false;
        })
        .catch((e) => {
          this.$swal({
            title: "Direccionamiento fallido.",
            type: "error",
          });
        });
    },
    SendEmail() {
      var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      if (!regex.test(this.emailEnvio)) {
        return this.$swal.fire({
          title: "Debe ingresar un correo electrónico valido",
          icon: "warning",
          type: "error",
        });
      }

      this.setPreload(true);
      let pdf = {
        tipo: this.formFilter.tipo == 2 ? "servicio" : "medicamento",
        enviar: true,
        correo: this.emailEnvio,
        detalles: {
          id: this.datosEnvioEmail.id,
        },
      };
      if (this.formFilter.tipo == 1) {
        pdf.filtro = this.datosEnvioEmail.estado_id;
        pdf.id = this.datosEnvioEmail.orden_id;
      }
      this.setPreload(true);
      this.$axios
        .post("pdf", pdf)
        .then((res) => {
          this.emailEnvio = null;
          this.datosEnvioEmail = null;
          this.modalEmail = false;
          this.setPreload(false);
          return this.$swal.fire({
            title: "¡Orden enviada con exito!",
            icon: "success",
            type: "success",
          });
        })
        .catch((err) => err.response);
    },

    descargarAnexo3(item) {
      let tipoAnexo;
      switch (this.formFilter.tipo) {
        case 1:
          tipoAnexo = "anexo3Medicamentos";
          break;
        case 2:
          tipoAnexo = "anexo3Servicios";
          break;
        case 3:
          tipoAnexo = "anexo3codigoPropio";
          break;
      }
      let pdf = {
        tipo: tipoAnexo,
        ordenamiento_id: item.id,
      };
      this.setPreload(true);
      this.$axios
        .post("/pdf", pdf, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          let blob = new Blob([res.data], {
            type: "application/pdf",
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    descargarAnexo4(item) {
      let tipoAnexo;
      switch (this.formFilter.tipo) {
        case 1:
          tipoAnexo = "anexo4Medicamentos";
          break;
        case 2:
          tipoAnexo = "anexo4Servicios";
          break;
        case 3:
          tipoAnexo = "anexo4codigoPropio";
          break;
      }
      let pdf = {
        tipo: tipoAnexo,
        ordenamiento_id: item.id,
      };
      this.setPreload(true);
      this.$axios
        .post("/pdf", pdf, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          let blob = new Blob([res.data], {
            type: "application/pdf",
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
    modalAbrir(item) {
      this.mostrarCobroModal = true;
      this.ordenArticuloId = item.id;
    },

    cobrarOrden() {
      this.$axios
        .post("ordenamiento/cobroOrdenes", {
          orden_servicio_id: this.ordenArticuloId,
        })
        .then((res) => {
          this.$swal({
            title: "Orden cobrada con exito.",
            type: "success",
          });
          this.buscarOrdenes();
          this.mostrarCobroModal = false;
        })
        .catch((e) => {
          this.$swal({
            title: "Direccionamiento fallido.",
            type: "error",
          });
        });
    },

    verDispensacion(item) {
      this.mostrarDispensacionModal = true;
      this.ordenArticuloId = item.id;
    },

    verSuspension(item) {
      this.mostrarSuspensionModal = true;
      this.ordenArticuloId = item.id;
    },

    onFocus() {
      this.focoOrdenId = true;
    },
    onBlur() {
      this.focoOrdenId = false;
    },

    CambiarEstadoOrden(item) {
      this.dialogCambiarEstadoOrden = true;
      this.itemActual = item;
    },

    cambiarElEstado_orden() {
      if (
        this.estadoSeleccionado === "" ||
        this.observacionCambioEstado === ""
      ) {
        return this.$toast.error("Campos obligatorios sin llenar");
      }
      this.loading = true;
      const data = {
        id: this.itemActual.id,
        tipo: this.itemActual.orden.tipo_orden_id,
        estado_id: this.estadoSeleccionado,
        observacion: this.observacionCambioEstado,
      };
      this.$axios
        .put("ordenamiento/actualizarEstadoOrden", data)
        .then((response) => {
          this.dialogCambiarEstadoOrden = false;
          this.buscarOrdenes();
          this.$toast.success("Actualizado con éxito");
        })
        .catch((error) => {
          this.$toast.error(
            error.response.data.error || "Error al actualizar el estado"
          );
        })
        .finally(() => {
          this.loading = false;
        });
    },
    cerrarDialogCambiarEstado() {
      this.dialogCambiarEstadoOrden = false;
      this.estadoSeleccionado = "";
    },

    cambioCheckbox(item) {
      const contador = this.seleccionados.indexOf(item.id);
      if (contador === -1) {
        this.seleccionados.push(item.id);
      } else {
        this.seleccionados.splice(contador, 1);
      }
    },

    limpiarCheckbox(item) {
      if (this.formFilter.tipo == 1) {
        const index = this.seleccionados.indexOf(item);
        if (index !== -1) {
          this.seleccionados.splice(index, 1);
        }
      }
    },

    abrirDireccionamiento() {
      this.mostrarDireccionamiento = true;
    },

    limpiarObjetos() {
      this.seleccionados = [];
    },

    async enviarFomag(item) {
      const confirmacion = confirm(
        "seguro quieres enviar esta orden a fomag ?"
      );
      if (!confirmacion) {
        return; // no hacemos nada
      }

      try {
        const response = await this.$axios.post(
          "ordenamiento/enviar-a-fomag/" + item.orden_id
        );
        this.$toast.success("la orden se ha enviado a fomag");
      } catch (error) {
        this.$toast.error(
          error.response.data.error || "Error al enviar la orden a fomag"
        );
      }
    },

    async printCertificado(pdf, clase) {
      try {
        const request = {
          orden_procedimiento: pdf.id,
          tipo: "certificadoAtencionLaboratorio",
          clase: clase,
        };
        this.setPreload(true);
        const res = await this.$axios.post("/pdf", request, {
          responseType: "arraybuffer",
        });
        const blob = new Blob([res.data], {
          type: "application/pdf",
        });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        window.open(link.href, "_blank");
      } catch (error) {
        console.log(error);
      } finally {
        this.setPreload(false);
      }
    },

    listarGestionPorPrestador(item) {
      this.setPreload(true);
      this.gestiones = [];
      this.$axios
        .get("gestion-orden-prestador/listarGestion/" + item.id)
        .then((res) => {
          this.modalDetalleGestion = true;
          this.gestiones = Array.isArray(res.data) ? res.data : [];
        })
        .catch((error) => {
          console.log(error);
          this.$toast.error("Error al listar las gestiones");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
    obtenerColorPorTipo(estado) {
      switch (parseInt(estado)) {
        case 51:
          return "green";
        case 30:
          return "red";
        case 8:
          return "orange";
        case 52:
          return "blue";
        case 58:
          return "info";
        case 50:
          return "warning";
        default:
          return "grey";
      }
    },
    obtenerIconoPorTipo(estado) {
      switch (estado) {
        case 51:
          return "mdi-account-check";
        case 30:
          return "mdi-cancel";
        case 8:
          return "mdi-alert-circle";
        case 52:
          return "mdi-phone-off";
        case 58:
          return "mdi-calendar-account";
        default:
          return "mdi-help-circle";
      }
    },
    async descargarAdjunto(ruta) {
      try {
        let adj = await this.$adjuntos(ruta);
        let blob = new Blob([adj[1]], {
          type: adj[0],
        });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        window.open(link.href, "_blank");
      } catch (error) {
        this.$toast.error("El adjunto no existe!");
        console.log(error.response);
      }
    },

    abrirModalDetallesOrdenUsada(orden) {
      this.mostrarModalDetallesOrdenUsada = true;
      this.ordenSeleccionada = orden;
    },
  },

  mounted() {
    this.tipoOrdenes();
    window.addEventListener("keyup", this.manejarEnter);
  },

  destruirEvento() {
    window.removeEventListener("keyup", this.manejarEnter);
  },
};
</script>
