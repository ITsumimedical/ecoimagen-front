<template>
    <v-container fluid>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span class="ml-2">Traslado de ubicación agenda</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>

            <v-form ref="formTraslado" v-model="formValid">
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-autocomplete outlined dense v-model="form.rep" :items="reps" item-text="nombre"
                            item-value="id" return-object label="Seleccione la sede origen" :rules="[requerido]"
                            @change="listarConsultorios" />
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-autocomplete outlined dense :disabled="!form.rep" v-model="form.consultorio"
                            :items="consultorios" :item-text="c => `${c.nombre} (Capacidad: ${c.cantidad_paciente})`"
                            item-value="id" label="Seleccione consultorio origen" :rules="[requerido]" />
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-menu ref="menuRango" v-model="menuRango" :close-on-content-click="false"
                            transition="scale-transition" offset-y min-width="350px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="form.rangoTexto" label="Seleccione rango de fechas"
                                    prepend-icon="mdi-calendar-range" readonly outlined dense v-bind="attrs" v-on="on"
                                    :rules="[requerido]" />
                            </template>

                            <v-date-picker v-model="form.rangoFechas" type="date" range locale="es-co" scrollable
                                @change="guardarRangoFechas" />

                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="6" class="d-flex align-center mt-n6">
                        <v-btn color="primary" :disabled="!form.consultorio || !form.anio || !form.mes"
                            @click="consultarAgendas" small>
                            <v-icon left>mdi-magnify</v-icon>
                            Consultar agendas
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>

            <v-card flat v-if="agendas.length > 0" class="mt-4">
                <v-data-table :headers="headers" :items="agendas" v-model="selectedAgendas" show-select dense
                    class="elevation-1">
                    <template v-slot:[`item.medico`]="{ item }">
                        <div v-if="item.medicos && item.medicos.length">
                            <span v-for="(m, i) in item.medicos" :key="i">
                                {{ m.nombre }} {{ m.apellido }} ({{ m.documento }})
                                <span v-if="i < item.medicos.length - 1">, </span>
                            </span>
                        </div>
                        <span v-else>-</span>
                    </template>
                </v-data-table>
            </v-card>

            <v-card flat class="mt-4" v-if="selectedAgendas.length > 0">
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-autocomplete outlined dense v-model="form.repDestino" :items="reps" item-text="nombre"
                            item-value="id" return-object label="Seleccione la sede destino" :rules="[requerido]"
                            @change="listarConsultoriosDestino" />
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-autocomplete outlined dense :disabled="!form.repDestino" v-model="form.consultorioDestino"
                            :items="consultoriosDestino"
                            :item-text="c => `${c.nombre} (Capacidad: ${c.cantidad_paciente})`" item-value="id"
                            label="Seleccione consultorio destino" :rules="[requerido]" />
                    </v-col>

                    <v-col cols="12">
                        <v-textarea outlined dense v-model="form.motivo" label="Motivo del traslado"
                            :rules="[requerido, v => v.length >= 5 || 'Debe tener mínimo 5 caracteres']" auto-grow
                            rows="2" />
                    </v-col>
                </v-row>
            </v-card>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" small :disabled="!formValid || selectedAgendas.length === 0"
                    @click="guardarTraslado">
                    <v-icon left>mdi-swap-horizontal</v-icon>
                    realizar traslado
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
    data() {
        return {
            menuRango: false,
            formValid: false,
            menuMes: false,
            form: {
                rangoTexto: '',
                rangoFechas: [null, null],
                fechaInicio: null,
                fechaFin: null,
                rep: null,
                consultorio: null,
                repDestino: null,
                consultorioDestino: null,
                motivo: "",
                anio: new Date().getFullYear(),
                mes: new Date().getMonth() + 1,
                mesAnio: new Date().toISOString().substr(0, 7),
                mesAnioTexto: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
            },
            reps: [],
            consultorios: [],
            consultoriosDestino: [],
            agendas: [],
            selectedAgendas: [],
            headers: [
                { text: "Fecha inicio", value: "fecha_inicio" },
                { text: "Fecha fin", value: "fecha_fin" },
                { text: "Médico(s)", value: "medico" },
            ],
        };
    },

    mounted() {
        this.listarReps();
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        requerido(v) {
            return !!v || "Campo requerido";
        },

        async listarReps() {
            try {
                this.setPreload(true);
                const response = await this.$axios.post("/reps/listar", {
                    page: 0,
                    filas: 0,
                    propias: true,
                    relacion: 1,
                });
                this.reps = response.data.data || response.data;
            } catch (error) {
                console.error("Error listando reps:", error);
            } finally {
                this.setPreload(false);
            }
        },

        async listarConsultorios() {
            if (!this.form.rep?.id) {
                this.consultorios = [];
                return;
            }
            try {
                this.setPreload(true);
                const { data } = await this.$axios.post("/consultorios/listarRep", {
                    rep_id: this.form.rep.id,
                });
                this.consultorios = data;
            } catch (error) {
                console.error("Error listando consultorios:", error);
            } finally {
                this.setPreload(false);
            }
        },

        async listarConsultoriosDestino() {
            if (!this.form.repDestino?.id) {
                this.consultoriosDestino = [];
                return;
            }
            try {
                this.setPreload(true);
                const { data } = await this.$axios.post("/consultorios/listarRep", {
                    rep_id: this.form.repDestino.id,
                });
                this.consultoriosDestino = data;
            } catch (error) {
                console.error("Error listando consultorios destino:", error);
            } finally {
                this.setPreload(false);
            }
        },

        guardarMesAnio(val) {
            this.menuMes = false;
            this.form.mesAnioTexto = val;
            const [anio, mes] = val.split("-");
            this.form.anio = parseInt(anio);
            this.form.mes = parseInt(mes);
        },

        async consultarAgendas() {
            if (!this.form.consultorio || !this.form.fechaInicio || !this.form.fechaFin) {
                this.$toast.info("Debe seleccionar un consultorio y un rango de fechas válido");
                return;
            }

            try {
                this.setPreload(true);
                const { data } = await this.$axios.post("/agenda/listar-por-consultorio", {
                    consultorio_id: this.form.consultorio,
                    fecha_inicio: this.form.fechaInicio,
                    fecha_fin: this.form.fechaFin,
                });

                if (!data || data.length === 0) {
                    this.$toast.info("No se encontraron agendas en el rango seleccionado");
                    this.agendas = [];
                } else {
                    this.agendas = data;
                }
            } catch (error) {
                console.error("Error consultando agendas:", error);
                this.$toast.error("Ocurrió un error al consultar las agendas");
            } finally {
                this.setPreload(false);
            }
        },

        async guardarTraslado() {
            if (!this.$refs.formTraslado.validate() || this.selectedAgendas.length === 0) return;

            this.setPreload(true);

            try {
                const payload = {
                    agendas: this.selectedAgendas.map(a => a.id),
                    consultorio_destino: this.form.consultorioDestino,
                    motivo: this.form.motivo,
                };

                await this.$axios.post("/agenda/trasladar-consultorio", payload);

                this.$toast.success("Traslado realizado con éxito");

                this.$emit("trasladoGuardado");
                this.$emit("cerrar");

                this.selectedAgendas = [];
                this.form.motivo = '';
                this.form.consultorioDestino = null;

            } catch (error) {
                this.setPreload(false);
                const msg =
                    error?.response?.data?.errors
                        ? Object.values(error.response.data.errors).flat().join("<br>")
                        : error?.response?.data?.error || error?.response?.data?.message || "Ocurrió un error al realizar el traslado.";

                await this.$swal({
                    type: 'error',
                    title: 'Error al trasladar agendas',
                    html: msg,
                    confirmButtonText: 'Aceptar'
                });

                console.error("Error guardando traslado:", error);

            } finally {
                this.setPreload(false);
            }
        },

        guardarRangoFechas(val) {
            this.menuRango = false;

            const [start, end] = val;

            if (!start || !end) {
                this.form.rangoTexto = '';
                this.form.fechaInicio = null;
                this.form.fechaFin = null;
                this.form.rangoFechas = [null, null];
                return;
            }

            const startDate = new Date(start);
            const endDate = new Date(end);

            const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;

            if (monthsDiff > 3) {
                this.$toast.error("El rango seleccionado no puede superar 3 meses.");
                this.form.rangoTexto = '';
                this.form.rangoFechas = [null, null];
                this.form.fechaInicio = null;
                this.form.fechaFin = null;
                return;
            }

            this.form.rangoTexto = `${start} - ${end}`;
            this.form.fechaInicio = start;
            this.form.fechaFin = end;
            this.form.rangoFechas = [start, end];
        },

    },
};
</script>
