<template>
    <div>
        <v-dialog v-model="dialogoCargue" v-if="dialogoCargue" persistent max-width="900px">
            <v-card>
                <v-alert dense text border="left" color="primary" icon="mdi-upload-multiple" class="text-center">
                    <b>Cargue Historias clinicas manuales</b>
                </v-alert>
                <v-card-actions v-if="$can('crear.tipoArchivos')">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="dialgoTipoArchivo = true" small>
                        Tipo archivo
                    </v-btn>
                </v-card-actions>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="3">
                            <v-text-field v-model.trim="cedula_paciente" label="Número de Documento">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="3">
                            <v-autocomplete v-model="tipo_documento_paciente" :items="tipo_documentos"
                                no-data-text="No existen datos" item-text="nombre" item-value="id"
                                label="Tipo de Documento">
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12" md="3">
                            <v-autocomplete v-model="listaAnexos" label="Tipo archivo" :items="tipoArchivo"
                                item-text="nombre" item-value="id">
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12" md="2">
                            <v-text-field v-model="fecha_proceso" label="Fecha del proceso" type="date">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="1" class="pa-4">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-bind="attrs" v-on="on" @click="buscarAfiliado()"
                                        @keyup.enter="buscarAfiliado()" v-if="!datosPaciente" fab outlined x-small
                                        color="success">
                                        <v-icon small>mdi-magnify</v-icon>
                                    </v-btn>
                                </template>
                                <span>Buscar Afiliado</span>
                            </v-tooltip>
                            <v-tooltip top v-if="datosPaciente">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-bind="attrs" v-on="on" @click="clearFields()" fab outlined x-small
                                        color="error">
                                        <v-icon small>mdi-close</v-icon>
                                    </v-btn>
                                </template>
                                <span>Limpiar</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" v-if="datosPaciente">
                            <AfiliadoComponent :afiliado="datosPaciente" :modoDetalle="true" :modoEdicion="true"
                                :mostrarClasificaciones="true" />
                        </v-col>
                        <v-col cols="12" sm="12" md="12" v-if="datosPaciente">
                            <input id="adjuntos" ref="adjuntos" type="file" />
                            <span>(máximo 1 archivo y 5 MB, formatos permitidos jpg, jpeg, png,
                                pdf)</span>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="clearFields()" small> Cancelar </v-btn>
                    <v-btn color="success" @click="guardar()" small> Guardar </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialgoTipoArchivo" v-if="dialgoTipoArchivo" persistent max-width="800px">
            <v-card>
                <v-alert dense text outlined color="primary" icon="mdi-order-bool-descending-variant"
                    class="text-center">
                    <b>Tipo archivo</b>
                </v-alert>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="6">
                            <v-text-field v-model="tipo.nombre" label="Nombre">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="6">
                            <v-text-field v-model="tipo.descripcion" label="Descripción">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="limpiarTipoArchivo()" small>
                        Cancelar
                    </v-btn>
                    <v-btn color="success" @click="guardarTipoArchivo()" small>
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogoDiligenciamiento" max-width="1200px">
            <ModalDiligenciamientoHistoria :datosRegistro="resgitroHistoriaCompleto"
                @cerrarDialogoDiligenciamiento="cerrarDialogoDiligenciamiento()" />
        </v-dialog>

        <v-dialog v-model="dialogoNota" v-if="dialogoNota" persistent max-width="800px">
            <v-card>
                <v-alert dense text border="left" color="primary" icon="mdi-note-plus-outline" class="text-center">
                    <b>Nota aclaratoria</b>
                </v-alert>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea dense v-model="descripcionNota" label="Descripción" auto-grow outlined>
                            </v-textarea>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="guardarNota()" small> Guardar </v-btn>
                </v-card-actions>
                <v-card-text>
                    <v-expansion-panels popout>
                        <v-expansion-panel v-for="(item, i) in listaNotas" :key="i">
                            <v-expansion-panel-header>Nota # {{ i + 1 }}</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-col>
                                    <span><b>Descripción:</b> {{ item.descripcion }}</span>
                                </v-col>
                                <v-col>
                                    <span><b>Fecha y Hora:</b> {{ $moment(item.created_at).format('LLL') }}</span>
                                </v-col>
                                <v-col>
                                    <span><b>Persona que realizó la nota: </b>{{ item.nombre || item.apellido ||
                                        item.documento
                                        ? `${item.nombre || ''} ${item.apellido || ''} - ${item.documento || ''}`.trim()
                                        :
                                        medico }}
                                    </span>
                                </v-col>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>
                <v-card-actions>
                    <v-spacer> </v-spacer>
                    <v-btn color="error" @click="(dialogoNota = false), (descripcionNota = '')" small>
                        Cancelar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="modalCorreo" persistent max-width="500" v-if="modalCorreo">
            <v-card>
                <v-col xs="12" sm="12" md="12">
                    <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
                        <b>Enviar historia al correo</b></v-alert>
                </v-col>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field v-model="formCorreo.correo" label="Correo electrónico">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark small @click="
                        (modalCorreo = false),
                        (formCorreo.correo = ''),
                        (consultaCorreo = '')
                        ">Cerrar</v-btn>
                    <v-btn color="success" dark small @click="enviarCorreo('historia')">Enviar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="modalCorreoViejo" persistent max-width="500" v-if="modalCorreoViejo">
            <v-card>
                <v-col xs="12" sm="12" md="12">
                    <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
                        <b>Enviar historia al correo</b></v-alert>
                </v-col>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field v-model="formCorreo.correo" label="Correo electrónico">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark small @click="
                        (modalCorreoViejo = false),
                        (formCorreo.correo = ''),
                        (consultaCorreo = '')
                        ">Cerrar</v-btn>
                    <v-btn color="success" dark small @click="enviarCorreo('historiaAntigua')">Enviar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-card elevation="0" class="mb-5">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Histórico de Consultas</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-container>
                <v-row dense>
                    <v-col cols="12" md="3" sm="3">
                        <v-autocomplete v-model="tipo_consulta" dense label="Tipo de Busqueda" :items="tipos"
                            item-value="id" item-text="nombre" outlined></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="4" sm="4">
                        <v-text-field v-model="documento" dense outlined label="Número de identificación" clearable
                            hide-spin-buttons @click:clear="limpiar()" @keyup.enter="buscarAtenciones()" autofocus>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="4">
                        <v-btn color="blue" dark small @click="buscarAtenciones">Buscar
                        </v-btn>
                        <v-btn color="success" small @click="abrirModalCargueManual">Cargue historias
                        </v-btn>
                    </v-col>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn small :loading="loading3" :disabled="loading3" color="blue-grey"
                                class="ma-2 white--text" v-on="on"
                                @click="loader = 'loading3'; resultadoProdiagnostico()">
                                Ayudas Diagnosticas
                                <v-icon right dark>
                                    mdi-file-powerpoint-box
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Resultados Prodiagnostico</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn small :loading="loading4" :disabled="loading4" color="green" class="ma-2 white--text"
                                v-on="on" @click="loader = 'loading4'; enlaceDinamica()">
                                HC hospitalaria
                                <v-icon right dark>
                                    mdi-disqus
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Dinamica</span>
                    </v-tooltip>
                </v-row>
            </v-container>
            <v-data-table :headers="headersBase" :items="historiasV2" loading-text="Cargando... por favor espere"
                no-data-text="No se encontraron resultados relacionados para este tipo de busqueda">
                <template v-slot:[`item.afiliado`]="{ item }">
                    {{ item.afiliado.nombre_completo }}
                </template>

                <template v-slot:[`item.medico`]="{ item }">
                    <td>
                        {{ item.medico_ordena ? item.medico_ordena.operador.nombre_completo : "Sin Dato" }}
                    </td>
                </template>

                <template v-slot:[`item.nEspecialidad`]="{ item }">
                    <td v-if="item.cita_no_programada == true">
                        {{ item.especialidad ? item.especialidad.nombre : "Sin Especialidad" }}
                    </td>
                    <td v-else-if="item.finalidad == 'Cargue historia contingencia'">
                        {{ item.finalidad }}
                    </td>
                    <td v-else>
                        {{ item.agenda ? item.agenda.cita.especialidad.nombre : "Sin Especialidad" }}
                    </td>
                </template>

                <template v-slot:[`item.tipo`]="{ item }">
                    <td v-if="item.cita_no_programada == true">
                        {{ item.tipo_consulta.nombre }}
                    </td>
                    <td v-else-if="item.finalidad == 'Cargue historia contingencia'">
                        {{ item.tipo_consulta.nombre }}
                    </td>
                    <td v-else>
                        {{ item.agenda ? item.agenda.cita.nombre : "Sin Cita" }}
                    </td>
                </template>

                <template v-slot:[`item.fecha_atencion`]="{ item }">
                    <td v-if="item.cargue_historia_contingencia == null">
                        {{ item.fecha_hora_inicio }}
                    </td>
                    <td v-else>
                        {{ item.cargue_historia_contingencia.fecha_proceso }}
                    </td>
                </template>

                <template v-slot:[`item.acciones`]="{ item }">
                    <div class="text-center">
                        <!-- Botón para descargar historia si la finalidad NO es 'Cargue historia contingencia' -->
                        <v-tooltip bottom
                            v-if="item.finalidad != 'Cargue historia contingencia' && item.fecha_hora_inicio > '2024-08-04 23:00:00'">
                            <template v-slot:activator="{ on }">
                                <v-btn class="mx-2" fab dark x-small color="blue" v-on="on"
                                    @click="imprimir(item.id, 'historia')">
                                    <v-icon dark>mdi-download</v-icon>
                                </v-btn>
                            </template>
                            <span>Descargar Historia</span>
                        </v-tooltip>

                        <v-tooltip bottom
                            v-if="item.finalidad != 'Cargue historia contingencia' && item.fecha_hora_inicio <= '2024-08-04 23:00:00'">
                            <template v-slot:activator="{ on }">
                                <v-btn class="mx-2" fab dark x-small color="blue" v-on="on"
                                    @click="imprimir(item.id, 'historiaAntigua')">
                                    <v-icon dark>mdi-download</v-icon>
                                </v-btn>
                            </template>
                            <span>Descargar Historia</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn v-if="item.recomendacion_consulta && item.recomendacion_consulta.length > 0"
                                    class="mx-2" text dark color="success" v-on="on"
                                    @click="imprimirRecomendacion(item.id, 'recomendacionesConsulta')">
                                    <v-icon dark>mdi-note-check-outline</v-icon>
                                </v-btn>
                            </template>
                            <span>Descargar Recomendaciones</span>
                        </v-tooltip>

                        <!-- Botón para descargar historia de contingencia, solo si la finalidad ES 'Cargue historia contingencia' -->
                        <v-tooltip bottom v-if="item.finalidad === 'Cargue historia contingencia'">
                            <template v-slot:activator="{ on }">
                                <v-btn class="mx-2" fab dark x-small color="success" v-on="on" @click="
                                    imprimirAdjunto(
                                        item.cargue_historia_contingencia.ruta
                                    )
                                    ">
                                    <v-icon dark>mdi-download</v-icon>
                                </v-btn>
                            </template>
                            <span>Descargar Historia</span>
                        </v-tooltip>

                        <v-tooltip bottom v-if="
                            item.finalidad != 'Cargue historia contingencia' &&
                            item.fecha_hora_inicio <= '2024-08-04 23:00:00'
                        ">
                            <template v-slot:activator="{ on }">
                                <v-btn class="mx-2" fab dark x-small color="success" v-on="on" @click="
                                    (modalCorreoViejo = true), (consultaCorreo = item.id)
                                    ">
                                    <v-icon dark>mdi-email</v-icon>
                                </v-btn>
                            </template>
                            <span>Envio de Historia</span>
                        </v-tooltip>

                        <v-tooltip bottom v-if="
                            item.finalidad != 'Cargue historia contingencia' &&
                            item.fecha_hora_inicio > '2024-08-04 23:00:00'
                        ">
                            <template v-slot:activator="{ on }">
                                <v-btn class="mx-2" fab dark x-small color="success" v-on="on" @click="
                                    (modalCorreo = true), (consultaCorreo = item.id)
                                    ">
                                    <v-icon dark>mdi-email</v-icon>
                                </v-btn>
                            </template>
                            <span>Envio de Historia</span>
                        </v-tooltip>
                    </div>
                </template>

                <template v-slot:[`item.nota`]="{ item }">
                    <div class="text-center">
                        <v-tooltip bottom v-if="
                            item.medico_ordena_id == $store.state.auth.usuario.id ||
                            $can('historico.nota.visualizar')
                        ">
                            <template v-slot:activator="{ on }">
                                <v-btn class="mx-2" fab dark x-small color="blue" v-on="on"
                                    @click="notaAclaratoria(item)">
                                    <v-icon dark> mdi-book-open-variant </v-icon>
                                </v-btn>
                            </template>
                            <span>Nota aclaratoria</span>
                        </v-tooltip>
                    </div>
                </template>

                <template v-slot:[`item.anexo`]="{ item }">
                    <v-tooltip bottom v-if="item.destinoPaciente === 'Hospitalización (Remision)'">
                        <template v-slot:activator="{ on }">
                            <v-btn class="mx-2" fab dark x-small color="blue" v-on="on" @click="descargarAnexo(item)">
                                <v-icon dark> mdi-download </v-icon>
                            </v-btn>
                        </template>
                        <span>Descargar Anexo Referencia </span>
                    </v-tooltip>
                </template>

                <template v-slot:[`item.recomendaciones`]="{ item }">
                    <div class="text-center">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn class="mx-2" fab dark x-small color="blue-grey" v-on="on"
                                    @click="recomendacionesDiagnosticas(item)">
                                    <v-icon dark> mdi-message-bulleted </v-icon>
                                </v-btn>
                            </template>
                            <span>Recomendaciones diagnósticas</span>
                        </v-tooltip>
                    </div>
                </template>

                <template v-slot:[`item.certificado`]="{ item }">
                    <div class="text-center">
                        <v-tooltip bottom v-if="item.firma_paciente">
                            <template v-slot:activator="{ on }">
                                <v-btn class="mx-2" fab dark x-small color="primary" v-on="on"
                                    @click="printCertificadoMedico(item)">
                                    <v-icon dark> mdi-message-bulleted </v-icon>
                                </v-btn>
                            </template>
                            <span>Certificado facturación </span>
                        </v-tooltip>
                    </div>
                </template>

                <template v-slot:[`item.accionesV1`]="{ item }">
                    <div class="text-center">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn v-if="item.Especialidad != 'N/A'" class="mx-2" fab dark x-small color="blue"
                                    v-on="on" @click="imprimirV1(item)">
                                    <v-icon dark> mdi-download </v-icon>
                                </v-btn>
                                <v-btn v-else class="mx-2" fab dark x-small color="warning" v-on="on"
                                    @click="imprimirAdjutnosV1(item)">
                                    <v-icon dark> mdi-download </v-icon>
                                </v-btn>
                            </template>
                            <span>Descargar Historia</span>
                        </v-tooltip>
                    </div>
                </template>

                <template v-slot:[`item.accionesS3`]="{ item }">
                    <div class="text-center">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn class="mx-2" fab dark x-small color="warning" v-on="on"
                                    @click="descargarAdjunto(item.url)">
                                    <v-icon dark> mdi-download </v-icon>
                                </v-btn>
                            </template>
                            <span>Descargar Historia</span>
                        </v-tooltip>
                    </div>
                </template>

                <template v-slot:[`item.diligenciamiento`]="{ item }">
                    <div class="text-center">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn class="mx-2" fab dark x-small color="purple" v-on="on"
                                    @click="mostrarDiligenciamiento(item)">
                                    <v-icon dark> mdi-text-box-search-outline </v-icon>
                                </v-btn>
                            </template>
                            <span>Ver diligenciamiento historia clínica</span>
                        </v-tooltip>
                    </div>
                </template>
            </v-data-table>

        </v-card>

        <v-dialog width="500px" max v-model="dialogImpresion" persistent>
            <v-card>
                <v-alert text dense color="info" icon="mdi-help"><b>¿Desea imprimir el consolidado completo de
                        laboratorios y ayudas diagnósticas?</b></v-alert>
                <v-card-text>
                    <v-sheet width="100%" height="100%" class="pa-12">
                        <v-switch v-model="imprimir_resultados_laboratorios" flat
                            :label="`Resultados laboratorios: ${imprimir_resultados_laboratorios ? 'Sí' : 'No'}`">
                        </v-switch>
                        <v-switch v-model="imprimir_ayudas_diagnosticas" flat
                            :label="`Ayudas diagnósticas: ${imprimir_ayudas_diagnosticas ? 'Sí' : 'No'}`"></v-switch>
                    </v-sheet>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" small dark outlined @click="cerrarDialogImpresion()">Cerrar<v-icon>mdi-close
                        </v-icon>
                    </v-btn>
                    <v-btn color="success" small @click="actualizarImpresion(item)" outlined>Imprimir<v-icon>
                            mdi-package-down
                        </v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- ModalServicioSolicita -->
        <ModalServicioSolicita :mostarServicioSolicitaModal.sync="mostarServicioSolicitaModal"
            :consulta="consultaSeleccionada" @actualizarServicioSolicita="actualizarServicioSolicita" />

        <!-- Modal de Cargue de Historias Clinicas -->
        <ModalCargueManual :mostrarModalCargue.sync="mostrarModalCargue" />
    </div>
</template>

<script>
import moment from "moment";
import AfiliadoComponent from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import ModalServicioSolicita from "@/components/historico/ModalServicioSolicita.vue";
import ModalCargueManual from "@/components/historico/ModalCargueManual.vue";
import {
    mapActions
} from "vuex";
import ModalDiligenciamientoHistoria from '~/components/historico/ModalDiligenciamientoHistoria.vue';
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can("historico.atenciones.consultas")) {
            return redirect("/");
        }
    },

    name: "historiasV1",
    components: {
        AfiliadoComponent,
        ModalServicioSolicita,
        ModalCargueManual,
        ModalDiligenciamientoHistoria,
    },
    data: () => ({
        mostrarModalCargue: false,
        tipo_consulta: null,
        tipos: [{
            'id': 1,
            'nombre': 'Historias Clinicas'
        }, {
            'id': 2,
            'nombre': 'Historias Horus V1'
        }, {
            'id': 3,
            'nombre': 'Historias Odontología'
        }, {
            'id': 4,
            'nombre': 'Consentimientos Odontologicos'
        }, {
            'id': 5,
            'nombre': 'Historias Oftamología'
        }, {
            'id': 6,
            'nombre': 'Historias Hospitalarias'
        }, {
            'id': 7,
            'nombre': 'Imagenes diagnósticas'
        }],
        dialogoDiligenciamiento: false,
        idConsulta: null,
        idAfiliado: null,
        resgitroHistoriaCompleto: {},
        imprimir_resultados_laboratorios: false,
        imprimir_ayudas_diagnosticas: false,
        dialogImpresion: false,
        modalCorreo: false,
        modalCorreoViejo: false,
        consultaCorreo: null,
        formCorreo: {},
        tab: "HorusV2",
        historiasV2: [],
        historiasV1: [],
        sumidental: [],
        consentimientos: [],
        visionTotal: [],
        tipo: {},
        fecha_proceso: "",
        listaAnexos: "",
        cedula_paciente: "",
        tipo_documento_paciente: null,
        tipo_documentos: [],
        dialgoTipoArchivo: false,
        dialogoCargue: false,
        preload: false,
        loadingTable: false,
        documento: null,
        headersBase: [],
        loading3: false,
        loading4: false,
        headersV1: [{
            text: "F.Atención",
            align: "center",
            sortable: false,
            value: "Datetimeingreso",
        },
        {
            text: "Afiliado",
            align: "center",
            sortable: false,
            value: "Nombre",
        },
        {
            text: "Atendido Por",
            align: "center",
            sortable: false,
            value: "Atendido_Por",
        },
        {
            text: "Especialidad",
            align: "center",
            sortable: false,
            value: "Especialidad",
        },
        {
            text: "Tipo",
            align: "center",
            sortable: false,
            value: "Tipocita",
        },
        {
            text: "Acciones",
            align: "center",
            sortable: false,
            value: "accionesV1",
        },
        ],
        headersV2: [{
            text: "F.Atención",
            align: "center",
            sortable: false,
            value: "fecha_atencion",
        },
        {
            text: "Afiliado",
            align: "center",
            sortable: false,
            value: "afiliado",
        },
        {
            text: "Atendido Por",
            align: "center",
            sortable: false,
            value: "medico",
        },
        {
            text: "Especialidad",
            align: "center",
            sortable: false,
            value: "nEspecialidad",
        },
        {
            text: "Tipo consulta",
            align: "center",
            sortable: false,
            value: "tipo",
        },
        {
            text: "Tipo archivo",
            align: "center",
            sortable: false,
            value: "cargue_historia_contingencia.tipo_archivo.nombre",
        },
        {
            text: "Finalidad",
            align: "center",
            sortable: false,
            value: "finalidadconsulta",
        },
        {
            text: "Acciones",
            align: "center",
            sortable: false,
            value: "acciones",
        },
        {
            text: "Nota aclaratoria",
            align: "center",
            sortable: false,
            value: "nota",
        },
        {
            text: "Anexo",
            align: "center",
            sortable: false,
            value: "anexo",
        },
        {
            text: "Recomendaciones",
            align: "center",
            sortable: false,
            value: "recomendaciones",
        },
        {
            text: "Certificado",
            align: "center",
            sortable: false,
            value: "certificado",
        },
        {
            text: "Diligenciamiento H.C",
            align: "center",
            sortable: false,
            value: "diligenciamiento",
        },
        ],

        headersSumidental: [{
            text: "Tipo documento",
            sortable: false,
            value: "tipo_documento",
        },
        {
            text: "Documento",
            sortable: false,
            value: "documento",
        },
        {
            text: "Fecha",
            sortable: false,
            value: "fecha",
        },
        {
            text: "Especialidad",
            sortable: false,
            value: "especialidad",
        },
        {
            text: "acciones",
            align: "center",
            sortable: false,
            value: "accionesS3",
        },
        ],
        paginaOrden: 1,
        totalOrden: 0,
        opcionesOrden: [5, 10, 20, 50, 100],
        opcionActualOrden: 5,
        tipoArchivo: [],
        datosPaciente: null,
        dialogoNota: false,
        descripcionNota: "",
        listaNotas: [],
        historia_id: "",
        medico: "",
        mostarServicioSolicitaModal: false,
        consultaSeleccionada: {},
        loading: false,
    }),

    methods: {
        ...mapActions('app', ['setPreload']),

        abrirModalCargueManual() {
            this.mostrarModalCargue = true;
        },

        async buscarAtenciones() {

            if (this.documento == null || this.tipo_consulta == null) {
                this.$toast.error(
                    "Debe indicar el tipo y número de documento del afiliado"
                );
                return;
            }

            this.setPreload(true);
            switch (this.tipo_consulta) {
                case 1: // Co
                    try {
                        this.headersBase = this.headersV2;
                        const responseV2 = await this.$axios.post("/historia/consultas", {
                            documento: this.documento,
                        });
                        // Ordenar las historias cronológicamente por fecha_hora_inicio y fecha_proceso
                        const sortedData = responseV2.data.sort((a, b) => {
                            const dateA_inicio = new Date(a.fecha_hora_inicio.split("T")[
                                0]); // Extrayendo solo la parte de la fecha
                            const dateB_inicio = new Date(b.fecha_hora_inicio.split("T")[
                                0]); // Extrayendo solo la parte de la fecha

                            const dateA_proceso = a.cargue_historia_contingencia ?
                                new Date(a.cargue_historia_contingencia.fecha_proceso) :
                                null;
                            const dateB_proceso = b.cargue_historia_contingencia ?
                                new Date(b.cargue_historia_contingencia.fecha_proceso) :
                                null;

                            // Comparar las fechas de inicio
                            if (dateA_inicio > dateB_inicio) return -1;
                            if (dateA_inicio < dateB_inicio) return 1;

                            // Si las fechas de inicio son iguales, comparar las fechas de proceso
                            if (dateA_proceso && dateB_proceso) {
                                if (dateA_proceso > dateB_proceso) return -1;
                                if (dateA_proceso < dateB_proceso) return 1;
                            }

                            // Si uno de los registros tiene fecha de proceso y el otro no, priorizar el que tiene fecha
                            if (dateA_proceso && !dateB_proceso) return -1;
                            if (!dateA_proceso && dateB_proceso) return 1;

                            // Si ambos no tienen fechas de proceso o son iguales, considerarlos iguales
                            return 0;
                        });

                        // Asignar los datos ordenados
                        this.historiasV2 = sortedData;
                    } catch (error) {
                        this.historiasV2 = [];
                    } finally {
                        this.setPreload(false);
                    }
                    break;

                case 2:
                    try {
                        this.headersBase = this.headersV1;
                        const responseV1 = await this.$axios.get(
                            "/historia/consultas/historias-v1/" + this.documento
                        );
                        this.historiasV2 = responseV1.data;
                    } catch (error) {
                        this.historiasV2 = [];
                    } finally {
                        this.setPreload(false);
                    }
                    break;

                case 3:
                    try {
                        this.headersBase = this.headersSumidental;
                        const responseSumidental = await this.$axios.get(
                            "/historia/repositorio/sumidental/" +
                            this.documento +
                            "?carpeta=historiasSumidental"
                        );
                        this.historiasV2 = responseSumidental.data.map((item) => {
                            const url = item.split("/")[1];
                            const informacionDeUrl = url.split("_");
                            return {
                                url: item,
                                tipo_documento: informacionDeUrl[0],
                                documento: informacionDeUrl[1],
                                fecha: informacionDeUrl[2].split(".")[0],
                            };
                        });
                    } catch (error) {
                        this.historiasV2 = [];
                    } finally {
                        this.setPreload(false);
                    }
                    break;

                case 4:
                    try {
                        this.headersBase = this.headersSumidental;
                        const consentimientos = await this.$axios.get(
                            "/historia/repositorio/sumidental/" +
                            this.documento +
                            "?carpeta=consentimientosInformados"
                        );
                        this.historiasV2 = consentimientos.data.map((item) => {
                            const url = item.split("/")[1];
                            const informacionDeUrl = url.split("_");
                            return {
                                url: item,
                                tipo_documento: informacionDeUrl[0],
                                documento: informacionDeUrl[1],
                                fecha: informacionDeUrl[2].split(".")[0],
                            };
                        });
                    } catch (error) {
                        this.historiasV2 = [];
                    } finally {
                        this.setPreload(false);
                    }
                    break;

                case 5:
                    try {
                        this.headersBase = this.headersSumidental;
                        const visionTotal = await this.$axios.get(
                            "/historia/repositorio/sumidental/" +
                            this.documento +
                            "?carpeta=visionTotal"
                        );
                        this.historiasV2 = visionTotal.data.map((item) => {
                            const url = item.split("/")[1];
                            const informacionDeUrl = url.split("_");
                            return {
                                url: item,
                                tipo_documento: informacionDeUrl[0],
                                documento: informacionDeUrl[1],
                                fecha: informacionDeUrl[2].split(".")[0],
                            };
                        });
                    } catch (error) {
                        this.historiasV2 = [];
                    } finally {
                        this.setPreload(false);
                    }
                    break;
                case 6:
                    try {
                        this.headersBase = this.headersSumidental;
                        const dinamica = await this.$axios.get(
                            "/historia/repositorio/sumidental/" +
                            this.documento +
                            "?carpeta=historiasDinamica"
                        );
                        this.historiasV2 = dinamica.data.map((item) => {
                            const url = item.split("/")[1];
                            const informacionDeUrl = url.split("_");
                            return {
                                url: item,
                                tipo_documento: informacionDeUrl[0],
                                documento: informacionDeUrl[1],
                                fecha: informacionDeUrl[2].split(".")[0],
                                especialidad: informacionDeUrl[3].split(".")[0],
                            };
                        });
                    } catch (error) {
                        this.historiasV2 = [];
                    } finally {
                        this.setPreload(false);
                    }
                    break;
                case 7:
                    try {
                        this.headersBase = this.headersSumidental;
                        const imagenes = await this.$axios.get(
                            "/historia/repositorio/sumidental/" +
                            this.documento +
                            "?carpeta=imagenesDiagnosticas"
                        );

                        this.historiasV2 = imagenes.data.map((item) => {
                            const url = item.split("/")[1];
                            const informacionDeUrl = url.split("_");
                            return {
                                url: item,
                                tipo_documento: informacionDeUrl[0],
                                documento: informacionDeUrl[1],
                                fecha: informacionDeUrl[2].split(".")[0],
                                especialidad: informacionDeUrl[3].split(".")[0],

                            };
                        });

                    } catch (error) {
                        this.historiasV2 = [];

                    } finally {
                        this.setPreload(false);
                    }
            }
        },

        imprimir(id, tipo) {
            this.setPreload(true);
            const data = {
                tipo: tipo,
                consulta: id,
            };
            this.$axios
                .post("pdf", data, {
                    responseType: "arraybuffer",
                })
                .then((res) => {
                    this.setPreload(false);
                    let blob = new Blob([res.data], {
                        type: "application/pdf",
                    });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                })
                .catch((res) => {
                    console.log(res);
                    this.setPreload(false);
                })
        },

        imprimirRecomendacion(id, tipo) {
            this.setPreload(true);
            const data = {
                tipo: tipo,
                consulta: id,
            };
            this.$axios
                .post("pdf", data, {
                    responseType: "arraybuffer",
                })
                .then((res) => {
                    this.setPreload(false);
                    let blob = new Blob([res.data], {
                        type: "application/pdf",
                    });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                })
                .catch((res) => {
                    console.log(res);
                    this.setPreload(false);
                });
        },

        /**
         * imprime la historia de horus uno
         */
        async imprimirV1(item) {
            const data = {
                data: item,
            };

            try {
                this.setPreload(true);
                const response = await this.$axios.post(
                    "historia/consultas/historias-v1/pdf",
                    data
                );
                // Convierte base64 a ArrayBuffer
                const arrayBuffer = this.base64ToArrayBuffer(response.data);
                // Crear un Blob a partir del ArrayBuffer
                const blob = new Blob([arrayBuffer], {
                    type: "application/pdf",
                });
                // Crear una URL para el Blob
                const url = window.URL.createObjectURL(blob);
                // Crear n elemento de enlace y simular el clic para descargar
                const a = document.createElement("a");
                a.href = url;
                a.download = "historia.pdf";
                document.body.appendChild(a); // Necesario para Firefox
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url); // Liberar la URL del objeto
            } catch (error) {
                console.log(error);
            } finally {
                this.setPreload(false);
            }
        },

        async imprimirAdjutnosV1(item) {
            const data = {
                data: item.Ruta_Adjunto,
            };

            try {
                this.setPreload(true);
                const response = await this.$axios.post(
                    "historia/consultas/historias-v1/adjunto",
                    data
                );
                // Convierte base64 a ArrayBuffer
                const arrayBuffer = this.base64ToArrayBuffer(response.data);
                // Crear un Blob a partir del ArrayBuffer
                const blob = new Blob([arrayBuffer], {
                    type: "application/pdf",
                });

                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
                this.preload = false;
            } catch (error) {
                console.log(error);
            } finally {
                this.setPreload(false);
            }
        },

        /**
         * decodifica la el base64 para poder convertir
         */
        base64ToArrayBuffer(base64) {
            const binaryString = window.atob(base64); // Decodificar base64
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        },

        limpiar() {
            this.documento = "";
            this.tab = null;
            this.historiasV1 = [];
            this.historiasV2 = [];
            this.sumidental = [];
            this.consentimientos = [];
            this.visionTotal = [];
        },

        cargueHistorias() {
            this.listarTipoArchivo();
            this.listarTiposDocumentos();
            this.dialogoCargue = true;
        },

        limpiarTipoArchivo() {
            for (const key in this.tipo) {
                this.tipo[key] = "";
            }
            this.dialgoTipoArchivo = false;
        },

        listarTipoArchivo() {
            this.preload = true;
            this.$axios
                .get("/tipo-archivo/listar")
                .then((res) => {
                    this.tipoArchivo = res.data;
                    this.preload = false;
                })
                .catch((e) => {
                    this.preload = false;
                });
        },

        guardarTipoArchivo() {
            this.preload = true;
            this.$axios
                .post("/tipo-archivo/crear", this.tipo)
                .then((res) => {
                    this.limpiarTipoArchivo();
                    this.listarTipoArchivo();
                    this.preload = false;
                })
                .catch((e) => {
                    this.preload = false;
                });
        },

        buscarAfiliado() {
            if (this.cedula_paciente == "" || this.tipo_documento_paciente == null) {
                this.$toast.error(
                    "Debe indicar el tipo y número de documento del afiliado"
                );
                return;
            }

            this.setPreload(true);
            this.$axios
                .get(
                    `afiliados/${this.cedula_paciente}/${this.tipo_documento_paciente}`
                )
                .then((res) => {
                    this.setPreload(false);
                    this.datosPaciente = res.data;
                })
                .catch((e) => {
                    this.$toast.error("El afiliado no se encuentra en la base de datos");
                    this.setPreload(false);
                });
        },

        clearFields() {
            (this.cedula_paciente = ""),
                (this.tipo_documento_paciente = ""),
                (this.listaAnexos = ""),
                (this.fecha_proceso = ""),
                (this.datosPaciente = null),
                (this.dialogoCargue = false);
        },

        guardar() {
            if (this.$refs.adjuntos.files == "") {
                this.$toast.error("El anexo es requerido");
                return;
            }
            this.setPreload(true);
            let fecha = moment(new Date()).format("YYYY-MM-D HH:mm");
            let formData = new FormData();
            formData.append("tipo_archivo_id", this.listaAnexos);
            formData.append("afiliado_id", this.datosPaciente.id);
            formData.append("fecha_hora_inicio", fecha);
            formData.append("fecha_proceso", this.fecha_proceso);
            formData.append(`adjuntos`, this.$refs.adjuntos.files[0]);
            this.$axios
                .post("/cargue-historia-contingencia/crear", formData)
                .then((res) => {
                    this.clearFields();
                    this.setPreload(false);
                })
                .catch((e) => {
                    this.setPreload(false);
                });
        },

        async imprimirAdjunto(ruta) {
            this.setPreload(true);
            try {
                let adj = await this.$adjuntos(ruta);
                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                this.setPreload(false);
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                this.setPreload(false);
                this.$toast.error("El adjunto de la factura no existe!");
            }
        },

        listarTiposDocumentos() {
            this.setPreload(true);
            this.$axios
                .get("tipo-documento/listar")
                .then((res) => {
                    this.tipo_documentos = res.data;
                })
                .catch((e) => {
                    this.$toast.error(
                        "Ocurrio un error al cargar los tipos de documento"
                    );
                    console.log(e);
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        notaAclaratoria(item) {
            this.historia_id = item.historiaId;
            this.medico = item.medico_ordena.operador.nombre_completo;
            this.listarNotas();
            this.dialogoNota = true;
        },

        guardarNota() {
            this.setPreload(true);
            this.$axios
                .post("/nota_aclaratoria/crear", {
                    descripcion: this.descripcionNota,
                    historia: this.historia_id,
                })
                .then((res) => {
                    this.descripcionNota = "";
                    this.listarNotas();
                    this.setPreload(false);
                })
                .catch((e) => {
                    this.setPreload(false);
                });
        },

        listarNotas() {
            this.$axios
                .post("/nota_aclaratoria/listar", {
                    historia: this.historia_id,
                })
                .then((res) => {
                    this.listaNotas = res.data;
                })
                .catch((e) => { });
        },

        descargarAnexo(item) {
            this.setPreload(true);
            let pdf = {
                tipo: "anexo9",
                consulta_id: item.id,
            };
            this.$axios
                .post("/pdf", pdf, {
                    responseType: "arraybuffer"
                })
                .then((res) => {
                    this.setPreload(false);
                    let blob = new Blob([res.data], {
                        type: "application/pdf"
                    });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                }).finally(() => {
                    this.setPreload(false);
                });

        },

        enviarCorreo(tipo) {
            var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (!regex.test(this.formCorreo.correo)) {
                return this.$swal.fire({
                    title: "Debe ingresar un Email valido",
                    icon: "warning",
                    type: "error",
                });
            }
            this.setPreload(true);
            let pdf = {
                consulta: this.consultaCorreo,
                tipo: tipo,
                correo: this.formCorreo.correo,
            };
            this.$axios
                .post("pdf", pdf)
                .then((res) => {
                    this.setPreload(false);
                    // this.emailEnvio = null;
                    this.formCorreo.correo = "";
                    this.consultaCorreo = "";
                    this.modalCorreo = false;
                    return this.$swal.fire({
                        title: "Historia enviada con exito!",
                        icon: "success",
                        type: "success",
                    });
                })
                .catch((err) => {
                    this.setPreload(false);
                });
        },

        actualizarServicioSolicita(data) {
            this.setPreload(true);
            this.$axios
                .put(`/consultas/actualizarServicioSolicita/${data.consulta_id}`, {
                    servicio_solicita_referencia: data.servicio_solicita_referencia,
                })
                .then((res) => {
                    this.$toast.success("Servicio solicitado actualizado");
                    this.buscarAtenciones();
                    let pdf = {
                        tipo: "anexo9",
                        consulta_id: data.consulta_id,
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
                        });
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al actualizar el servicio solicitado"
                    );
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        imprimirSumidental(item) {
            console.log(item);
        },

        resultadoProdiagnostico() {
            window.open("https://prodiagnostico.hiruko.com.co/login", "ventana1",
                "width=800,height=800,scrollbars=NO");
        },

        enlaceDinamica() {
            window.open("http://192.168.0.30:8887", "ventana1", "width=800,height=800,scrollbars=NO");
        },

        recomendacionesDiagnosticas(item) {
            let data = {
                tipo: 'recomendacionDiagnosticos',
                recomendaciones: this.recomendacionesSeleccionadas,
                consulta_id: item.id
            };
            this.setPreload(true);
            this.$axios.post("/pdf", data, {
                responseType: "arraybuffer",
            })
                .then(res => {
                    let blob = new Blob([res.data], {
                        type: "application/pdf"
                    });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                    this.setPreload(false);
                })
                .catch(err => {
                    console.error("Error al generar el PDF:", err);
                    this.setPreload(false);
                });
        },

        abririDialogImpresion(item) {
            this.dialogImpresion = true;
            this.item = item
        },

        actualizarImpresion(item) {
            this.$axios.put('historia/actualizarImpresion/' + item.historiaId, {
                imprimir_resultados_laboratorios: this.imprimir_resultados_laboratorios,
                imprimir_ayudas_diagnosticas: this.imprimir_ayudas_diagnosticas
            }).then(() => {
                this.imprimir(item.id, 'historia')
            }).catch((error) => {
                console.log(error)
            })
        },

        cerrarDialogImpresion() {
            this.dialogImpresion = false;
            this.imprimir_ayudas_diagnosticas = '',
                this.imprimir_resultados_laboratorios = ''
        },

        async printCertificadoMedico(pdf) {
            try {
                const request = {
                    consulta: pdf.id,
                    tipo: "certificadoAtencionMedica",
                    correo: null,
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
                this.$toast.error('El adjunto no existe!')
                console.log(error.response);
            }
        },
        mostrarDiligenciamiento(item) {
            this.idConsulta = item.id;
            this.dialogoDiligenciamiento = true;
            this.setPreload(true);
            this.$axios.post('consultas/consultar-completo/', {
                consulta: this.idConsulta
            }).then((res) => {
                this.resgitroHistoriaCompleto = res.data;
            }).finally(() => {
                this.setPreload(false);
            });
        },

        cerrarDialogoDiligenciamiento() {
            this.dialogoDiligenciamiento = false;
        }
    },
};
</script>
