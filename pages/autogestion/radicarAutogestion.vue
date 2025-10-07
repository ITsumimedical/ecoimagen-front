<template>
    <div>
        <v-row>
            <v-dialog v-model="preload" persistent width="300">
                <v-card color="primary" dark>
                    <v-card-text>
                        Procesando Información
                        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>

            <v-col cols="12" sm="12" md="12" v-if="card">
                <v-card elevation="3" class="pa-4 rounded-lg">
                    <v-alert dense text outlined border="left" color="primary" class="text-center font-weight-bold">
                        Información Importante
                    </v-alert>

                    <v-card-text v-if="$store.state.auth.usuario.tipo_usuario == 2">
                        <p class="text-body-1">
                            <strong>Estimado(a) {{ $store.state.auth.usuario.datosAfiliado.nombre_completo }},</strong>
                        </p>
                        <p class="text-body-2">
                            Su opinión es clave para mejorar la calidad de nuestros servicios. Aquí puede
                            consultar el estado de su radicación o proceder con una nueva solicitud.
                        </p>
                        <p class="text-body-2 font-weight-bold">¿Qué desea hacer?</p>
                    </v-card-text>

                    <v-card-actions v-if="$store.state.auth.usuario.tipo_usuario == 2">
                        <v-spacer></v-spacer>
                        <v-btn small color="primary" class="white--text" @click="consultar()">Consultar estado</v-btn>
                        <v-btn small color="success" class="white--text" @click="radicar()">Radicar solicitud</v-btn>
                    </v-card-actions>

                    <v-card-actions v-if="$store.state.auth.usuario.tipo_usuario != 2">
                        <v-spacer></v-spacer>
                        <v-btn color="primary" class="white--text" @click="alerta()">Radicar solicitud</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

            <v-col cols="12" sm="12" md="12" v-if="llamarRadicacion">
                <Radicacion :docuemntoAfiliado="$store.state.auth.usuario.datosAfiliado.numero_documento"
                    :tipoDocumento="$store.state.auth.usuario.datosAfiliado.tipo_documento" :panelBusqueda="false"
                    @dialogo="dialogo" />
            </v-col>

            <v-col cols="12" sm="12" md="12" v-if="consultarRadicado">
                <v-bottom-navigation background-color="info" grow dark elevation="4">
                    <v-btn @click="informacion = true; radicado = false; ordenes = false">
                        <v-icon>mdi-account-cog</v-icon>
                        <span class="text-caption font-weight-bold">INFORMACIÓN PERSONAL</span>
                    </v-btn>

                    <v-btn @click="informacion = false; radicado = true; ordenes = false">
                        <v-icon>mdi-frequently-asked-questions</v-icon>
                        <span class="text-caption font-weight-bold">MIS RADICADOS</span>
                    </v-btn>
                </v-bottom-navigation>
            </v-col>

            <v-col cols="12" sm="12" md="12" v-if="informacion">
                <v-card>
                    <v-row>
                        <v-col cols="12" sm="11" md="11"> </v-col>
                        <v-col cols="12" sm="1" md="1" v-if="consultarRadicado">
                            <v-btn @click="
                                (informacion = false),
                                (radicado = false),
                                (ordenes = false),
                                (consultarRadicado = false),
                                (card = true)
                                " color="red" dark small>
                                Volver
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-card-text>
                        <v-alert dense text outlined color="info" class="text-center">Actualizar datos de contacto
                        </v-alert>
                        <p>
                            <strong>Para nosotros es de vital importancia mantener los datos de
                                contacto actualizados por si requerimos contactarnos con usted,
                                muchas gracias.
                            </strong>
                        </p>
                        <PacienteComponent :afiliado="datosPaciente" :modoDetalle="true" :modoEdicion="true"
                            :mostrarClasificaciones="true" />
                        <v-col cols="12" sm="12" md="12">
                            <v-checkbox color="redvitalAzul" v-model="habeas"
                                label="Con el diligenciamiento de este formato autorizo expresamente el uso de mis datos personales según Ley 1581 de 2012">
                            </v-checkbox>
                        </v-col>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="12" md="12" v-if="radicado">
                <v-card>
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" sm="6" md="5">
                                <v-text-field label="Desde (Fecha Radicación)" v-model="fechaDesde" type="date"
                                    color="primary">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="7">
                                <v-text-field label="Nº Radicado" v-model="filtroNumeroRadicado"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="info" dark @click="obtenerRadicados()">Consultar</v-btn>
                        <v-btn @click="
                            (informacion = false),
                            (radicado = false),
                            (ordenes = false),
                            (consultarRadicado = false),
                            (card = true)
                            " color="red" dark small>
                            Volver
                        </v-btn>
                    </v-card-actions>
                    <v-row dense v-if="listaRadicados">
                        <v-col cols="12" sm="12" md="12">
                            <v-data-table :headers="headersRadicado" dense :items="listaRadicados"
                                no-data-text="Sin datos para mostrar">
                                <template v-slot:[`item.acciones`]="{ item }">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                                @click="abrirSolicitud(item)">
                                                mdi-file-document
                                            </v-icon>
                                        </template>
                                        <span>ver</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

            <v-col cols="12" sm="12" md="12" v-if="ordenes">
                <v-card>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-select v-model="tipoOrden" label="Tipo" dense :items="[
                                    { id: 0, nombre: 'MEDICAMENTOS' },
                                    { id: 1, nombre: 'SERVICIOS' },
                                    { id: 2, nombre: 'INCAPACIDADES' },
                                ]" item-text="nombre" item-value="id" @change="orden = []" hide-details>
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="1" md="1">
                                <v-btn small color="info" dark @click="obtenerOrdenes()">Buscar</v-btn>
                            </v-col>
                            <v-col cols="12" sm="5" md="5">
                                <v-text-field v-model="buscarOrden" append-icon="mdi-magnify"
                                    label="Filtrar por (# Orden)" single-line dense hide-details>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="
                            (informacion = false),
                            (radicado = false),
                            (ordenes = false),
                            (consultarRadicado = false),
                            (card = true)
                            " color="red" dark small>
                            Volver
                        </v-btn>
                    </v-card-actions>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12" v-if="tipoOrden === 0">
                            <v-data-table dense :headers="headersMedicamento" :items="orden" hide-default-footer
                                loading-text="Cargando... por favor espere" :search="buscarOrden">
                                <template v-slot:[`item.estado_id`]>
                                    <v-chip color="success" dark small> Disponible </v-chip>
                                </template>
                                <template v-slot:[`item.accion`]="{ item }">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="primary" small class="mr-2" v-bind="attrs" v-on="on"
                                                @click="imprimirServicios(item, 'medicamento')">
                                                mdi-file
                                            </v-icon>
                                        </template>
                                        <span>Imprimir</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                            <v-row no-gutters>
                                <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                                    <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                                        @input="obtenerOrdenes()">
                                    </v-pagination>
                                </v-col>
                                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                        @change="obtenerOrdenes()">
                                    </v-select>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" v-if="tipoOrden === 1">
                            <v-data-table dense :headers="headersServicio" :items="orden"
                                loading-text="Cargando... por favor espere" :search="buscarOrden">
                                <template v-slot:[`item.estado_id`]>
                                    <v-chip color="success" dark small> Disponible </v-chip>
                                </template>
                                <template v-slot:[`item.accion`]="{ item }">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="primary" small class="mr-2" v-bind="attrs" v-on="on"
                                                @click="imprimirServicios(item, 'servicio')">
                                                mdi-file
                                            </v-icon>
                                        </template>
                                        <span>Imprimir</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

            <v-dialog v-model="dialogoSolicitud" v-if="dialogoSolicitud" persistent width="1000">
                <v-card>
                    <v-alert dense text outlined color="info" class="text-center">Solicitud #{{ solicitud.id }}
                    </v-alert>

                    <v-card-text>
                        <v-col cols="12" sm="12" md="12">
                            <v-row dense>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="solicitud.tipo_solicitud_red_vital.nombre" readonly
                                        label="Tipo solicitud" dense>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field v-model="solicitud.tipo_solicitud_red_vital.nombre" readonly
                                        label="Correo de respuesta" dense>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field v-model="solicitud.tipo_solicitud_red_vital.nombre" readonly
                                        label="Numero de telefono de respuesta" dense>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-textarea v-model="solicitud.descripcion" readonly label="Descripción" auto-grow>
                                    </v-textarea>
                                    <span><strong>Fecha: </strong> {{ solicitud.created_at }}</span>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-btn style="margin-right: 7px" small
                                        v-for="(adjuntoR, index) in solicitud.adjunto_radicado" :key="index">
                                        <a @click="consultarAdjunto(adjuntoR.ruta)">
                                            Adjunto
                                            {{ index + 1 }}
                                        </a>
                                        <v-icon small color="info">mdi-file-find</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-row dense>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-alert border="left" dense text color="blue darken-1"
                                            icon="mdi-message-text-fast">
                                            <b>Comentarios del Solicitante</b>
                                        </v-alert>
                                        <div class="mx-1" v-for="(gestion, i) in comentarioPublico" :key="i">
                                            <v-divider></v-divider>
                                            <span>
                                                <b>Usuario</b>
                                                <br />
                                                {{ gestion.user.operador != null ? gestion.user.operador.nombre_completo
                                                    :
                                                    'Paciente' }}
                                            </span>
                                            <br />
                                            <span>
                                                <b>Fecha</b>
                                                <br />
                                                {{ gestion?.created_at }}
                                            </span>
                                            <br />
                                            <span>
                                                <b>Comentarios</b>
                                                <br />
                                                {{ gestion?.motivo }}
                                            </span>
                                            <br />
                                            <span>
                                                <b>Adjuntos</b>
                                                <br />
                                                <v-btn v-for="(adjunto, index) in gestion.adjuntos_gestion" :key="index"
                                                    dark color="blue-grey" x-small
                                                    @click="consultarAdjunto(adjunto.ruta)">
                                                    Adjunto {{ index + 1 }}
                                                    <v-icon right small>mdi-download</v-icon>
                                                </v-btn>
                                            </span>
                                            <br />
                                            <v-divider></v-divider>
                                        </div>
                                    </v-col>

                                    <v-col cols="12" sm="12" md="12">
                                        <v-alert border="left" dense text color="blue darken-1"
                                            icon="mdi-message-text-fast">
                                            <b>Respuesta de la Gestión</b>
                                        </v-alert>
                                        <div class="mx-1" v-for="(gestion, i) in solicitud.gestion" :key="i">

                                            <!-- Condición para mostrar solo si el tipo_id es 21 -->
                                            <template v-if="gestion?.tipo_id == 21">
                                                <span>
                                                    <b>Funcionario</b>
                                                    <br />
                                                    {{ gestion?.user?.operador?.nombre_completo }}
                                                </span>
                                                <br />
                                                <span>
                                                    <b>Fecha</b>
                                                    <br />
                                                    {{ gestion?.created_at }}
                                                </span>
                                                <br />
                                                <span>
                                                    <b>Comentarios</b>
                                                    <br />
                                                    {{ gestion?.motivo }}
                                                </span>
                                                <br />
                                                <span>
                                                    <b>Adjuntos</b>
                                                    <br />
                                                    <v-btn v-for="(adjunto, index) in gestion.adjuntos_gestion"
                                                        :key="index" dark color="blue-grey" small
                                                        @click="consultarAdjunto(adjunto.ruta)">
                                                        Adjunto {{ index + 1 }}
                                                        <v-icon right small>mdi-download</v-icon>
                                                    </v-btn>
                                                </span>
                                                <br />
                                                <v-divider></v-divider>
                                            </template>
                                        </div>
                                    </v-col>

                                    <!-- Botón de Imprimir Incapacidad, solo visible si el tipo_solicitud_red_vital_id es 11 -->
                                    <v-col cols="12" sm="12" md="12" v-if="solicitud.tipo_solicitud_red_vital_id == 11">
                                        <v-btn v-if="solicitud.incapacidades" tile color="warning" small class="mb-6"
                                            @click="imprimirIncapacidad()">
                                            Imprimir Incapacidad
                                        </v-btn>
                                    </v-col>

                                </v-row>
                                <v-col cols="12" sm="12" md="12" v-if="solicitud.estado.nombre != 'Cerrado'">
                                    <v-col cols="12" sm="12" md="12">
                                        <v-alert dense text outlined color="info" class="text-center">Nueva observación
                                        </v-alert>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-textarea v-model="observacion" label="Observación" auto-grow>
                                        </v-textarea>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <input id="adjuntos" multiple ref="adjuntos" type="file" />
                                    </v-col>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="error" @click="dialogoSolicitud = false">
                            Cerrar
                        </v-btn>
                        <v-btn small color="success" @click="comentar()" v-if="solicitud.estado.nombre != 'Cerrado'">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
import Radicacion from "@/components/solicitudes/radicar.vue";
import PacienteComponent from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import {
    listarAfiliadoActivo
} from "@/api/afiliados/afiliados";
export default {
    name: "WorkspaceJsonRadicarAutogestion",
    components: {
        Radicacion,
        PacienteComponent,
    },
    data() {
        return {
            buscarOrden: "",
            adjuntos: [],
            preload: false,
            llamarRadicacion: false,
            consultarRadicado: false,
            card: true,
            ordenes: false,
            radicado: false,
            informacion: false,
            datosPaciente: null,
            habeas: false,
            fechaDesde: "",
            filtroNumeroRadicado: "",
            listaRadicados: null,
            solicitud: [],
            comentarioPublico: [],
            orden: [],
            observacion: "",
            tipoOrden: 0,
            dialogoSolicitud: false,
            headersRadicado: [{
                text: "Radicado",
                align: "left",
                value: "id",
            },
            {
                text: "Solicitud",
                align: "left",
                value: "tipo_solicitud_red_vital.nombre",
                sortable: false,
            },
            {
                text: "Fecha",
                align: "left",
                value: "created_at",
            },
            {
                text: "Estado",
                align: "left",
                value: "estado.nombre",
                sortable: false,
            },
            {
                text: "Accion",
                align: "left",
                value: "acciones",
                sortable: false,
            },
            ],
            headersMedicamento: [{
                text: "Número Orden",
                align: "center",
                value: "id",
            },
            {
                text: "Fecha",
                align: "center",
                value: "fecha_vigencia",
            },
            {
                text: "Página",
                align: "center",
                value: "paginacion",
            },
            {
                text: "Estado",
                align: "center",
                value: "estado_id",
                sortable: false,
            },
            {
                text: "",
                align: "center",
                value: "accion",
                sortable: false,
            },
            ],
            headersServicio: [{
                text: "# Orden",
                align: "center",
                value: "orden",
            },
            {
                text: "Fecha",
                align: "center",
                sortable: false,
                value: "fecha_vigencia",
            },
            {
                text: "Nombre",
                align: "center",
                value: "cup.nombre",
            },
            {
                text: "Estado",
                align: "center",
                value: "estado_id",
                sortable: false,
            },
            {
                text: "Accion",
                align: "center",
                value: "accion",
                sortable: false,
            },
            ],

            pagina: 1,
            total: 0,
            opcionActual: 5,
            opciones: [5, 10, 20, 50, 100],
            medicamentos: [],
            pdf: [],
        };
    },

    mounted() { },

    methods: {
        radicar() {
            this.llamarRadicacion = true;
            this.card = false;
        },

        dialogo() {
            (this.card = true), (this.llamarRadicacion = false);
        },

        consultar() {
            (this.card = false), (this.consultarRadicado = true);
            this.ConsultarAfiliado();
        },

        ConsultarAfiliado() {
            this.preload = true;
            this.$axios
                .get(
                    listarAfiliadoActivo(
                        this.$store.state.auth.usuario.datosAfiliado.numero_documento,
                        this.$store.state.auth.usuario.datosAfiliado.tipo_documento
                    )
                )
                .then((res) => {
                    this.datosPaciente = res.data;
                    this.preload = false;
                })
                .catch((e) => {
                    console.log(e);
                    this.$toast.error(
                        "El afiliado no se encuentra registrado en la base de datos"
                    );
                    this.preload = false;
                });
        },

        obtenerRadicados() {
            this.preload = true;
            let data = {
                afiliado_id: this.datosPaciente.id,
                fecha: this.fechaDesde,
                numero_radicado: this.filtroNumeroRadicado,
            };
            this.$axios
                .post("radicacion-online/obtenerRadicadosPaciente", data)
                .then((res) => {
                    this.listaRadicados = res.data;
                    this.preload = false;
                })
                .catch((e) => {
                    console.log(e);
                    this.preload = false;
                });
        },

        abrirSolicitud(data) {
            this.solicitud = data;
            this.dialogoSolicitud = true;
            this.comentariosPublicos();
        },

        comentariosPublicos() {
            this.preload = true;
            this.$axios
                .post("gestion-radicacion-online/verComentariosPublicos", {
                    radicacion_id: this.solicitud.id,
                })
                .then((res) => {
                    this.comentarioPublico = res.data;
                    this.preload = false;
                })
                .catch((e) => {
                    this.preload = false;
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

        comentar() {
            this.adjuntos = this.$refs.adjuntos.files;
            this.preload = true;
            let formData = new FormData();
            formData.append("radicacion_online_id", this.solicitud.id);
            formData.append("motivo", this.observacion);
            formData.append("afiliado_id", this.solicitud.afiliado_id);
            if (this.adjuntos.length >= 1) {
                for (let i = 0; i < this.adjuntos.length; i++) {
                    formData.append(`adjuntos[]`, this.adjuntos[i]);
                }
            } else {
                formData.append(`adjuntos`, null);
            }

            this.$axios
                .post("radicacion-online/comentarAutogestion", formData)
                .then((res) => {
                    this.preload = false;
                    this.obtenerRadicados();
                    this.$toast.success(res.data);
                    this.cerrarAcciones();
                })
                .catch((err) => {
                    this.preload = false;
                    this.$toast.error("Error");
                });
        },

        cerrarAcciones() {
            this.dialogoSolicitud = false;
            this.$refs.adjuntos.value = "";
            this.observacion = "";
        },

        obtenerOrdenes() {
            this.preload = true;
            this.orden = [];
            if (this.tipoOrden === 0) {
                this.$axios
                    .post(
                        "ordenamiento/ordenMedicamnetosAutogestion?page=" +
                        this.pagina +
                        "&cantidad=" +
                        this.opcionActual, {
                        cedula: this.$store.state.auth.usuario.datosAfiliado.numero_documento,
                    }
                    )
                    .then((res) => {
                        this.orden = res.data.data;
                        this.total = res.data.last_page;
                        if (this.orden.length <= 0) {
                            this.$toast.error(
                                "Señor(a) usuario, en el momento no cuenta con fórmula vigente. Le recomendamos consultar con su médico de atención primaria en caso que requiera continuidad de su tratamiento."
                            );
                        }
                        this.preload = false;
                    })
                    .catch((e) => {
                        this.preload = false;
                    });
            } else if (this.tipoOrden === 1) {
                this.$axios
                    .post(
                        "ordenamiento/ordenServiciosAutogestion?page=" +
                        this.pagina +
                        "&cantidad=" +
                        this.opcionActual, {
                        cedula: this.$store.state.auth.usuario.datosAfiliado.numero_documento,
                    }
                    )
                    .then((res) => {
                        this.orden = res.data;

                        if (this.orden.length <= 0) {
                            this.$toast.error(
                                "Señor(a) usuario, en el momento no cuenta con orden de servicio vigente."
                            );
                        }
                        this.preload = false;
                    })
                    .catch((e) => {
                        this.preload = false;
                    });
            }
        },

        imprimir(medicamentos, tipo) {
            let objeto = Object.assign({}, medicamentos);
            let objetoMipres = Object.assign({}, medicamentos);
            if (tipo === 1) {
                const changeCant = (deta) => ({
                    ...deta,
                    cantidadPormedico: deta.cantidad_mensual_disponible,
                });
                this.$axios.post("ordenamiento/imprimirMedicamento", {
                    orden_id: objeto.id,
                }).then((res) => {
                    let obj = res.data.filter((s) => !s.mipres);
                    let objMipres = res.data.filter((s) => parseInt(s.mipres) === 1);
                    objeto.ordenArticulo = obj.map(changeCant);
                    objetoMipres.ordenArticulo = objMipres.map(changeCant);
                    if (objeto.ordenArticulo.length > 0) {
                        var pdf = {};
                        this.prepararData(objeto);
                        pdf = this.obtenerPdf(objeto);
                        pdf.tipo = "formula";
                        this.$axios
                            .post("ordenamiento/generarPdf", pdf, {
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
                    }

                    if (objetoMipres.ordenArticulo.length > 0) {
                        var pdf = {};
                        this.prepararData(objetoMipres);
                        pdf = this.obtenerPdf(objetoMipres);
                        pdf.tipo = "formula";
                        pdf.mensaje = "M I P R E S";
                        this.$axios
                            .post("ordenamiento/generarPdf", pdf, {
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
                    }
                }).catch((e) => { });
            }

            if (objeto.paginacion.split("/")[1] === objeto.paginacion.split("/")[0]) {
                this.$swal({
                    title: "Aviso",
                    text: "Señor(a) usuario, esta es su última fórmula vigente. Le recomendamos consultar con su médico de atención primaria en caso que requiera continuidad de su tratamiento.",
                    type: "info",
                });
            }
        },

        prepararData(autorizacion) {
            this.medicamentos = [];
            autorizacion.ordenArticulo.forEach((med) => {
                let objeto = {
                    id: med.codesumi_id,
                    nombre: med.codesumi.nombre,
                    Cantidadosis: med.dosis,
                    Unidadmedida: med.codesumi.unidad_presentacion,
                    Via: med.codesumi.via,
                    Codigo: med.codesumi.codigo,
                    Frecuencia: med.frecuencia,
                    Unidadtiempo: med.unidad_tiempo,
                    Duracion: med.duracion,
                    Cantidadmensual: med.cantidad_mensual,
                    NumMeses: med.meses,
                    Observacion: med.observacion,
                    Cantidadpormedico: med.cantidadPormedico,
                    PosViaAdmin: med.codesumi.via,
                    Estado_id: med.codesumi.estado_id,
                };
                this.medicamentos.push(objeto);
            });
        },

        obtenerPdf(medicamentos) {
            return (this.objeto = {
                Primer_Nom: this.$store.state.auth.usuario.datosAfiliado.primer_nombre,
                Segundo_Nom: this.$store.state.auth.usuario.datosAfiliado.segundo_nombre,
                Primer_Ape: this.$store.state.auth.usuario.datosAfiliado.primer_apellido,
                Segundo_Ape: this.$store.state.auth.usuario.datosAfiliado.segundo_apellido,
                Tipo_Doc: this.$store.state.auth.usuario.datosAfiliado.tipo_documento,
                Num_Doc: this.$store.state.auth.usuario.datosAfiliado.numero_documento,
                Edad_Cumplida: this.$store.state.auth.usuario.datosAfiliado.edad_cumplida,
                Sexo: this.$store.state.auth.usuario.datosAfiliado.sexo,
                ips: this.$store.state.auth.usuario.datosAfiliado.ips.nombre,
                Direccion_Residencia: this.$store.state.auth.usuario.datosAfiliado.direccion_Residencia_cargue,
                Correo: this.$store.state.auth.usuario.datosAfiliado.correo1,
                Telefono: this.$store.state.auth.usuario.datosAfiliado.telefono,
                Tipo_Afiliado: this.$store.state.auth.usuario.datosAfiliado.tipo_afiliado,
                Estado_Afiliado: this.$store.state.auth.usuario.datosAfiliado.estado_afiliacion_id,
                orden_id: medicamentos.id,
                tipo: "pendiente",
                medicamentos: this.medicamentos,
                consulta_id: medicamentos.consulta_id,
            });
        },

        imprimirServicios(item, tipoOrden) {
            this.preload = true;

            let pdf = {
                tipo: tipoOrden,
                id: item.id,
                filtro: item.estado_id,
                detalles: {
                    id: item.id,
                },
            };

            this.$axios
                .post("/pdf", pdf, {
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
                    this.preload = false;
                });
        },
        getPDF(pdf) {
            this.$axios
                .post("ordenamiento/generarPdf", pdf, {
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
        },

        imprimirIncapacidad() {
            this.preload = true;
            const data = {
                incapacidad_id: this.solicitud.incapacidades.id,
                tipo: 'incapacidad'
            }
            this.$axios.post('pdf', data, {
                responseType: "arraybuffer"
            }).then(res => {
                this.preload = false;
                let blob = new Blob([res.data], {
                    type: "application/pdf"
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            }).catch(res => {
                console.log(res)
                this.preload = false;
            });
        },

        alerta() {
            this.$swal({
                title: "No puede ser",
                text: "Señor usuario usted no es un afiliado.",
                type: "error",
                confirmButtonColor: "#28a745",
                confirmButtonText: "OK",
            });
        },
    },
};

</script>

