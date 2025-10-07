<template>
    <div>
        <v-row class="mt-2">
            <v-col cols="12" sm="10" md="10">
                <v-text-field append-icon="mdi-magnify" dense label="Buscar"
                    hint="Ingrese el número de documento del afiliado" v-model="filtro.numeroDocumento"
                    outlined></v-text-field>
            </v-col>
            <v-col cols="12" sm="2" md="2">
                <v-btn color="primary" style="width: 49%" @click="listarConsultasSinFinalizar()">Buscar</v-btn>
                <v-btn color="error" style="width: 49%" @click="limpiarFiltro()">Limpiar</v-btn>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-divider></v-divider>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-data-table :headers="headersConsultasNoFinalizadas" :items="consultasNoFinalizadas"
                    :loading="loading.consultasNoFinalizadas" loading-text="Cargando... Por favor espere" dense
                    no-data-text="Señor Usuario, usted no tiene consultas sin finalizar">
                    <template v-slot:[`item.afiliado`]="{ item }">
                        {{
                            [item.afiliado?.nombre, item.afiliado?.apellido]
                                .filter(Boolean)
                        .join(' ') || 'Sin nombre'
                        }}
                    </template>
                    <template v-slot:[`item.fechaAtencion`]="{ item }">
                        {{ $moment(item.fecha_hora_inicio).format("DD/MM/YYYY") }}
                    </template>
                    <template v-slot:[`item.sexoAfiliado`]="{ item }">
                        {{ item.afiliado.sexo === "M" ? "Masculino" : "Femenino" }}
                    </template>
                    <template v-slot:[`item.edadAfiliado`]="{ item }">
                        {{ item.afiliado.edad_cumplida }} Años
                    </template>
                    <template v-slot:[`item.estadoConsulta`]="{ item }">
                        <v-chip dark small :color="obtenerEstado(item.estado_id).color">{{
                            obtenerEstado(item.estado_id).nombre
                            }}</v-chip>
                    </template>
                    <template v-slot:[`item.acciones`]="{ item }">
                        <div style="display: flex; gap: 0.4rem; justify-content: center">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                        @click="atenderConsulta(item)">mdi-check-circle-outline</v-icon>
                                </template>
                                <span>Continuar Atención</span>
                            </v-tooltip>
                        </div>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

        <!-- Historia Integral -->
        <component :is="componente" :datos="datosGenerales" @cerrar="cerrarHistoria" :historiaSinFinalizar="true"
            :ref="componente"></component>
    </div>
</template>
<script>
import HistoriaIntegral from "~/components/panelMedico/historiaIntegral.vue";
import { mapActions } from "vuex";

export default {
    name: "consultasSinFinalizar",
    components: {
        HistoriaIntegral,
    },
    data() {
        return {
            filtro: {
                numeroDocumento: null,
            },
            loading: {
                consultasNoFinalizadas: false,
            },
            consultasNoFinalizadas: [],
            headersConsultasNoFinalizadas: [
                { text: "N° Atención", value: "id" },
                { text: "Fecha Atención", value: "fechaAtencion" },
                { text: "Afiliado", value: "afiliado" },
                { text: "Tipo de Documento", value: "afiliado.tipo_documento.nombre" },
                { text: "N° de Documento", value: "afiliado.numero_documento" },
                { text: "Sexo", value: "sexoAfiliado" },
                { text: "Edad", value: "edadAfiliado" },
                { text: "Sede", value: "nombreRep" },
                { text: "Especialidad", value: "cita.especialidad.nombre" },
                { text: "Actividad", value: "actividad" },
                { text: "Estado", value: "estadoConsulta", align: "center" },
                { text: "Tiempo de Consulta", value: "tiempo_consulta" },
                {
                    text: "Acciones",
                    value: "acciones",
                    sortable: false,
                    align: "center",
                },
            ],
            datosGenerales: {},
            componente: null,
            historia: [],
            dialogHistoria: false,
            registroHistoria: {},
            e6: 1,
        };
    },
    mounted() {
        this.listarConsultasSinFinalizar();
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        limpiarFiltro() {
            this.filtro = {
                numeroDocumento: null,
            };

            this.listarConsultasSinFinalizar();
        },

        listarConsultasSinFinalizar() {
            this.loading.consultasNoFinalizadas = true;
            this.$axios
                .post("/consultas/consultasSinFinalizar", this.filtro)
                .then((res) => {
                    this.consultasNoFinalizadas = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Error al cargar las consultas sin finalizar. Por favor, intente nuevamente"
                    );
                })
                .finally(() => {
                    this.loading.consultasNoFinalizadas = false;
                });
        },

        obtenerEstado(estadoId) {
            switch (estadoId) {
                case 7:
                    return { color: "yellow darken-2", nombre: "En Consulta" };
                case 49:
                    return {
                        color: "red darken-2",
                        nombre: "Historia Clínica Sin Finalizar",
                    };
                default:
                    return { color: "gray", nombre: "Desconocido" };
            }
        },

        atenderConsulta(item) {
            const consultaId = item.id;
            this.$axios
                .get(`/consultas/verificarEstadoConsulta/${consultaId}`)
                .then((res) => {
                    if (res.data.estado_id === 13 || res.data.estado_id === 14) {
                        this.enconsulta(item.id);
                    }
                })
                .catch((e) => {
                    this.$toast.error(
                        "Ocurrió un error al verificar el estado de la consulta"
                    );
                });

            this.datosGenerales = item;
            this.componente = "HistoriaIntegral";
            this.$nextTick(() => {
                this.$refs.HistoriaIntegral.abrirDialog()
            })
        },

        cerrarHistoria() {
            this.componente = null;
            this.listarConsultasSinFinalizar();
        },

        siguienteCategoria(item, categoria) {
            const validate = this.$refs[categoria][0].validate();
            if (validate) {
                this.e6 =
                    parseInt(item) > this.historia.length ? this.historia.length : item;
            }
        },

        saltoCategoria(actual, siguiente) {
            console.log(actual, siguiente);
        },

        finalizarHistoria() {
            this.setPreload(true);
            this.$axios
                .post(
                    "/consultas/guardarHistoria/" + this.datosGenerales.id,
                    this.registroHistoria
                )
                .then((res) => {
                    this.dialogHistoria = false;
                    this.listarConsultasSinFinalizar();
                })
                .catch((e) => {
                    this.$swal({
                        type: "error",
                        title: "¡No puede ser!",
                        text: e.response.data.mensaje,
                    });
                    for (const item in this.$refs) {
                        const validate = this.$refs[item][0].validate();
                        if (!validate) {
                            return (this.e6 = item);
                        }
                    }
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        pausarConsulta() {
            this.dialogHistoria = false;
        },
    },
};
</script>
