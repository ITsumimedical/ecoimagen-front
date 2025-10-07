<template>
    <div>
        <v-dialog v-model="mostrarModalAsignados" max-width="2000px" persistent>
            <v-card>
                <v-alert text dense border="left" type="info" icon="mdi-account-alert" class="text-center">
                    <b>Gestionar PQRF N° {{ PQRSFSeleccionada?.id }}</b>
                </v-alert>
                <v-card-text>
                    <v-row dense v-if="PQRSFActual.afiliado">
                        <v-col cols="12" md="12" sm="12">
                            <EditarAfiliadoComponente :afiliado="PQRSFActual.afiliado" :modoDetalle="true"
                                :modoEdicion="true" :mostrarClasificaciones="true" />
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="my-4">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-form ref="formActualizarPQRSF">
                        <v-row dense>
                            <v-col cols="12" md="6" sm="6">
                                <v-text-field dense outlined label="Nombre" v-model="PQRSFActual.nombre_genera" readonly
                                    v-if="PQRSFActual.quien_genera === 'Otro'"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" sm="6">
                                <v-text-field dense outlined label="N° Documento" v-model="PQRSFActual.documento_genera"
                                    readonly v-if="PQRSFActual.quien_genera === 'Otro'"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" sm="6">
                                <v-text-field dense outlined label="Correo Electrónico"
                                    v-model="PQRSFActual.correo"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" sm="6">
                                <v-text-field dense outlined label="Teléfono o Celular" v-model="PQRSFActual.telefono"
                                    readonly></v-text-field>
                            </v-col>
                            <v-col cols="12" md="12" sm="12">
                                <v-textarea dense outlined readonly label="Descripción del caso"
                                    v-model="PQRSFActual.descripcion" auto-grow></v-textarea>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" class="mb-4">
                                <v-divider></v-divider>
                            </v-col>
                            <v-col cols="12" md="3" sm="3">
                                <v-autocomplete dense outlined label="Tipo de Requerimiento"
                                    :items="opcionesTiposSolicitudes" item-text="nombre" item-value="id"
                                    :loading="loading.opcionesTiposSolicitudes" v-model="PQRSFActual.tipo_solicitud_id"
                                    :rules="[rules.obligatorio]"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="3" sm="3">
                                <v-autocomplete dense outlined label="Priorización" :items="opcionesPriorizacion"
                                    v-model="PQRSFActual.priorizacion" :rules="[rules.obligatorio]"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="3" sm="3">
                                <v-autocomplete dense outlined label="Atributo de Calidad"
                                    :items="opcionesAtributoCalidad" v-model="PQRSFActual.atributo_calidad"
                                    :rules="[rules.obligatorio]"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="2" sm="3">
                                <v-text-field dense outlined label="Código SuperSalud"
                                    v-model="PQRSFActual.codigo_super"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="1" sm="3">
                                <v-autocomplete dense outlined label="¿Reabierta?" :items="opcionesReabierta"
                                    v-model="PQRSFActual.reabierta" :rules="[rules.obligatorio]"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" align="right">
                                <v-btn small dark color="primary" @click="actualizarPQRSF">
                                    Actualizar PQRF
                                    <v-icon right>mdi-update</v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" class="my-4">
                                <v-divider></v-divider>
                            </v-col>
                            <v-col cols="12" md="11" sm="11">
                                <v-autocomplete dense outlined label="Subcategoría(s)" item-text="nombre" return-object
                                    chips small-chips deletable-chips multiple clearable
                                    no-data-text="Escriba el nombre de la subcategoría"
                                    loading-text="Cargando... Por favor espere" :items="opcionesSubcategorias"
                                    :loading="loading.opcionesSubcategorias" v-model="PQRSFActual.subcategoria_pqrsf"
                                    @change="listarDerechosSubcategorias">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="1" sm="1">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn block dark color="primary" v-bind="attrs" v-on="on"
                                            @click="guardarSubcategorias">
                                            <v-icon>mdi-content-save-check</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Guardar Subcategoría(s)</span>
                                </v-tooltip>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" v-if="
                                PQRSFActual.tipo_solicitud_id === 2 ||
                                PQRSFActual.tipo_solicitud_id === 3
                            ">
                                <v-alert text dense border="left" type="info" v-for="item in derechosSubcategorias"
                                    :key="item.id">
                                    {{ item.descripcion }}</v-alert>
                            </v-col>
                            <v-col cols="12" md="11" sm="11">
                                <v-autocomplete dense outlined label="Medicamento(s)" item-text="nombre" return-object
                                    chips small-chips deletable-chips multiple clearable
                                    no-data-text="Escriba el nombre del medicamento para iniciar la búsqueda"
                                    loading-text="Cargando... Por favor espere" :items="opcionesCodesumis"
                                    :loading="loading.opcionesCodesumis" v-model="codesumisSeleccionados"
                                    :search-input.sync="campoBusquedaCodesumi">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="1" sm="1">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn block dark color="primary" v-bind="attrs" v-on="on"
                                            @click="guardarCodesumis">
                                            <v-icon>mdi-content-save-check</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Guardar Medicamento(s)</span>
                                </v-tooltip>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" style="
                  display: flex;
                  flex-wrap: wrap;
                  gap: 0.5rem;
                  justify-content: center;
                " v-if="
                    PQRSFActual.codesumi_pqrsf &&
                    PQRSFActual.codesumi_pqrsf.length > 0
                ">
                                <v-chip small dark color="blue-grey" v-for="item in PQRSFActual.codesumi_pqrsf"
                                    :key="item.id" @click="removerCodesumi(item)">
                                    {{ item.nombre }}
                                </v-chip>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" class="mb-4">
                                <v-divider></v-divider>
                            </v-col>
                            <v-col cols="12" md="11" sm="11">
                                <v-autocomplete dense outlined label="Servicio(s)" item-text="nombre" return-object
                                    chips small-chips deletable-chips multiple clearable
                                    no-data-text="Escriba el nombre del servicio para iniciar la búsqueda"
                                    loading-text="Cargando... Por favor espere" :items="opcionesServicios"
                                    :loading="loading.opcionesServicios" v-model="serviciosSeleccionados"
                                    :search-input.sync="campoBusquedaServicio"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="1" sm="1">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn block dark color="primary" v-bind="attrs" v-on="on"
                                            @click="guardarServicios">
                                            <v-icon>mdi-content-save-check</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Guardar Servicio(s)</span>
                                </v-tooltip>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" style="
                  display: flex;
                  flex-wrap: wrap;
                  gap: 0.5rem;
                  justify-content: center;
                " v-if="
                    PQRSFActual.servicio_pqrsf &&
                    PQRSFActual.servicio_pqrsf.length > 0
                ">
                                <v-chip small dark color="blue-grey" v-for="item in PQRSFActual.servicio_pqrsf"
                                    :key="item.id" @click="removerServicio(item)">
                                    {{ item.nombre }}
                                </v-chip>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" class="mb-4">
                                <v-divider></v-divider>
                            </v-col>
                            <v-col cols="12" md="11" sm="11">
                                <v-autocomplete dense outlined label="Area(s)" item-text="nombre" return-object chips
                                    small-chips deletable-chips multiple clearable
                                    no-data-text="Escriba el nombre del área para iniciar la búsqueda"
                                    loading-text="Cargando... Por favor espere" :items="opcionesAreas"
                                    :loading="loading.opcionesAreas" v-model="areasSeleccionadas"
                                    :search-input.sync="campoBusquedaArea"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="1" sm="1">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn block dark color="primary" v-bind="attrs" v-on="on"
                                            @click="guardarAreas">
                                            <v-icon>mdi-content-save-check</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Guardar Área(s)</span>
                                </v-tooltip>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" style="
                  display: flex;
                  flex-wrap: wrap;
                  gap: 0.5rem;
                  justify-content: center;
                " v-if="
                    PQRSFActual.area_pqrsf && PQRSFActual.area_pqrsf.length > 0
                ">
                                <v-chip small dark color="blue-grey" v-for="item in PQRSFActual.area_pqrsf"
                                    :key="item.id" @click="removerArea(item)">
                                    {{ item.nombre }}
                                </v-chip>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" class="mb-4">
                                <v-divider></v-divider>
                            </v-col>
                            <v-col cols="12" md="11" sm="11">
                                <v-autocomplete dense outlined label="IPS Afectadas(s)" item-text="nombre" return-object
                                    chips small-chips deletable-chips multiple clearable
                                    no-data-text="Escriba el nombre de la IPS para iniciar la búsqueda"
                                    loading-text="Cargando... Por favor espere" :items="opcionesReps"
                                    :loading="loading.opcionesReps" v-model="repsSeleccionados"
                                    :search-input.sync="campoBusquedaRep"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="1" sm="1">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn block dark color="primary" v-bind="attrs" v-on="on" @click="guardarReps">
                                            <v-icon>mdi-content-save-check</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Guardar IPS(s)</span>
                                </v-tooltip>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" style="
                  display: flex;
                  flex-wrap: wrap;
                  gap: 0.5rem;
                  justify-content: center;
                " v-if="PQRSFActual.ips_pqrsf && PQRSFActual.ips_pqrsf.length > 0">
                                <v-chip small dark color="blue-grey" v-for="item in PQRSFActual.ips_pqrsf"
                                    :key="item.id" @click="removerRep(item)">
                                    {{ item.nombre }}
                                </v-chip>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" class="mb-4">
                                <v-divider></v-divider>
                            </v-col>
                            <v-col cols="12" md="11" sm="11">
                                <v-autocomplete dense outlined label="Codigo(s) Propio(s)" item-text="nombre"
                                    return-object chips small-chips deletable-chips multiple clearable
                                    no-data-text="Escriba el nombre del código propio para iniciar la búsqueda"
                                    loading-text="Cargando... Por favor espere" :items="opcionesCodigosPropios"
                                    :loading="loading.opcionesCodigosPropios" v-model="codigosPropiosSeleccionados"
                                    :search-input.sync="campoBusquedaCodigosPropios"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="1" sm="1">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn block dark color="primary" v-bind="attrs" v-on="on"
                                            @click="guardarCodigosPropios">
                                            <v-icon>mdi-content-save-check</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Guardar Código(s) Propio(s)</span>
                                </v-tooltip>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" style="
                  display: flex;
                  flex-wrap: wrap;
                  gap: 0.5rem;
                  justify-content: center;
                " v-if="
                    PQRSFActual.codigo_propio_pqrsf &&
                    PQRSFActual.codigo_propio_pqrsf.length > 0
                ">
                                <v-chip small dark color="blue-grey" v-for="item in PQRSFActual.codigo_propio_pqrsf"
                                    :key="item.id" @click="removerCodigoPropio(item)">
                                    {{ item.nombre }}
                                </v-chip>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" class="mb-4">
                                <v-divider></v-divider>
                            </v-col>
                            <v-col cols="12" md="11" sm="11">
                                <v-autocomplete dense outlined label="Empleado(s)" :item-text="getNombreCompleto"
                                    return-object chips small-chips deletable-chips multiple clearable
                                    no-data-text="Escriba el nombre del empleado para iniciar la búsqueda"
                                    loading-text="Cargando... Por favor espere" :items="opcionesOperadores"
                                    :loading="loading.opcionesOperadores" v-model="operadoresSeleccionados"
                                    :search-input.sync="campoBusquedaOperador"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="1" sm="1">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn block dark color="primary" v-bind="attrs" v-on="on"
                                            @click="guardarOperadores">
                                            <v-icon>mdi-content-save-check</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Guardar Empleado(s)</span>
                                </v-tooltip>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" style="
                  display: flex;
                  flex-wrap: wrap;
                  gap: 0.5rem;
                  justify-content: center;
                " v-if="
                    PQRSFActual.operador_pqrsf &&
                    PQRSFActual.operador_pqrsf.length > 0
                ">
                                <v-chip small dark color="blue-grey" v-for="item in PQRSFActual.operador_pqrsf"
                                    :key="item.id" @click="removerOperador(item)">
                                    {{
                                        [
                                            item.nombre,
                                            item.apellido
                                        ].filter(Boolean).join(' ') || 'Sin nombre'
                                    }}
                                </v-chip>

                            </v-col>
                            <v-col cols="12" md="12" sm="12" class="mb-4">
                                <v-divider></v-divider>
                            </v-col>
                        </v-row>
                    </v-form>
                    <v-row dense v-if="PQRSFActual.gestion_pqr && PQRSFActual.gestion_pqr.length > 0" class="my-4">
                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense border="left" color="info" icon="mdi-timeline-clock-outline"
                                class="text-center">
                                <b>Histórico de la PQRF</b>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" v-for="gestion in PQRSFActual.gestion_pqr" :key="gestion.id"
                            style="
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: center;
              "
            >
              <div style="display: flex; flex-wrap: wrap; gap: 1rem">
                <div style="flex-basis: 15rem; min-width: 15rem">
                  <b>Usuario</b>
                  <br />
                  <span>
                    {{
                      gestion?.user?.tipo_usuario_id === 2
                        ? "Afiliado"
                        : gestion?.user?.operador?.nombre_completo
                    }}
                  </span>
                </div>
                <div style="flex-basis: 25rem; min-width: 25rem">
                  <b>Área</b>
                  <br />
                  <span>
                    {{
                      gestion?.area_responsable
                        ? gestion?.area_responsable?.nombre
                        : "-"
                    }}
                  </span>
                </div>
                <div style="flex-basis: 15rem; min-width: 15rem">
                  <b>Fecha</b>
                  <br />
                  <span>{{ $moment(gestion?.created_at).format('YYYY-MM-D H:mm') }}</span>
                </div>
                <div style="flex-basis: 15rem; min-width: 15rem">
                  <b>Tipo | <i>{{ gestion?.tipo?.nombre }}</i></b>
                  <br />
                  <span>{{ gestion?.tipo?.descripcion }}</span>
                </div>
              </div>
              <div>
                <b>Descripción</b>
                <br />
                <span>{{ gestion?.motivo }}</span>
              </div>
              <div>
                <b>Adjuntos</b>
                <br />
                <div
                  style="
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    justify-content: center;
                  ">
                                    <v-btn small dark color="blue-grey" v-for="adjunto in gestion.adjuntos"
                                        :key="adjunto.id" @click="consultarAdjunto(adjunto.ruta)">
                                        {{ adjunto.nombre }}
                                    </v-btn>
                                    <span v-if="gestion.adjuntos.length === 0">Sin adjuntos para mostrar</span>
                                </div>
                            </div>
                            <v-divider class="my-2"></v-divider>
                        </v-col>
                    </v-row>
                    <v-form ref="formResponderPQRF">
                        <v-row dense>
                            <v-col cols="12" md="12" sm="12">
                                <v-alert text dense border="left" color="success" icon="mdi-send-check"
                                    class="text-center">
                                    <b>Responder PQRF</b>
                                </v-alert>
                            </v-col>
                            <v-col cols="12" md="1" sm="1" align="center">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on">
                                            <v-icon x-large>mdi-information-variant</v-icon>
                                        </span>
                                    </template>
                                    <span>
                                        <b>Importante:</b>
                                        <ul>
                                            <li>Devolver: La PQRF No le pertenece.</li>
                                            <li>Parcial: La PQRF todavía está en gestió.</li>
                                            <li>Final: La PQRF está completamente gestionada.</li>
                                        </ul>
                                    </span>
                                </v-tooltip>
                            </v-col>
                            <v-col cols="12" md="5" sm="5">
                                <v-select dense outlined label="Tipo de Respuesta *"
                                    v-model="formResponder.tipo_respuesta" :items="opcionesTiposRespuesta"
                                    :rules="[rules.obligatorio]" item-text="nombre" item-value="valor"></v-select>
                            </v-col>
                            <v-col cols="12" md="6" sm="6">
                                <v-autocomplete dense outlined label="Seleccione el área que responde *"
                                    :items="opcionesAreasOperador" item-text="nombre" item-value="id"
                                    :loading="loading.opcionesAreasOperador" v-model="formResponder.area_responsable"
                                    :rules="[rules.obligatorio]"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="12" sm="12">
                                <v-textarea dense outlined label="Respuesta *" v-model="formResponder.observacion"
                                    :rules="[rules.obligatorio, rules.min]" auto-grow></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-file-input dense outlined v-model="formResponder.adjuntos" label="Adjuntar Archivos"
                                    counter show-size append-icon="mdi-paperclip" prepend-icon="" multiple clearable
                                    small-chips accept=".jpg, .jpeg, ,.png, .pdf"
                                    :rules="[rules.fileSize]"></v-file-input>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn v-if="$can('pqrsf.solucionarCentral')" color="success" small dark
                        @click="abrirModalSolucionar">Solucionar</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small dark @click="cerrarModal">Cerrar</v-btn>
                    <v-btn color="success" small dark @click="enviarFormuarioPqrsf">Guardar</v-btn>
                    <v-btn color="warning" v-if="$can('pqrsf.anular')" small dark @click="abrirModalAnular">
                        Anular
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modales -->
        <modalAnularPqrsf :mostrarModalAnular.sync="mostrarModalAnular" :pqrsf="PQRSFSeleccionada"
            @cerrarModal="cerrarModal" @recargarPQRFs="listarPQRSFAsignados" />

        <modalSolucionarPqrsf :solucionCentral="true" :mostrarModalSolucionar.sync="mostrarModalSolucionar"
            :pqrsf="PQRSFSeleccionada" @cerrarModal="cerrarModal" @recargarPQRFs="listarPQRSFAsignados" />
    </div>
</template>
<script>
import { mapActions } from "vuex";
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import modalAnularPqrsf from "@/components/pqrsf/centralPqrf/modalAnularPqrsf.vue";
import ModalSolucionarPqrsf from './modalSolucionarPqrsf.vue';

export default {
    components: {
        EditarAfiliadoComponente,
        modalAnularPqrsf,
        ModalSolucionarPqrsf,
    },
    props: {
        mostrarModalAsignados: {
            type: Boolean,
            default: false,
        },
        PQRSFSeleccionada: {
            type: Object,
            default: () => { },
        },
    },
    data() {
        return {
            PQRSFActual: {},
            opcionesTiposSolicitudes: [],
            loading: {
                opcionesTiposSolicitudes: false,
                opcionesSubcategorias: false,
                opcionesCodesumis: false,
                opcionesServicios: false,
                opcionesAreas: false,
                opcionesReps: false,
                opcionesCodigosPropios: false,
                opcionesOperadores: false,
                opcionesAreasOperador: false,
            },
            rules: {
                obligatorio: (value) =>
                    (value !== null && value !== undefined && value !== "") ||
                    "Este campo es obligatorio.",
                min: (v) =>
                    v.length >= 10 || "Este campo debe tener al menos 10 caracteres",
                fileSize: (files) => {
                    if (!files || !files.length) return true;
                    for (let file of files) {
                        if (file.size > 1073741824) {
                            return "Cada archivo no debe superar 1GB";
                        }
                    }
                    return true;
                },
            },
            opcionesPriorizacion: [
                "Riesgo Vital (1 Día)",
                "Riesgo priorizado (2 Días)",
                "Riesgo simple (3 Días)",
                "Peticiones generales (10 Días)",
            ],
            opcionesAtributoCalidad: [
                "Accesibilidad",
                "Oportunidad",
                "Seguridad",
                "Pertinencia",
                "Continuidad",
                "Satisfaccion del Usuario",
                "No Aplica",
            ],
            opcionesReabierta: [
                { text: "Si", value: true },
                { text: "No", value: false },
            ],
            opcionesSubcategorias: [],
            derechosSubcategorias: [],
            opcionesCodesumis: [],
            campoBusquedaCodesumi: null,
            codesumisSeleccionados: [],
            opcionesServicios: [],
            campoBusquedaServicio: null,
            serviciosSeleccionados: [],
            opcionesAreas: [],
            campoBusquedaArea: null,
            areasSeleccionadas: [],
            opcionesReps: [],
            campoBusquedaRep: null,
            repsSeleccionados: [],
            opcionesCodigosPropios: [],
            campoBusquedaCodigosPropios: null,
            codigosPropiosSeleccionados: [],
            opcionesOperadores: [],
            campoBusquedaOperador: null,
            operadoresSeleccionados: [],
            formResponder: {
                tipo_respuesta: null,
                observacion: "",
                adjuntos: [],
                area_responsable: null,
            },
            opcionesTiposRespuesta: [
                { nombre: "Parcial", valor: 44 },
                { nombre: "Final", valor: 8 },
                { nombre: "Devolver", valor: 22 },
            ],
            opcionesAreasOperador: [],
            mostrarModalAnular: false,
            mostrarModalSolucionar: false,
            solucionCentral: false,
        };
    },

    mounted() {
        this.listarTiposSolicitudes();
        this.listarOpcionesSubcategorias();
    },
    watch: {
        mostrarModalAsignados(newValue) {
            if (newValue) {
                this.buscarPQRSF();
                this.listarOpcionesAreasOperador();
            }
        },
        campoBusquedaCodesumi(newValue) {
            if (newValue && newValue.length === 4) {
                this.listarOpcionesCodesumis();
            }
        },
        campoBusquedaServicio(newValue) {
            if (newValue && newValue.length === 4) {
                this.listarOpcionesServicios();
            }
        },
        campoBusquedaArea(newValue) {
            if (newValue && newValue.length === 4) {
                this.listarOpcionesAreas();
            }
        },
        campoBusquedaRep(newValue) {
            if (newValue && newValue.length === 4) {
                this.listarOpcionesReps();
            }
        },
        campoBusquedaCodigosPropios(newValue) {
            if (newValue && newValue.length === 4) {
                this.listarOpcionesCodigosPropios();
            }
        },
        campoBusquedaOperador(newValue) {
            if (newValue && newValue.length === 4) {
                this.listarOpcionesOperadores();
            }
        },
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        cerrarModal() {
            this.PQRSFActual = {};
            this.limpiarFormularioResponder();
            this.$emit("update:mostrarModalAsignados", false);
        },

        buscarPQRSF() {
            this.setPreload(true);

            this.$axios
                .post("/formularios-pqrsf/listarAsignadosInternaDetalle", {
                    pqr_id: this.PQRSFSeleccionada.id,
                })
                .then((res) => {
                    this.PQRSFActual = res.data;
                    this.listarDerechosSubcategorias();
                })
                .catch((error) => {
                    this.$toast.error("Error al cargar la información de la PQRF");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        listarTiposSolicitudes() {
            this.loading.opcionesTiposSolicitudes = true;
            this.$axios
                .get("/tipos-solicitudes-pqrsf/listar")
                .then((res) => {
                    this.opcionesTiposSolicitudes = res.data.data;
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar los tipos de solicitudes.");
                })
                .finally(() => {
                    this.loading.opcionesTiposSolicitudes = false;
                });
        },

        actualizarPQRSF() {
            if (!this.$refs.formActualizarPQRSF.validate()) {
                return;
            }

            const data = {
                reabierta: this.PQRSFActual.reabierta,
                priorizacion: this.PQRSFActual.priorizacion,
                atributo_calidad: this.PQRSFActual.atributo_calidad,
                pqrsf_id: this.PQRSFActual.id,
                tipo_solicitud: this.PQRSFActual.tipo_solicitud_id,
                codigo_super: this.PQRSFActual.codigo_super,
                correo: this.PQRSFActual.correo,
            };

            this.setPreload(true);
            this.$axios
                .post("/formularios-pqrsf/actualizar", data)
                .then((res) => {
                    this.$toast.success("PQRF actualizada correctamente");
                    this.listarPQRSFAsignados();
                    this.buscarPQRSF();
                })
                .catch((error) => {
                    this.$toast.error("Error al actualizar la PQRF");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        listarOpcionesSubcategorias() {
            this.loading.opcionesSubcategorias = true;
            this.$axios
                .get("/subcategorias/listar")
                .then((res) => {
                    this.opcionesSubcategorias = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar las subcategorias");
                })
                .finally(() => {
                    this.loading.opcionesSubcategorias = false;
                });
        },

        listarDerechosSubcategorias() {
            const subcategoriaIds = this.PQRSFActual.subcategoria_pqrsf.map(
                (sub) => sub.id
            );

            this.setPreload(true);
            this.$axios
                .post("/subcategorias/listarDerechosSubcategorias", {
                    subcategorias: subcategoriaIds,
                })
                .then((res) => {
                    this.derechosSubcategorias = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar los derechos de la PQRF");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        guardarSubcategorias() {
            const subcategoriaIds = this.PQRSFActual.subcategoria_pqrsf.map(
                (sub) => sub.id
            );

            this.setPreload(true);
            this.$axios
                .post(
                    `/subcategorias-pqrsf/actualizarSubcategorias/${this.PQRSFActual.id}`,
                    { subcategorias: subcategoriaIds }
                )
                .then((res) => {
                    this.$toast.success("Subcategorias actualizadas correctamente");
                    this.buscarPQRSF();
                })
                .catch((error) => {
                    this.$toast.error("Error al actualizar las subcategorias");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        listarOpcionesCodesumis() {
            this.loading.opcionesCodesumis = true;
            this.$axios
                .post("/codesumis/buscar", { nombre: this.campoBusquedaCodesumi })
                .then((res) => {
                    this.opcionesCodesumis = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar los codesumis");
                })
                .finally(() => {
                    this.loading.opcionesCodesumis = false;
                });
        },

        guardarCodesumis() {
            const codesumisIds = this.codesumisSeleccionados.map(
                (codesumi) => codesumi.id
            );

            this.setPreload(true);
            this.$axios
                .post(`/medicamentos-pqrsf/actualizarCodesumi/${this.PQRSFActual.id}`, {
                    codesumis: codesumisIds,
                })
                .then((res) => {
                    this.$toast.success("Medicamentos actualizados correctamente");
                    this.codesumisSeleccionados = [];
                    this.buscarPQRSF();
                })
                .catch((error) => {
                    this.$toast.error("Error al actualizar los medicamentos");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        removerCodesumi(codesumi) {
            const codesumiId = codesumi.id;

            this.$swal({
                title: "¿Desea eliminar el medicamento de la PQRF?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, eliminar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.setPreload(true);
                    this.$axios
                        .post(
                            `/medicamentos-pqrsf/removerCodesumi/${this.PQRSFActual.id}`,
                            {
                                codesumi: codesumiId,
                            }
                        )
                        .then((res) => {
                            this.$toast.success("Medicamento eliminado correctamente");
                            this.buscarPQRSF();
                        })
                        .catch((error) => {
                            this.$toast.error("Error al eliminar el medicamento");
                        })
                        .finally(() => {
                            this.setPreload(false);
                        });
                }
            });
        },

        listarOpcionesServicios() {
            this.loading.opcionesServicios = true;
            this.$axios
                .get(`/cup/BuscarCup/${this.campoBusquedaServicio}`)
                .then((res) => {
                    this.opcionesServicios = res.data.original;
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar los servicios");
                })
                .finally(() => {
                    this.loading.opcionesServicios = false;
                });
        },

        guardarServicios() {
            const cupIds = this.serviciosSeleccionados.map((servicio) => servicio.id);

            this.setPreload(true);

            this.$axios
                .post(`/servicios-pqrsf/actualizarServicios/${this.PQRSFActual.id}`, {
                    servicios: cupIds,
                })
                .then((res) => {
                    this.$toast.success("Servicios actualizados correctamente");
                    this.serviciosSeleccionados = [];
                    this.buscarPQRSF();
                })
                .catch((error) => {
                    this.$toast.error("Error al actualizar los servicios");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        removerServicio(servicio) {
            const servicioId = servicio.id;

            this.$swal({
                title: "¿Desea eliminar el servicio de la PQRF?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, eliminar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.setPreload(true);
                    this.$axios
                        .post(`/servicios-pqrsf/removerServicio/${this.PQRSFActual.id}`, {
                            servicio: servicioId,
                        })
                        .then((res) => {
                            this.$toast.success("Servicio eliminado correctamente");
                            this.buscarPQRSF();
                        })
                        .catch((error) => {
                            this.$toast.error("Error al eliminar el servicio");
                        })
                        .finally(() => {
                            this.setPreload(false);
                        });
                }
            });
        },

        listarOpcionesAreas() {
            this.loading.opcionesAreas = true;
            this.$axios
                .get(`/areas/buscarPorNombre/${this.campoBusquedaArea}`)
                .then((res) => {
                    this.opcionesAreas = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar las areas");
                })
                .finally(() => {
                    this.loading.opcionesAreas = false;
                });
        },

        guardarAreas() {
            const areaIds = this.areasSeleccionadas.map((area) => area.id);

            this.setPreload(true);

            this.$axios
                .post(`/areas-pqrsf/actualizarAreas/${this.PQRSFActual.id}`, {
                    areas: areaIds,
                })
                .then((res) => {
                    this.$toast.success("Areas actualizadas correctamente");
                    this.areasSeleccionadas = [];
                    this.buscarPQRSF();
                })
                .catch((error) => {
                    this.$toast.error("Error al actualizar las areas");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        removerArea(area) {
            const areaId = area.id;

            this.$swal({
                title: "¿Desea eliminar el área de la PQRF?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, eliminar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.setPreload(true);
                    this.$axios
                        .post(`/areas-pqrsf/removerArea/${this.PQRSFActual.id}`, {
                            area: areaId,
                        })
                        .then((res) => {
                            this.$toast.success("Área eliminado correctamente");
                            this.buscarPQRSF();
                        })
                        .catch((error) => {
                            this.$toast.error("Error al eliminar el área");
                        })
                        .finally(() => {
                            this.setPreload(false);
                        });
                }
            });
        },

        listarOpcionesReps() {
            this.loading.opcionesReps = true;
            this.$axios
                .get(`/reps/buscarRep/${this.campoBusquedaRep}`)
                .then((res) => {
                    this.opcionesReps = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar los representantes");
                })
                .finally(() => {
                    this.loading.opcionesReps = false;
                });
        },

        guardarReps() {
            const repIds = this.repsSeleccionados.map((rep) => rep.id);

            this.setPreload(true);

            this.$axios
                .post(`/ips-pqrsf/actualizarIps/${this.PQRSFActual.id}`, {
                    reps: repIds,
                })
                .then((res) => {
                    this.$toast.success("IPS afectadas actualizadas correctamente");
                    this.repsSeleccionados = [];
                    this.buscarPQRSF();
                })
                .catch((error) => {
                    this.$toast.error("Error al actualizar las IPS");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        removerRep(rep) {
            const repId = rep.id;

            this.$swal({
                title: "¿Desea eliminar la IPS de la PQRF?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, eliminar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.setPreload(true);
                    this.$axios
                        .post(`/ips-pqrsf/removerIps/${this.PQRSFActual.id}`, {
                            rep: repId,
                        })
                        .then((res) => {
                            this.$toast.success("IPS eliminada correctamente");
                            this.buscarPQRSF();
                        })
                        .catch((error) => {
                            this.$toast.error("Error al eliminar la IPS");
                        })
                        .finally(() => {
                            this.setPreload(false);
                        });
                }
            });
        },

        listarOpcionesCodigosPropios() {
            this.loading.opcionesCodigosPropios = true;
            this.$axios
                .get(
                    `/codigo-propio/BuscarCodigoPropio/${this.campoBusquedaCodigosPropios}`
                )
                .then((res) => {
                    this.opcionesCodigosPropios = res.data.original;
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar los codigos propios");
                })
                .finally(() => {
                    this.loading.opcionesCodigosPropios = false;
                });
        },

        guardarCodigosPropios() {
            const codigosPropiosIds = this.codigosPropiosSeleccionados.map(
                (codigoPropio) => codigoPropio.id
            );

            this.setPreload(true);

            this.$axios
                .post(
                    `/codigos-propios-pqrsf/actualizarCodigosPropios/${this.PQRSFActual.id}`,
                    {
                        codigos_propios: codigosPropiosIds,
                    }
                )
                .then((res) => {
                    this.$toast.success("Códigos Propios actualizados correctamente");
                    this.codigosPropiosSeleccionados = [];
                    this.buscarPQRSF();
                })
                .catch((error) => {
                    this.$toast.error("Error al actualizar los Códigos Propios");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        removerCodigoPropio(codigoPropio) {
            const codigoPropioId = codigoPropio.id;

            this.$swal({
                title: "¿Desea elimiar el Código Propio de la PQRF?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, eliminar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.setPreload(true);
                    this.$axios
                        .post(
                            `/codigos-propios-pqrsf/removerCodigoPropio/${this.PQRSFActual.id}`,
                            {
                                codigo_propio: codigoPropioId,
                            }
                        )
                        .then((res) => {
                            this.$toast.success("Código Propio eliminado correctamente");
                            this.buscarPQRSF();
                        })
                        .catch((error) => {
                            this.$toast.error("Error al eliminar el Código Propio");
                        })
                        .finally(() => {
                            this.setPreload(false);
                        });
                }
            });
        },

        listarOpcionesOperadores() {
            this.loading.opcionesOperadores = true;
            this.$axios
                .post("/operador/listarFiltro", {
                    nombre: this.campoBusquedaOperadores,
                })
                .then((res) => {
                    this.opcionesOperadores = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar los operadores");
                })
                .finally(() => {
                    this.loading.opcionesOperadores = false;
                });
        },

        getNombreCompleto(item) {
            if (!item) return '';
            return [
                item.nombre,
                item.apellido,
            ].filter(Boolean).join(' ');
        },

        guardarOperadores() {
            const operadoresIds = this.operadoresSeleccionados.map(
                (operador) => operador.id
            );

            this.setPreload(true);

            this.$axios
                .post(`/empleado-pqrsf/actualizarOperadores/${this.PQRSFActual.id}`, {
                    operadores: operadoresIds,
                })
                .then((res) => {
                    this.$toast.success("Empleados actualizados correctamente");
                    this.operadoresSeleccionados = [];
                    this.buscarPQRSF();
                })
                .catch((error) => {
                    this.$toast.error("Error al actualizar los Empleados");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        removerOperador(operador) {
            const operadorId = operador.id;

            this.$swal({
                title: "¿Desea elimiar el Empleado de la PQRF?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, eliminar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.setPreload(true);
                    this.$axios
                        .post(`/empleado-pqrsf/removerOperador/${this.PQRSFActual.id}`, {
                            operador: operadorId,
                        })
                        .then((res) => {
                            this.$toast.success("Empleado eliminado correctamente");
                            this.buscarPQRSF();
                        })
                        .catch((error) => {
                            this.$toast.error("Error al eliminar el Empleado");
                        })
                        .finally(() => {
                            this.setPreload(false);
                        });
                }
            });
        },

        listarOpcionesAreasOperador() {
            this.loading.opcionesAreasOperador = true;
            this.$axios
                .get("/area-responsable-pqrsf/listarAreasUsuario")
                .then((res) => {
                    this.opcionesAreasOperador = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar sus áreas");
                })
                .finally(() => {
                    this.loading.opcionesAreasOperador = false;
                });
        },

        listarPQRSFAsignados() {
            this.$emit("listarPQRSFAsignados");
        },

        async consultarAdjunto(ruta) {
            this.setPreload(true);
            try {
                let adj = await this.$adjuntos(ruta);
                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                this.$toast.error("Error al cargar el archivo");
            } finally {
                this.setPreload(false);
            }
        },

        enviarFormuarioPqrsf() {
            if (!this.$refs.formResponderPQRF.validate()) {
                return;
            }

            const formData = new FormData();

            formData.append("pqrsf_id", this.PQRSFActual.id);
            formData.append("afiliado_id", this.PQRSFActual.afiliado.id);
            formData.append("tipo_id", this.formResponder.tipo_respuesta);
            formData.append("motivo", this.formResponder.observacion);
            formData.append(
                "area_responsable_id",
                this.formResponder.area_responsable
            );
            if (this.formResponder.adjuntos.length > 0) {
                for (let file = 0; file < this.formResponder.adjuntos.length; file++) {
                    formData.append("adjuntos[]", this.formResponder.adjuntos[file]);
                }
            }

            this.setPreload(true);

            this.$axios
                .post("/formularios-pqrsf/respuesta", formData)
                .then(() => {
                    this.$toast.success("Respuesta guardada exitosamente");
                    this.limpiarFormularioResponder();
                    this.listarPQRSFAsignados();
                    this.cerrarModal();
                })
                .catch((error) => {
                    this.$toast.error("Error al guardar la respuesta");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        limpiarFormularioResponder() {
            this.formResponder = {
                tipo_respuesta: null,
                observacion: "",
                adjuntos: [],
                area_responsable: null,
            };

            this.$refs.formResponderPQRF.resetValidation();
        },

        abrirModalAnular() {
            this.mostrarModalAnular = true;
        },

        abrirModalSolucionar() {
            this.solucionCentral = true
            this.mostrarModalSolucionar = true;
        },
    },
};
</script>
