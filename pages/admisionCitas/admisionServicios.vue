<template>
    <div>
        <v-dialog v-model="dialogCobro" persistent width="1200">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    Recaudo de Servicios
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-col cols="12" md="12" v-if="serviciosCobrar.total_individuales == 0">
                            <v-alert dense outlined type="info">
                                <strong>Atención:</strong> Todas las ordenes que tiene el afiliado estan pendientes por
                                autorizar
                            </v-alert>
                        </v-col>
                        <v-card-title>
                            Detalle de cobro
                            <v-spacer></v-spacer>
                            Total a cobrar:
                            {{ formatoPesosCOP(totalCobroSeleccionado) }}
                            <v-spacer></v-spacer>
                        </v-card-title>
                        <v-alert text dense color="warning" icon="mdi-cash" border="left" class="mb-0"
                            v-if="serviciosCobrar.laboratorios && serviciosCobrar.laboratorios.length">
                            <strong>Laboratorios Total de Cobro {{
                                formatoPesosCOP(serviciosCobrar.laboratorios?.[0]?.valor || 0) }}</strong>
                        </v-alert>
                        <v-data-table show-select dense v-model="selectedLaboratorios" :headers="headerAgrupador"
                            :items="serviciosCobrar.laboratorios" :search="search"
                            v-if="serviciosCobrar.laboratorios && serviciosCobrar.laboratorios.length">
                            <template v-slot:item.tipo="{ item }">
                                <v-chip :color="getColor(item.tipo)" dark>
                                    {{ item.tipo == 'cuota' ? 'Cuota Moderadora' : item.tipo }}
                                </v-chip>
                            </template>

                            <template v-slot:item.prestador="{ item }">
                                {{ item.prestador == null ? 'Sin Direccionamiento' : item.prestador }}
                            </template>

                            <template v-slot:item.estado_cobro="{ item }">
                                <v-chip :color="getColorEstado(item.estado_cobro_id)" dark>
                                    {{ item.estado_cobro_id == 1 ? 'Pendiente de Cobro' : 'Cobrada' }}
                                </v-chip>
                            </template>

                        </v-data-table>
                        <v-alert text dense color="warning" icon="mdi-cash" border="left" class="mb-0"
                            v-if="serviciosCobrar.ayudasDX && serviciosCobrar.ayudasDX.length">
                            <strong>Ayudas Diagnosticas Total de Cobro {{
                                formatoPesosCOP(serviciosCobrar.ayudasDX?.[0]?.valor || 0) }}</strong>
                        </v-alert>
                        <v-data-table show-select dense v-model="selectedAyudasDX" :headers="headerAgrupador"
                            :items="serviciosCobrar.ayudasDX" :search="search"
                            v-if="serviciosCobrar.ayudasDX && serviciosCobrar.ayudasDX.length">
                            <template v-slot:item.tipo="{ item }">
                                <v-chip :color="getColor(item.tipo)" dark>
                                    {{ item.tipo == 'cuota' ? 'Cuota Moderadora' : item.tipo }}
                                </v-chip>
                            </template>

                            <template v-slot:item.prestador="{ item }">
                                {{ item.prestador == null ? 'Sin Direccionamiento' : item.prestador }}
                            </template>

                            <template v-slot:item.estado_cobro="{ item }">
                                <v-chip :color="getColorEstado(item.estado_cobro_id)" dark>
                                    {{ item.estado_cobro_id == 1 ? 'Pendiente de Cobro' : 'Cobrada' }}
                                </v-chip>
                            </template>

                        </v-data-table>
                        <v-alert text dense color="warning" icon="mdi-cash" border="left" class="mb-0"
                            v-if="serviciosCobrar.individuales && serviciosCobrar.individuales.length">
                            <strong>Otros Servicios Total de Cobro {{
                                formatoPesosCOP(serviciosCobrar.total_individuales) }}</strong>
                        </v-alert>
                        <v-data-table show-select v-model="selectedIndividuales" :headers="headerCobro"
                            :items="serviciosCobrar.individuales" :search="search"
                            v-if="serviciosCobrar.individuales && serviciosCobrar.individuales.length">
                            <template v-slot:item.tipo="{ item }">
                                <v-chip :color="getColor(item.tipo)" dark>
                                    {{ item.tipo == 'cuota' ? 'Cuota Moderadora' : item.tipo }}
                                </v-chip>
                            </template>

                            <template v-slot:item.estado_id="{ item }">
                                <v-chip :color="getColorEstadoOrden(item.estado_id)" dark>
                                    {{ item.estado_id == 1 ? 'Activo' : item.estado_id == 4
                                        ? 'Autorizada' : 'Pendiente por Autorizar' }}
                                </v-chip>
                            </template>

                            <template v-slot:item.prestador="{ item }">
                                {{ item.prestador == null ? 'Sin Direccionamiento' : item.prestador }}
                            </template>

                            <template v-slot:item.estado_cobro="{ item }">
                                <v-chip :color="getColorEstado(item.estado_cobro_id)" dark>
                                    {{ item.estado_cobro_id == 1 ? 'Pendiente de Cobro' : 'Cobrada' }}
                                </v-chip>
                            </template>

                            <template v-slot:item.valor="{ item }">
                                {{ formatoPesosCOP(item.valor) }}
                            </template>
                        </v-data-table>
                        <v-row>
                            <v-col>
                                <v-alert dense outlined type="warning">
                                    Por favor, indique su forma de pago
                                </v-alert>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-select v-model="medioPagoSeleccionado" :items="medioPagos"
                                    label="Medio de pago"></v-select>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" dark
                        @click="cobroSeleccionado = null; dialogCobro = false; medioPagoSeleccionado = false">Cerrar</v-btn>
                    <v-btn small color="success" dark @click="guardarRecaudo()">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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
                    <v-btn color="red" dark @click="limpiarAfiliado()" style="width: 50%">Limpiar<v-icon
                            right>mdi-close</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row dense v-if="afiliado">
                <v-col cols="12" md="12" sm="12">
                    <EditarAfiliadoComponente :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                        :mostrarClasificaciones="true" />
                </v-col>
            </v-row>
            <v-row dense v-if="afiliado">
                <v-col cols="12" md="12" sm="12">
                    <v-toolbar-title>
                        <v-alert text dense :color="colorAlerta" icon="mdi-cash" border="left" class="mb-0">
                            Total de Cobros Acumulado al Año del Afiliado:
                            <strong>{{ acumuladoAnualAfiliado | pesoFormat }}</strong>
                            (Tope Evento:
                            <strong>{{ topeEvento | pesoFormat }}</strong>,
                            Tope Anual:
                            <strong>{{ topeAnual | pesoFormat }}</strong>)
                            <strong>{{ mensajeAlerta }}</strong>
                        </v-alert>
                    </v-toolbar-title>
                    <v-alert text dense color="warning" icon="mdi-cash" border="left" class="mb-0"
                        v-if="servicios.length === 0">
                        <strong>Paciente no posee ordenes para cobrar</strong>
                    </v-alert>
                    <v-expansion-panels class="mb-6">
                        <v-expansion-panel v-for="(item, i) in servicios" :key="i">
                            <v-expansion-panel-header expand-icon="mdi-menu-down">
                                <div class="d-flex justify-space-between align-center w-100"
                                    @click="ordenesPorCobrar(item.consulta_id)">
                                    <div>
                                        <strong>Se envio desde:</strong>
                                        {{ item.agenda_id ? 'CONSULTA' : 'TRANSCRIPCIONES' }}
                                        &nbsp;|&nbsp;
                                        <strong>Fecha:</strong>
                                        {{ formatearFecha(item.fecha_hora_inicio || item.created_at) }}
                                    </div>
                                    <v-btn small color="info" @click.stop="validarAsistencia(item.consulta_id)">
                                        COBRAR
                                    </v-btn>
                                </div>
                            </v-expansion-panel-header>

                            <v-expansion-panel-content>
                                <slot name="contenido-panel" :item="item">
                                    <v-card-title>
                                        Detalle de cobro
                                        <v-spacer></v-spacer>
                                        Total a cobrar:
                                        {{ formatoPesosCOP(
                                            (procedimientos.laboratorios?.[0]?.valor || 0) +
                                            (procedimientos.total_individuales || 0) + (procedimientos.ayudasDX?.[0]?.valor
                                                || 0)
                                        ) }}
                                        <v-spacer></v-spacer>
                                    </v-card-title>
                                    <v-alert text dense color="warning" icon="mdi-cash" border="left" class="mb-0"
                                        v-if="procedimientos.laboratorios && procedimientos.laboratorios.length">
                                        <strong>Laboratorios Total de Cobro {{
                                            formatoPesosCOP(procedimientos.laboratorios?.[0]?.valor || 0) }}</strong>
                                    </v-alert>
                                    <v-data-table :headers="headerAgrupador" :items="procedimientos.laboratorios"
                                        :search="search"
                                        v-if="procedimientos.laboratorios && procedimientos.laboratorios.length">
                                        <template v-slot:item.tipo="{ item }">
                                            <v-chip :color="getColor(item.tipo)" dark>
                                                {{ item.tipo == 'cuota' ? 'Cuota Moderadora' : item.tipo }}
                                            </v-chip>
                                        </template>

                                        <template v-slot:item.prestador="{ item }">
                                            {{ item.prestador == null ? 'Sin Direccionamiento' : item.prestador }}
                                        </template>

                                        <template v-slot:item.estado_cobro="{ item }">
                                            <v-chip :color="getColorEstado(item.estado_cobro_id)" dark>
                                                {{ item.estado_cobro_id == 1 ? 'Pendiente de Cobro' : 'Cobrada' }}
                                            </v-chip>
                                        </template>

                                    </v-data-table>
                                    <v-alert text dense color="warning" icon="mdi-cash" border="left" class="mb-0"
                                        v-if="procedimientos.ayudasDX && procedimientos.ayudasDX.length">
                                        <strong>Ayudas Diagnosticas Total de Cobro {{
                                            formatoPesosCOP(procedimientos.ayudasDX?.[0]?.valor || 0) }}</strong>
                                    </v-alert>
                                    <v-data-table :headers="headerAgrupador" :items="procedimientos.ayudasDX"
                                        :search="search"
                                        v-if="procedimientos.ayudasDX && procedimientos.ayudasDX.length">
                                        <template v-slot:item.tipo="{ item }">
                                            <v-chip :color="getColor(item.tipo)" dark>
                                                {{ item.tipo == 'cuota' ? 'Cuota Moderadora' : item.tipo }}
                                            </v-chip>
                                        </template>

                                        <template v-slot:item.prestador="{ item }">
                                            {{ item.prestador == null ? 'Sin Direccionamiento' : item.prestador }}
                                        </template>

                                        <template v-slot:item.estado_cobro="{ item }">
                                            <v-chip :color="getColorEstado(item.estado_cobro_id)" dark>
                                                {{ item.estado_cobro_id == 1 ? 'Pendiente de Cobro' : 'Cobrada' }}
                                            </v-chip>
                                        </template>

                                    </v-data-table>
                                    <v-alert text dense color="warning" icon="mdi-cash" border="left" class="mb-0"
                                        v-if="procedimientos.individuales && procedimientos.individuales.length">
                                        <strong>Otros Servicios Total de Cobro {{
                                            formatoPesosCOP(procedimientos.total_individuales) }}</strong>
                                    </v-alert>
                                    <v-data-table :headers="headerCobro" :items="procedimientos.individuales"
                                        :search="search"
                                        v-if="procedimientos.individuales && procedimientos.individuales.length">
                                        <template v-slot:item.tipo="{ item }">
                                            <v-chip :color="getColor(item.tipo)" dark>
                                                {{ item.tipo == 'cuota' ? 'Cuota Moderadora' : item.tipo }}
                                            </v-chip>
                                        </template>

                                        <template v-slot:item.estado_id="{ item }">
                                            <v-chip :color="getColorEstadoOrden(item.estado_id)" dark>
                                                {{ item.estado_id == 1 ? 'Activo' : item.estado_id == 4
                                                    ? 'Autorizada' : 'Pendiente por Autorizar' }}
                                            </v-chip>
                                        </template>

                                        <template v-slot:item.prestador="{ item }">
                                            {{ item.prestador == null ? 'Sin Direccionamiento' : item.prestador }}
                                        </template>

                                        <template v-slot:item.estado_cobro="{ item }">
                                            <v-chip :color="getColorEstado(item.estado_cobro_id)" dark>
                                                {{ item.estado_cobro_id == 1 ? 'Pendiente de Cobro' : 'Cobrada' }}
                                            </v-chip>
                                        </template>

                                        <template v-slot:item.valor="{ item }">
                                            {{ formatoPesosCOP(item.valor) }}
                                        </template>
                                    </v-data-table>
                                </slot>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import {
    mapActions
} from "vuex";

export default {
    components: {
        EditarAfiliadoComponente,
    },
    data() {
        return {
            datosAnuales: {},
            selectedLaboratorios: [],
            selectedAyudasDX: [],
            selectedIndividuales: [],
            acumuladoAnualAfiliado: 0,
            medioPagos: [
                'EFECTIVO',
                'CONSIGNACION',
                'TRANSFERENCIA',
                'TARJETA CREDITO',
                'TARJETA DEBITO'
            ],
            medioPagoSeleccionado: null,
            cobroSeleccionado: null,
            dialogCobro: false,
            servicios: [],
            serviciosCobrar: [],
            procedimientos: [],
            datosBuscarAfiliado: {
                numero_documento: null,
                tipo_documento: null,
            },
            afiliado: null,
            tiposDocumentos: [],
            search: '',
            loading: false,
            headerAgrupador: [{
                text: 'Codigo',
                value: 'codigoServicio',
                align: 'center'

            },
            {
                text: 'Servicio',
                value: 'servicio',
                align: 'center'
            },
            {
                text: 'Direccionada',
                value: 'prestador',
                align: 'center'
            },
            {
                text: 'Tipo',
                value: 'tipo',
                align: 'center'
            },
            {
                text: 'Estado de Cobro',
                value: 'estado_cobro',
                align: 'center'
            },
            ],
            headerCobro: [{
                text: 'Codigo',
                value: 'codigoServicio',
                align: 'start'
            }, {
                text: 'Servicio',
                value: 'servicio',
                align: 'start'
            },
            {
                text: 'Direccionada',
                value: 'prestador',
                align: 'center'
            },
            {
                text: 'Tipo',
                value: 'tipo',
                align: 'center'
            },
            {
                text: 'Valor',
                value: 'valor',
                align: 'start'
            },
            {
                text: 'Estado de Orden',
                value: 'estado_id',
                align: 'center'
            },
            {
                text: 'Estado de Cobro',
                value: 'estado_cobro',
                align: 'center'
            },
            ]
        }
    },
    mounted() {
        this.listarTiposDocumentos();
    },
    watch: {
        dialogCobro(val) {
            if (val) {
                this.selectedLaboratorios = [...(this.serviciosCobrar.laboratorios || [])];
                this.selectedAyudasDX = [...(this.serviciosCobrar.ayudasDX || [])];
                this.selectedIndividuales = [...(this.serviciosCobrar.individuales || [])];
            }
        }
    },
    computed: {
        // Aplica topes subsidiados si corresponde
        topeEvento() {
            return this.afiliado?.tipo_afiliacion_id === 2
                ? this.datosAnuales?.copago_subsidiado_tope_evento
                : this.datosAnuales?.tope_evento;
        },
        topeAnual() {
            return this.afiliado?.tipo_afiliacion_id === 2
                ? this.datosAnuales?.copago_subsidiado_tope_anual
                : this.datosAnuales?.tope_anual;
        },
        mensajeAlerta() {
            if (this.acumuladoAnualAfiliado >= this.topeAnual) {
                return 'Alerta: Afiliado ha alcanzado el tope anual.';
            }
            return 'Afiliado no a superado ningun tope.';
        },
        colorAlerta() {
            if (this.acumuladoAnualAfiliado >= this.topeAnual) {
                return 'red darken-2';
            }
            return 'teal';
        },
        totalCobroSeleccionado() {
            const totalLab = this.selectedLaboratorios.length > 0 ? (this.selectedLaboratorios[0].valor || 0) : 0;
            const totalAyudas = this.selectedAyudasDX.length > 0 ? (this.selectedAyudasDX[0].valor || 0) : 0;
            const totalInd = this.selectedIndividuales.reduce((acc, item) => acc + (item.valor || 0), 0);
            return totalLab + totalAyudas + totalInd;
        }

    },

    filters: {
        pesoFormat: (valor) => `${new Intl.NumberFormat().format(valor) || 0}`
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
            this.$axios
                .get(
                    `/afiliados/${this.datosBuscarAfiliado.numero_documento}/${this.datosBuscarAfiliado.tipo_documento}`
                )
                .then((res) => {
                    this.afiliado = res.data;
                    this.serviciosVigentes(res.data.id);
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
        serviciosVigentes(id) {
            this.setPreload(true)
            this.$axios.get('ordenamiento/servicios-vigentes-admision/' + id).then(res => {
                this.servicios = res.data;
                this.acumuladoAnual(id);
            }).catch((error) => console.log(error.response)).finally(() => this.setPreload(false));
        },

        ordenesPorCobrar(consulta_id) {
            this.setPreload(true)
            this.$axios.get('ordenamiento/ordenes-por-cobrar/' + consulta_id).then(res => {
                this.procedimientos = res.data;
            }).catch((error) => console.log(error.response)).finally(() => this.setPreload(false));
        },

        acumuladoAnual(id) {
            this.setPreload(true)
            this.$axios.get('cobro-servicio/acumulado-anual/' + id).then(res => {
                this.datosAnuales = res.data.valores
                this.acumuladoAnualAfiliado = res.data.acumulado
            }).catch((error) => console.log(error.response)).finally(() => this.setPreload(false));
        },
        async guardarRecaudo() {
            const totalCobro = this.totalCobroSeleccionado;

            if (!this.medioPagoSeleccionado && totalCobro > 0) {
                return this.$toast.error('El campo "Medio Pago" es requerido.');
            }

            if (totalCobro === 0) {
                return this.$toast.error('Debe seleccionar al menos un servicio para cobrar.');
            }

            const result = await this.$swal.fire({
                title: '¿Está seguro?',
                text: `Está a punto de cobrar el recaudo por un total de ${this.formatoPesosCOP(totalCobro)}.`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, Cobrar',
                cancelButtonText: 'Cancelar'
            });

            if (!result.value && !result.isConfirmed) return;

            const ordenesSeleccionadas = [];

            this.selectedLaboratorios.forEach(lab => {
                if (Array.isArray(lab.detalles)) {
                    lab.detalles.forEach(det => {
                        if (det.orden_procedimiento_id) {
                            ordenesSeleccionadas.push(det.orden_procedimiento_id);
                        }
                    });
                }
            });

            this.selectedAyudasDX.forEach(ayuda => {
                if (Array.isArray(ayuda.detalles)) {
                    ayuda.detalles.forEach(det => {
                        if (det.orden_procedimiento_id) {
                            ordenesSeleccionadas.push(det.orden_procedimiento_id);
                        }
                    });
                }
            });

            this.selectedIndividuales.forEach(item => {
                if (item.orden_procedimiento_id) {
                    ordenesSeleccionadas.push(item.orden_procedimiento_id);
                }
            });

            if (ordenesSeleccionadas.length === 0) {
                return this.$toast.error('No se encontraron órdenes válidas para cobrar.');
            }

            this.setPreload(true);

            this.$axios.post('ordenamiento/cobro-servicio/' + this.afiliado.id, {
                medio_pago: this.medioPagoSeleccionado,
                valor: totalCobro,
                servicios: ordenesSeleccionadas,
            }).then(res => {
                this.$toast.success("Cobro Efectuado con éxito.");
                this.serviciosVigentes(this.afiliado.id);
                this.imprimirRecibo(res.data);
                this.medioPagoSeleccionado = null;
                this.dialogCobro = false;
                this.selectedLaboratorios = [];
                this.selectedAyudasDX = [];
                this.selectedIndividuales = [];
            }).catch((error) => console.log(error.response))
                .finally(() => this.setPreload(false));
        },

        validarAsistencia(consulta_id) {
            this.setPreload(true)
            this.$axios.get('ordenamiento/ordenes-a-cobrar/' + consulta_id).then(res => {
                this.serviciosCobrar = res.data;
                this.dialogCobro = true
            }).catch((error) => console.log(error.response)).finally(() => this.setPreload(false));
        },

        imprimirRecibo(item) {
				let pdf = {
					tipo: "reciboCaja",
					cobro_factura_id: item.id,
				};
				this.setPreload(true);

				this.$axios
					.post("/pdf", pdf, {
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
					.catch((res) => {
						this.$toast.error("Error al generar el pdf");
					})
					.finally(() => {
						this.setPreload(false);
					});
			},

        getColor(tipo) {
            if (tipo === 'cuota') {
                return 'success';
            } else if (tipo === 'Exento') {
                return 'orange';
            } else {
                return 'green';
            }
        },

        getColorEstado(estado_id) {
            if (estado_id === 1) {
                return 'red';
            } else if (estado_id === 14) {
                return 'success';
            } else {
                return 'grey';
            }
        },

        formatoPesosCOP(valor) {
            if (!valor && valor !== 0) return '$0'
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(valor)
        },

        formatearFecha(fecha) {
            if (!fecha) return 'N/A'
            return new Date(fecha).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            })
        },

        getColorEstadoOrden(estado_id) {
            if (estado_id === 1 || estado_id === 4) {
                return 'orange';
            } else if (estado_id === 3) {
                return 'red';
            } else {
                return 'grey';
            }
        }
    }
}
</script>
