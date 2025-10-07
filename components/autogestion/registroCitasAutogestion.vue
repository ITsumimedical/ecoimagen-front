<template>
    <div>
        <v-alert border="left" dense text type="warning" icon="mdi-update">
            <div>
                <b>Actualizar Datos de Contacto</b>
                <p>
                    Para nosotros es de vital importancia mantener los datos de contacto
                    actualizados por si requerimos contactarnos con usted, muchas gracias.
                </p>
            </div>
        </v-alert>

        <v-row dense v-if="afiliado">
            <AfiliadoComponente :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                :mostrarClasificaciones="true" @respuestaComponente="componente = null" />
        </v-row>

        <v-row dense v-if="afiliado" class="mt-3">
            <v-col cols="12" sm="12" md="12">
                <v-alert text dense border="left" type="info" icon="mdi-calendar-clock" class="text-center"><b>HISTÓRICO
                        - CITAS MÉDICAS</b></v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-data-table dense :headers="headersRegistroCitas" :items="citasAfiliado.data"
                    no-data-text="Señor afiliado, usted no tiene Citas registradas" :loading="loading.tablaCitas"
                    :items-per-page="cantidadItemsPagina" disable-pagination hide-default-footer>
                    <template v-slot:[`item.medico_ordena_operador_nombre`]="{ item }">
                        {{ [item.medico_ordena?.operador?.nombre,
                        item.medico_ordena?.operador?.apellido].filter(Boolean).join(' ')}}
                    </template>
                    <template v-slot:[`item.fecha`]="{ item }">
                        {{ item.fecha_hora_inicio?.substring(0, 10) | formatoFecha }}
                    </template>
                    <template v-slot:[`item.hora`]="{ item }">
                        {{ item.fecha_hora_inicio?.substring(11, 20) }}
                    </template>
                    <template v-slot:[`item.estadoConsulta`]="{ item }">
                        <v-chip dark small :color="obtenerColorEstado(item.estado.id)">
                            {{ item.estado.nombre }}
                        </v-chip>
                    </template>
                    <template v-slot:[`item.acciones`]="{ item }">
                        <div class="d-flex justify-center">
                            <v-tooltip top v-if="estadosCancelarConsulta.includes(parseInt(item.estado_id))">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="red" class="mr-2" v-bind="attrs" v-on="on"
                                        @click="abrirModalCancelarConsulta(item)">
                                        mdi-calendar-remove
                                    </v-icon>
                                </template>
                                <span>Cancelar Consulta</span>
                            </v-tooltip>
                            <v-tooltip top v-if="item.estado.id === 13">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="success" class="mr-2" v-bind="attrs" v-on="on"
                                        @click="confirmarConsulta(item)">
                                        mdi-calendar-check
                                    </v-icon>
                                </template>
                                <span>Confirmar Consulta</span>
                            </v-tooltip>
                            <v-tooltip top v-if="estadosDescargarComprobante.includes(parseInt(item.estado_id))">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="info" class="mr-2" v-bind="attrs" v-on="on"
                                        @click="descargarComporbante(item)">
                                        mdi-file-download-outline
                                    </v-icon>
                                </template>
                                <span>Descargar Comprobante</span>
                            </v-tooltip>
                        </div>
                    </template>
                </v-data-table>
                <v-col cols="12" sm="12" md="12">
                    <v-pagination v-model="paginaActual" :length="totalPaginas" @input="obtenerCitasAfiliado"
                        :total-visible="9"></v-pagination>
                </v-col>
            </v-col>
        </v-row>

        <!-- Modal Cancelar Consulta -->
        <modal-cancelar-consulta :consulta="consultaSeleccionada" :mostrar-modal-cancelar.sync="mostrarModalCancelar"
            @recargarDatos="obtenerCitasAfiliado" />

    </div>
</template>
<script>
import { mapActions } from "vuex";
import AfiliadoComponente from "../afiliado/FormularioAfiliadoComponente.vue";
import moment from "moment";
import ModalCancelarConsulta from "~/components/consultas/modalCancelarConsulta.vue";

moment.locale("es");

export default {
    components: { ModalCancelarConsulta, AfiliadoComponente },
    data() {
        return {
            afiliado: null,
            datosBasicos: true,
            editar: true,
            loading: {
                tablaCitas: false,
            },
            citasAfiliado: [],
            headersRegistroCitas: [
                { text: "N°", value: "id", align: "center" },
                { text: "Especialidad", value: "especialidad.nombre", align: "center" },
                { text: "Cita", value: "cita.nombre", align: "center" },
                { text: "Fecha", value: "fecha", align: "center" },
                { text: "Hora", value: "hora", align: "center" },
                {
                    text: "Sede",
                    value: "agenda.consultorio.rep.nombre",
                    align: "center",
                },
                {
                    text: "Consultorio",
                    value: "agenda.consultorio.nombre",
                    align: "center",
                },
                {
                    text: "Médico",
                    value: "medico_ordena_operador_nombre",
                    align: "center",
                },
                { text: "Estado", value: "estadoConsulta", align: "center" },
                {
                    text: "Acciones",
                    value: "acciones",
                    align: "center",
                    sortable: false,
                },
            ],
            dialogCancelacionConsulta: false,
            formCancelarConsulta: {
                id: null,
                motivoCancelacion: "",
            },
            paginaActual: 1,
            cantidadItemsPagina: 10,
            totalPaginas: 0,
            mostrarModalCancelar: false,
            consultaSeleccionada: {}
        };
    },
    computed: {
        estadosCancelarConsulta() {
            return [13, 14, 59];
        },
        estadosDescargarComprobante() {
            return [13, 14, 59];
        }
    },
    filters: {
        formatoFecha(fecha) {
            return moment(fecha).format("dddd, D MMMM, YYYY");
        },

        formatoHora(Hora_Inicio) {
            return moment(Hora_Inicio).format("hh:mm A");
        },
    },
    mounted() {
        this.buscarAfiliado();
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        async buscarAfiliado() {
            const tipoDocumento = this.$store.state.auth.usuario.datosAfiliado.tipo_documento;
            const numeroDocumento = this.$store.state.auth.usuario.datosAfiliado.numero_documento;

            this.setPreload(true);

            try {
                const res = await this.$axios.get(`/afiliados/${numeroDocumento}/${tipoDocumento}`);
                this.afiliado = res.data;

                await this.obtenerCitasAfiliado();
            } catch (error) {
                this.$toast.error("Ocurrió un error al obtener sus datos.");
            } finally {
                this.setPreload(false);
            }
        },

        async obtenerCitasAfiliado() {
            this.loading.tablaCitas = true;

            try {
                const res = await this.$axios.get(`/consultas/historicoCitasAfiliado?page=${this.paginaActual}`);

                this.citasAfiliado = res.data;
                this.totalPaginas = Math.ceil(res.data.total / this.cantidadItemsPagina);
            } catch (error) {
                this.$toast.error("Ocurrió un error al cargar las Citas");
            } finally {
                this.loading.tablaCitas = false;
            }
        },

        obtenerColorEstado(estadoId) {
            switch (estadoId) {
                // En Consulta
                case 7:
                    return "orange darken-2";
                // Inasistencia
                case 8:
                    return "yellow darken-2";
                // Atendido
                case 9:
                    return "green darken-2";
                // Por Confirmar
                case 13:
                    return "light-blue darken-4";
                // Confirmada
                case 14:
                case 59:
                    return "blue darken-2";
                // Cancelada
                case 30:
                    return "red darken-2";

                default:
                    return "gray";
            }
        },

        confirmarConsulta(item) {
            this.$swal({
                title: "Esta Seguro?",
                text: "Confirmar Cita Asignada",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar",
            }).then((res) => {
                if (res.value) {
                    this.setPreload(true);
                    const data = {
                        consulta: item.id,
                        afiliado: this.afiliado.id,
                    };
                    this.$axios
                        .post("/consultas/confirmar", data)
                        .then((res) => {
                            this.$toast.success(res.data.mensaje);
                            this.obtenerCitasAfiliado();
                        })
                        .catch((error) => {
                            this.$toast.error(error.response.data.mensaje);
                        })
                        .finally(() => {
                            this.setPreload(false);
                        });
                }
            });
        },

        descargarComporbante(item) {
            const data = {
                afiliado_id: this.afiliado.id,
                id: item.agenda_id,
            };
            this.setPreload(true);
            this.$axios
                .post("/agenda/generarPdf", data, {
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
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al descargar el comprobante de cita"
                    );
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        abrirModalCancelarConsulta(consulta) {
            this.consultaSeleccionada = consulta;
            this.mostrarModalCancelar = true
        }
    },


};
</script>
