<template>
    <v-card>
        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                        <span>Servicios a facturar</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-card-title>

        <v-card-text class="mb-6">
            <v-row dense>
                <v-col cols="12" md="4">
                    <v-text-field v-model="filtros.documento" dense outlined label="Documento"></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="filtros.cup" dense outlined label="Codigo cup"></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                    <v-autocomplete v-model="filtros.estado" :items="estados" item-text="text" item-value="value" dense
                        outlined label="Estado" clearable></v-autocomplete>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col cols="12" md="6">
                    <v-text-field v-model="filtros.fecha_inicio" dense outlined label="Fecha de inicio"
                        type="date"></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="filtros.fecha_final" dense outlined label="Fecha de final"
                        type="date"></v-text-field>
                </v-col>
            </v-row>

            <div class="d-block d-md-flex justify-md-space-between">
                <v-btn class="mb-3 mb-md-0" :block="$vuetify.breakpoint.smAndDown" outlined color="success"
                    :disabled="bolsa.length === 0" @click="dialogs.bolsa = true">
                    {{ bolsa.length }} ítems seleccionados
                    <v-icon small class="ml-2">
                        mdi-eye
                    </v-icon>
                </v-btn>

                <div>
                    <v-btn class="mb-3 mb-md-0" :block="$vuetify.breakpoint.smAndDown" outlined color="primary"
                        @click="limpiarFiltros">
                        Limpiar filtros
                        <v-icon small class="ml-2">
                            mdi-close-thick
                        </v-icon>
                    </v-btn>

                    <v-btn class="mb-3 mb-md-0" :block="$vuetify.breakpoint.smAndDown" color="primary">
                        Buscar
                        <v-icon small class="ml-2">
                            mdi-magnify
                        </v-icon>
                    </v-btn>
                </div>
            </div>

        </v-card-text>

        <v-data-table dense :headers="headers" :items="facturasRadicadas" v-model="selectedItems" :loading="loading">

            <template v-slot:item.seleccionado="{ item }">
                <v-hover v-slot="{ hover }" v-if="enBolsa(item)">
                    <v-icon :color="hover ? 'red' : 'green'" @click="eliminarDeBolsa(item)">
                        {{ hover ? 'mdi-close' : 'mdi-check' }}
                    </v-icon>
                </v-hover>

                <v-icon color="primary" v-else @click="agregarABolsa(item)">
                    mdi-plus
                </v-icon>
            </template>

            <template v-slot:item.contrato="{ item }">
                <span>{{ item.contrato === "12076-031-2024" ? "Capita" : "Evento" }}</span>
            </template>

            <template v-slot:item.actions="{ item }">
                <div class="d-flex align-center">
                    <v-icon color="blue" class="mx-1" @click="imprimir(item)">
                        mdi-clipboard-plus
                    </v-icon>
                    <v-icon color="purple" class="mx-1" @click="printCertificadoMedico(item)">
                        mdi-certificate
                    </v-icon>
                </div>
            </template>

            <template v-slot:item.estado="{ item }">
                <v-chip v-if="item.estado" small color="success" dark
                    :to="'/facturacion/factura/' + item.factura_unique">
                    Facturado
                </v-chip>
                <v-chip v-else small color="error" dark>
                    Pendiente
                </v-chip>
            </template>

            <template v-slot:item.valor_cup="{ item }">
                {{ $formatPesos(item.valor_cup, 2) }}
            </template>

            <!-- <template v-slot:item.data-table-select="{ isSelected, select, item }">
                    <v-simple-checkbox v-model="isSelected" :disabled="item.estado"
                        @click.stop="select($event)" />
                </template> -->

        </v-data-table>

        <v-dialog v-model="dialogPreFactura" persistent max-width="1290">
            <v-card>
                <template #title>
                    <span>Vista Previa de Pre-Factura</span>
                </template>

                <div class="pdf-preview">
                    <!-- Encabezado -->
                    <div class="header" style="text-align: center">
                        <img src="/images/sumi.png" class="logo" />
                        <!-- <h2><strong>PRE FACTURA ELECTRÓNICA</strong></h2> -->
                        <h3><strong>SUMIMEDICAL S.A.S.</strong></h3>
                        <h4><strong>NIT: 900.033.371-4</strong></h4>
                        <h4><strong>Cr 80C 32EE 65</strong></h4>
                        <h4><strong>Tel: (604) 5201040</strong></h4>
                        <h4><strong>Medellín - Colombia</strong></h4>
                        <h4><strong>auxiliar.contable4@sumimedical.com</strong></h4>
                        <hr />
                    </div>
                    <h2>
                        Fecha facturación: <span>{{ fechaFacturacion }}</span>
                    </h2>
                    <table class="detalle-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Cant.</th>
                                <th>Vr Unit.</th>
                                <!-- <th>Total</th> -->
                            </tr>
                        </thead>
                        <tbody v-if="conceptoFacturacion === null && datosAfacturar.length > 0">
                            <tr v-for="(item, index) in datosAfacturar" :key="item.id">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.codigo_cup }}</td>
                                <td>{{ item.descripcion_cup }}</td>
                                <td>{{ item.cantidad_cup }}</td>
                                <td>{{ formatMoney(item.valor_cup) }}</td>
                                <!-- <td>
                                    {{ formatMoney(Number(totalFactura) * Number(item.cantidad_cup)) }}
                                </td> -->
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><strong>TOTAL:</strong> {{ formatMoney(totalFactura) }}</td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td>1</td>
                                <td></td>
                                <td>{{ conceptoFacturacion }}</td>
                                <td>1</td>
                                <td>{{ formatMoney(totalFactura) }}</td>
                                <!-- <td>
                                    {{ formatMoney(Number(totalFactura) * Number(item.cantidad_cup)) }}
                                </td> -->
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><strong>TOTAL:</strong> {{ formatMoney(totalFactura) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <pre>{{ nombreConceptoFactura }}</pre>
                </div>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark @click="cancelarFacturacion()">
                        Cancelar
                    </v-btn>
                    <v-btn color="success" @click="facturar()">
                        Facturar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConcepto" persistent max-width="600px">
            <v-card>
                <v-alert border="top" colored-border type="success" elevation="1">
                    Crear nuevo concepto de facturacion electronica.
                </v-alert>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="nombreConceptoFactura" label="Nombre del concepto">
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" small dark @click="dialogConcepto = false">
                        Cancelar
                    </v-btn>
                    <v-btn color="success" small dark @click="radicarConceptoFactura()">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogs.bolsa" :max-width="$vuetify.breakpoint.smAndDown ? '100%' : '70%'">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Ítems en bolsa</span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialogs.bolsa = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-data-table :headers="headers" :items="bolsa" dense>
                        <template v-slot:item.seleccionado="{ item }">
                            <v-icon color="red" @click="eliminarDeBolsa(item)">
                                mdi-close
                            </v-icon>
                        </template>

                        <template v-slot:item.contrato="{ item }">
                            <span>{{ item.contrato === "12076-031-2024" ? "Capita" : "Evento" }}</span>
                        </template>

                        <template v-slot:item.actions="{ item }">
                            <div class="d-flex align-center">
                                <v-icon color="blue" class="mx-1" @click="imprimir(item)">
                                    mdi-clipboard-plus
                                </v-icon>
                                <v-icon color="purple" class="mx-1" @click="printCertificadoMedico(item)">
                                    mdi-certificate
                                </v-icon>
                            </div>
                        </template>

                        <template v-slot:item.estado="{ item }">
                            <v-chip v-if="item.estado" small color="success" dark
                                :to="'/facturacion/factura/' + item.factura_unique">
                                Facturado
                            </v-chip>
                            <v-chip v-else small color="error" dark>
                                Pendiente
                            </v-chip>
                        </template>

                        <template v-slot:item.valor_cup="{ item }">
                            {{ $formatPesos(item.valor_cup, 2) }}
                        </template>
                    </v-data-table>
                </v-card-text>
                <v-card-actions class="card-footer">
                    <span class="text-h6 text-md-h4"><strong>Total:</strong>{{ $formatPesos(totalBolsa, 2) }}</span>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" outlined @click="dialogs.bolsa = false">cerrar</v-btn>
                    <v-btn color="success">Agregar a factura</v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>

        <v-btn fab color="success" dark fixed bottom right @click="accion">
            <v-icon>mdi-currency-usd</v-icon>
        </v-btn>

    </v-card>
</template>

<script>
import JSZip from "jszip";
import { saveAs } from "file-saver";
import AppCard7 from "@/components/ui/application/appcard/AppCard7.vue";

export default {

    name: "FacturacionPendientes",

    components: {
        AppCard7,
    },
    data() {
        return {
            multiusuario: false,
            estados: [
                { text: "Todos", value: null },
                { text: "Facturado", value: true },
                { text: "Pendiente", value: false },
            ],
            filtros: {
                documento: null,
                cup: null,
                estado: null,
                fecha_inicio: null,
                fecha_final: null,
            },
            bolsa: [],
            dialogs: {
                bolsa: false,
            },
            itemConceptos: [],
            nombreConceptoFactura: null,
            dialogConcepto: false,
            conceptoFacturacion: null,
            fechaFacturacion: null,
            monto: 0,
            displayMonto: "",
            dialogPreFactura: false,
            selectedItems: [],
            loading: false,
            search: "",
            page: 1,
            itemsPerPage: 10,
            totalItems: 0,
            facturasRadicadas: [],
            itemsPerPage: 70,
            loading5: false,
            stats: [
                {
                    title: "TOTAL COBRADO",
                    value: 0,
                    diff: 0,
                    graphValues: [12143, 11143, 13143, 12143, 12143, 12143, 13748],
                },
                {
                    title: "Pendientes X factura electronica",
                    value: 0,
                    diff: 0,
                    graphValues: [25, 22, 21, 18, 21, 20, 22.42],
                },
            ],
            headers: {
                bolsa: [
                    {
                        text: "En bolsa",
                        value: "seleccionado",
                        sortable: false,
                    },
                    {
                        text: "Afiliado",
                        value: "numero_documento",
                    },
                    {
                        text: "Contrato",
                        value: "contrato",
                    },
                    {
                        text: "Dx",
                        value: "codigo_diagnostico",
                    },
                    {
                        text: "Codigo Cup",
                        value: "codigo_cup",
                    },
                    {
                        text: "Cup",
                        value: "descripcion_cup",
                    },
                    {
                        text: "Cantidad",
                        value: "cantidad_cup",
                    },
                    {
                        text: "Valor",
                        value: "valor_cup",
                    },
                    {
                        text: "Estado",
                        value: "estado",
                    },
                    {
                        text: "Acciones",
                        value: "actions",
                        sortable: false,
                    },
                ]
            },
            headers: [
                {
                    text: "En bolsa",
                    value: "seleccionado",
                    sortable: false,
                },
                // {
                //     text: "ID",
                //     value: "id",
                // },
                // {
                //     text: "consulta_id",
                //     value: "consulta_id",
                // },
                {
                    text: "Afiliado",
                    value: "numero_documento",
                },
                {
                    text: "Contrato",
                    value: "contrato",
                },
                {
                    text: "Dx",
                    value: "codigo_diagnostico",
                },
                {
                    text: "Codigo Cup",
                    value: "codigo_cup",
                },
                {
                    text: "Cup",
                    value: "descripcion_cup",
                },
                {
                    text: "Cantidad",
                    value: "cantidad_cup",
                },
                {
                    text: "Valor",
                    value: "valor_cup",
                },
                {
                    text: "Estado",
                    value: "estado",
                },
                {
                    text: "Acciones",
                    value: "actions",
                    sortable: false,
                },
            ],
            fechaDesde: null,
            fechaHasta: null,
            menuDesde: false,
            menuHasta: false,
            datosAfacturar: [],
            fechaRules: [(v) => !!v || "La fecha de facturación es requerida"],
            montoRules: [
                (v) => {
                    if (this.conceptoFacturacion != null) {
                        return (
                            !!v || "El monto es requerido cuando hay concepto de facturación"
                        );
                    }
                    return true;
                },
            ],
        };
    },
    watch: {
        page() {
            this.listar();
        },
        itemsPerPage() {
            this.page = 1;
            this.listar();
        },
    },
    created() {
        this.listar();
        this.listarConceptoFactura();
    },
    computed: {
        totalBolsa() {
            return this.bolsa.reduce((sum, item) => sum + Number(item.valor_cup) * Number(item.cantidad_cup), 0);
        },
        totalFactura() {
            if (this.conceptoFacturacion != null) {
                return this.monto || 0; // valor manual ingresado
            }

            return this.datosAfacturar.reduce((sum, item) => {
                return sum + Number(item.valor_cup) * Number(item.cantidad_cup);
            }, 0);
        },
    },
    methods: {
        async listar() {
            try {                               
                this.loading = true;
                const response = await this.$axios.get("/facturacion-electronica/facturas-pendientes", { params: {
                    ...this.filtros
                } });
                this.facturasRadicadas = response.data;
            } catch (e) {
                console.error(e);
                this.$toast.error("Error cargando facturas");
            } finally {
                this.loading = false;
            }
        },

        customFilter(value, search, item) {
            if (!search) return true;
            search = search.toLowerCase();
            const estado = item.estado_factura_sisma ? "true" : "false";
            return (
                estado.includes(search) ||
                (item.numero_documento &&
                    item.numero_documento.toLowerCase().includes(search)) ||
                (item.estudio && item.estudio.toLowerCase().includes(search)) ||
                (item.descripcion && item.descripcion.toLowerCase().includes(search)) ||
                (item.entidad_nombre &&
                    item.entidad_nombre.toLowerCase().includes(search)) ||
                (item.fechaIngreso && item.fechaIngreso.toLowerCase().includes(search))
            );
        },
        rowStyle(item) {
            return item.numero_factura ? "background-color: #a8e6a3;" : "";
        },
        async consultarEstudio(estudio, item) {
            this.setPreload(true);
            try {
                const res = await this.$axios.post(
                    "/ordenamiento/validar-estado-factura",
                    {
                        estudio: item.estudio,
                    }
                );
                const data = res.data;
                this.setPreload(false);

                if (data.numeroFactura && data.pdf) {
                    const confirm = await this.$swal({
                        title: "Factura generada",
                        text: data.numeroFactura,
                        icon: "success",
                        confirmButtonText: "Imprimir",
                        showCancelButton: true,
                        cancelButtonText: "Cerrar",
                    });
                    if (!confirm.value) return;
                    this.setPreload(true);
                    const zip = new JSZip();
                    const zipFactura = zip.folder("soportes");
                    const zipSoportes = zip.folder("soportes");
                    const pdfBytes = Uint8Array.from(atob(data.pdf), (c) =>
                        c.charCodeAt(0)
                    );
                    zipFactura.file(`FVS_9000333714_${data.numeroFactura}.pdf`, pdfBytes);

                    if (data.xml) {
                        zipFactura.file(`${data.numeroFactura}.xml`, data.xml);
                    }

                    if (!item.consulta_id) {
                        return this.$swal(
                            "Error",
                            "No se encontró el ID de consulta",
                            "error"
                        );
                    }

                    const datos = {
                        consulta_id: item.consulta_id,
                        numero_factura: data.numeroFactura,
                    };
                    const historia = await this.obtenerHistoriaClinicaBlob(datos);
                    const cert = await this.obtenerCertificadoMedicoBlob(datos);
                    if (historia)
                        zipSoportes.file(
                            `HEV_9000333714_${data.numeroFactura}.pdf`,
                            historia
                        );
                    if (cert)
                        zipSoportes.file(`CRC_9000333714_${data.numeroFactura}.pdf`, cert);

                    const zipBlob = await zip.generateAsync({
                        type: "blob",
                    });
                    saveAs(zipBlob, `soportes_${data.numeroFactura}.zip`);
                    this.actualizarEstudioHorus({
                        estudio,
                        numeroFactura: data.numeroFactura,
                    });
                    this.setPreload(false);
                } else {
                    this.$swal(
                        "Aviso",
                        data.message || "Respuesta inesperada",
                        "warning"
                    );
                    this.setPreload(false);
                }
            } catch (e) {
                console.error(e);
                this.setPreload(false);
            }
        },
        async obtenerHistoriaClinicaBlob(item) {
            try {
                const res = await this.$axios.post(
                    "/pdf",
                    {
                        tipo: "historia",
                        consulta: item.consulta_id,
                    },
                    {
                        responseType: "arraybuffer",
                    }
                );
                return res.data;
            } catch (e) {
                console.error(e);
                return null;
            }
        },
        async obtenerCertificadoMedicoBlob(item) {
            try {
                const res = await this.$axios.post(
                    "/pdf",
                    {
                        tipo: "certificadoAtencionMedica",
                        consulta: item.consulta_id,
                        correo: null,
                    },
                    {
                        responseType: "arraybuffer",
                    }
                );
                return res.data;
            } catch (e) {
                console.error(e);
                return null;
            }
        },
        imprimir(item) {
            this.setPreload(true);
            this.$axios
                .post(
                    "/pdf",
                    {
                        tipo: "historia",
                        consulta: item.consulta_id,
                    },
                    {
                        responseType: "arraybuffer",
                    }
                )
                .then((res) => {
                    this.setPreload(false);
                    const blob = new Blob([res.data], {
                        type: "application/pdf",
                    });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute(
                        "download",
                        `HEV_9000333714_${item.numero_factura}.pdf`
                    );
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    setTimeout(() => window.URL.revokeObjectURL(url), 100);
                })
                .catch(console.error);
        },

        obtenerFirmarAfiliados(datos) {
            this.$axios
                .get("/facturasSisma/obtenerFirmasAfiliados")
                .then(() => {
                    this.$toast.success("Se actualizó el estudio correctamente");
                    this.listar();
                })
                .catch(console.error);
        },

        printCertificadoMedico(item) {
            // this.setPreload(true);
            this.$axios
                .post(
                    "/pdf",
                    {
                        tipo: "certificadoAtencionMedica",
                        consulta: item.consulta_id,
                        correo: null,
                    },
                    {
                        responseType: "arraybuffer",
                    }
                )
                .then((res) => {
                    // this.setPreload(false);
                    const blob = new Blob([res.data], {
                        type: "application/pdf",
                    });
                    const link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    link.setAttribute(
                        "download",
                        `CRC_9000333714_${item.numero_factura}.pdf`
                    );
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                })
                .catch(console.error);
        },

        formatMoney(value) {
            return new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
            })
                .format(value)
                .replace("COP", "")
                .trim();
        },

        cancelarFacturacion() {
            this.dialogPreFactura = false;
            this.selectedItems = [];
            this.conceptoFacturacion = null;
            this.fechaFacturacion = null;
            this.monto = null;
        },

        modalPreFactura() {
            if (this.selectedItems.length === 0) {
                this.$toast.warning("No hay ítems seleccionados para facturar.");
                return;
            }
            if (this.fechaFacturacion === null) {
                this.$toast.error("Debe ingresar la fecha de facturación.");
                return;

            }
            this.dialogPreFactura = true;
            const conceptoNombre =
                this.itemConceptos[0]?.nombre || "Concepto no definido";
            // Aquí puedes enviar al backend o procesar internamente
            const payload = this.selectedItems.map((item) => ({
                id: item.id,
                consulta_id: item.consulta_id,
                numero_documento: item.numero_documento,
                contrato: item.contrato,
                codigo_cup: item.codigo_cup,
                descripcion_cup: item.descripcion_cup,
                cantidad_cup: item.cantidad_cup,
                valor_cup: item.valor_cup,
                codigo_diagnostico: item.codigo_diagnostico,
                fecha_ingreso: item.fecha_ingreso,
                hora_ingreso: item.hora_ingreso,
                fecha_facturacion: this.fechaFacturacion,
            }));

            this.datosAfacturar = payload;
        },

        crearConcepto() {
            this.dialogConcepto = true;
        },

        radicarConceptoFactura() {
            const concepto = {
                nombre: this.nombreConceptoFactura,
            };
            this.$axios
                .post("/facturacion-electronica/crear-concepto", concepto)
                .then(() => {
                    this.$toast.success("Se creo el concepto correctamente");
                    this.dialogConcepto = false;
                    this.nombreConceptoFactura = null;
                    this.listarConceptoFactura();
                })
                .catch(console.error);
        },

        listarConceptoFactura() {
            this.$axios
                .get("/facturacion-electronica/listar-concepto")
                .then((res) => {
                    this.itemConceptos = res.data;
                })
                .catch(console.error);
        },
        formatearEnTiempoReal(value) {
            const rawValue = value.replace(/\D/g, "");
            const numero = parseInt(rawValue || "0", 10);
            this.monto = numero;
            this.displayMonto = numero.toLocaleString("de-DE");
        },

        validarFormulario() {
            const fechaValida = this.fechaRequerida(this.fechaFacturacion) === true;
            const montoValido = this.montoRequerido(this.monto) === true;

            if (!fechaValida) {
                this.$toast.error("Debe ingresar la fecha de facturación");
                return false;
            }
            if (!montoValido) {
                this.$toast.error(
                    "Debe ingresar el monto si hay concepto de facturación"
                );
                return false;
            }
            return true;
        },

        RadicarFacturaDian() {
            if (!this.validarFormulario()) return;

            const payload = {
                items: this.datosAfacturar,
                concepto: this.conceptoFacturacion,
                fecha_facturacion: this.fechaFacturacion,
                monto: this.conceptoFacturacion ? this.monto : undefined,
            };

            this.$axios
                .post("/facturacion-electronica/emitir-pre-factura", payload)
                .then(() => {
                    this.$toast.success("Facturación enviada a DIAN correctamente");
                    this.selectedItems = [];
                    this.dialogPreFactura = false;
                })
                .catch((error) => {
                    console.error(error);
                    this.$toast.error("Error al facturar en DIAN");
                });
        },

        async facturar() {

            const request = {
                'multiusuario': this.conceptoFacturacion === null ? false : true,
                'subtotal': this.totalFactura,
                'total': this.totalFactura,
                'fecha': this.fechaFacturacion
            }

            if (request.multiusuario) {
                request.detalles = [{
                    'descripcion': this.conceptoFacturacion,
                    'cantidad': 1,
                    'precio_unitario': this.totalFactura,
                    'total': this.totalFactura,
                    'items': this.datosAfacturar.map(item => {
                        return {
                            'registro_facturacion_id': item.id,
                        }
                    })
                }]
            } else {
                request.detalles = this.datosAfacturar.map(item => ({
                    'descripcion': item.descripcion_cup,
                    'cantidad': item.cantidad_cup,
                    'precio_unitario': Number(item.valor_cup),
                    'total': Number(item.valor_cup) * Number(item.cantidad_cup),
                    'id': item.id,
                }));
            }

            try {
                const response = await this.$axios.post('/facturacion/crear', request);
                this.$toast.success('Factura creada exitosamente');
            } catch (error) {
                this.$toast.error('Error al crear la factura');
            }

        },

        limpiarFiltros() {
            this.filtros = {
                documento: null,
                cup: null,
                estado: null,
                fecha_inicio: null,
                fecha_final: null,
            };
            // this.listar();
        },

        agregarABolsa(item) {
            if (this.enBolsa(item)) {
                return;
            }
            this.bolsa.push(item);
        },

        eliminarDeBolsa(item) {
            this.bolsa = this.bolsa.filter(b => b.id !== item.id);
        },

        enBolsa(item) {
            return this.bolsa.some(b => b.id === item.id);
        }

    },
};
</script>

<style scoped lang="scss">
.row-con-estudio {
    background-color: #651134 !important;
}

.custom-loader {
    animation: loader 1s infinite;
    display: flex;
}

@keyframes loader {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
}

.pdf-preview {
    font-family: "Arial", sans-serif;
    font-size: 12px;
    color: #000;
    padding: 20px;
}

.logo {
    width: 179px;
    margin-left: 30px;
    margin-top: 3px;
    float: inline-start;
}

.company-info,
.factura-info {
    display: inline-block;
    width: 45%;
    text-align: center;
}

.section-title {
    margin-top: 20px;
    font-weight: bold;
    background-color: #2e2c7e;
    color: white;
    padding: 4px;
}

.detalle-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.detalle-table th,
.detalle-table td {
    border: 1px solid black;
    padding: 4px;
    font-size: 12px;
    text-align: center;
}

.detalle-table th {
    background-color: #2e2c7e;
    color: white;
}

.totales {
    margin-top: 20px;
    text-align: right;
}

.firma,
.footer {
    margin-top: 30px;
    text-align: center;
}

.footer .nota {
    font-size: 10px;
    text-align: justify;
    margin: 10px auto;
}

.firma-footer {
    margin-top: 10px;
    font-size: 10px;
}

.card-footer {
    position: sticky;
    bottom: 0;
    background: white;
    /* 👈 para que no se vea superpuesto al texto */
    z-index: 1;
}
</style>
