<template>
    <div>
        <v-dialog v-model="mostrarModalPendientes" max-width="2000px" persistent>
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
                            <v-col cols="12" md="12" sm="12">
                                <v-alert text dense border="left" type="info" icon="mdi-file-document-alert-outline"
                                    class="text-center">
                                    <b>Detalles de la Radicación</b>
                                </v-alert>
                            </v-col>
                            <!-- Afiliados -->
                            <v-col cols="12" md="12" sm="12" v-if="
                                PQRSFActual?.user && PQRSFActual?.user.tipo_usuario_id === 2
                            ">
                                <v-row dense>
                                    <v-col cols="12" md="6" sm="6">
                                        <v-text-field dense outlined label="Nombre - Quien Registra PQRF"
                                            :value="getNombreAfiliado(PQRSFActual?.user?.afiliado)" readonly />
                                    </v-col>
                                    <v-col cols="12" md="6" sm="6">
                                        <v-text-field dense outlined label="N° Documento - Quien Registra PQRF" :value="PQRSFActual?.user?.afiliado?.numero_documento || '-'
                                            " readonly>
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <!-- Operadores -->
                            <v-col cols="12" md="12" sm="12" v-if="
                                PQRSFActual?.user && PQRSFActual?.user.tipo_usuario_id !== 2
                            ">
                                <v-row dense>
                                    <v-col cols="12" md="6" sm="6">
                                        <v-text-field dense outlined label="Nombre - Quien Registra PQRF"
                                            :value="getNombreOperador(PQRSFActual?.user?.operador)" readonly />
                                    </v-col>
                                    <v-col cols="12" md="6" sm="6">
                                        <v-text-field dense outlined label="N° Documento - Quien Registra PQRF"
                                            :value="PQRSFActual?.user?.operador?.documento || '-'" readonly>
                                        </v-text-field>
                                    </v-col> </v-row></v-col>
                        </v-row>
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
                            <v-col cols="12" md="12" sm="12">
                                <v-alert text dense border="left" color="info" icon="mdi-file-download-outline"
                                    class="text-center">
                                    <b>Adjunto(s) de la Radicación</b>
                                </v-alert>
                            </v-col>

                            <!-- Mostrar adjuntos si existen -->
                            <template v-if="gestionesConAdjuntos.length > 0">
                                <v-col cols="12" md="12" sm="12" style="
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    justify-content: center;
                  " v-for="gestion in gestionesConAdjuntos" :key="gestion.id">
                                    <v-btn small dark color="blue-grey" v-for="adjunto in gestion.adjuntos"
                                        :key="adjunto.id" @click="consultarAdjunto(adjunto.ruta)">
                                        {{ adjunto.nombre }}
                                    </v-btn>
                                </v-col>
                            </template>

                            <!-- Mostrar mensaje si no hay adjuntos -->
                            <template v-else>
                                <v-col cols="12" md="12" sm="12" align="center">
                                    <span>Sin adjuntos para mostrar</span>
                                </v-col>
                            </template>

                            <v-col cols="12" md="12" sm="12" class="my-4">
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
                                <v-autocomplete dense outlined label="Empleado(s)" :item-text="formatearNombre"
                                    return-object chips small-chips deletable-chips multiple clearable
                                    no-data-text="Escriba el nombre del empleado para iniciar la búsqueda"
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
                                        [item.nombre, item.apellido]
                                            .filter(Boolean)
                                            .join(' ')
                                    }}
                                </v-chip>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" class="mb-4">
                                <v-divider></v-divider>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on">
                                <v-icon left>mdi-information-variant</v-icon>
                            </span>
                        </template>
                        <span>Para habilitar las acciones de <b>Solucionar</b> y
                            <b>Asignar</b> es necesario que diligencie los campos
                            <li>Tipo de Requerimiento</li>
                            <li>Priorización</li>
                            <li>Reabierta</li>
                            <li>Atributo de Calidad</li>
                            <li>Subcategoría</li>
                            <li>Área</li>
                        </span>
                    </v-tooltip>
                    <v-btn color="error" small dark @click="cerrarModal">Cerrar</v-btn>
                    <v-btn :disabled="deshabilitarBoton" color="success" small dark
                        @click="abrirModalSolucionar">Solucionar</v-btn>
                    <v-btn :disabled="deshabilitarBoton" color="info" small dark
                        @click="abrirModalAsignar">Asignar</v-btn>
                    <v-btn color="warning" v-if="$can('pqrsf.anular')" small dark @click="abrirModalAnular">
                        Anular
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modales -->
        <modalAnularPqrsf :mostrarModalAnular.sync="mostrarModalAnular" :pqrsf="PQRSFSeleccionada"
            @cerrarModal="cerrarModal" @recargarPQRFs="listarPQRSFPendientes" />

        <modalSolucionarPqrsf :mostrarModalSolucionar.sync="mostrarModalSolucionar" :pqrsf="PQRSFSeleccionada"
            @cerrarModal="cerrarModal" @recargarPQRFs="listarPQRSFPendientes" />

        <modalAsignarPqrsf :mostrarModalAsignar.sync="mostrarModalAsignar" :pqrsf="PQRSFSeleccionada"
            @cerrarModal="cerrarModal" @recargarPQRFs="listarPQRSFPendientes" />
    </div>
</template>
<script>
import { mapActions } from "vuex";
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import modalAnularPqrsf from "@/components/pqrsf/centralPqrf/modalAnularPqrsf.vue";
import modalSolucionarPqrsf from "@/components/pqrsf/centralPqrf/modalSolucionarPqrsf.vue";
import modalAsignarPqrsf from "@/components/pqrsf/centralPqrf/modalAsignarPqrsf.vue";

export default {
    components: {
        EditarAfiliadoComponente,
        modalAnularPqrsf,
        modalSolucionarPqrsf,
        modalAsignarPqrsf,
    },
    props: {
        mostrarModalPendientes: {
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
            },
            rules: {
                obligatorio: (value) =>
                    (value !== null && value !== undefined && value !== "") ||
                    "Este campo es obligatorio.",
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
            mostrarModalAnular: false,
            mostrarModalSolucionar: false,
            mostrarModalAsignar: false,
        };
    },
    computed: {
        deshabilitarBoton() {
            return (
                this.PQRSFActual.atributo_calidad === null ||
                this.PQRSFActual.priorizacion === null ||
                this.PQRSFActual.tipo_solicitud_id === null ||
                this.PQRSFActual.reabierta === null ||
                (this.PQRSFActual.subcategoria_pqrsf &&
                    this.PQRSFActual.subcategoria_pqrsf.length < 1) ||
                (this.PQRSFActual.area_pqrsf && this.PQRSFActual.area_pqrsf.length < 1)
            );
        },
        gestionesConAdjuntos() {
            if (!this.PQRSFActual || !this.PQRSFActual.gestion_pqr) return [];
            return this.PQRSFActual.gestion_pqr.filter(
                (gestion) => gestion.adjuntos && gestion.adjuntos.length > 0
            );
        },
    },
    mounted() {
        this.listarTiposSolicitudes();
        this.listarOpcionesSubcategorias();
    },
    watch: {
        mostrarModalPendientes(newValue) {
            if (newValue) {
                this.buscarPQRSF();
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
            this.limpiarCamposSeleccion();
            this.$refs.formActualizarPQRSF.resetValidation();
            this.$emit("update:mostrarModalPendientes", false);
        },

        limpiarCamposSeleccion() {
            this.codesumisSeleccionados = [];
            this.serviciosSeleccionados = [];
            this.areasSeleccionadas = [];
            this.repsSeleccionados = [];
            this.codigosPropiosSeleccionados = [];
            this.operadoresSeleccionados = [];
        },

        buscarPQRSF() {
            this.setPreload(true);

            this.$axios
                .post("/formularios-pqrsf/listarPendientesInternaDetalle", {
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
                    this.listarPQRSFPendientes();
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

        abrirModalAnular() {
            this.mostrarModalAnular = true;
        },

        abrirModalSolucionar() {
            this.mostrarModalSolucionar = true;
        },

        abrirModalAsignar() {
            this.mostrarModalAsignar = true;
        },

        listarPQRSFPendientes() {
            this.$emit("listarPQRSFPendientes");
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

        getNombreAfiliado(afiliado) {
            if (!afiliado) return '-';
            return [
                afiliado.primer_nombre,
                afiliado.segundo_nombre,
                afiliado.primer_apellido,
                afiliado.segundo_apellido
            ].filter(Boolean).join(' ');
        },

        getNombreOperador(operador) {
            if (!operador) return '-';
            return [
                operador.nombre,
                operador.apellido,
            ].filter(Boolean).join(' ');
        },

        formatearNombre(item) {
            return [item.nombre, item.apellido]
                .filter(Boolean)
                .join(' ');
        }
    },
};
</script>
