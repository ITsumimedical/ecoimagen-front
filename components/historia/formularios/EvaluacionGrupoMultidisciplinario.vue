<template>
    <div>
        <template>
            <v-dialog persistent width="300">
                <v-card color="primary" dark>
                    <v-card-text>
                        Procesando Información
                        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </template>
        <v-card elevation="0">
            <v-container fluid>
                <v-col cols="12" sm="12" md="12">
                    <v-alert class="text-center" dense text type="info" icon="mdi-account-group" border="left">
                        <b>EVALUACIÓN POR GRUPO MULTIDISCIPLINARIO</b></v-alert>
                </v-col>
                <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table :items="consultasProcedimientos" :headers="headerEvaluacion" dense>
                            <template v-slot:[`item.user.operador`]="{ item }">
                                {{ `${item.user.operador?.nombre || ''} ${item.user.operador?.apellido ||
                                    ''}`.trim() || 'Sin nombre' }}
                            </template>
                            <template v-slot:[`item.fecha`]="{ item }">
                                {{ item.fecha ? item.fecha.split(' ')[0] : '' }}
                            </template>
                            <template v-slot:[`item.acciones`]="{ item }">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon small color="info" class="mr-2" v-bind="attrs" v-on="on"
                                            @click="listarOrdenes(item)">
                                            mdi-check-circle-outline
                                        </v-icon>
                                    </template>
                                    <span>Gestionar</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
        <v-dialog v-model="ordenActivaDialogo" max-width="500px" persistent>
            <v-card>
                <v-card-title class="headline">Orden activa</v-card-title>
                <v-card-text>
                    El afiliado <strong>{{ datos.afiliado.nombre_completo }}</strong> ya tiene una orden activa de
                    <strong>{{ itemSeleccionado?.nombre_tipo }}</strong><br />
                    <strong>Fecha:</strong> {{ ordenActiva?.fecha_vigencia }}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="ordenActivaDialogo = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="nuevaOrdenDialogo" max-width="500px">
            <v-card>
                <v-card-title class="headline">Nueva orden</v-card-title>
                <v-card-text>
                    El afiliado <strong>{{ datos.afiliado.nombre_completo }}</strong> no tiene
                    orden activa para <strong>{{ itemSeleccionado?.nombre_tipo }}</strong>.<br />
                    ¿Desea asignar una nueva orden de
                    <strong>{{ itemSeleccionado?.nombre_tipo }}</strong>?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" @click="nuevaOrdenDialogo = false">Cancelar</v-btn>
                    <v-btn color="primary" @click="generarOrden(itemSeleccionado)">ASIGNAR</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    name: "",
    props: ['datos', 'resumen'],
    data() {
        return {
            hoy: this.$moment().format("YYYY-MM-DD"),
            tipo_orden: 2,
            itemSeleccionado: null,
            ordenes: [],
            ordenActiva: null,
            ordenActivaDialogo: false,
            nuevaOrdenDialogo: false,
            consultasProcedimientos: [],
            cups: {
                odontologia: 6917,
                psicologia: 6922,
                nutricion: 6920,
                oftalmologia: 6990,
            },
            cupSeguimiento: {
                odontologia: 7015,
                psicologia: 7019,
                nutricion: 7017,
                oftalmologia: 7087,
            },
            consulta_id: this.datos.id,
            afiliadoId: this.datos.afiliado_id,
            campoRequerido: [
                v => v !== null && v !== undefined || 'Este campo es requerido',
            ],
            headerEvaluacion: [{
                text: 'Valoracion',
                value: 'nombre_tipo'
            },
            {
                text: 'Profesional',
                value: 'medico'
            },
            {
                text: 'Fecha',
                value: 'fecha'
            },
            {
                text: 'Estado',
                value: 'estado'
            },
            {
                text: "Acciones",
                value: "acciones",
                sortable: false,
                align: "center",
            }
            ]
        }
    },
    mounted() {
        this.listarConsultasProcedimientos()
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        listarConsultasProcedimientos() {
            this.$axios.post("/consultas/ConsultasPorEspecialidad", {
                afiliado: this.afiliadoId
            })
                .then((res) => {
                    this.consultasProcedimientos = res.data;
                })
                .catch((err) => {
                    return this.$toast.error("Error al consultar las citas por especialidad");
                }).finally(() => {
                    this.loading = false
                })
        },
        listarOrdenes(item) {
            this.itemSeleccionado = item;
            const convertirCups = this.quitarTildes(item.nombre_tipo);

            const cup_id = item.fecha == null
                ? this.cups[convertirCups] || null
                : this.cupSeguimiento[convertirCups] || null;

            if (!cup_id) {
                console.warn("No se encontró CUP para este item", item);
                return;
            }

            this.$axios.get(`/ordenamiento/listar-ordenes-cups/${this.afiliadoId}/${cup_id}`)
                .then((response) => {
                    if (response.data.length > 0) {
                        this.ordenActiva = response.data[0];
                        this.ordenActivaDialogo = true;
                    } else {
                        this.nuevaOrdenDialogo = true;
                    }
                })
                .catch((error) => {
                    console.error("Error consultando órdenes:", error);
                });
        },
        generarDataOrden(tipo, fecha) {

            const convertirCups = this.quitarTildes(tipo);

            const procedimientoId = fecha == null
                ? this.cups[convertirCups]
                : this.cupSeguimiento[convertirCups];

            return [
                {
                    cantidad: "1",
                    procedimiento: {
                        id: procedimientoId,
                    },
                    rep: {
                        id: this.datos?.afiliado?.ips_id
                    },
                    fechaVigencia: this.$moment().format("YYYY-MM-DD"),
                    observacion: "Riesgo Cardiovascular"
                }
            ];
        },
        generarOrden(item) {
            this.setPreload(true);
            const data = this.generarDataOrden(item.nombre_tipo, item.fecha);
            this.$axios.post(
                `/ordenamiento/generarOrdenamiento/${this.consulta_id}/${this.tipo_orden}`,
                data
            ).then(() => {
                this.listarConsultasProcedimientos();
                this.nuevaOrdenDialogo = false;
                this.$toast.success("Orden generada con éxito");
            }).catch(() => {
                this.$toast.error("Error al generar la orden");
            }).finally(() => {
                this.setPreload(false);
            });
        },
        quitarTildes(palabra) {
            return palabra?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
    }
}
</script>