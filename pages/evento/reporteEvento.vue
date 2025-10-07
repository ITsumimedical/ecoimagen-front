<template>
    <div class="text-center">

        <v-card>
            <v-form>
                <!-- Título del formulario -->
                <v-card elevation="0">
                    <v-card-title>
                        <v-toolbar flat>
                            <v-toolbar-title>
                                <div class="d-flex align-center">
                                    <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                                    <span>Reporte</span>
                                </div>
                            </v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                        </v-toolbar>
                    </v-card-title>
                </v-card>
                <v-container fluid>
                    <v-row dense>
                        <v-col cols="12" sm="4" md="3">
                            <v-switch v-model="evento.relacionar_afiliado" label="Relacionar afiliado" dense></v-switch>
                        </v-col>

                        <v-col cols="12" v-if="evento.relacionar_afiliado">
                            <v-row dense>
                                <v-col cols="12" sm="4" md="3">
                                    <v-autocomplete label="Tipo de documento" dense outlined
                                        v-model="afiliado.tipo_documento" :items="tiposDocumentos" item-value="id"
                                        item-text="nombre" :loading="loadingTipoDocumento"></v-autocomplete>
                                </v-col>

                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field label="Número documento" dense outlined type="number"
                                        v-model="afiliado.numero_documento" hide-spin-buttons min="0"></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="4" md="3" class="d-flex">
                                    <v-btn color="info" small class="mr-2" @click="buscarAfiliado()"
                                        :loading="loadingAfiliado" :disabled="loadingAfiliado">
                                        Buscar
                                    </v-btn>

                                    <v-btn color="error" small @click="limpiarComponente()">
                                        Limpiar
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" v-if="evento.relacionar_afiliado && datosAfiliado">
                            <AfiliadoComponente :afiliado="datosAfiliado" :modoDetalle="true" :modoEdicion="true"
                                :mostrarClasificaciones="true" />
                        </v-col>
                    </v-row>


                </v-container>
                <!-- Formulario de registro del reporte -->
                <v-card elevation="0">
                    <div class="my-8 d-flex align-center">
                        <v-divider color="#311B92"></v-divider>

                        <span class="mx-4 font-weight-bold text-subtitle-1 d-flex align-center" style="color: #311B92;">
                            <v-icon left color="#311B92">mdi-account-injury</v-icon>
                            FORMULARIO DE REPORTE SUCESO CLÍNICO
                        </span>

                        <v-divider color="#311B92"></v-divider>
                    </div>
                    <v-container fluid>
                        <v-row dense>
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete dense :error-messages="errors.suceso_id" v-model="evento.suceso_id"
                                    :items="sucesos" label="Suceso" item-text="nombre" item-value="id" outlined
                                    @input="listarClasiAreas" @change="resetEventoClasificacion"></v-autocomplete>
                            </v-col>

                            <!-- Clasificación del área -->
                            <v-col cols="12" sm="6" md="4" v-if="mostrarClasificacionArea">
                                <v-autocomplete dense :error-messages="errors.clasificacion_area_id" outlined
                                    v-model="evento.clasificacion_area_id" :items="clasifAreas"
                                    label="Clasificación de área" item-text="nombre" item-value="id"
                                    @input="listarTiposEventos" @change="resetClasificacionArea">
                                </v-autocomplete>
                            </v-col>

                            <!-- Tipo de evento -->
                            <v-col cols="12" sm="6" md="4" v-if="mostrarTipoEvento">
                                <v-autocomplete dense :error-messages="errors.tipo_evento_id" outlined
                                    v-model="evento.tipo_evento_id" :items="tiposEventos" label="Tipo de evento"
                                    item-text="nombre" item-value="id"></v-autocomplete>
                            </v-col>

                            <!-- Tecnovigilancia -->
                            <v-col cols="12" sm="6" md="4" v-if="evento.suceso_id == 139">
                                <v-autocomplete dense v-model="evento.relacion" :items="relacionesTecnovigilancia"
                                    outlined label="Relacionado con" :error-messages="errors.relacion"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" v-if="evento.suceso_id == 139">
                                <v-autocomplete dense v-model="evento.clasif_tecnovigilancia" outlined
                                    :items="['Evento adverso serio', 'Evento adverso no serio', 'Incidente serio', 'Incidente no serio']"
                                    label="Clasificación tecnovigilancia"
                                    :error-messages="errors.clasif_tecnovigilancia">
                                </v-autocomplete>
                            </v-col>

                            <!-- Sección para dispositivos y equipos biomédicos -->
                            <template v-if="evento.relacion === 'Dispositivos' || evento.relacion === 'Ambos'">
                                <!-- Dispositivo -->
                                <v-col cols="12" sm="8" md="4">
                                    <v-autocomplete dense :error-messages="errors.dispositivo_id" outlined
                                        v-model="evento.dispositivo_id" :search-input.sync="medicamento"
                                        no-data-text="Debe ingresar el nombre del medicamento para iniciar la búsqueda"
                                        :items="medicamentos" label="Dispositivo" item-text="nombre" item-value="id">
                                    </v-autocomplete>
                                </v-col>
                                <!-- Referencia del dispositivo -->
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field dense v-model="evento.referencia_dispositivo"
                                        label="Referencia del dispositivo" outlined
                                        :error-messages="errors.referencia_dispositivo"></v-text-field>
                                </v-col>
                                <!-- Marca del dispositivo -->
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field dense v-model="evento.marca_dispositivo" label="Marca dispositivo"
                                        outlined :error-messages="errors.marca_dispositivo"></v-text-field>
                                </v-col>
                                <!-- Lote del dispositivo -->
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field dense v-model="evento.lote_dispositivo" label="Lote dispositivo"
                                        outlined :error-messages="errors.lote_dispositivo"></v-text-field>
                                </v-col>
                                <!-- Invima del dispositivo -->
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field dense v-model="evento.invima_dispositivo" label="Invima dispositivo"
                                        outlined :error-messages="errors.invima_dispositivo"></v-text-field>
                                </v-col>
                                <!-- Fabricante del dispositivo -->
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field dense v-model="evento.fabricante_dispositivo" outlined
                                        label="Fabricante Dispositivo" :error-messages="errors.fabricante_dispositivo">
                                    </v-text-field>
                                </v-col>
                            </template>

                            <!-- Sección para equipo biomédico -->
                            <template v-if="evento.relacion === 'Equipo biomédico' || evento.relacion === 'Ambos'">
                                <!-- Nombre del equipo biomédico -->
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field dense v-model="evento.nombre_equipo_biomedico"
                                        label="Nombre equipo biomédico" outlined
                                        :error-messages="errors.nombre_equipo_biomedico"></v-text-field>
                                </v-col>
                                <!-- Marca del equipo biomédico -->
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field dense v-model="evento.marca_equipo_biomedico" outlined
                                        label="Marca equipo biomédico" :error-messages="errors.marca_equipo_biomedico">
                                    </v-text-field>
                                </v-col>
                                <!-- Modelo del equipo biomédico -->
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field dense v-model="evento.modelo_equipo_biomedico" outlined
                                        label="Modelo equipo biomédico"
                                        :error-messages="errors.modelo_equipo_biomedico"></v-text-field>
                                </v-col>
                                <!-- Serie del equipo biomédico -->
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field dense v-model="evento.serie_equipo_biomedico" outlined
                                        label="Serie equipo biomédico" :error-messages="errors.serie_equipo_biomedico">
                                    </v-text-field>
                                </v-col>
                                <!-- Invima del equipo biomédico -->
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field dense v-model="evento.invima_equipo_biomedico" outlined
                                        label="Invima equipo biomédico"
                                        :error-messages="errors.invima_equipo_biomedico"></v-text-field>
                                </v-col>
                                <!-- Fabricante del equipo biomédico -->
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field dense v-model="evento.fabricante_biomedico"
                                        label="Fabricante equipo Biomedico" outlined
                                        :error-messages="errors.fabricante_biomedico"></v-text-field>
                                </v-col>
                            </template>

                            <!-- Datos de la sede -->
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete :error-messages="errors.sede_ocurrencia_id" outlined
                                    v-model="evento.sede_ocurrencia_id" label="Sede de ocurrencia" :items="reps"
                                    no-data-text="Debe ingresar el nombre de una sede para iniciar la búsqueda"
                                    item-value="id" item-text="nombre" :search-input.sync="rep" dense></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete :error-messages="errors.sede_reportante_id"
                                    v-model="evento.sede_reportante_id" outlined
                                    no-data-text="Debe ingresar el nombre de una sede para iniciar la búsqueda"
                                    label="Sede reportante" :items="repsReporta" item-value="id" item-text="nombre"
                                    :search-input.sync="repReporta" dense>
                                </v-autocomplete>
                            </v-col>
                            <!-- Servicio de ocurrencia si corresponde -->
                            <v-col cols="12" sm="6" md="4" v-if="evento.sede_ocurrencia_id === 13742">
                                <v-autocomplete dense v-model="evento.servicio_ocurrencia" :items="serviciosOcurrencias"
                                    outlined label="Servicio ocurrencia" :error-messages="errors.servicio_ocurrencia">
                                </v-autocomplete>
                            </v-col>

                            <!--Servicio reportante si corresponde-->
                            <v-col cols="12" sm="6" md="4" v-if="evento.sede_reportante_id === 13742">
                                <v-autocomplete dense v-model="evento.servicio_reportante" :items="serviciosOcurrencias"
                                    outlined label="Servicio reportante" :error-messages="errors.servicio_reportante">
                                </v-autocomplete>
                            </v-col>


                            <!-- Fecha de ocurrencia -->
                            <v-col cols="12" sm="6" md="2">
                                <v-text-field dense v-model="evento.fecha_ocurrencia" outlined
                                    :error-messages="errors.fecha_ocurrencia" label="Fecha ocurrencia" type="date">
                                </v-text-field>
                            </v-col>
                            <!-- Profesional tratante -->
                            <v-col cols="12" sm="6" md="6">
                                <v-autocomplete :items="listaOperadores" :item-text="concatenar" item-value="user_id"
                                    outlined v-model="evento.profesional_id" label="Profesional tratante"
                                    dense></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="8" md="4" v-if="evento.suceso_id == 109">
                                <v-autocomplete dense :error-messages="errors.medicamento_id" outlined
                                    v-model="evento.medicamento_id" :search-input.sync="medicamento"
                                    no-data-text="Debe ingresar el nombre del medicamento para iniciar la búsqueda"
                                    :items="medicamentos" label="Medicamento" item-text="nombre" item-value="id">
                                </v-autocomplete>
                            </v-col>
                            <!-- Descripción de los hechos -->
                            <v-col cols="12">
                                <v-textarea dense auto-grow v-model="evento.descripcion_hechos" outlined
                                    label="Descripción de los hechos" :error-messages="errors.descripcion_hechos"
                                    hint="Describa con detalle el suceso reportado">
                                </v-textarea>
                            </v-col>
                            <!-- Acciones tomadas -->
                            <v-col cols="12">
                                <v-textarea auto-grow dense v-model="evento.accion_tomada" outlined
                                    label="Acciones que se tomaron" :error-messages="errors.accion_tomada"
                                    hint="Describa las acciones que se tomaron"></v-textarea>
                            </v-col>

                            <!-- Adjuntos -->
                            <v-col cols="12" sm="6">
                                <v-file-input counter show-size truncate-length="10" v-model="adjuntos" small-chips
                                    multiple outlined dense label="Adjuntar"></v-file-input>
                            </v-col>
                        </v-row>

                        <!-- Botón de acción -->
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn small color="boton" dark @click="guardarEvento">
                                Registrar evento
                            </v-btn>
                        </v-card-actions>
                    </v-container>
                </v-card>
            </v-form>
        </v-card>

        <!-- Diálogo de históricos del afiliado -->
        <v-dialog v-model="dialogoHistoricos" max-width="1000px" persistent v-if="datosHistoricos">
            <v-card>

                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                                <span>Registro histórico de sucesos clínicos del afiliado</span>
                            </div>
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="dialogoHistoricos = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar>
                </v-card-title>

                <v-card-subtitle class="text-subtitle-2 grey--text text--darken-1">
                    Afiliado relacionado - Detalle de eventos registrados
                </v-card-subtitle>

                <v-card-text>
                    <v-expansion-panels accordion>
                        <v-expansion-panel v-for="(item, evento) in datosHistoricos" :key="evento"
                            class="mb-2 rounded-lg">
                            <v-expansion-panel-header>
                                <v-row class="align-center">
                                    <v-col cols="12" md="3">
                                        <b>ID:</b> {{ item.id }}
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <b>Estado:</b>
                                        <v-chip small :color="getColor(item.estado_id)" dark class="font-weight-medium">
                                            <v-icon left small>mdi-alert-circle-outline</v-icon>
                                            {{ getEstadoTexto(item.estado_id) }}
                                        </v-chip>
                                    </v-col>

                                    <v-col cols="12" md="5">
                                        <b>Fecha:</b> {{ item.fecha_ocurrencia }}
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-header>

                            <v-expansion-panel-content>
                                <v-row dense>
                                    <v-col cols="6" v-if="item.suceso">
                                        <span><b>Suceso:</b> {{ item.suceso.nombre }}</span>
                                    </v-col>

                                    <v-col cols="6" v-if="item.clasificacion_area">
                                        <span><b>Clasificación:</b> {{ item.clasificacion_area.nombre }}</span>
                                    </v-col>

                                    <v-col cols="6" v-if="item.otros_nombre_suceso">
                                        <span><b>Nombre Suceso:</b> {{ item.otros_nombre_suceso }}</span>
                                    </v-col>

                                    <v-col cols="6" v-if="item.priorizacion">
                                        <span><b>Priorización:</b> {{ item.priorizacion }}</span>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-textarea v-model="item.descripcion_hechos" label="Descripción de los hechos"
                                            auto-grow outlined dense />
                                    </v-col>

                                    <v-col cols="12">
                                        <v-textarea v-model="item.accion_tomada" label="Acciones tomadas" auto-grow
                                            outlined dense />
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn color="error" left small @click="dialogoHistoricos = false">
                        <v-icon left>mdi-close</v-icon>
                        Salir
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
import BuscarAfiliado from "@/components/afiliado/BuscarAfiliadoComponente.vue";
import AfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import {
    listarTipoDocumento
} from "@/api/tiposDocumentos/tipoDocumento";
import {
    buscarAfiliado
} from "@/api/afiliados/afiliados";
import {
    mapActions
} from "vuex";

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can("eventoAdverso.reporte")) {
            return redirect("/");
        }
    },
    name: "WorkspaceJsonReporteEvento",
    components: {
        BuscarAfiliado,
        AfiliadoComponente
    },
    props: {
        documentos: Array,
    },
    data() {
        return {
            grupoId: null,
            datosBasicos: false,
            dialogoHistoricos: false,
            editar: false,
            datosAfiliado: null,
            datosHistoricos: null,
            serviciosOcurrencias: [
                'Hospitalización tercer piso', 'Hospitalización cuarto piso', 'Hospitalización quinto piso',
                'Hospitalización sexto piso',
                'Unidad de cuidados intensivos (UCI)', 'Unidad de cuidados especiales (UCE)', 'Cirugía',
                'Endoscopia',
                'Urgencias',
                'Servicio farmacéutico', 'Laboratorio', 'Alimentación', 'Centro regulador', 'Quimioterapia',
                'Diagnóstico cardiovascular', 'Imagenología', 'Vacunación', 'Consulta externa', 'Hospitalización parcial'
            ],
            relacionesTecnovigilancia: ["Dispositivos", "Equipo biomédico", "Ambos"],
            sucesos: [],
            clasifAreas: [],
            tiposEventos: [],
            reps: [],
            repsReporta: [],
            adjuntos: [],
            listaOperadores: [],
            medicamentos: [],
            tiposDocumentos: [],
            loadingTipoDocumento: false,
            loadingAfiliado: false,
            afiliado: {
                tipo_documento: '',
                numero_documento: ''
            },
            evento: {
                estado_id: 10,
                suceso_id: "",
                sede_ocurrencia_id: "",
                sede_reportante_id: "",
                fecha_ocurrencia: "",
                descripcion_hechos: "",
                profesional_id: "",
                accion_tomada: "",
                clasificacion_area_id: "",
                medicamento_id: "",
                relacionar_afiliado: true,
                relacion: "",
                user_id: this.$store.state.auth.usuario.id,
            },
            defecto: {
                estado_id: 10,
                suceso_id: "",
                sede_ocurrencia_id: "",
                sede_reportante_id: "",
                fecha_ocurrencia: "",
                descripcion_hechos: "",
                profesional_id: "",
                accion_tomada: "",
                clasificacion_area_id: "",
                medicamento_id: "",
                relacionar_afiliado: false,
                relacion: "",
            },
            errors: {
                suceso_id: "",
                sede_ocurrencia_id: "",
                sede_reportante_id: "",
                fecha_ocurrencia: "",
                descripcion_hechos: "",
                profesional_id: "",
                accion_tomada: "",
                clasificacion_area_id: "",
                medicamento_id: "",
                relacion: "",
                fabricante_dispositivo: "",
                marca_dispositivo: "",
                referencia_dispositivo: "",
                lote_dispositivo: "",
                invima_dispositivo: "",
                dispositivo_id: "",
                clasif_tecnovigilancia: "",
                fabricante_biomedico: "",
                marca_equipo_biomedico: "",
                modelo_equipo_biomedico: "",
                nombre_equipo_biomedico: "",
                serie_equipo_biomedico: "",
                servicio_ocurrencia: "",
                servicio_reportante: ""
            },
            rep: null,
            repReporta: null,
            medicamento: null,
            mostrarClasificacionArea: false,
            mostrarTipoEvento: false,
        };
    },

    mounted() {
        // Listar sucesos y operadores al montar el componente
        this.listarSucesos();
        this.listarOperadores();
        this.cargarTiposDocumentos()
    },

    watch: {
        // Observadores para búsquedas en campos específicos
        medicamento(val) {
            if (!val || val.length < 4) {
                this.medicamentos = null;
                return;
            }

            let tipo = null;
            if (this.evento.suceso_id === 109) tipo = 'medicamento';   // farmacovigilancia
            else if (this.evento.suceso_id === 139) tipo = 'dispositivo'; // tecnovigilancia
            else if (this.evento.suceso_id === 156) tipo = 'reactivo'; // reactivovigilancia

            this.listarMedicamentos(tipo);
        },
        rep(val) {
            if (val) {
                if (val.length === 6) {
                    this.listarReps(val, "reps");
                } else if (val.length < 6) {
                    this.reps = null;
                }
            } else {
                this.reps = null;
            }
        },
        repReporta(val) {
            if (val) {
                if (val.length === 6) {
                    this.listarReps(val, "repsReporta");
                } else if (val.length < 6) {
                    this.repsReporta = null;
                }
            } else {
                this.repsReporta = null;
            }
        },

        "evento.relacionar_afiliado"(nuevoValor) {
            if (!nuevoValor) {
                this.afiliado = {};
                this.datosAfiliado = null;
            }
        }

    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        listarSucesos() {
            this.$axios.get("/sucesos/listar").then((res) => {
                this.sucesos = res.data.data.filter(suceso => suceso.estado_id !== 2 || suceso.estado_id === null);
            });
        },

        listarHistoricoAfiliado() {
            this.$axios.get('eventos-adversos/listarEventosAfiliado/' + this.datosAfiliado.id).then((res) => {
                this.datosHistoricos = res.data
                this.dialogoHistoricos = true
            }).catch((error) => {
                console.log(error)
            })
        },

        // Listar clasificaciones de áreas según el suceso seleccionado
        listarClasiAreas() {
            if (!this.evento.suceso_id) {
                this.clasifAreas = [];
                this.mostrarClasificacionArea = false;
                return;
            }

            this.$axios.get(`/clasificaciones-areas/${this.evento.suceso_id}`).then((res) => {
                this.clasifAreas = res.data.data;
                this.mostrarClasificacionArea = this.clasifAreas.length > 0;
                this.resetClasificacionArea();
            });
        },

        // Listar tipos de eventos según la clasificación de área seleccionada
        listarTiposEventos() {
            if (!this.evento.clasificacion_area_id) {
                this.tiposEventos = [];
                this.mostrarTipoEvento = false;
                return;
            }

            this.$axios.get(`/tipos-eventos/${this.evento.clasificacion_area_id}`).then((res) => {
                this.tiposEventos = res.data.data;
                this.mostrarTipoEvento = this.tiposEventos.length > 0;
                this.resetTipoEvento();
            });
        },

        // Listar sedes según el valor del input (para ocurrencia o reporte)
        listarReps(valor, tipo) {
            this.setPreload(true);
            this.$axios
                .post("reps/listarConfiltro?page=0", {
                    rep: valor
                })
                .then((res) => {
                    this[tipo] = res.data.length >= 2 ? res.data.map((rep) => ({
                        id: rep.id,
                        nombre: rep.nombre
                    })) : [];
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        // Listar operadores activos
        listarOperadores() {
            this.$axios.get("/operador/listarActivos").then((res) => {
                this.listaOperadores = res.data;
            }).catch((error) => {
                this.$toast.error(error.response.data.mensaje);
            });
        },

        // Concatenar documento y nombre completo del operador para mostrar en el autocomplete
        concatenar(operador) {
            return `${operador.documento} - ${operador.nombre_completo}`;
        },

        // Listar medicamentos según el nombre ingresado en el input
        listarMedicamentos(tipo) {
            let payload = { nombre: this.medicamento };

            if (tipo === "dispositivo") payload.grupo_id = 4;
            else if (tipo === "medicamento") payload.grupo_id = 1;
            else if (tipo === "reactivo") payload.grupo_id = 7;

            this.$axios.post("/medicamentos/listarVademecum", payload)
                .then((res) => {
                    this.medicamentos = res.data.map((med) => ({
                        id: med.id,
                        nombre: med.codesumi.nombre
                    }));
                });
        },

        // Reiniciar campos de clasificación y relación del evento
        resetEventoClasificacion() {
            this.evento.clasificacion_area_id = null;
            this.evento.tipo_evento_id = null;
            this.clasifAreas = [];
            this.tiposEventos = [];
            this.mostrarClasificacionArea = false;
            this.mostrarTipoEvento = false;
        },

        resetClasificacionArea() {
            this.evento.tipo_evento_id = null;
            this.tiposEventos = [];
            this.mostrarTipoEvento = false;
        },

        // Guardar el evento adverso
        guardarEvento() {
            if (this.evento.relacionar_afiliado && !this.datosAfiliado) {
                return this.$swal({
                    type: "error",
                    title: "¡No puede ser!",
                    text: '¡Debe definir el documento de un afiliado si el indicador de "relacionar afiliado" está marcado!',
                });
            }
            this.setPreload(true);
            const formData = new FormData();
            if (this.datosAfiliado) {
                formData.append("afiliado_id", this.datosAfiliado.id);
            }
            Object.keys(this.evento).forEach((key) => {
                if (this.evento[key] !== null) {
                    formData.append(key, this.evento[key]);
                }
            });
            for (let i = 0; i < this.adjuntos.length; i++) {
                formData.append("adjuntos[]", this.adjuntos[i]);
            }
            this.$axios
                .post("/eventos-adversos/crear", formData)
                .then((res) => {
                    const idEvento = res.data[0].evento.id;
                    this.$toast.success("Evento adverso registrado exitosamente!");
                    this.resetForm();
                    this.$swal({
                        type: "success",
                        title: "¡Se ha generado un reporte con éxito!",
                        text: "¡Felicitaciones! Ahora haces parte del personal con cultura del reporte, esto nos ayudará a mejorar nuestros procesos.",
                        footer: "Radicado del reporte " + idEvento,
                    });
                })
                .catch((error) => {
                    if (error.response.data.mensaje) {
                        this.$toast.error(error.response.data.mensaje);
                    } else if (error.response.data) {
                        this.handleErrors(error.response.data);
                    }
                }).finally(() => {
                    this.setPreload(false);
                });
        },

        // Manejar errores en el formulario
        handleErrors(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(",");
                }
            }
        },

        // Resetear el formulario
        resetForm() {
            this.limpiarError();
            this.datosAfiliado = null;
            this.adjuntos = null;
            this.evento = Object.assign({}, this.defecto);
            this.limpiarComponente()
        },

        // Limpiar los errores del formulario
        limpiarError() {
            for (const key in this.errors) {
                this.errors[key] = "";
            }
        },

        buscarAfiliado() {
            this.loadingAfiliado = true;
            this.$axios.post('afiliados/buscarAfiliados/' + this.afiliado.numero_documento + '/' + this.afiliado.tipo_documento).then((res) => {
                this.datosAfiliado = res.data;
                this.listarHistoricoAfiliado()
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.loadingAfiliado = false;
            })
        },

        resetTipoEvento() {
            this.evento.tipo_evento_id = null;
        },

        // Obtener color basado en el estado del evento
        getColor(estado_id) {
            switch (estado_id) {
                case 10:
                    return "orange";
                case 6:
                    return "blue";
                case 15:
                    return "green";
                case 16:
                    return "blue-grey";
                case 17:
                    return "indigo";
                case 45:
                    return "#66BB6A";
                case 46:
                    return "#455A64";
                default:
                    return "red";
            }
        },

        getEstadoTexto(estadoId) {
            const estados = {
                10: 'Pendiente asignación',
                6: 'Asignado',
                15: 'Reasignado',
                5: 'Anulado',
                16: 'Analizado',
                17: 'Cerrado',
                45: 'Seguimiento plan de mejora',
                46: 'Plan de mejora cumplido',
            }
            return estados[estadoId] || 'Desconocido'
        },

        limpiarComponente() {
            this.evento = {},
                this.adjuntos = [],
                this.limpiarError(),
                this.evento.estado_id = 10,
                this.evento.user_id = this.$store.state.auth.usuario.id,
                this.datosAfiliado = null
            this.afiliado = {}
        },

        async cargarTiposDocumentos() {
            this.loadingTipoDocumento = true;
            try {
                const response = await this.$axios.get(listarTipoDocumento(1, 10));
                this.tiposDocumentos = response.data.data;
            } catch (error) {
                console.error("Error al cargar los tipos de documentos:", error);
                this.$toast.error("Error al cargar los tipos de documentos");
            } finally {
                this.loadingTipoDocumento = false;
            }
        },
    },
};

</script>
