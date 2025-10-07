<template>
    <v-card>
        <v-card-title>
            <div class="d-flex align-center">
                <img
                    src="/images/ojo.svg"
                    alt="Icono Proveedores"
                    height="50"
                    width="50"
                />
                <span class="ml-3"
                    >INFORMACIÓN BÁSICA DEL PROVEEDOR
                    {{ proveedor.nombre_proveedor }}</span
                >
            </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-col></v-col>
        <v-card-text>
            <v-form ref="form" v-model="formValidado">
                <v-row dense>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field
                            label="Nombre proveedor *"
                            outlined
                            v-model="proveedor.nombre_proveedor"
                            :rules="[rules.obligatorio]"
                            dense
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field
                            label="NIT *"
                            v-model="proveedor.nit"
                            outlined
                            dense
                            :rules="[rules.numerico]"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field
                            label="Nombre representante *"
                            v-model="proveedor.nombre_representante"
                            :rules="[rules.obligatorio]"
                            outlined
                            dense
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field
                            label="Telefono *"
                            v-model="proveedor.telefono"
                            outlined
                            :rules="[rules.obligatorio, rules.numerico]"
                            dense
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            label="Dirección *"
                            v-model="proveedor.direccion"
                            outlined
                            :rules="[rules.obligatorio]"
                            dense
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-autocomplete
                            label="Municipio *"
                            outlined
                            :items="municipios"
                            v-model="proveedor.municipio_id"
                            item-text="municipioYDepartamento"
                            item-value="id"
                            :rules="[rules.obligatorio]"
                            dense
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            label="E-Mail *"
                            v-model="proveedor.email"
                            outlined
                            :rules="[rules.obligatorio]"
                            dense
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-alert
                            color="blue-grey darken-3"
                            border="bottom"
                            type="info"
                            dense
                            text
                            icon="mdi-book-account"
                            class="text-center"
                        >
                            <v-row align="center" justify="center">
                                <v-col>
                                    <b>INFORMACIÓN JURÍDICA</b>
                                </v-col>
                            </v-row>
                        </v-alert>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-select
                            label="Tipo de Documento *"
                            :items="tipoDocumento"
                            item-text="nombre"
                            item-value="id"
                            v-model="proveedor.tipo_documento_legal"
                            dense
                            outlined
                        ></v-select>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete
                            label="Pais y Código del País*"
                            :items="paises"
                            item-text="paisYDane"
                            item-value="id"
                            v-model="proveedor.pais_id"
                            dense
                            outlined
                        ></v-autocomplete>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete
                            label="Codigo Obligación DIAN*"
                            :items="codigoObligacion"
                            item-text="nombre"
                            item-value="id"
                            v-model="proveedor.codigo_dian"
                            dense
                            outlined
                        ></v-autocomplete>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete
                            label="Responsabilidad Fiscal *"
                            :items="ResponsabilidadFiscal"
                            v-model="proveedor.responsabilidad_fiscal"
                            item-value="id"
                            item-text="nombre"
                            dense
                            outlined
                        ></v-autocomplete>
                    </v-col>

                    <v-col cols="12">
                        <v-alert
                            color="blue-grey darken-3"
                            border="bottom"
                            type="info"
                            dense
                            text
                            icon="mdi-folder-arrow-down-outline"
                            class="text-center"
                        >
                            <v-row align="center" justify="center">
                                <v-col>
                                    <b>ADJUNTOS</b>
                                </v-col>
                            </v-row>
                        </v-alert>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-file-input
                            label="Formato de conocimiento del Cliente - Proveedor *"
                            v-model="formData.adjuntoCliente.file"
                            dense
                            outlined
                            show-size
                            accept="application/pdf"
                        ></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-file-input
                            label="RUT *"
                            v-model="formData.adjuntoRut.file"
                            outlined
                            dense
                        ></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-file-input
                            label="Camara de comercio *"
                            v-model="formData.adjuntoCamara.file"
                            outlined
                            dense
                        ></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-file-input
                            label="Certificado de cuenta bancaria *"
                            v-model="formData.adjuntoCuentaB.file"
                            outlined
                            dense
                        ></v-file-input>
                    </v-col>

                    <v-row>
                        <v-col
                            v-for="adjunto in adjuntos"
                            :key="adjunto.id"
                            cols="12"
                            sm="6"
                            md="3"
                        >
                            <v-card-actions class="d-flex justify-center">
                                <v-btn
                                    v-if="[1, 2, 3, 4].includes(adjunto.tipo)"
                                    color="primary"
                                    small
                                    @click="AbrirAdjunto(adjunto.url)"
                                >
                                    Ver Adjunto
                                    <v-icon>mdi-download</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>

                    <v-col cols="12">
                        <v-alert
                            color="blue-grey darken-3"
                            border="bottom"
                            dense
                            text
                            icon="mdi-folder-arrow-down-outline"
                            class="text-center"
                        >
                            <v-row align="center" justify="center">
                                <v-col>
                                    <b>OTROS ADJUNTOS</b>
                                </v-col>
                            </v-row>
                        </v-alert>
                    </v-col>

                    <v-col cols="12">
                        <v-file-input
                            label="Otros adjuntos *"
                            :rules="[rules.obligatorio]"
                            dense
                            outlined
                            accept="application/pdf"
                        ></v-file-input>
                    </v-col>

                    <v-card-actions class="d-flex justify-center">
                        <template
                            v-for="adjunto in adjuntos.filter(
                                (a) => a.tipo === 5
                            )"
                        >
                            <v-btn
                                color="primary"
                                small
                                @click="AbrirAdjunto(adjunto.url)"
                            >
                                Ver Adjunto
                                <v-icon>mdi-download</v-icon>
                            </v-btn>
                        </template>
                    </v-card-actions>

                    <v-col cols="12">
                        <v-alert
                            color="blue-grey darken-3"
                            border="bottom"
                            dense
                            text
                            icon="mdi-cash"
                            class="text-center"
                        >
                            <v-row align="center" justify="center">
                                <v-col>
                                    <b>INFORMACIÓN DE NEGOCIO</b>
                                </v-col>
                            </v-row>
                        </v-alert>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-text-field
                            label="Actividad Economica *"
                            v-model="proveedor.actividad_economica"
                            :rules="[rules.obligatorio]"
                            outlined
                            dense
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete
                            label="Modalidad de Vinculación *"
                            :rules="[rules.obligatorio]"
                            :items="modadlidadVinculacion"
                            v-model="proveedor.modalidad_vinculacion"
                            item-text="modalidad"
                            outlined
                            dense
                        ></v-autocomplete>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-text-field
                            label="Forma de Pago (Días) *"
                            outlined
                            v-model="proveedor.forma_pago"
                            :rules="[rules.obligatorio, rules.numerico]"
                            dense
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete
                            label="Tiempo de Entrega *"
                            outlined
                            :rules="[rules.obligatorio]"
                            v-model="proveedor.tiempo_entrega"
                            :items="tiempoEntrega"
                            item-text="nombre"
                            item-value="nombre"
                            dense
                        ></v-autocomplete>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete
                            label="Area Responsable de Aprobación Factura *"
                            :rules="[rules.obligatorio]"
                            v-model="proveedor.area_id"
                            :items="areas"
                            item-text="nombre"
                            item-value="id"
                            outlined
                            dense
                        ></v-autocomplete>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete
                            label="Estado *"
                            :rules="[rules.obligatorio]"
                            :items="estado"
                            v-model="formData.estado"
                            item-text="estadoTexto"
                            item-value="id"
                            outlined
                            dense
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    label="Fecha de Ingreso *"
                                    dense
                                    outlined
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    :rules="[rules.obligatorio]"
                                    v-model="proveedor.fecha_ingreso"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="proveedor.fecha_ingreso"
                                @input="menu = false"
                                no-title
                                scrollable
                            ></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete
                            label="Tipo Proveedor *"
                            :items="tipoProveedor"
                            v-model="proveedor.tipo_proveedor"
                            :rules="[rules.obligatorio]"
                            item-text="nombre"
                            item-value="nombre"
                            outlined
                            dense
                        ></v-autocomplete>
                    </v-col>

                    <v-col cols="12">
                        <v-autocomplete
                            label="Linea *"
                            :rules="[rules.obligatorio]"
                            :items="lineas"
                            v-model="proveedor.linea_id"
                            item-text="nombre"
                            item-value="id"
                            outlined
                            dense
                        ></v-autocomplete>
                    </v-col>

                    <v-col cols="12">
                        <v-alert
                            color="blue-grey darken-3"
                            border="bottom"
                            dense
                            text
                            icon="mdi-cash"
                            class="text-center"
                        >
                            <v-row>
                                <v-col>
                                    <b>OBSERVACIONES</b>
                                </v-col>
                            </v-row>
                        </v-alert>
                    </v-col>

                    <v-col>
                        <v-textarea
                            dense
                            clearable
                            label="Observaciones *"
                            v-model="proveedor.observaciones"
                            :rules="[rules.obligatorio, rules.minCaracteres]"
                            outlined
                        >
                        </v-textarea>
                    </v-col>
                </v-row>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small @click="cerrarModal()"
                    >Cancelar</v-btn
                >
                <v-btn color="success" small @click="EnviarFormulario()"
                    >Guardar</v-btn
                >
            </v-card-actions>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
    props: {
        proveedor: Object,
    },
    data() {
        return {
            municipios: null,
            municipioYDepartamento: null,
            areas: null,
            lineas: null,
            lineaSeleccionada: 0,
            menu: null,
            fechaIngreso: null,
            formValidado: true,
            adjuntos: [],
            paises: [],
            paisYDane: null,
            ResponsabilidadFiscal: [
                { id: 1, nombre: "0-13 - Gran Contribuyente " },
                { id: 2, nombre: "0-15 - Autoretenedor " },
                { id: 3, nombre: "0-23 - Agente de retención IVA " },
                { id: 4, nombre: "0-47 - Régimen simple de tributación " },
                { id: 5, nombre: "R-99-PN - No responable " },
            ],
            codigoObligacion: [
                { id: 48, nombre: "Impuestos Sobre las Ventas" },
                { id: 49, nombre: "No responsable de IVA " },
                {
                    id: 50,
                    nombre: "No responsable de consumo restaurantes y bares ",
                },
            ],
            tipoProveedor: [
                { id: 1, nombre: "PERIÓDICO" },
                { id: 2, nombre: "ESPORÁDICO " },
            ],
            tiempoEntrega: [
                { id: 1, nombre: "15 Días" },
                { id: 2, nombre: "30 Días" },
                { id: 3, nombre: "60 Días" },
            ],
            estado: [
                { id: false, estadoTexto: "Inactivo" },
                { id: true, estadoTexto: "Activo" },
            ],
            modadlidadVinculacion: [
                { id: 1, modalidad: "Contrato" },
                { id: 2, modalidad: "Cotización" },
                { id: 3, modalidad: "Lista de precios" },
                { id: 4, modalidad: "Garantía" },
            ],

            rules: {
                obligatorio: (v) =>
                    (v !== null && v !== undefined && v !== "") ||
                    "Este campo es obligatorio.",
                minCaracteres: (v) =>
                    (v && v.length >= 5) ||
                    "Este campo debe tener al menos 5 caracteres.",
                noNegativo: (v) => v >= 0 || "Este campo no debe ser negativo",
                numerico: (v) => !isNaN(v) || "Este campo debe ser un número",
            },

            tipoDocumento: [
                { id: 11, nombre: "Registro Civil de Nacimiento " },
                { id: 12, nombre: "Tarjeta de identidad " },
                { id: 13, nombre: "Cédula de ciudadania " },
                { id: 14, nombre: "Certificado de la Registraduría " },
                { id: 15, nombre: "Sucesion Ilíquida " },
                { id: 21, nombre: "Tarjeta de Extranjería " },
                { id: 22, nombre: "Cédula de Extranjería " },
                { id: 31, nombre: "NIT " },
                { id: 33, nombre: "Identificación de Extranjeros " },
                { id: 41, nombre: "Pasaporte " },
                { id: 42, nombre: "Documento de Identificación Extranjero " },
                {
                    id: 43,
                    nombre: "Sin identificación del exterior o para uso definido por la DIAN ",
                },
                {
                    id: 44,
                    nombre: "Documento de Identificación Extranjero Persona Jurídica ",
                },
                { id: 46, nombre: "Carné Diplomático " },
            ],

            formData: {
                nombre_proveedor: "",
                nit: "",
                nombre_representante: "",
                telefono: "",
                direccion: "",
                municipio_id: null,
                email: "",
                actividad_economica: "",
                modalidad_vinculacion: null,
                forma_pago: "",
                tiempo_entrega: null,
                operador_seleccionado: null,
                estado: null,
                fecha_ingreso: null,
                tipo_proveedor: null,
                linea_id: null,
                observaciones: "",
                documentoSeleccionado: null,
                codigoDianSeleccionado: null,
                ResponsabilidadFiscalSeleccionada: null,
                pais_id: null,
                adjuntoRut: {
                    file: null,
                    tipo: 1,
                },
                adjuntoCamara: {
                    file: null,
                    tipo: 2,
                },
                adjuntoCliente: {
                    file: null,
                    tipo: 3,
                },
                adjuntoCuentaB: {
                    file: null,
                    tipo: 4,
                },
                adjuntoOtros: {
                    file: null,
                    tipo: 5,
                },
            },
        };
    },

    watch: {
        "proveedor.linea_id": function (val) {
            console.log("linea_id cambiado a:", val);
            this.cargarDatosProveedor();
            this.lineaSeleccionada = val;
        },
    },

    mounted() {
        console.log("Proveedor en mounted:", this.proveedor);
        this.cargarDatosProveedor();
        this.obtenerMunicipios();
        this.obtenerPais();
        this.traerAreas();
        this.traerLineas();
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        AbrirAdjunto(url) {
            window.open(url, "_blank");
        },

        obtenerMunicipios() {
            this.setPreload(true);
            this.$axios
                .get("/municipios/listar")
                .then((response) => {
                    this.municipios = response.data.map((municipio) => ({
                        ...municipio,
                        municipioYDepartamento: `${municipio.nombre} - ${municipio.departamento.nombre}`,
                    }));
                })
                .catch((error) => {
                    console.error("Error al obtener entidades:", error);
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        obtenerAdjuntos() {
            this.setPreload(true);
            this.$axios
                .get(
                    "/proveedores-compras/obtener-adjuntos/" + this.proveedor.id
                )
                .then((response) => {
                    this.adjuntos = response.data;
                })
                .catch((error) => {
                    this.$swal("El Proveedor no tiene adjuntos");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        cargarDatosProveedor() {
            this.formData = {
                nombre_proveedor: this.proveedor.nombre_proveedor || "",
                nit: this.proveedor.nit || "",
                nombre_representante: this.proveedor.nombre_representante || "",
                telefono: this.proveedor.telefono || "",
                direccion: this.proveedor.direccion || "",
                municipio_id: this.proveedor.municipio_id || null,
                email: this.proveedor.email || "",
                actividad_economica: this.proveedor.actividad_economica || "",
                modalidad_vinculacion:
                    this.proveedor.modalidad_vinculacion || null,
                forma_pago: this.proveedor.forma_pago || "",
                tiempo_entrega: this.proveedor.tiempo_entrega || null,
                operador_seleccionado:
                    this.proveedor.operador_seleccionado || null,
                estado: this.proveedor.estado || false,
                fecha_ingreso:
                    this.$moment(this.proveedor.fecha_ingreso).format("L") ||
                    null,
                tipo_proveedor: this.proveedor.tipo_proveedor || null,
                linea_id: this.proveedor.linea_id || null,
                observaciones: this.proveedor.observaciones || "",
                tipo_documento_legal:
                    this.proveedor.documentoSeleccionado || null,
                pais_id: this.proveedor.pais_id || null,
                adjuntoRut: { file: null, tipo: 1 },
                adjuntoCamara: { file: null, tipo: 2 },
                adjuntoCliente: { file: null, tipo: 3 },
                adjuntoCuentaB: { file: null, tipo: 4 },
            };
        },

        obtenerPais() {
            this.$axios
                .post("/pais/listar")
                .then((response) => {
                    this.paises = response.data.map((paises) => ({
                        ...paises,
                        paisYDane: `${paises.codigo_dane} - ${paises.nombre}`,
                    }));
                })
                .catch((error) => {
                    console.error("hubo un error", error);
                });
        },

        traerAreas() {
            this.setPreload(true);
            this.$axios
                .get("/areas-proveedores/listar-areas")
                .then((response) => {
                    this.areas = response.data;
                })
                .catch((error) => {
                    console.error("Error al las areas", error);
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        traerLineas() {
            this.setPreload(true);
            this.$axios
                .get("/lineas-compras/listar-lineas")
                .then((response) => {
                    this.lineas = response.data;
                })
                .catch((error) => {
                    console.error("Error al obtener las lineas");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        EnviarFormulario() {
            let formData2 = new FormData();

            formData2.append(
                "nombre_proveedor",
                this.proveedor.nombre_proveedor
            );
            formData2.append("nit", this.proveedor.nit);
            formData2.append(
                "nombre_representante",
                this.proveedor.nombre_representante
            );
            formData2.append("telefono", this.proveedor.telefono);
            formData2.append("direccion", this.proveedor.direccion);
            formData2.append("municipio_id", this.proveedor.municipio_id);
            formData2.append("email", this.proveedor.email);
            formData2.append(
                "actividad_economica",
                this.proveedor.actividad_economica
            );
            formData2.append(
                "modalidad_vinculacion",
                this.proveedor.modalidad_vinculacion
            );
            formData2.append("forma_pago", this.proveedor.forma_pago);
            formData2.append("tiempo_entrega", this.proveedor.tiempo_entrega);
            formData2.append(
                "operador_seleccionado",
                this.proveedor.operador_seleccionado
            );
            formData2.append("estado", this.proveedor.estado);
            formData2.append("fecha_ingreso", this.proveedor.fecha_ingreso);
            formData2.append("tipo_proveedor", this.proveedor.tipo_proveedor);
            formData2.append("linea_id", this.proveedor.linea_id);
            formData2.append("observaciones", this.proveedor.observaciones);

            formData2.append("files[]", this.formData.adjuntoRut.file);
            formData2.append("tipo_adjunto[]", this.formData.adjuntoRut.tipo);
            formData2.append("files[]", this.formData.adjuntoCamara.file);
            formData2.append(
                "tipo_adjunto[]",
                this.formData.adjuntoCamara.tipo
            );
            formData2.append("files[]", this.formData.adjuntoCliente.file);
            formData2.append(
                "tipo_adjunto[]",
                this.formData.adjuntoCliente.tipo
            );
            formData2.append("files[]", this.formData.adjuntoCuentaB.file);
            formData2.append(
                "tipo_adjunto[]",
                this.formData.adjuntoCuentaB.tipo
            );

            this.$axios
                .post(
                    "/proveedores-compras/modificar-proveedor/" +
                    this.proveedor.id,
                    formData2
                )
                .then((response) => {
                    this.$swal({
                        title: "¡Proveedor actualizado con éxito!",
                        icon: "success",
                    });
                    this.cerrarModal();
                })
                .catch((error) => {
                    console.error("Error al enviar el formulario:", error);
                    this.$swal({
                        title: "Error al enviar los datos",
                        text:
                            error.response?.data?.message ||
                            "Inténtelo de nuevo",
                        icon: "error",
                    }).finally(() => {});
                });
        },

        cerrarModal() {
            this.$emit("cerrar");
        },
    },
};
</script>
