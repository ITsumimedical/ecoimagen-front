<template>
    <div>
        <v-card>
            <!-- Diálogo para mostrar el indicador de carga -->
            <template>
                <div class="text-center">
                    <v-dialog v-model="preload" persistent width="300">
                        <v-card color="primary" dark>
                            <v-card-text>
                                Tranquilo, procesamos tu solicitud!
                                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </div>
            </template>

            <v-container>
                <!-- Encabezado del módulo -->
                <v-alert type="info" icon="mdi-account-search" border="left" text dense>
                    Módulo de registro de PQRS-F
                </v-alert>

                <v-row dense>
                    <!-- Componente para buscar afiliado -->
                    <v-col cols="12">
                        <buscar-afiliado :documentos="documentos" @buscarAfiliado="realizarBusqueda"
                            ref="buscarAfiliado">
                        </buscar-afiliado>
                    </v-col>

                    <!-- Mostrar datos del afiliado si está disponible -->
                    <v-col cols="12" sm="12" md="12" v-if="datosAfiliado">
                        <EditarAfiliadoComponente :afiliado="datosAfiliado" :modoDetalle="true" :modoEdicion="true"
                            :mostrarClasificaciones="true" />
                    </v-col>
                </v-row>

                <!-- Diálogo para mostrar el historial -->
                <v-dialog v-model="historial" max-width="1000" persistent v-if="historial">
                    <v-card>
                        <v-alert dense text border="left" color="blue" class="text-center" icon="mdi-history">
                            Historial PQRS-F
                        </v-alert>
                        <v-expansion-panels>
                            <v-expansion-panel v-for="(item, index) in historia" :key="index">
                                <v-expansion-panel-header>
                                    <v-row justify="space-around" no-gutters dense>
                                        <v-col cols="3">Radicado: <b>{{ item.id }}</b></v-col>
                                        <v-col cols="3">Tipo requerimiento: <b>{{ item.solicitud.nombre }}</b></v-col>
                                        <v-col cols="3">
                                            Fecha solicitud:
                                            <b>{{ item.created_at ? item.created_at.substring(0, 10) : 'Fecha no disponible' }}</b>
                                        </v-col>
                                        <v-col cols="3">
                                            <b>
                                                <v-chip dark small :color="ColorTd(item.estado.nombre)">
                                                    {{ item.estado.nombre }}
                                                </v-chip>
                                            </b>
                                        </v-col>
                                        <v-spacer></v-spacer>
                                    </v-row>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-card-text>
                                        <v-row dense>
                                            <v-col cols="12" sm="4" md="3">
                                                <v-text-field dense label="Radicado" v-model="item.id"
                                                    readonly></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="3">
                                                <v-text-field dense label="Nombre afiliado"
                                                    :value="`${datosAfiliado.nombre || ''} ${datosAfiliado.apellido || ''}`.trim()"
                                                    readonly></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="3">
                                                <v-text-field dense label="Quién genera" v-model="item.quien_genera"
                                                    readonly></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="3">
                                                <v-text-field dense label="Correo" v-model="item.correo"
                                                    readonly></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="3">
                                                <v-text-field dense label="Estado" v-model="item.estado.nombre"
                                                    readonly></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="3">
                                                <v-text-field dense label="Teléfono" v-model="item.telefono"
                                                    readonly></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="3">
                                                <v-text-field dense label="Tipo requerimiento"
                                                    v-model="item.solicitud.nombre" readonly></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="3">
                                                <v-text-field dense label="Canal"
                                                    :value="item.canal && item.canal.nombre ? item.canal.nombre : 'N/A'"
                                                    readonly></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-textarea dense label="Descripción" v-model="item.descripcion"
                                                    readonly auto-grow></v-textarea>
                                            </v-col>
                                        </v-row>
                                        <v-col>
                                            <b>Nombre de usuario que registra:</b>
                                            {{
                                                item.user?.operador
                                                    ? `${item.user.operador.nombre || ''} ${item.user.operador.apellido ||
                                            ''}`.trim()
                                            : 'No disponible'
                                            }}
                                        </v-col>
                                    </v-card-text>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="error"
                                @click.prevent="mostrarProcesoRegistro = true; historial = false; validation = false"
                                small>
                                Cerrar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-col cols="12"></v-col>

                <!-- Alerta del proceso de registro -->
                <v-alert v-if="mostrarProcesoRegistro" type="info" color="blue-grey"
                    icon="mdi-text-box-multiple-outline" border="left" text dense>
                    <b>Proceso de registro</b>
                </v-alert>

                <!-- Formulario para registrar PQRSF -->
                <v-row v-if="mostrarProcesoRegistro">
                    <v-col cols="12" sm="6" md="4">
                        <v-select dense v-model="pqrsf.quien_genera" :error-messages="errors.quien_genera"
                            :items="quienGeneraItems" append-icon="mdi-hand-back-right-outline"
                            label="¿Quién genera el PQRSF?*">
                        </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" v-if="pqrsf.quien_genera == 'Otro'">
                        <v-text-field dense v-model="pqrsf.nombre_genera" label="Nombre*"
                            :error-messages="errors.nombre_genera"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" v-if="pqrsf.quien_genera == 'Otro'">
                        <v-text-field dense v-model="pqrsf.documento_genera" label="Documento de identificación*"
                            :error-messages="errors.documento_genera"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field dense v-model="pqrsf.correo" append-icon="mdi-email-check-outline"
                            label="Correo electrónico*" :error-messages="errors.correo"
                            hint="Correo por medio del cual se ha de hacer seguimiento al registro"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field dense v-model="pqrsf.telefono" label="Teléfono o celular*"
                            :error-messages="errors.telefono" append-icon="mdi-cellphone"
                            hint="Número por medio del cual se pueda hacer contacto con el remitente del PQRSF"></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                        <v-autocomplete dense :items="tiposSolicitudes" v-model="pqrsf.tipo_solicitud_id"
                            :error-messages="errors.tipo_solicitud_id" item-text="nombre" item-value="id"
                            label="Tipo de requerimiento*"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-autocomplete dense :items="canales" v-model="pqrsf.canal_id"
                            :error-messages="errors.canal_id" item-text="nombre" item-value="id"
                            label="Canal de ingreso*"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="12">
                        <input id="adjuntos" multiple ref="adjuntos" type="file" />
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-textarea auto-grow dense v-model="pqrsf.descripcion" label="Descripción del caso*"
                            :error-messages="errors.descripcion"
                            hint="Describa detalladamente el caso que genera la PQRSF"></v-textarea>
                    </v-col>
                </v-row>

                <!-- Alerta de autorización si no está marcada -->
                <v-alert v-if="!autorizacion && mostrarProcesoRegistro" type="info" border="left" icon="mdi-alert"
                    class="mt-4">
                    Debe autorizar el uso de sus datos personales para continuar.
                </v-alert>

                <!-- Acciones del formulario -->
                <v-card-actions v-if="mostrarProcesoRegistro">
                    <v-col cols="8">
                        <v-checkbox v-model="autorizacion"
                            label="Con el diligenciamiento de este formato autorizo expresamente el uso de mis datos personales según ley 1581 de 2012"
                            color="success" value="success" hide-details></v-checkbox>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-btn :loading="loading" :disabled="loading" small color="boton" dark @click="guardarPqrsf">
                        Registrar PQRSF
                    </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </div>
</template>

<script>
import BuscarAfiliado from '@/components/afiliado/BuscarAfiliadoComponente.vue';
import { buscarAfiliado } from "@/api/afiliados/afiliados";
import { mapActions } from "vuex";
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";

export default {
    name: 'WorkspaceJsonFormulario',
    props: {
        documentoAfiliado: String,
        panelBusqueda: Boolean,
        canal: String,
        tipoDocumento: String,
        documentos: Array
    },
    components: {
        BuscarAfiliado,
        EditarAfiliadoComponente
    },
    data() {
        return {
            adjuntos: [],
            documento: '',
            loading: false,
            datosAfiliado: null,
            listaEmpleados: [],
            tiposSolicitudes: [],
            canales: [],
            quienGeneraItems: ['Usuario', 'Otro'],
            historia: [],
            history: [],
            mostrarProcesoRegistro: false,
            historial: false,
            autorizacion: false,
            preload: false,
            headers: [
                { text: 'Radicado', value: 'id' },
                { text: 'Estado', value: 'estado_id' },
                { text: 'Teléfono', value: 'telefono' },
            ],
            pqrsf: {
                correo: '',
                quien_genera: '',
                tipo_solicitud_id: '',
                descripcion: '',
                nombre_genera: '',
                documento_genera: '',
                canal_id: '',
                telefono: '',
            },
            defecto: {
                documento: '',
                correo: '',
                quien_genera: '',
                tipo_solicitud_id: '',
                descripcion: '',
                nombre_genera: '',
                documento_genera: '',
                canal_id: '',
                afiliado_id: '',
                usuario_registra_id: '',
                estado_id: '',
                telefono: '',
            },
            errors: {
                documento: '',
                correo: '',
                quien_genera: '',
                tipo_solicitud_id: '',
                descripcion: '',
                nombre_genera: '',
                documento_genera: '',
                canal_id: '',
                afiliado_id: '',
                usuario_registra_id: '',
                telefono: '',
            },
        };
    },
    watch: {
        'pqrsf.tipo_solicitud_id': function (newVal) {
            if (newVal) {
                const tipoSolicitud = this.tiposSolicitudes.find(solicitud => solicitud.id === newVal);
                if (tipoSolicitud) {
                    // Mostrar el alert con el nombre y la descripción
                    this.$swal({
                        icon: 'info',
                        title: tipoSolicitud.nombre,
                        text: tipoSolicitud.descripcion || 'Descripción no disponible',
                        confirmButtonText: 'OK'
                    });
                }
            }
        }
    },
    mounted() {
        this.listarTiposSolicitudes();
        this.listarCanales();
        this.aviso();
    },
    methods: {

        ...mapActions("app", ["setPreload"]),

        guardarPqrsf() {
            this.setPreload(true);
            const adjuntosInput = this.$refs.adjuntos;
            const adjuntos = adjuntosInput.files;

            if (!this.autorizacion) {
                return this.$swal({
                    type: 'error',
                    title: '¡Atención!',
                    text: 'Por favor, autoriza el uso de tus datos personales según la ley 1581 de 2012 antes de guardar la PQRSF.',
                });
            }
            this.loading = true;

            this.adjuntos = adjuntos;

            let formData = new FormData();

            // Añadir propiedades de pqrsf
            for (const key in this.pqrsf) {
                formData.append(key, this.pqrsf[key]);
            }

            // Añadir campos adicionales requeridos
            formData.append('afiliado_id', this.datosAfiliado.id);
            formData.append('documento', this.datosAfiliado.numero_documento);
            formData.append('usuario_registra_id', this.$store.state.auth.usuario.id);
            formData.append('estado_id', 10);

            // Añadir adjuntos
            for (let i = 0; i < this.adjuntos.length; i++) {
                formData.append('adjuntos[]', this.adjuntos[i]);
            }

            this.$axios.post('/formularios-pqrsf/crear', formData)
                .then(res => {
                    this.$toast.success('PQRSF registrado exitosamente!');
                    this.limpiarError();
                    this.cerrarTodo();
                    this.$swal({
                        type: 'success',
                        title: '¡Éxito!',
                        text: `Sr(a) su solicitud fue radicada con éxito N° de radicado ${res.data}. La respuesta será enviada a su correo electrónico dando cumplimiento a los tiempos de oportunidad establecidos por SUMIMEDICAL S.A.S.`,
                    });
                })
                .catch(error => {
                    if (error.response.data.mensaje) {
                        this.$toast.error(error.response.data.mensaje);
                    } else if (error.response.data) {
                        this.ErrorEntrada(error.response.data);
                    }
                }).finally(() => {
                    this.setPreload(false);
                });
            this.limpiarError();
        },

        concatenar(listarEmpleados) {
            return `${listarEmpleados.documento} - ${listarEmpleados.nombre_completo}`;
        },

        realizarBusqueda(documentoAfiliado, tipoDocumento) {
            this.cargando = true;
            this.$loadingGetRequest(buscarAfiliado(documentoAfiliado, tipoDocumento))
                .then(res => {
                    this.preload = true;
                    this.historialAfiliado(res.data.numero_documento);
                    this.datosAfiliado = res.data;
                    this.preload = false;
                })
                .catch(error => {
                    console.error(error);
                    this.$toast.error('El afiliado no se encuentra registrado en la base de datos');
                    this.cerrarTodo();
                    this.preload = false;
                });
        },
        cerrarTodo() {
            this.historial = false;
            this.validation = false;
            this.mostrarProcesoRegistro = false;
            this.datosAfiliado = null;
            this.documento = '';
            // Restablecer campos de pqrsf
            this.pqrsf = Object.assign({}, this.defecto);
            this.autorizacion = false;
            this.$refs.buscarAfiliado.limpiarFormulario();
        },
        listarEmpleados() {
            this.$axios.get('/empleados/listar')
                .then(res => {
                    this.listaEmpleados = res.data.data;
                })
                .catch(error => {
                    this.$toast.error(error.response.data.mensaje);
                });
        },
        ErrorEntrada(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(',');
                }
            }
        },
        limpiarError() {
            for (const key in this.errors) {
                this.errors[key] = '';
            }
        },
        listarTiposSolicitudes() {
            this.$axios.get('/tipos-solicitudes-pqrsf/listar')
                .then(res => {
                    this.tiposSolicitudes = res.data.data;
                })
                .catch(e => {
                    console.log(e.response.data);
                });
        },
        listarCanales() {
            this.$axios.post('/canales-pqrsf/listar')
                .then(res => {
                    this.canales = res.data;
                })
                .catch(e => {
                    console.log(e.response.data);
                });
        },
        historialAfiliado(numeroCedula) {
            this.preload = true;
            this.$axios.get(`/formularios-pqrsf/historial/${numeroCedula}`)
                .then(response => {
                    if (response.data.res) {
                        this.historia = response.data.data;
                        this.historial = true;
                        this.preload = false;
                    } else {
                        this.mostrarProcesoRegistro = true;
                        this.historial = false;
                        this.$toast.warning(response.data.mensaje);
                    }
                })
                .catch(error => {
                    console.error(error);
                    this.mostrarProcesoRegistro = true;
                    this.historial = false;
                    this.$swal({
                        type: 'error',
                        title: '¡Atención!',
                        text: 'El afiliado no cuenta con registros previos de PQRS-F.',
                    });
                });
        },
        ColorTd(estado) {
            if (estado === 'Cerrado') {
                return 'green';
            } else if (estado === 'Pendiente') {
                return 'red';
            } else if (estado === 'Asignado') {
                return 'info';
            } else {
                return 'warning';
            }
        },
        aviso() {
            return this.$swal({
                type: 'info',
                title: '¡AVISO!',
                text: 'Señor usuario recuerde que para recibir respuesta a su requerimiento debe ingresar un correo electrónico válido, de lo contrario deberá realizar su trámite a través de los canales presenciales. Se recuerda la importancia que de manera continua actualice sus datos personales en su centro de atención primaria avanzada.',
            });
        },
    },
};
</script>
