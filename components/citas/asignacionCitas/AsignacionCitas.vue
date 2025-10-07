<template>
    <div>
        <v-row dense>
            <v-col cols="12" sm="12" md="12">
                <v-alert dense text border="left" icon="mdi-calendar-search" type="info">
                    Proceso de asignación de cita
                </v-alert>
                <v-row dense>
                    <v-col cols="12" md="6" sm="12">
                        <v-autocomplete dense label="Especialidad" v-model="formGenerarCita.especialidad"
                            :items="especialidades" :loading="loading" no-data-text="No hay resultados" return-object
                            item-text="nombre" @change="onEspecialidadChange"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6" sm="12">
                        <v-autocomplete dense label="Cita" v-model="formGenerarCita.cita" return-object :items="citas"
                            no-data-text="Debe seleccionar una especialidad" :item-text="(citas) =>
                                    `${citas.nombre} - ${citas.tiempo_consulta} Min -  ${parseInt(citas.tipo_cita_id) === 2
                                        ? 'Grupal'
                                        : 'Individual'
                                    }`
                                " :loading="loading" @change="onCitaChange"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="12" sm="12" v-if="coincidenciasCups.length > 0">
                        <v-autocomplete dense label="Seleccione Orden y CUP" :items="coincidenciasCups"
                            v-model="seleccionOrdenCup" item-text="itemText" item-value="itemValue"
                            no-data-text="No hay coincidencias"></v-autocomplete>
                    </v-col>

                    <v-col cols="12" md="12" sm="12" v-if="coincidenciasCups.length > 0">
                        <v-textarea dense label="Observación de la Orden" v-model="observacionOrdenSeleccionada"
                            readonly></v-textarea>
                    </v-col>

                    <v-col cols="12" md="6" sm="12">
                        <v-autocomplete dense label="Sede" v-model="formGenerarCita.sede" :items="sedes"
                            no-data-text="Debe seleccionar una una cita" return-object item-text="nombre"
                            @change="onSedeChange"></v-autocomplete>
                    </v-col>
                    <!-- <v-col cols="12" md="3" sm="3">
                      <v-text-field
                        dense
                        type="date"
                        label="Fecha Solicitada"
                        v-model="formGenerarCita.fecha_solicitada"
                      ></v-text-field>
                    </v-col> -->
                    <v-col cols="12" md="6" sm="12">
                        <v-menu dense v-model="menu" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="formGenerarCita.fecha_solicitada"
                                    label="Fecha deseada por el paciente" prepend-icon="mdi-calendar" readonly dense
                                    v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="formGenerarCita.fecha_solicitada" :min="fechaMinima"
                                @input="menu = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-date-picker v-if="formGenerarCita.sede" event-color="green lighten-1"
                            v-model="formGenerarCita.fecha" :events="eventos" :min="fechaMinima" locale="es-es"
                            full-width @change="onFechaChange"></v-date-picker>
                    </v-col>
                    <v-col cols="12" md="12" sm="12"> </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-autocomplete dense label="Médico" v-model="formGenerarCita.medico" :items="medicos"
                            no-data-text="Debe elegir una fecha disponible" return-object item-text="nombre"
                            @change="onMedicoChange"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-textarea dense auto-grow label="Observaciones"
                            v-model="formGenerarCita.observacion"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table dense :headers="headersAgendasDisponibles" :items="agendas" disable-pagination
                            hide-default-footer>
                            <template v-slot:[`item.horario`]="{ item }">
                                {{ item.fecha_inicio?.substring(11, 20) }}
                            </template>
                            <template v-slot:[`item.disponibilidad`]="{ item }">
                                {{
                                    item.consultas.filter(
                                        (consulta) => consulta.estado_id !== 5
                                    ).length
                                }}
                                /
                                {{ item.cita.cantidad_paciente }}
                            </template>
                            <template v-slot:[`item.acciones`]="{ item }">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="teal" class="mr-2" v-bind="attrs" v-on="on"
                                            @click="verificarInfo(item)">
                                            mdi-account-check
                                        </v-icon>
                                    </template>
                                    <span>Agendar Cita</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-dialog persistent v-if="dialogAsignarCita" v-model="dialogAsignarCita" max-width="600px" scrollable>
            <v-card>
                <v-alert dense text border="left" icon="mdi-clipboard-text" type="info" color="info">
                    <b>Asignar Cita</b>
                </v-alert>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <p v-if="
                                formGenerarCita.cita &&
                                formGenerarCita.agenda &&
                                formGenerarCita.sede &&
                                formGenerarCita.medico
                            ">
                                Asignar Cita de tipo
                                <b>{{ formGenerarCita.cita.nombre }}</b> al Afiliado
                                <b>{{ afiliado.primer_nombre }} {{ afiliado.segundo_nombre }}
                                    {{ afiliado.primer_apellido }}
                                    {{ afiliado.segundo_apellido }}</b>
                                identificado con
                                <b>{{ afiliado.tipo_documento.nombre }}</b> N°
                                <b>{{ afiliado.numero_documento }}</b> el día
                                <b>{{
                                    $moment(
                                        formGenerarCita.agenda.fecha_inicio?.substring(0, 10)
                                    ).format("dddd, D MMMM YYYY")
                                }}</b>
                                a las
                                <b>{{
                                    $moment(formGenerarCita.agenda.fecha_inicio).format(
                                        "h:mm a"
                                    )
                                }}</b>
                                en la Sede <b>{{ formGenerarCita.sede.nombre }}</b>, <b>{{
                                    formGenerarCita.agenda.consultorio.nombre }}</b> con
                                el Médico
                                <b>{{ formGenerarCita.medico.nombre }}</b>
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

export default {
    name: 'AsignacionCitas',
    props: {
        afiliado: Object,
        servicio: Object
    },
    data() {
        return {
            ordenesAfiliado: [],
            dialogAsignarCita: false,
            formGenerarCita: {
                especialidad: null,
                cita: null,
                sede: null,
                fecha_solicitada: null,
                fecha: null,
                medico: null,
                observacion: null,
                agenda: null,
                paciente: null,
                orden_id: null,
                cup_id: null,
                servicio_id: null,
            },
            citas: [],
            loading: false,
            especialidades: [],
            coincidenciasCups: [],
            seleccionOrdenCup: [],
            observacionOrdenSeleccionada: "",
            sedes: [],
            menu: false,
            fechaMinima: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10),
            eventos: [],
            medicos: [],
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
            agendas: [],
        }
    },
    watch: {
        seleccionOrdenCup(newVal) {
            if (newVal) {
                const seleccionada = this.coincidenciasCups.find(
                    (item) =>
                        item.itemValue.orden_id === newVal.orden_id &&
                        item.itemValue.cup_id === newVal.cup_id
                );
                this.observacionOrdenSeleccionada = seleccionada
                    ? seleccionada.observacion
                    : "Sin Observación";
            } else {
                this.observacionOrdenSeleccionada = "Sin Observación";
            }
        },
    },
    mounted() {
        this.listarEspecialidadesConCitas();
        this.buscarOrdenesAfiliado();
    },
    methods: {
        ...mapActions("app", ["setPreload"]),
        listarEspecialidadesConCitas() {
            this.loading = true;
            this.$axios
                .get("/especialidades/listarEspecialidadesConMedicos")
                .then((res) => {
                    this.especialidades = res.data;
                })
                .catch((error) => {
                    this.$toast.error("Ocurrio un error al cargar las especialidades");
                    console.log(error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onEspecialidadChange() {
            this.citas = [];
            this.sedes = [];
            this.eventos = [];
            this.medicos = [];
            this.agendasDisponibles = [];
            this.agendas = [];
            this.coincidenciasCups = [];
            this.seleccionOrdenCup = null;
            this.observacionOrdenSeleccionada = "Sin Observación";
            this.listarCitasEspecialidad();
        },
        listarCitasEspecialidad() {
            const especialidadSeleccionada = this.formGenerarCita.especialidad?.id;
            const especialidad = this.especialidades.find(
                (e) => e.id === especialidadSeleccionada
            );
            this.citas = especialidad ? especialidad.citas : [];
            this.formGenerarCita.cita = null;
            this.formGenerarCita.sede = null;
            this.sedes = [];
        },
        onCitaChange() {
            this.sedes = [];
            this.medicos = [];
            this.eventos = [];
            this.agendas = [];
            this.agendasDisponibles = [];
            this.coincidenciasCups = [];
            this.seleccionOrdenCup = null;
            this.observacionOrdenSeleccionada = "Sin Observación";
            this.listarSedes();
            this.verificarCupOrden();
        },
        listarSedes() {
            const citaSeleccionada = this.formGenerarCita.cita?.id;
            if (citaSeleccionada) {
                this.setPreload(true);
                this.$axios
                    .post("/agenda/sede", { cita: citaSeleccionada })
                    .then((res) => {
                        this.sedes = res.data;
                    })
                    .catch((error) => {
                        this.$toast.error("Ocurrió un error al cargar las sedes");
                        console.log(error);
                    })
                    .finally(() => {
                        this.setPreload(false);
                    });
            } else {
                this.sedes = [];
            }
            this.formGenerarCita.sede = null;
        },
        verificarCupOrden() {

            // Verificar si la cita requiere orden
            if (this.formGenerarCita.cita) {
                if (!this.formGenerarCita.cita.requiere_orden) {
                    return;
                }


                // Verificar si el afiliado tiene órdenes
                if (this.ordenesAfiliado.length === 0) {
                    this.$swal({
                        type: "warning",
                        title: "¡Sin órdenes activas!",
                        text: "El afiliado no tiene órdenes activas para la cita seleccionada.",
                    });
                    return;
                }

                // Buscar coincidencias entre los CUPs de la cita y las órdenes del afiliado
                const cupIdsCita = this.formGenerarCita.cita.cups.map((cup) => cup.id);
                this.coincidenciasCups = this.ordenesAfiliado
                    .filter((orden) => cupIdsCita.includes(orden.cup_id))
                    .map((orden) => ({
                        itemText: `Orden N° ${orden.orden_id} - Servicio: ${orden.cup_codigo
                            } - ${orden.cup_nombre} - Sede: ${orden.rep.nombre} - Tipo: ${orden.tipo === "procedimiento"
                                ? "Procedimiento"
                                : "Otros Servicios"
                            }- Cantidad pendiente: ${orden.cantidad_pendiente == null
                                ? orden.cantidad
                                : orden.cantidad_pendiente
                            }`,
                        itemValue: {
                            orden_id: orden.orden_id,
                            cup_id: orden.cup_id,
                            servicio_id: orden.id,
                            tipo: orden.tipo,
                            cantidad: orden.cantidad,
                            cantidad_pendiente: orden.cantidad_pendiente,
                            cantidad_usada: orden.cantidad_usada
                        },
                        observacion: orden.observaciones,
                    }));

                // Si no hay coincidencias de CUPs
                if (this.coincidenciasCups.length === 0) {
                    this.$swal({
                        type: "warning",
                        title: "¡CUP no coincide!",
                        text: "El CUP de las órdenes del afiliado no coincide con los CUPs de la cita seleccionada.",
                    });
                }
            }
        },
        onSedeChange() {
            this.eventos = [];
            this.medicos = [];
            this.agendasDisponibles = [];
            this.agendas = [];
            this.listarAgendaDisponible();
        },
        listarAgendaDisponible() {
            this.setPreload(true);
            this.$axios
                .get(
                    `/agenda/agendaDisponible?cita=${this.formGenerarCita.cita?.id}&sede=${this.formGenerarCita.sede?.id}`
                )
                .then((res) => {
                    this.agendasDisponibles = res.data;
                    res.data.forEach((agenda) => {
                        const found = this.eventos.find(
                            (elemento) => elemento === agenda.fecha_inicio?.substring(0, 10)
                        );
                        if (found === undefined) {
                            this.eventos.push(agenda.fecha_inicio?.substring(0, 10));
                        }
                    });
                })
                .catch((error) => {
                    this.$toast.error("Ocurrio un error al cargar las sedes");
                    console.log(error);
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },
        onFechaChange() {
            this.medicos = [];
            this.agendas = [];
            this.agendasDisponibles = [];
            this.listarMedicosPorAgenda();
        },
        listarMedicosPorAgenda() {
            this.setPreload(true);
            this.$axios
                .post("/agenda/medicos", {
                    cita: this.formGenerarCita.cita?.id,
                    fecha: this.formGenerarCita.fecha,
                    sede: this.formGenerarCita.sede,
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
                .catch((error) => {
                    this.$toast.error("Error al cargar los médicos");
                    console.log(error);
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },
        onMedicoChange() {
            this.agendas = [];
            const medicoSeleccionado = this.formGenerarCita.medico?.id;
            const medico = this.medicos.find((m) => m.id === medicoSeleccionado);
            this.agendas = medico ? medico.agendas : [];
        },
        verificarInfo(item) {
            if (!this.formGenerarCita.fecha_solicitada) {
                this.$toast.error("Debe seleccionar una Fecha Solicitada");
                return;
            }

            // if (this.formGenerarCita.cita.requiere_orden && !this.seleccionOrdenCup) {
            //     this.$toast.error("Debe seleccionar una orden y CUP para continuar.");
            //     return;
            // }

            const consultasValidas = item.consultas.filter(
                (consulta) => consulta.estado_id !== 5
            );

            if (consultasValidas.length >= item.cita.cantidad_paciente) {
                this.$toast.error(
                    "La agenda ya tiene una consulta asignada a esa hora."
                );
                return;
            }

            this.formGenerarCita.agenda = item;
            this.dialogAsignarCita = true;
        },
        asignarCita() {
            this.formGenerarCita.paciente = this.afiliado;
            if (this.formGenerarCita.cita.requiere_orden) {
                this.formGenerarCita.orden_id = this.seleccionOrdenCup.orden_id;
                this.formGenerarCita.cup_id = this.seleccionOrdenCup.cup_id;
                this.formGenerarCita.servicio_id = this.seleccionOrdenCup.servicio_id;
                this.formGenerarCita.tipo_orden = this.seleccionOrdenCup.tipo;
                this.formGenerarCita.cantidad_usada = this.seleccionOrdenCup.cantidad_usada == null ? 1 : this.seleccionOrdenCup.cantidad_usada + 1;
                this.formGenerarCita.cantidad_pendiente = this.seleccionOrdenCup.cantidad_pendiente == null ? this.seleccionOrdenCup.cantidad - 1 : this.seleccionOrdenCup.cantidad_pendiente - 1
            }




            this.setPreload(true);
            this.$axios
                .post("/consultas/crear", this.formGenerarCita)
                .then((res) => {
                    if (res.data.mensaje === "Cita asignada al afiliado con exito!") {
                        this.$toast.success(res.data.mensaje);
                        const seguimiento = {
                            fecha: this.formGenerarCita.fecha,
                            fecha_solicitada: this.formGenerarCita.fecha_solicitada,
                            medico: this.formGenerarCita.medico.nombre,
                            observaciones: this.formGenerarCita.observacion
                        }
                        this.$emit('datos-agendamiento', seguimiento)
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
        buscarOrdenesAfiliado() {
            this.setPreload(true);
            this.$axios
                .get(`/ordenamiento/listarOrdenesAfiliado/${this.afiliado.id}`)
                .then((res) => {
                    this.ordenesAfiliado = res.data;
                })
                .catch(() => {
                    this.$toast.error(
                        "Ocurrió un error al cargar las ordenes de afiliado"
                    );
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },
    },
}
</script>
