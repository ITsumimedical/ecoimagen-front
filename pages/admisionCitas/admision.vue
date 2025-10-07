<template>
    <div>
        <v-alert text dense border="left" type="info" :icon="false" class="text-center"><b>MÓDULO DE
                INGRESO CITAS AFILIADO</b></v-alert>
        <v-container fluid>
            <!-- Buscar Afiliado -->
            <v-row dense>
                <v-col cols="12" md="4" sm="12">
                    <v-autocomplete dense outlined label="Tipo de documento" :items="tiposDocumentos" :loading="loading"
                        no-data-text="No hay resultados" item-value="id" item-text="nombre"
                        v-model="datosBuscarAfiliado.tipo_documento" />
                </v-col>
                <v-col cols="12" md="4" sm="12">
                    <v-text-field dense outlined label="Número documento" @keyup.enter="consultarAfiliado()"
                        v-model.trim="datosBuscarAfiliado.numero_documento" />
                </v-col>
                <v-col cols="12" md="4" sm="12" style="display: flex; gap: 0.2rem">
                    <v-btn color="primary" dark @click="consultarAfiliado()" style="width: 50%">Consultar <v-icon right>
                            mdi-magnify</v-icon>
                    </v-btn>
                    <v-btn color="red" dark @click="
                        limpiarAfiliado();
                    " style="width: 50%">Limpiar<v-icon right>mdi-close</v-icon>
                    </v-btn>
                </v-col>
            </v-row>

            <!-- Afiliado -->
            <v-row dense v-if="afiliado">
                <v-col cols="12" md="12" sm="12">
                    <EditarAfiliadoComponente :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                        :mostrarClasificaciones="true" />
                </v-col>
            </v-row>

            <v-row dense v-if="afiliado">
                <v-col cols="12" md="12" sm="12">
                    <v-data-table no-data-text="El Paciente no tiene citas pendientes" dense
                        :headers="headersConsultasPendientes" :items="datosCita" :loading="loading">
                        <template v-slot:[`item.fecha`]="{ item }">
                            {{ item.fecha_hora_inicio?.substring(0, 10) | formatoFecha }}
                        </template>
                        <template v-slot:[`item.hora`]="{ item }">
                            {{ item.fecha_hora_inicio?.substring(11, 20) }}
                        </template>
                        <template v-slot:[`item.estado`]="{ item }">
                            <v-chip small :color="obtenerColorEstado(item.estado.id)">
                                {{ item.estado.nombre }}
                            </v-chip>
                        </template>
                        <template v-slot:[`item.medicoAgenda`]="{ item }">
                            {{ obtenerUltimoMedico(item.agenda?.medicos) }}
                        </template>
                        <template v-slot:[`item.acciones`]="{ item }">
                            <div class="d-flex justify-center">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="success" class="mr-2" v-bind="attrs" v-on="on"
                                            @click="confirmarConsulta(item)">
                                            mdi-calendar-check
                                        </v-icon>
                                    </template>
                                    <span>Admitir Consulta</span>
                                </v-tooltip>

                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                            v-if="item.consulta_orden_procedimientos?.[0]?.orden_procedimiento?.cobro?.estado_id == 1"
                                            color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                            @click="dialogOrdenAsociada(item)">
                                            mdi-file-document-alert-outline
                                        </v-icon>
                                    </template>
                                    <span>Verificar órden asociada</span>
                                </v-tooltip>
                            </div>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>

            <v-dialog v-model="dialogoFirma" persistent fullscreen>
                <v-card>
                    <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
                        <b>Firma atención</b>
                        <!-- {{datosFirma.afiliado.entidad_id}} -->
                    </v-alert>
                    <div>
                        <v-card>
                            <v-card-title class="pb-0">
                                <v-row no-gutters>
                                    <!-- Avatar -->
                                    <v-col cols="12" md="3" class="d-flex justify-center">
                                        <v-avatar size="120" color="grey darken-3">
                                            <v-img v-if="datosFirma.afiliado && datosFirma.afiliado.sexo === 'M'"
                                                :src="hombre" />
                                            <v-img v-else :src="mujer" />
                                        </v-avatar>
                                    </v-col>

                                    <!-- Datos del afiliado -->
                                    <v-col cols="12" md="9">
                                        <v-card-text>
                                            <div v-if="datosFirma.afiliado">
                                                <v-simple-table dense>
                                                    <tbody>
                                                        <tr>
                                                            <td><strong>Entidad:</strong></td>
                                                            <td>
                                                                <v-chip color="warning" label text-color="white">
                                                                    <v-icon left>
                                                                        mdi-label
                                                                    </v-icon>
                                                                    <strong>{{ entidadAfiliado }}</strong>
                                                                </v-chip>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Nombre:</strong></td>
                                                            <td>{{ datosFirma.afiliado.nombre_completo }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Tipo Documento:</strong></td>
                                                            <td>{{ datosFirma.afiliado.tipo_documento }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Documento:</strong></td>
                                                            <td>{{ datosFirma.afiliado.numero_documento }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Sexo:</strong></td>
                                                            <td>
                                                                {{ datosFirma.afiliado.sexo === 'M' ? 'Masculino' :
                                                                'Femenino' }}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Estado Civil:</strong></td>
                                                            <td>{{ datosFirma.afiliado.estado_civil }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Edad:</strong></td>
                                                            <td>{{ datosFirma.afiliado.edad_cumplida }}</td>
                                                        </tr>
                                                    </tbody>
                                                </v-simple-table>
                                            </div>
                                            <div v-else>
                                                <p class="grey--text">No hay información del afiliado disponible.</p>
                                            </div>
                                        </v-card-text>
                                    </v-col>
                                </v-row>
                            </v-card-title>
                        </v-card>
                    </div>
                    <v-expansion-panels>
                        <v-col cols="12" sm="12" md="12"
                            v-if="datosFirma.hasOwnProperty('cobro') && datosFirma.cobro && datosFirma.afiliado.entidad_id != 1">
                            <v-alert text dense color="teal" icon="mdi-badge-account-alert" border="left" prominent>
                                <v-row align="center">
                                    <v-col class="grow">
                                        La Atencion tiene un valor de
                                        <strong>{{ datosFirma.cobro.valor | pesoFormat }}</strong> por
                                        concepto de
                                        <strong>"Cuota Moderadora"</strong>
                                    </v-col>
                                    <v-col>
                                        <v-select v-model="medioPagoSeleccionado" out :items="medioPagos" filled
                                            outlined label="Medio de pago"></v-select>
                                    </v-col>
                                </v-row>
                            </v-alert>
                        </v-col>

                        <v-expansion-panel v-if="datosFirma.afiliado && datosFirma.afiliado.entidad_id != 2">
                            <v-expansion-panel-header>
                                <h3 class="text-center">Firma afiliado</h3>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-col cols="12" sm="12" md="12">
                                    <v-row dense>
                                        <v-col cols="12" sm="12" md="12">
                                            <div class="firma mb-5">
                                                <h4 class="ml-3">Firma</h4>
                                                <vueSignature ref="signature" :sigOption="option" :w="'400'">
                                                </vueSignature>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn small color="warning" @click="clear">Limpiar</v-btn>
                                                    <!-- <v-btn small color="info" @click="undo">Deshacer</v-btn> -->
                                                    <!-- <v-btn small color="error" @click="cerrarDialogo()">Cerrar</v-btn> -->
                                                    <!-- <v-btn small color="success" @click="save">Guardar</v-btn> -->
                                                </v-card-actions>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-expansion-panel-content>
                        </v-expansion-panel>

                        <v-expansion-panel v-if="datosFirma.afiliado && datosFirma.afiliado.entidad_id != 2">
                            <v-expansion-panel-header>
                                <h3 class="text-center">Firma Acompañante</h3>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-col cols="12" sm="12" md="12">
                                    <v-row dense>
                                        <v-col cols="12" sm="12" md="12">
                                            <div class="firma mb-5">
                                                <h4 class="ml-3">Firma</h4>
                                                <vueSignature ref="signature2" :sigOption="option" :w="'400'">
                                                </vueSignature>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn small color="warning" @click="clear2">Limpiar</v-btn>
                                                    <!-- <v-btn small color="info" @click="undo2">Deshacer</v-btn> -->
                                                    <!-- <v-btn small color="error" @click="cerrarDialogo()">Cerrar</v-btn> -->
                                                    <!-- <v-btn small color="success" @click="save2">Guardar</v-btn> -->
                                                </v-card-actions>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" small dark @click="dialogoFirma = false, clear, clear2">Cancelar
                        </v-btn>
                        <v-btn color="success" small dark @click="confirmarCita()">Ingresar cita</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogOrden" persistent max-width="900px">
                <v-card class="rounded-xl" elevation="10" :loading="loadingRecaudo" :disabled="loadingRecaudo">
                    <v-alert text dense type="info" border="left" class="text-center">
                        <v-icon left color="primary">mdi-file-document-alert-outline</v-icon>
                        <strong>ORDEN ASOCIADA</strong>
                    </v-alert>

                    <v-card-text>
                        <v-row
                            v-if="itemSeleccionado && itemSeleccionado.consulta_orden_procedimientos && itemSeleccionado.consulta_orden_procedimientos.length">
                            <v-col v-for="(orden, index) in itemSeleccionado.consulta_orden_procedimientos" :key="index"
                                cols="12" class="mb-4">
                                <v-card flat>
                                    <v-row>
                                        <v-col cols="12" sm="6">
                                            <v-icon color="cyan darken-2" left>mdi-numeric</v-icon>
                                            <strong>Orden ID:</strong> {{ orden.orden_procedimiento?.id }}
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-icon color="purple" left>mdi-stethoscope</v-icon>
                                            <strong>Procedimiento:</strong> {{ orden.orden_procedimiento?.cup?.nombre }}
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-icon color="green" left>mdi-format-list-numbered</v-icon>
                                            <strong>Código CUPS:</strong> {{ orden.orden_procedimiento?.cup?.codigo }}
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-icon color="blue" left>mdi-clipboard-check-outline</v-icon>
                                            <strong>Estado:</strong> {{ orden.orden_procedimiento.estado?.nombre }}
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-icon color="orange" left>mdi-counter</v-icon>
                                            <strong>Cantidad Usada:</strong> {{
                                            orden.orden_procedimiento?.cantidad_usada }}
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-icon color="primary" left>mdi-cash</v-icon>
                                            <strong>Valor: {{ orden.orden_procedimiento?.cobro?.valor }}</strong>
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-icon color="red" left>mdi-clock-outline</v-icon>
                                            <strong>Fecha Creación:</strong> {{ orden.created_at?.substring(0, 10) }}
                                        </v-col>
                                    </v-row>

                                    <v-col v-if="cobroActivado">
                                        <v-divider></v-divider>
                                        <v-col></v-col>
                                        <v-alert dense outlined type="error">
                                            Para aplicar la asistencia al procedimiento, se requiere un pago de
                                            <strong>{{
                                                cobroSeleccionado.valor || '' }}</strong> como
                                            <strong>{{ cobroSeleccionado.tipo === 'cuota' ? 'CUOTA MODERADORA' :
                                                'COPAGO'
                                                }}</strong>.
                                            Por favor, indique su forma de pago
                                        </v-alert>
                                        <v-col cols="12" md="12">
                                            <v-select v-model="medioPagoSeleccionadoOrden" :items="medioPagos"
                                                label="Medio de pago"></v-select>
                                        </v-col>
                                    </v-col>

                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row v-else>
                            <v-col cols="12" class="text-center">
                                <v-icon color="grey" large>mdi-file-remove-outline</v-icon>
                                <div class="mt-2">No hay órdenes asociadas</div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" small
                            @click="dialogOrden = false, cobroActivado = false, medioPagoSeleccionadoOrden = null">
                            <v-icon left>mdi-close</v-icon>Salir
                        </v-btn>
                        <v-btn color="primary" v-if="!cobroActivado" small
                            @click="validarAsistencia(itemSeleccionado.consulta_orden_procedimientos[0])">
                            <v-icon left>mdi-cash</v-icon>Asistencia
                        </v-btn>
                        <v-btn v-if="cobroActivado" color="success" small @click="guardarRecaudo()"
                            :loading="loadingRecaudo">
                            <v-icon left>mdi-cash</v-icon>Recaudar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>

<script>
import vueSignature from "vue-signature";
import {
    mapActions
} from "vuex";
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import CitasAfiliado from "@/components/afiliado/CitasAfiliado.vue";
import moment from "moment";
import dedosVue from '~/components/historia/formularios/FiguraHumana/dedos.vue';
moment.locale("es");

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can("cita.agendamiento.vista")) {
            return redirect("/");
        }
    },
    components: {
        EditarAfiliadoComponente,
        CitasAfiliado,
        vueSignature
    },
    data() {
        return {
            medioPagos: [
                'EFECTIVO',
                'CONSIGNACION',
                'TRANSFERENCIA',
                'TARJETA CREDITO',
                'TARJETA DEBITO'
            ],
            medioPagoSeleccionado: null,
            menu: false,
            loading: false,
            tiposDocumentos: [],
            medioPagoSeleccionadoOrden: null,
            dialogOrden: false,
            loadingRecaudo: false,
            itemSeleccionado: null,
            cobroSeleccionado: null,
            cobroActivado: false,
            datosBuscarAfiliado: {
                numero_documento: null,
                tipo_documento: null,
            },
            afiliado: null,
            fechaMinima: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .substring(0, 10),
            headersConsultasPendientes: [{
                text: "Especialidad",
                value: "cita.especialidad.nombre"
            },
            {
                text: "Cita",
                value: "cita.nombre"
            },
            {
                text: "Fecha",
                value: "fecha"
            },
            {
                text: "Hora",
                value: "hora"
            },
            {
                text: "Sede",
                value: "agenda.consultorio.rep.nombre"
            },
            {
                text: "Funcionario asigna",
                value: "user.operador.nombre_completo"
            },
            {
                text: "Consultorio",
                value: "agenda.consultorio.nombre"
            },
            {
                text: "Médico",
                value: "medicoAgenda",
            },
            {
                text: "Estado",
                value: "estado"
            },
            {
                text: "Acciones",
                value: "acciones",
                sortable: false,
                align: "center",
            },
            ],
            datosCita: [],
            dialogoFirma: false,
            datosFirma: {},
            entidadAfiliado: null,
            option: {
                penColor: "rgb(0, 0, 0)",
                backgroundColor: "rgb(255,255,255)",
            },
            mujer: 'https://w7.pngwing.com/pngs/439/19/png-transparent-avatar-user-profile-icon-women-wear-frock-face-holidays-women-accessories-thumbnail.png',
            hombre: 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png',
        };
    },
    mounted() {
        this.listarTiposDocumentos();
        // this.listarEspecialidadesConCitas();
    },
    filters: {
        pesoFormat: (valor) => `$${new Intl.NumberFormat().format(valor) || 0}`,
        formatoFecha(fecha) {
            return moment(fecha).format("dddd, D MMMM, YYYY");
        },

        formatoHora(Hora_Inicio) {
            return moment(Hora_Inicio).format("hh:mm A");
        },
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        listarTiposDocumentos() {
            this.loading = true;
            this.$axios
                .get("/tipo-documento/listar")
                .then((res) => {
                    this.tiposDocumentos = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los tipos de documento"
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        consultarAfiliado() {
            this.setPreload(true);
            this.$axios.get(
                `/afiliados/${this.datosBuscarAfiliado.numero_documento}/${this.datosBuscarAfiliado.tipo_documento}`
            )
                .then((res) => {
                    this.afiliado = res.data;
                    this.entidadAfiliado = res.data.entidad.nombre;

                    this.consultarCitas(res.data.id)
                })
                .catch((error) => {
                    this.$toast.error(
                        "El afiliado no se encuentra registrado en la base de datos."
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        limpiarAfiliado() {
            this.datosBuscarAfiliado = {
                numero_documento: null,
                tipo_documento: null,
            };
            this.afiliado = null;
        },

        consultarCitas(id) {
            this.$axios.post(`/consultas/consultarCitas`, {
                afiliado: id
            }).then((res) => {
                this.datosCita = res.data
            })
                .catch((error) => {
                    this.$toast.error(
                        "El afiliado no se encuentra registrado en la base de datos."
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        obtenerColorEstado(estadoId) {
            switch (estadoId) {
                case 30:
                    return "warning";
                case 8:
                    return "info";
                case 9:
                    return "success";
                case 10:
                    return "warning";
                case 13:
                    return "info";
                case 59:
                    return "success";
                case 7:
                    return "success";
                default:
                    return "gray";
            }
        },

        obtenerUltimoMedico(medicos) {
            if (medicos && medicos.length > 0) {
                return medicos[medicos.length - 1].operador.nombre_completo;
            }
            return "No disponible";
        },

        confirmarConsulta(item) {

            this.datosFirma = item
            this.dialogoFirma = true;
            console.log('dslkds', this.datosFirma);
        },

        clear() {
            var _this = this;
            _this.$refs.signature.clear();
        },
        undo() {
            var _this = this;
            _this.$refs.signature.undo();
        },

        clear2() {
            var _this = this;
            _this.$refs.signature2.clear();
        },
        undo2() {
            var _this = this;
            _this.$refs.signature2.undo();
        },

        confirmarCita() {
            if (this.datosFirma.hasOwnProperty('cobro') && this.datosFirma.cobro && this.datosFirma.afiliado.entidad_id != 1 && !this.medioPagoSeleccionado) {
                this.$swal({
                    title: "¡Error!",
                    text: "Es necesaria el medio de pago",
                    type: "warning",
                });
                return
            }
            if (this.datosFirma.afiliado.entidad_id != 2 && !this.$refs.signature) {
                this.$swal({
                    title: "¡Error!",
                    text: "Es necesaria la firma del paciente.",
                    type: "warning",
                });
                return
            }
            this.preload = true
            let formdata = new FormData();
            if (this.datosFirma.afiliado.entidad_id != 2) {
                const firmaBase64 = this.$refs.signature.save();
                const firmaBase64Acompanante = this.$refs.signature2 && !this.$refs.signature2.isEmpty() ? this
                    .$refs
                    .signature2
                    .save() : null;
                formdata.append("firma", firmaBase64);
                if (firmaBase64Acompanante) {
                    formdata.append("firmaAcompanante", firmaBase64Acompanante);
                }
            }
            formdata.append("consulta", this.datosFirma.id);
            formdata.append("afiliado", this.afiliado.id);
            formdata.append("medio_pago", this.medioPagoSeleccionado)
            this.$axios.post("/consultas/confirmarAdmision", formdata)
                .then((res) => {
                    const estadoCobro = this.datosFirma.consulta_orden_procedimientos?.[0]?.orden_procedimiento?.cobro?.estado_id;

                    if (estadoCobro === 1) {
                        this.$swal({
                            title: "¿Desea realizar el pago de la orden?",
                            text: "Esta acción procesará el cobro correspondiente.",
                            type: "question",
                            showCancelButton: true,
                            confirmButtonText: "Sí, pagar",
                            cancelButtonText: "No",
                        }).then((result) => {
                            if (result.value) {
                                // Si acepta pagar, solo se ejecuta esto
                                this.dialogOrdenAsociada(this.datosFirma);
                            } else {
                                // Si no acepta pagar, se continúa con el flujo normal
                                this.finalizarConfirmacion();
                            }
                        });
                    } else {
                        // Si no hay cobro pendiente, se continúa normal
                        this.finalizarConfirmacion();
                    }
                })
                .catch((error) => {
                    this.$toast.error(error.response.data.mensaje);
                    console.log(error);
                })
                .finally(() => {
                    this.preload = false;
                });
        },

        finalizarConfirmacion() {
            this.printCertificadoMedico(this.datosFirma.id);
            this.dialogoFirma = false;
            this.consultarCitas(this.afiliado.id);
            this.clear();
            this.datosFirma = {};
        },

        async printCertificadoMedico(pdf) {
            try {
                const request = {
                    consulta: pdf,
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

        dialogOrdenAsociada(item) {
            this.itemSeleccionado = item;
            this.dialogOrden = true;
        },

        validarAsistencia(item) {
            this.cobroSeleccionado = item.orden_procedimiento?.cobro;
            if (item.orden_procedimiento?.cobro?.valor > 0) {
                this.cobroActivado = true;
                // console.log('cobro', this.cobroSeleccionado);

            } else {
                this.guardarRecaudo();
            }
        },

        guardarRecaudo() {
            this.loadingRecaudo = true
            // if (!this.medioPagoSeleccionado && this.cobroSeleccionado.valor > 0) {
            //     return this.$toast.error('El campo "Medio Pago" es requerido.');
            // }
            // this.setPreload(true)
            this.$axios.post('ordenamiento/cobro-servicio/' + this.cobroSeleccionado.id, { medio_pago: this.medioPagoSeleccionadoOrden }).then(res => {
                this.$toast.success('Cobro registrado con éxito');
                // this.serviciosVigentes(this.afiliado.id);
                this.medioPagoSeleccionadoOrden = null;
                this.cobroSeleccionado = null;
                this.cobroActivado = false;
                this.dialogOrden = false;
                this.consultarCitas(this.afiliado.id);
                this.finalizarConfirmacion();
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.loadingRecaudo = false
            })
        },
    },
};

</script>
