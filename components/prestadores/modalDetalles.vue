<template>
    <div>
        <!-- Preload -->
        <v-dialog v-model="preload" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Tranquilo procesamos tu solicitud!
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Formulario Detalles -->
        <v-dialog v-model="mostrarDetallesModal" persistent max-width="1600px">
            <v-card>
                <v-form ref="form" v-model="formValid">
                    <v-col cols="12" sm="12" md="12" v-if="orden">
                        <v-alert text dense border="left" type="info" icon="mdi-account-box">
                            <b>Datos del Afiliado</b>
                        </v-alert>
                        <v-row v-if="afiliado">
                            <v-col cols="12" sm="12" md="12">
                                <EditarAfiliadoComponente :afiliado="orden.afiliado" :modoDetalle="true"
                                    :modoEdicion="true" :mostrarClasificaciones="true" />
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" sm="12" md="12" v-if="orden">
                        <v-alert dense text border="left" icon="mdi-medical-bag" color="success">
                            <b>Servicio</b>
                        </v-alert>
                        <v-container v-if="orden.tipoOrden=='servicio'" fluid v-for="procedimiento in orden.servicio"
                            :key="procedimiento.cup.id">
                            <v-checkbox v-model="procedimientos" :label="procedimiento.cup.nombre"
                                :value="procedimiento.cup" color="success"></v-checkbox>
                        </v-container>
                        <v-container v-if="orden.tipoOrden=='codigo_propio'" fluid
                            v-for="procedimiento in orden.servicio" :key="procedimiento.codigo_propio.id">
                            <v-checkbox v-model="procedimientos" :label="procedimiento.codigo_propio.nombre"
                                :value="procedimiento.codigo_propio" color="success"></v-checkbox>
                        </v-container>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" v-if="procedimientos.length > 0">
                        <v-alert text dense border="left" color="warning" icon="mdi-alert-circle">
                            <b>Detalles del Servicio</b>
                        </v-alert>
                        <div class="d-flex justify-center">
                            <v-radio-group v-model="selectedOption" row>
                                <v-radio v-if="filtroEstado == 50 || filtroEstado==19" label="Programadas" value="58"></v-radio>
                                <v-radio label="Asistencia" value="51"></v-radio>
                                <v-radio label="Cancelada" value="30"></v-radio>
                                <v-radio label="Inasistencia" value="8"></v-radio>
                                <v-radio label="No Contactado" value="52"></v-radio>
                                <v-radio label="Notas seguimiento" value="19"></v-radio>
                            </v-radio-group>
                        </div>
                        <v-row v-if="selectedOption === '58'" class="px-2">
                            <template v-if="agendamientoInterno">
                                <v-expansion-panels>
                                    <v-expansion-panel>
                                        <v-expansion-panel-header>
                                            AGENDAMIENTO CITAS
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <v-col cols="12" sm="12" md="12">
                                                <AsignacionCitasComponente :afiliado="orden.afiliado" :servicio="orden"
                                                    :orden="orden_id" @datos-agendamiento="datosAgendamiento">
                                                </AsignacionCitasComponente>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-file-input v-model="formGestionAsistencia.adjuntos"
                                                    placeholder="Adjunte aquí los archivos." label="Soportes"
                                                    accept=".jpg, .jpeg, .png, .pdf, .xls, .xlsx" counter show-size
                                                    multiple dense chips deletable-chips></v-file-input>
                                            </v-col>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    <v-expansion-panel>
                                        <v-expansion-panel-header>
                                            AGENDAMIENTO CIRUGIAS
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <v-col cols="12" sm="12" md="12">
                                                <Cirugia :afiliado="orden.afiliado" :servicio="procedimientos"
                                                    :ordenId="orden_id" :tipo-orden="orden.tipoOrden"
                                                    @datos-agendamiento="datosAgendamiento"></Cirugia>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-file-input v-model="formGestionAsistencia.adjuntos"
                                                    placeholder="Adjunte aquí los archivos." label="Soportes"
                                                    accept=".jpg, .jpeg, .png, .pdf, .xls, .xlsx" counter show-size
                                                    multiple dense chips deletable-chips></v-file-input>
                                            </v-col>
                                          
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>



                            </template>
                            <template v-else>
                                <v-col cols="12" sm="12" md="4">
                                    <v-menu dense v-model="menuFechaSugerida" :close-on-content-click="false"
                                        :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="formGestionAsistencia.fecha_sugerida"
                                                label="Fecha Sugerida" prepend-icon="mdi-calendar" readonly dense
                                                v-bind="attrs" v-on="on" :rules="[rules.required]">
                                            </v-text-field>
                                        </template>
                                        <v-date-picker v-model="formGestionAsistencia.fecha_sugerida"
                                            @input="menuFechaSugerida = false">
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-menu dense v-model="menuFechaSolicitadaAfiliado" :close-on-content-click="false"
                                        :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="formGestionAsistencia.fecha_solicitada_afiliado"
                                                label="Fecha Solicitada Afiliado" prepend-icon="mdi-calendar" readonly
                                                dense v-bind="attrs" v-on="on" :rules="[rules.required]"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="formGestionAsistencia.fecha_solicitada_afiliado"
                                            @input="menuFechaSolicitadaAfiliado = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-menu dense v-model="menuFechaResultado" :close-on-content-click="false"
                                        :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="formGestionAsistencia.fecha_resultado"
                                                label="Fecha Resultado" prepend-icon="mdi-calendar" readonly dense
                                                v-bind="attrs" v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="formGestionAsistencia.fecha_resultado"
                                            @input="menuFechaResultado = false">
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="formGestionAsistencia.funcionario_responsable"
                                        label="Funcionario Responsable" dense :rules="[rules.required]"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-textarea v-model="formGestionAsistencia.observaciones" label="Observaciones"
                                        dense auto-grow :rules="[rules.required]">
                                    </v-textarea>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-file-input v-model="formGestionAsistencia.adjuntos"
                                        placeholder="Adjunte aquí los archivos." label="Soporte Resultados"
                                        accept=".jpg, .jpeg, .png, .pdf, .xls, .xlsx" counter show-size multiple dense
                                        chips deletable-chips></v-file-input>
                                </v-col>


                                <v-col cols="12" sm="12" md="12">
                                    <v-alert text dense border="left" type="info" icon="mdi-needle">
                                        <b>Detalles Cirugía</b>
                                    </v-alert>
                                </v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field v-model="formGestionAsistencia.cirujano" label="Cirujano"
                                        dense></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field v-model="formGestionAsistencia.especialidad" label="Especialidad"
                                        dense></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-menu dense v-model="menuFechaPreanestesia" :close-on-content-click="false"
                                        :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="formGestionAsistencia.fecha_preanestesia"
                                                label="Fecha Pre-Anestesia" prepend-icon="mdi-calendar" readonly dense
                                                v-bind="attrs" v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="formGestionAsistencia.fecha_preanestesia"
                                            @input="menuFechaPreanestesia = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-menu dense v-model="menuFechaCirugia" :close-on-content-click="false"
                                        :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="formGestionAsistencia.fecha_cirugia"
                                                label="Fecha Cirugía" prepend-icon="mdi-calendar" readonly dense
                                                v-bind="attrs" v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="formGestionAsistencia.fecha_cirugia"
                                            @input="menuFechaCirugia = false">
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-menu dense v-model="menuFechaEjecucion" :close-on-content-click="false"
                                        :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="formGestionAsistencia.fecha_ejecucion"
                                                label="Fecha Ejecución" prepend-icon="mdi-calendar" readonly dense
                                                v-bind="attrs" v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="formGestionAsistencia.fecha_ejecucion"
                                            @input="menuFechaEjecucion = false">
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>

                            </template>
                        </v-row>
                        <v-row v-if="selectedOption === '51'" class="px-2">
                            <v-col cols="12" sm="12" md="6" v-if="selectedOption === '51'">
                                <v-menu dense v-model="menuFechaAsistencia" :close-on-content-click="false"
                                    :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="formGestionAsistencia.fecha_asistencia"
                                            label="Fecha Asistencia" prepend-icon="mdi-calendar" readonly dense
                                            v-bind="attrs" v-on="on" :rules="[rules.required]">
                                        </v-text-field>
                                    </template>
                                    <v-date-picker v-model="formGestionAsistencia.fecha_asistencia"
                                        @input="menuFechaAsistencia = false">
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                                <v-menu dense v-model="menuFechaResultado" :close-on-content-click="false"
                                    :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="formGestionAsistencia.fecha_resultado"
                                            label="Fecha Resultado" prepend-icon="mdi-calendar" readonly dense
                                            v-bind="attrs" v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="formGestionAsistencia.fecha_resultado"
                                        @input="menuFechaResultado = false">
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="formGestionAsistencia.funcionario_responsable"
                                    label="Funcionario Responsable" dense :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea v-model="formGestionAsistencia.observaciones" label="Observaciones" dense
                                    auto-grow :rules="[rules.required]">
                                </v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-file-input v-model="formGestionAsistencia.adjuntos"
                                    placeholder="Adjunte aquí los archivos." label="Soporte Resultados"
                                    accept=".jpg, .jpeg, .png, .pdf, .xls, .xlsx" counter show-size multiple dense chips
                                    deletable-chips></v-file-input>
                            </v-col>
                        </v-row>
                        <v-row dense v-else-if="selectedOption === '30'" class="px-2">
                            <v-col cols="12" sm="12" md="4">
                                <v-menu dense v-model="menuFechaCancelacion" :close-on-content-click="false"
                                    :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="formGestionCancelacion.fecha_cancelacion"
                                            label="Fecha Cancelación" prepend-icon="mdi-calendar" readonly dense
                                            v-bind="attrs" v-on="on" :rules="[rules.required]">
                                        </v-text-field>
                                    </template>
                                    <v-date-picker v-model="formGestionCancelacion.fecha_cancelacion"
                                        @input="menuFechaCancelacion = false">
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                                <v-select v-model="formGestionCancelacion.causa_cancelacion"
                                    label="Causas Administrativas" dense :items="tiposCausaCancelacion"
                                    @change="formGestionCancelacion.motivo_cancelacion = null">
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                                <v-select v-model="formGestionCancelacion.motivo_cancelacion"
                                    label="Exigencias y condiciones del usuario" dense :items="tiposMotivosCancelacion"
                                    @change="formGestionCancelacion.causa_cancelacion = null">
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="formGestionCancelacion.funcionario_responsable"
                                    label="Funcionario Responsable" dense :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea v-model="formGestionCancelacion.observaciones" label="Observaciones" dense
                                    auto-grow :rules="[rules.required]">
                                </v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12" md="4">
                                <v-file-input v-model="formGestionCancelacion.adjuntos"
                                    placeholder="Adjunte aquí el adjunto." label="Disentimiento" accept=".pdf" counter
                                    show-size dense chips deletable-chips></v-file-input>
                            </v-col>
                        </v-row>
                        <v-row dense v-else-if="selectedOption === '8'" class="px-2">
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="formGestionInasistencia.funcionario_responsable"
                                    label="Funcionario Responsable" dense :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea v-model="formGestionInasistencia.observaciones" label="Observaciones" dense
                                    auto-grow :rules="[rules.required]">
                                </v-textarea>
                            </v-col>
                        </v-row>
                        <v-row dense v-else-if="selectedOption === '19'" class="px-2">
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="formGestionSeguimiento.funcionario_responsable"
                                    label="Funcionario Responsable" dense :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea v-model="formGestionSeguimiento.observaciones" label="Observaciones" dense
                                    auto-grow :rules="[rules.required]">
                                </v-textarea>
                            </v-col>
                        </v-row>
                        <v-row dense v-else-if="selectedOption === '52'" class="px-2">
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="formGestionNoContactado.funcionario_responsable"
                                    label="Funcionario Responsable" dense :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea v-model="formGestionNoContactado.observaciones" label="Observaciones" dense
                                    auto-grow :rules="[rules.required]">
                                </v-textarea>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" small @click="cerrarModal">Cancelar</v-btn>
                        <v-btn v-if="(selectedOption !== '58' && agendamientoInterno) || (!agendamientoInterno)"
                            color="success" small @click="enviarDetalles">{{ selectedOption === '51' ? 'GUARDAR E IMPRIMIR' : 'GUARDAR'}}</v-btn>
                    </v-card-actions>
                </v-form>


                <v-col v-if="gestiones.length > 0">
                    <v-alert text dense border="left" color="success" icon="mdi-history"><b>Historico</b></v-alert>
                    <v-timeline>
                        <v-timeline-item v-for="(gestion, index) in gestiones" :key="index" color="info"
                            icon="mdi-check-underline">

                            <v-card>
                                <v-card-title>
                                    <div style="display: flex; align-items: center;">
                                        <v-icon :color="obtenerColorPorTipo(gestion.estado_gestion_id)">
                                            {{ obtenerIconoPorTipo(gestion.estado_gestion_id) }}</v-icon>
                                        <span style="margin-left: 8px;">{{ gestion.estado }}</span>
                                    </div>
                                </v-card-title>
                                <v-card-text>
                                    <div>
                                        <div class="font-weight-normal" v-if="gestion.fecha_sugerida">
                                            <strong>Fecha Creación: {{ $moment(gestion.created_at).format('DD-MM-YYYY')
                                                }}</strong>
                                        </div>
                                        <div v-if="gestion.fecha_sugerida">
                                            <strong>Fecha Sugerida: {{ gestion.fecha_sugerida }}</strong>
                                        </div>
                                        <div v-if="gestion.fecha_solicitada_afiliado">
                                            <strong>Fecha solicitada por el afiliado: {{
                                                gestion.fecha_solicitada_afiliado }}</strong>
                                        </div>

                                        <div v-if="gestion.observacion">
                                            <strong>Observación: {{ gestion.observacion }}</strong>
                                        </div>
                                        <div v-if="gestion.cup">
                                            <strong>Servicio: {{ gestion.cup }}</strong>
                                        </div>
                                        <div v-if="gestion.fecha_cancelacion">
                                            <strong>Fecha cancelacion: {{ gestion.fecha_cancelacion }}</strong>
                                        </div>
                                        <div v-if="gestion.fecha_cancelacion">
                                            <strong>Causas administrativas: {{ gestion.causa_cancelacion }}</strong>
                                        </div>
                                        <div v-if="gestion.motivo_cancelacion">
                                            <strong>Exigencias y condiciones del usuario: {{ gestion.motivo_cancelacion
                                                }}</strong>
                                        </div>
                                        <div v-if="gestion.funcionario_responsable">
                                            <strong>Funcionario Responsable: {{ gestion.funcionario_responsable
                                                }}</strong>
                                        </div>
                                        <div v-if="gestion.fecha_asistencia">
                                            <strong> Fecha asistencia: {{ gestion.fecha_asistencia }}</strong>
                                        </div>
                                        <div v-if="gestion.adjuntos">
                                            <v-tooltip bottom v-for="adjunto in gestion.adjuntos" :key="adjunto.id">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon color="success" @click="adjuntoOncologico(adjunto.ruta)" v-bind="attrs" v-on="on">
                                                        <v-icon>mdi-file-download</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ adjunto.nombre }}</span>

                                            </v-tooltip>
                                        </div>
                                    </div>
                                    <v-col></v-col>
                                    <div v-if="gestion.cirujano || gestion.especialidad || gestion.fecha_preanestesia">
                                        <v-alert text dense color="warning" icon="mdi-needle" border="left"><b>Detalles
                                                de cirugía</b>
                                        </v-alert>

                                        <div v-if="gestion.cirujano">
                                            <strong>Cirujano: {{ gestion.cirujano }}</strong>
                                        </div>

                                        <div v-if="gestion.especialidad">
                                            <strong>Especialidad: {{ gestion.especialidad }}</strong>
                                        </div>

                                        <div v-if="gestion.fecha_preanestesia">
                                            <strong>Fecha pre-anestesia: {{ gestion.fecha_preanestesia }}</strong>
                                        </div>

                                        <div v-if="gestion.fecha_cirugia">
                                            <strong>Fecha Cirugía: {{ gestion.fecha_cirugia }}</strong>
                                        </div>

                                        <div v-if="gestion.fecha_ejecucion">
                                            <strong>Fecha ejecución: {{ gestion.fecha_ejecucion }}</strong>
                                        </div>
                                    </div>

                                </v-card-text>
                            </v-card>
                        </v-timeline-item>
                    </v-timeline>
                </v-col>

            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import AsignacionCitasComponente from "@/components/citas/asignacionCitas/AsignacionCitas.vue";
import Cirugia from "@/components/agendamientoCirugia/cirugia.vue"

export default {
    components: {
        EditarAfiliadoComponente,
        AsignacionCitasComponente,
        Cirugia,
    },
    props: {
        mostrarDetallesModal: Boolean,
        orden: Object,
        orden_id: Number,
        sede: Object,
        agendamientoInterno: false,
        filtroEstado: Number
    },
    data() {
        return {
            preload: false,
            datosBasicos: true,
            afiliado: {},
            editar: true,
            selectedOption: "",
            menuFechaSugerida: false,
            menuFechaAsistencia: false,
            menuFechaResultado: false,
            menuFechaPreanestesia: false,
            menuFechaCirugia: false,
            menuFechaEjecucion: false,
            menuFechaCancelacion: false,
            menuFechaSolicitadaAfiliado: false,
            formValid: false,
            gestiones: [],
            rules: {
                required: value => !!value || 'Este campo es requerido',
            },
            formGestionAsistencia: {
                fecha_sugerida: "",
                fecha_asistencia: "",
                fecha_resultado: "",
                observaciones: "",
                funcionario_responsable: "",
                cirujano: "",
                especialidad: "",
                fecha_preanestesia: "",
                fecha_cirugia: "",
                fecha_ejecucion: "",
                adjuntos: [],
            },

            tiposCausaCancelacion: [
                "PACIENTE RETIRADO",
                "PACIENTE FALLECIDO",
                "PACIENTE INACTIVO",
                "NO DISPONIBILIDAD DE INSUMOS/DISPOSITIVOS/MEDICAMENTOS",
                "NO DISPONIBILIDAD DE INFRAESTRUCTURA",
                "NO DISPONIBILIDAD DE RECURSO HUMANO",
                "NO DISPONIBILIDAD DE EQUIPOS MEDICOS"
            ],
            tiposMotivosCancelacion: [
                "CAUSAS DE SALUD USUARIO",
                "EL USUARIO NO DESEA SER ATENDIDO EN ESA IPS",
                "SE LE OLVIDO LA CITA",
                "DESEO OPERARME EN MIS VACACIONES",
                "SE LA REALIZO PARTICULAR",
                "NO TENIA DINERO PARA MOVILIZARME",
                "NO DESEA DAR EXPLICACIONES",
                "DISENTIMIENTO"
            ],
            formGestionCancelacion: {
                fecha_cancelacion: "",
                causa_cancelacion: "",
                motivo_cancelacion: "",
                observaciones: "",
                funcionario_responsable: "",
                adjuntos: [],
            },
            formGestionInasistencia: {
                observaciones: "",
                funcionario_responsable: "",
            },
            formGestionNoContactado: {
                observaciones: "",
                funcionario_responsable: "",
            },
            formGestionSeguimiento : {
                observaciones:"",
                funcionario_responsable:"",
            },
            procedimientos:[],
        };
    },
    mounted() {
        this.listarGestionPorPrestador();
    },
    methods: {
        cerrarModal() {
            this.$emit("update:comp", '')
            this.$emit("update:mostrarDetallesModal", false);
        },

        limpiarFormularios() {
            this.formGestionAsistencia = {
                fecha_sugerida: "",
                fecha_solicitada_afiliado: "",
                fecha_resultado: "",
                observaciones: "",
                funcionario_responsable: "",
                cirujano: "",
                especialidad: "",
                fecha_preanestesia: "",
                fecha_cirugia: "",
                fecha_ejecucion: "",
                adjuntos: [],
            };

            this.formGestionCancelacion = {
                fecha_cancelacion: "",
                causa_cancelacion: "",
                motivo_cancelacion: "",
                observaciones: "",
                funcionario_responsable: "",
                adjuntos: [],
            };

            this.formGestionInasistencia = {
                observaciones: "",
                funcionario_responsable: "",
            };

            this.formGestionNoContactado = {
                observaciones: "",
                funcionario_responsable: "",
            };

            this.formGestionSeguimiento = {
                observaciones:"",
                funcionario_responsable:"",
            };
        },

        enviarDetalles() {
            if(this.procedimientos.length < 0){
                this.$toast.error('Debe seleccionar al menos un procedimiento');
                return;
            }
            if (this.$refs.form.validate() ) {
                let detalles;
                switch (this.selectedOption) {
                    case "51":
                        detalles = this.formGestionAsistencia;
                        break;
                    case "30":
                        detalles = this.formGestionCancelacion;
                        break;
                    case "8":
                        detalles = this.formGestionInasistencia;
                        break;
                    case "52":
                        detalles = this.formGestionNoContactado;
                        break;
                    case "58":
                        detalles = this.formGestionAsistencia;
                        break;
                    case "19":
                        detalles = this.formGestionSeguimiento;
                        break;
                    default:
                        detalles = {};
                }

                const servicios = this.orden.servicio
                    .filter(s => {
                        const referencia = s.codigo_propio_id ?? s.cup_id;
                        return this.procedimientos.some(p => p.id === referencia);
                    })
                    .map(s => s.id);
                    

                const payload = {
                    ordenes_id: servicios,
                    selectedOption: this.selectedOption,
                    detalles: detalles,
                    tipoOrden: this.orden.tipoOrden,
                };
               
                this.$emit("enviarDetalles", payload);
                if (this.selectedOption === "51") {
                    // this.imprimir();
                }
                this.selectedOption = "";
                this.limpiarFormularios();
            }
        },

        listarGestionPorPrestador() {
            const ordenes = this.orden.servicio.map(s=>s.id)
            this.$axios.post('gestion-orden-prestador/listarGestion',{ordenes: ordenes})
                .then(res => {
                    this.gestiones = Array.isArray(res.data) ? res.data : [];
                })
                .catch(error => {
                    console.log(error);
                    this.$toast.error('Error al listar las gestiones');
                });
        },

        obtenerColorPorTipo(estado) {
            switch (estado) {
                case 51:
                    return 'green';
                case 19:
                    return 'orange';
                case 30:
                    return 'red';
                case 8:
                    return 'orange';
                case 52:
                    return 'blue';
                case 58:
                    return 'info';
                default:
                    return 'grey';
            }
        },

        obtenerIconoPorTipo(estado) {
            switch (estado) {
                case 51:
                    return 'mdi-account-check';
                case 19:
                    return 'mdi-progress-clock';
                case 30:
                    return 'mdi-cancel';
                case 8:
                    return 'mdi-alert-circle';
                case 52:
                    return 'mdi-phone-off';
                case 58:
                    return 'mdi-calendar-account';
                default:
                    return 'mdi-help-circle';
            }
        },
        //todo: revisar la impresion de orden
        imprimir() {
            return
            let pdf = {
                tipo: (this.orden.tipoOrden === 'codigo_propio' ? 'codigoPropio' : 'servicio'),
                id: this.orden.id,
                // filtro: item.estado_id,
                detalles: {
                    id: this.orden.id,
                },
                documento: this.orden.afiliado.numero_documento

            };
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
                .catch((res) => {
                });
        },
        datosAgendamiento(item) {
            this.formGestionAsistencia.fecha_sugerida = item.fecha;
            this.formGestionAsistencia.fecha_solicitada_afiliado = item.fecha_solicitada;
            this.formGestionAsistencia.funcionario_responsable = item.medico;
            this.formGestionAsistencia.observaciones = item.observaciones;
            const servicios = this.orden.servicio
                .filter(s => {
                    const referencia = s.codigo_propio_id ?? s.cup_id;
                    return this.procedimientos.some(p => p.id === referencia);
                })
                .map(s => s.id);
            const payload = {
                ordenes_id: servicios,
                selectedOption: this.selectedOption,
                detalles: this.formGestionAsistencia,
                tipoOrden: this.orden.tipoOrden,

            };
            this.$emit("enviarDetalles", payload);
            // this.imprimir();
            this.selectedOption = "";
            this.limpiarFormularios();
        },
        async adjuntoOncologico(ruta) {
            try {
                let adj = await this.$adjuntos(ruta);
                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                this.$toast.error('El adjunto no existe!')
                console.log(error.response);
            }
        }
    },
};

</script>
<style scoped>
.compact-card-text {
    margin-bottom: 4px;
    /* Ajusta el valor según lo necesites */
}
</style>
