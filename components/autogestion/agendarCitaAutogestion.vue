<template>
    <div>
        <v-alert border="left" dense text type="info" icon="mdi-update">
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

        <v-snackbar v-model="mostrarMensaje" color="red" timeout="-1">
            {{ mensajeAyuda }}
        </v-snackbar>

        <v-form style="width: 100%" ref="formAsignacionCitaAutogestion">
            <v-row dense v-if="afiliado" class="mt-3">
                <v-col cols="12" sm="12" md="12">
                    <v-alert text dense border="left" type="info" icon="mdi-calendar-search"
                        class="text-center"><b>PROCESO DE AGENDAMIENTO - CITA MÉDICA</b></v-alert>
                </v-col>
                <v-snackbar v-model="mostrarMensaje" color="red" timeout="8000">
                    {{ mensajeAyuda }}
                </v-snackbar>

                <!-- Selección del Servicio -->
                <v-col cols="12">
                    <v-autocomplete outlined label="Seleccione el Servicio" dense prepend-icon="mdi-stethoscope"
                        :items="citas" :loading="loading.citas" no-data-text="No hay resultados"
                        v-model="formAgendarCita.cita" item-text="nombre" return-object @change="onCitaChange"
                        v-bind:class="{ 'resaltar-campo': campoActivo === 'cita' }"></v-autocomplete>
                </v-col>

                <!-- Fecha Deseada -->
                <v-col cols="12" v-if="formAgendarCita.cita">
                    <v-menu v-model="menuFechaSolicitada" :close-on-content-click="false">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field outlined v-model="formAgendarCita.fecha_solicitada" label="Fecha Deseada"
                                prepend-icon="mdi-calendar" readonly dense v-bind="attrs" v-on="on"
                                v-bind:class="{ 'resaltar-campo': campoActivo === 'fecha_solicitada' }"></v-text-field>
                        </template>
                        <v-date-picker v-model="formAgendarCita.fecha_solicitada"
                            @input="menuFechaSolicitada = false"></v-date-picker>
                    </v-menu>
                </v-col>

                <!-- Calendario con eventos -->
                <v-col cols="12">
                    <v-date-picker v-if="formAgendarCita.cita" event-color="green lighten-1"
                        v-model="formAgendarCita.fecha" :events="eventos" :min="fechaMinima" locale="es-es" full-width
                        @change="onFechaChange"
                        v-bind:class="{ 'resaltar-campo': campoActivo === 'fecha' }"></v-date-picker>
                </v-col>

                <!-- Selección del Médico -->
                <v-col cols="12">
                    <v-autocomplete v-if="formAgendarCita.fecha" outlined dense label="Médico"
                        v-model="formAgendarCita.medico" :items="medicosFormateados"
                        no-data-text="Debe elegir una fecha disponible" return-object item-text="nombre"
                        @change="onMedicoChange" v-bind:class="{ 'resaltar-campo': campoActivo === 'medico' }">
                        <template v-slot:item="{ item, on, attrs }">
                            <v-list-item v-bind="attrs" v-on="on"
                                :style="item.esMedicoDeFamilia ? 'background-color: #e0fae2;' : ''">
                                <v-list-item-content>
                                    <v-list-item-title>{{ item.nombre }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                    </v-autocomplete>
                </v-col>

                <!-- Agendas Disponibles -->
                <v-col cols="12" v-if="formAgendarCita.medico">
                    <v-data-table :headers="headersAgendasDisponibles" :items="agendasFiltradas">
                        <template v-slot:[`item.horario`]="{ item }">
                            {{ item.fecha_inicio?.substring(11, 20) }}
                        </template>
                        <template v-slot:[`item.disponibilidad`]="{ item }">
                            {{
                                item.consultas.filter((consulta) => consulta.estado_id !== 5).length
                            }}
                            /
                            {{ item.cita.cantidad_paciente }}
                        </template>
                        <template v-slot:[`item.acciones`]="{ item }">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="teal" class="mr-2" v-bind="attrs" v-on="on"
                                        @click="abrirModalVerificacion(item)">
                                        mdi-check-circle
                                    </v-icon>
                                </template>
                                <span>Agendar Cita</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-form>

        <!-- Dialog Asignación de Cita -->
        <v-dialog persistent v-if="dialogAsignarCita" v-model="dialogAsignarCita" max-width="600px" scrollable>
            <v-card>
                <v-alert dense text border="left" icon="mdi-clipboard-text" type="info" color="info">
                    <b>Asignar Cita</b>
                </v-alert>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <p v-if="
                                formAgendarCita.cita &&
                                formAgendarCita.agenda &&
                                formAgendarCita.medico
                            ">
                                Señor(a)
                                <b>{{ afiliado.primer_nombre }} {{ afiliado.segundo_nombre }}
                                    {{ afiliado.primer_apellido }}
                                    {{ afiliado.segundo_apellido }}</b>
                                identificado con
                                <b>{{ afiliado.tipo_documento.nombre }}</b> N°
                                <b>{{ afiliado.numero_documento }}</b>
                                su cita de tipo <b>{{ formAgendarCita.cita.nombre }}</b> será
                                agendada para el día
                                <b>{{
                                    $moment(
                                        formAgendarCita.agenda.fecha_inicio?.substring(0, 10)
                                    ).format("dddd, D MMMM YYYY")
                                }}</b>
                                a las
                                <b>{{
                                    $moment(formAgendarCita.agenda.fecha_inicio).format("h:mm a")
                                }}</b>
                                en la Sede <b>{{ afiliado.ips.nombre }}</b>, <b>{{
                                    formAgendarCita.agenda.consultorio.nombre
                                }}</b> con el
                                Médico
                                <b>{{ formAgendarCita.medico.nombre }}</b>
                            </p>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="success" small dark @click="asignarCita()">Asignar Cita</v-btn>
                    <v-btn @click="dialogAsignarCita = false" color="error" small>Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import AfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";

export default {
    components: { AfiliadoComponente },
    data() {
        return {
            afiliado: null,
            datosBasicos: true,
            editar: true,
            loading: {
                citas: false,
            },
            formAgendarCita: {
                cita: null,
                fecha: null,
                medico: null,
                agenda: null,
                paciente: null,
                fecha_solicitada: null,
            },
            menuFechaSolicitada: false,
            citas: [],
            agendaDisponible: [],
            eventos: [],
            medicos: [],
            agendas: [],
            fechaMinima: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .substring(0, 10),
            headersAgendasDisponibles: [
                { text: "Hora", value: "horario", align: "center" },
                { text: "Consultorio", value: "consultorio.nombre", align: "center" },
                {
                    text: "Asignados/Disponibilidad",
                    value: "disponibilidad",
                    align: "center",
                },
                {
                    text: "Acciones",
                    value: "acciones",
                    sortable: false,
                    align: "center",
                },
            ],
            dialogAsignarCita: false,
            mostrarMensaje: false,
            campoActivo: null,
            mensajeAyuda: "",
        };
    },
    computed: {
        medicosFormateados() {
            return this.medicos.map((medico) => {
                let nombreCompleto = medico.nombre;
                let esMedicoDeFamilia = false;

                if (
                    medico.id === this.afiliado.medico_familia1_id ||
                    medico.id === this.afiliado.medico_familia2_id
                ) {
                    nombreCompleto += " - MÉDICO DE FAMILIA";
                    esMedicoDeFamilia = true;
                }

                return {
                    ...medico,
                    nombre: nombreCompleto,
                    esMedicoDeFamilia,
                };
            });
        },

        agendasFiltradas() {
            const clasificaciones = this.afiliado?.clasificacion || [];

            const tieneAislamiento = clasificaciones.some(c =>
                c.nombre?.toLowerCase().includes('aislamiento')
            );

            // Si no tiene aislamiento, retornamos todas las agendas
            if (!tieneAislamiento) {
                return this.agendas;
            }

            // Si tiene aislamiento, filtramos para solo mostrar la última por día y consultorio
            return this.agendas.filter((item) => {
                const fechaAgenda = item.fecha_inicio?.substring(0, 10);

                const agendasConsultorio = this.agendas.filter(agenda =>
                    agenda.consultorio_id === item.consultorio_id &&
                    agenda.fecha_inicio?.substring(0, 10) === fechaAgenda
                );

                const ultimaAgenda = agendasConsultorio.reduce((ultima, actual) =>
                    new Date(actual.fecha_fin) > new Date(ultima.fecha_fin) ? actual : ultima,
                    agendasConsultorio[0]
                );

                return ultimaAgenda?.id === item.id;
            });
        }
    },

    watch: {
        formAgendarCita: {
            deep: true,
            handler() {
                this.validarCampos();
            },
        },
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        buscarAfiliado() {
            const tipoDocumento =
                this.$store.state.auth.usuario.datosAfiliado.tipo_documento;
            const numeroDocumento =
                this.$store.state.auth.usuario.datosAfiliado.numero_documento;

            this.setPreload(true);
            this.$axios
                .get(`/afiliados/${numeroDocumento}/${tipoDocumento}`)
                .then((res) => {
                    this.afiliado = res.data;
                })
                .catch(() => {
                    this.$toast.error("Ocurrió un error al obtener sus datos.");
                })
                .finally(() => {
                    this.setPreload(false);
                    return this.$swal.fire({
                        type: "warning",
                        title: "Proceso de agendamiento de cita para atención médica",
                        text: "Para agendar una cita médica, primero debe seleccionar el tipo de servicio y luego completar el formulario con la información requerida.",
                        confirmButtonText: "Entendido",
                    });
                });
        },

        listarCitasAutogestion() {
            this.loading.citas = true;
            this.$axios
                .get("/citas/listarCitasAutogestion")
                .then((res) => {
                    this.citas = res.data.map((cita) => {
                        return {
                            id: cita.id,
                            nombre: `${cita.nombre} - ${parseInt(cita.tipo_cita_id) === 2 ? "Grupal" : "Individual"
                                }`,
                            cantidad_paciente: cita.cantidad_paciente,
                            especialidad: cita.especialidad,
                            tipo_consulta_id: cita.tipo_consulta_id,
                        };
                    });
                })
                .catch(() => {
                    this.$toast.error("Ocurrió un error al cargar las Citas.");
                })
                .finally(() => {
                    this.loading.citas = false;
                });
        },

        listarAgendaDisponible() {
            const sede = this.$store.state.auth.usuario.datosAfiliado.ips_id;

            this.setPreload(true);
            this.$axios
                .get(
                    `/agenda/agendaDisponible?cita=${this.formAgendarCita.cita.id}&sede=${sede}`
                )
                .then((res) => {
                    this.agendaDisponible = res.data;
                    res.data.forEach((agenda) => {
                        const found = this.eventos.find(
                            (elemento) => elemento === agenda.fecha_inicio?.substring(0, 10)
                        );
                        if (found === undefined) {
                            this.eventos.push(agenda.fecha_inicio?.substring(0, 10));
                        }
                    });
                })
                .catch(() => {
                    this.$toast.error("Ocurrió un error al cargar la agenda.");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        listarMedicosPorAgenda() {
            this.setPreload(true);
            this.$axios
                .post("/agenda/medicos", {
                    cita: this.formAgendarCita.cita?.id,
                    fecha: this.formAgendarCita.fecha,
                    sede: this.$store.state.auth.usuario.datosAfiliado.ips_id,
                })
                .then((res) => {
                    res.data.forEach((agenda) => {
                        agenda.medicos.forEach((medico) => {
                            const id = this.medicos.findIndex(
                                (agenda) => parseInt(agenda.id) === parseInt(medico.id)
                            );
                            if (id < 0) {
                                this.medicos.push({
                                    id: medico.id,
                                    nombre: [medico.operador?.nombre, medico.operador?.apellido].filter(Boolean).join(' '),
                                    agendas: [agenda],
                                });
                            } else {
                                this.medicos[id].agendas.push(agenda);
                            }
                        });
                    });
                })
                .catch(() => {
                    this.$toast.error("Ocurrió un error al cargar los medicos");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        onCitaChange() {
            this.eventos = [];
            this.medicos = [];
            this.agendaDisponible = [];
            this.agendas = [];
            this.listarAgendaDisponible();
        },

        onFechaChange() {
            this.medicos = [];
            this.agendas = [];
            this.agendasDisponibles = [];
            this.listarMedicosPorAgenda();
        },

        onMedicoChange() {
            this.agendas = [];
            const medicoSeleccionado = this.formAgendarCita.medico?.id;
            const medico = this.medicos.find((m) => m.id === medicoSeleccionado);
            this.agendas = medico ? medico.agendas : [];
        },

        abrirModalVerificacion(item) {
            if (this.$refs.formAsignacionCitaAutogestion.validate()) {
                const consultasValidas = item.consultas.filter(
                    (consulta) => consulta.estado_id !== 5
                );

                if (consultasValidas.length >= item.cita.cantidad_paciente) {
                    this.$toast.error(
                        "La agenda ya tiene una consulta asignada a esa hora."
                    );
                    return;
                }

                this.formAgendarCita.agenda = item;
                this.dialogAsignarCita = true;
            } else {
                this.$toast.error("Por favor, indique la fecha deseada.");
            }
        },

        asignarCita() {
            this.setPreload(true);
            this.formAgendarCita.paciente = this.afiliado;

            this.$axios
                .post("/consultas/asignarCitaAutogestion", this.formAgendarCita)
                .then((res) => {
                    if (res.data.mensaje === "Su cita ha sido asignada exitosamente") {
                        this.$toast.success(res.data.mensaje);
                        this.limpiarFormulario();
                    } else {
                        this.$swal({
                            type: "error",
                            title: "¡No es posible asignar esa cita!",
                            text: res.data.mensaje,
                        });
                    }
                })
                .catch((error) => {
                    this.$swal({
                        type: "error",
                        title: "¡No puede ser!",
                        text: error.response.data.mensaje,
                    });
                })
                .finally(() => {
                    this.dialogAsignarCita = false;
                    this.setPreload(false);
                });
        },

        limpiarFormulario() {
            (this.formAgendarCita = {
                agenda: null,
                medico: null,
                fecha: null,
                paciente: this.afiliado,
                cita: null,
            }),
                (this.eventos = []);
            this.medicos = [];
            this.agendaDisponible = [];
            this.agendas = [];
        },

        validarCampos() {
            if (!this.formAgendarCita.cita) {
                this.mostrarAyuda("Debe seleccionar un servicio", "cita");
                return;
            }
            if (!this.formAgendarCita.fecha_solicitada) {
                this.mostrarAyuda("Seleccione la fecha en la que desea recibir atención médica.", "fecha_solicitada");
                return;
            }
            if (!this.formAgendarCita.fecha) {
                this.mostrarAyuda("Las fechas resaltadas con un ícono verde indican disponibilidad para atención. Por favor, seleccione el día de su preferencia.", "fecha");
                return;
            }
            if (!this.formAgendarCita.medico) {
                this.mostrarAyuda("A continuación, se mostrarán los médicos con agenda disponible para el día seleccionado. Por favor, elija el médico que atenderá su cita.", "medico");
                return;
            }
            if (this.formAgendarCita.medico) {
                this.mostrarAyuda(
                    `Por último, elija la hora de su cita haciendo clic en el ícono ✔ de color verde de confirmación llamado (AGENDAR CITA) ubicado a la derecha y confirme los datos para agendar su cita.`
                );
                return;
            }
            this.mostrarMensaje = false;
            this.campoActivo = null;
        },
        mostrarAyuda(mensaje, campo) {
            this.mensajeAyuda = mensaje;
            this.mostrarMensaje = true;
            this.campoActivo = campo;
        },

    },
    created() {
        this.buscarAfiliado();
        this.listarCitasAutogestion();
    },
};
</script>

<style scoped>
.resaltar-campo {
    border: #7e95c7 !important;
    box-shadow: 0 0 10px #516585;
    animation: resaltar 1s infinite alternate;
}

@keyframes resaltar {
    0% {
        box-shadow: 0 0 10px #e41c1c;
    }

    100% {
        box-shadow: 0 0 20px #3e5d7c;
    }
}
</style>
