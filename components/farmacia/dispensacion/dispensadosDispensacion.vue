dispensados dispensación
<template>
    <v-row dense class="mt-2">
        <v-col cols="12" sm="6" md="3">
            <v-text-field label="N° Orden" prepend-inner-icon="mdi-magnify" outlined dense v-model="filtro.ordenId">
            </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
            <v-autocomplete label="Producto" outlined dense v-model="filtro.codesumiId" :items="opcionesCodesumi"
                :loading="loading.opcionesCodesumi" :search-input.sync="campoBusquedaCodesumi"
                no-data-text="Ingrese el nombre del producto para iniciar la búsqueda." item-text="nombre"
                item-value="id"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="2">
            <v-menu dense v-model="menu.fechaInicio" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="filtro.fechaInicio" label="Fecha Inicial" prepend-inner-icon="mdi-calendar"
                        readonly dense outlined v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="filtro.fechaInicio" @input="menu.fechaInicio = false"></v-date-picker>
            </v-menu>
        </v-col>
        <v-col cols="12" sm="6" md="2">
            <v-menu dense v-model="menu.fechaFin" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="filtro.fechaFin" label="Fecha Final" prepend-inner-icon="mdi-calendar"
                        readonly dense outlined v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="filtro.fechaFin" @input="menu.fechaFin = false"></v-date-picker>
            </v-menu>
        </v-col>
        <v-col cols="12" sm="6" md="2" style="display: flex; gap: 0.2rem; justify-content: center">
            <v-btn color="primary" dark style="min-width: fit-content" @click="listarArticulosDispensados()"
                :loading="loading.articulosDispensados">Buscar</v-btn>
            <v-btn color="error" dark style="min-width: fit-content" :loading="loading.articulosDispensados"
                @click="limpiarFiltro()">Limpiar</v-btn>
        </v-col>
        <v-col cols="12" sm="12" md="12">
            <v-divider></v-divider>
        </v-col>
        <v-col cols="12" sm="12" md="12">
            <v-data-table dense :headers="headersArticulosDispensados" :items="articulosDispensados"
                :loading="loading.articulosDispensados" loading-text="Cargando... Por favor espere"
                no-data-text="Sin resultados">
                <template v-slot:[`item.created_at`]="{ item }">
                    {{ $moment(item.created_at).format("DD-MM-YYYY") }}
                </template>
                <template v-slot:[`item.cantidad`]="{ item }">
                    {{ sumarCantidadDispensada(item.detalle_movimientos) }}
                </template>
                <template v-slot:[`item.acciones`]="{ item }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon @click="descargarOrden(item)" color="success" v-bind="attrs" v-on="on">
                                mdi-file-download</v-icon>
                        </template>
                        <span>Descargar Comprobante de Entrega</span>
                    </v-tooltip>
					<v-tooltip bottom v-if="![1].includes(Number(tipoDispensacion))">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon @click="firmarOrden(item.orden.consulta, item.id)" color="primary" v-bind="attrs" v-on="on">
                                mdi-signature-image</v-icon>
                        </template>
                        <span>Firma Entrega</span>
                    </v-tooltip>

                </template>
                <template v-slot:[`item.firma`]="{ item }">
                    <v-chip small :color="getColor(item.firma_persona_recibe)" dark>
                        {{ item.firma_persona_recibe != null ? "Si" : "No" }}
                    </v-chip>
                </template>
            </v-data-table>
        </v-col>
        <v-dialog v-model="dialogoFirma" persistent fullscreen v-if="dialogoFirma">
            <v-card>
                <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
                    <b>Firma atención</b></v-alert>
                 <v-col cols="12" sm="12" md="12">
                                <v-row dense>
                                    <v-col cols="12" sm="12" md="12">
                                        <div class="firma mb-5">
                                            <h4 class="ml-3">Firma</h4>
                                            <vueSignature ref="signature" :sigOption="option" :w="'400'"></vueSignature>
                                            <v-card-actions>
                                                <!-- <v-spacer></v-spacer> -->
                                                <v-btn small color="warning" @click="clear">Limpiar</v-btn>
                                            </v-card-actions>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-col>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small dark @click="dialogoFirma=false,datosFirma={}, clear">Cancelar</v-btn>
                    <v-btn color="success" small dark @click="confirmarCita()">Guardar Firmas</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
    import {
        mapActions
    } from "vuex";
    import vueSignature from "vue-signature";
    export default {
        props: {
            afiliadoId: {
                type: Number,
                required: true,
            },

			tipoDispensacion: {
				type: Number,
                required: true,
			}
        },
        name: "dispensadosDispensacion",
        components: {
            vueSignature
        },
        data() {
            const ayer = new Date();
            ayer.setDate(ayer.getDate() - 1);
            const ayerFormateado = ayer.toISOString().substring(0, 10);
            const manana = new Date();
            manana.setDate(manana.getDate() + 1);
            const mananaFormateado = manana.toISOString().substring(0, 10);
            return {
                menu: {
                    fechaInicio: false,
                    fechaFin: false,
                },
                filtro: {
                    fechaInicio: ayerFormateado,
                    fechaFin: mananaFormateado,
                    ordenId: null,
                    codesumiId: null,
                },
                loading: {
                    articulosDispensados: false,
                    opcionesCodesumi: false,
                },
                articulosDispensados: [],
                id_firma: null,
                headersArticulosDispensados: [{
                        text: "N° Orden",
                        value: "orden_id",
                    },
                    {
                        text: "Producto",
                        value: "orden_articulo.codesumi.nombre",
                    },
                    {
                        text: "Cantidad",
                        value: "cantidad",
                        align: "center",
                    },
                    {
                        text: "Fecha de Dispensación",
                        value: "created_at",
                        align: "center",
                    },
                    {
                        text: "Bodega",
                        value: "bodega_origen.nombre",
                        align: "center",
                    },
                    {
                        text: "Tiene firma",
                        value: "firma",
                        align: "center",
                    },
                    {
                        text: "Acciones",
                        value: "acciones",
                        align: "center",
                        sortable: false,
                    },
                ],
                opcionesCodesumi: [],
                campoBusquedaCodesumi: null,
                dialogoFirma: false,
                option: {
                    penColor: "rgb(0, 0, 0)",
                    backgroundColor: "rgb(255,255,255)",
                },
                datosFirma: {}
            };
        },
        watch: {
            campoBusquedaCodesumi(newValue) {
                if (newValue && newValue.length === 4) {
                    this.listarOpcionesCodesumi();
                }
            },
        },
        mounted() {
            this.listarArticulosDispensados();
        },
        methods: {
            ...mapActions("app", ["setPreload"]),

            listarArticulosDispensados() {
                this.loading.articulosDispensados = true;
                this.$axios
                    .post(
                        `/ordenamiento/listarMovimientosDispensacion/${this.afiliadoId}`,
                        this.filtro
                    )
                    .then((res) => {
                        this.articulosDispensados = res.data;
                    })
                    .catch(() => {
                        this.$toast.error(
                            "Ocurrió un error al cargar los articulos dispensados"
                        );
                    })
                    .finally(() => {
                        this.loading.articulosDispensados = false;
                    });
            },

            limpiarFiltro() {
                const ayer = new Date();
                ayer.setDate(ayer.getDate() - 1);
                const ayerFormateado = ayer.toISOString().substring(0, 10);
                const manana = new Date();
                manana.setDate(manana.getDate() + 1);
                const mananaFormateado = manana.toISOString().substring(0, 10);
                this.filtro = {
                    fechaInicio: ayerFormateado,
                    fechaFin: mananaFormateado,
                    ordenId: null,
                    codesumiId: null,
                };
                this.listarArticulosDispensados();
            },

            sumarCantidadDispensada(detalles) {
                return detalles.reduce(
                    (acc, item) => acc + parseInt(item.cantidad_solicitada),
                    0
                );
            },

            descargarOrden(item) {
                this.setPreload(true);

                const data = {
                    detalles: {
                        id: item.orden_articulo_id,
                        movimiento: item.id,
                    },
                    filtro: 34,
                    tipo: "medicamentoDispensado",
                    id: item.id,
                };

                this.$axios
                    .post("/pdf", data, {
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
                    .catch(() => {
                        this.$toast.error("Ocurrio un error al descargar el archivo");
                    })
                    .finally(() => {
                        this.setPreload(false);
                    });
            },

            listarOpcionesCodesumi() {
                this.loading.opcionesCodesumi = true;
                this.$axios
                    .post("/codesumis/buscar", {
                        nombre: this.campoBusquedaCodesumi
                    })
                    .then((res) => {
                        this.opcionesCodesumi = res.data;
                    })
                    .catch((error) => {
                        this.$toast.error("Ocurrió un error al listar los productos");
                    })
                    .finally(() => {
                        this.loading.opcionesCodesumi = false;
                    });
            },

            firmarOrden(item,id) {
                this.datosFirma = item,
                this.id_firma = id
                this.dialogoFirma = true;
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
                if (this.$refs.signature.isEmpty()) {
                    this.$swal({
                        title: "¡Error!",
                        text: "Es necesaria la firma del paciente.",
                        type: "warning",
                    });
                    return;
                }
                this.preload = true;
                let formdata = new FormData();
                const firmaBase64 = this.$refs.signature.save();
                const firmaBase64Acompanante = this.$refs.signature2 && !this.$refs.signature2.isEmpty() ?
                    this.$refs.signature2.save() :
                    null;

                formdata.append("firma", firmaBase64);

                // Solo agregar "firmaAcompanante" si no es null
                if (firmaBase64Acompanante) {
                    formdata.append("firmaAcompanante", firmaBase64Acompanante);
                }

                formdata.append("movimiento", this.datosFirma.id);

                this.$axios
                    .post("/movimientos/guardarFirma/" + this.id_firma, formdata)
                    .then((res) => {
                        this.datosFirma = {};
                        this.dialogoFirma = false;
                        this.clear();
                        this.listarArticulosDispensados();
                    })
                    .catch((error) => {
                        this.$toast.error(error.response.data.mensaje);
                        console.log(error);
                    })
                    .finally(() => {
                        this.preload = false;
                    });
            },

            getColor(estado) {
                return estado != null ? "green" : "red";
            },

        },
    };

</script>

