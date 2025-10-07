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
                <span class="ml-3">INFORMACIÓN BÁSICA DEL PROVEEDOR</span>
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
                            v-model="formData.nombre_proveedor"
                            :rules="[rules.obligatorio]"
                            dense
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete
                            label="Tipo de Documento *"
                            :rules="[rules.obligatorio]"
                            :items="tipoDocumento"
                            item-text="nombre"
                            item-value="id"
                            v-model="formData.documentoSeleccionado"
                            dense
                            outlined
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field
                            label="Número Documento"
                            v-model="formData.nit"
                            outlined
                            dense
                            :rules="[rules.numerico]"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field
                            label="Nombre representante *"
                            v-model="formData.nombre_representante"
                            :rules="[rules.obligatorio]"
                            outlined
                            dense
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field
                            label="Telefono *"
                            v-model="formData.telefono"
                            outlined
                            :rules="[rules.obligatorio, rules.numerico]"
                            dense
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field
                            label="Dirección *"
                            v-model="formData.direccion"
                            outlined
                            :rules="[rules.obligatorio]"
                            dense
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete
                            label="Municipio *"
                            outlined
                            :items="municipios"
                            v-model="formData.municipio_id"
                            item-text="municipioYDepartamento"
                            item-value="id"
                            :rules="[rules.obligatorio]"
                            dense
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field
                            label="E-Mail *"
                            v-model="formData.email"
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

                    <v-col cols="12" md="4">
                        <v-autocomplete
                            label="Pais y Código del País*"
                            :items="paises"
                            :rules="[rules.obligatorio]"
                            item-text="paisYDane"
                            item-value="id"
                            v-model="formData.pais_id"
                            dense
                            outlined
                        ></v-autocomplete>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-autocomplete
                            label="Codigo Obligación DIAN*"
                            :rules="[rules.obligatorio]"
                            :items="codigoObligacion"
                            item-text="nombre"
                            item-value="id"
                            v-model="formData.codigoDianSeleccionado"
                            dense
                            outlined
                        ></v-autocomplete>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-autocomplete
                            label="Responsabilidad Fiscal *"
                            :rules="[rules.obligatorio]"
                            :items="ResponsabilidadFiscal"
                            v-model="formData.ResponsabilidadFiscalSeleccionada"
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
                            :rules="[rules.obligatorio]"
                            dense
                            outlined
                            accept="application/pdf"
                        ></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-file-input
                            label="RUT *"
                            v-model="formData.adjuntoRut.file"
                            :rules="[rules.obligatorio]"
                            outlined
                            dense
                        ></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-file-input
                            label="Camara de comercio *"
                            v-model="formData.adjuntoCamara.file"
                            :rules="[rules.obligatorio]"
                            outlined
                            dense
                        ></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-file-input
                            label="Certificado de cuenta bancaria *"
                            v-model="formData.adjuntoCuentaB.file"
                            :rules="[rules.obligatorio]"
                            outlined
                            dense
                        ></v-file-input>
                    </v-col>

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
                            v-model="formData.adjuntoOtros.file"
                            :rules="[rules.obligatorio]"
                            dense
                            outlined
                            accept="application/pdf"
                        ></v-file-input>
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
                            v-model="formData.actividad_economica"
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
                            v-model="formData.modalidad_vinculacion"
                            item-text="modalidad"
                            outlined
                            dense
                        ></v-autocomplete>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-text-field
                            label="Forma de Pago (Días) *"
                            outlined
                            v-model="formData.forma_pago"
                            :rules="[rules.obligatorio, rules.numerico]"
                            dense
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete
                            label="Tiempo de Entrega *"
                            outlined
                            :rules="[rules.obligatorio]"
                            v-model="formData.tiempo_entrega"
                            :items="tiempoEntrega"
                            item-text="nombre"
                            item-value="nombre"
                            dense
                        ></v-autocomplete>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete
                            label="Area Responsable Aprobación Factura *"
                            :rules="[rules.obligatorio]"
                            v-model="formData.area_id"
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
                                    v-model="formData.fecha_ingreso"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="formData.fecha_ingreso"
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
                            v-model="formData.tipo_proveedor"
                            :rules="[rules.obligatorio]"
                            item-text="nombre"
                            item-value="nombre"
                            outlined
                            dense
                        ></v-autocomplete>
                    </v-col>

                    <v-col cols="12">
                        <v-col cols="12">
                            <v-autocomplete
                                outlined
                                dense
                                multiple
                                chips
                                deletable-chips
                                small
                                v-model="formData.selectedLinea"
                                :items="lineas"
                                item-text="nombre"
                                item-value="id"
                                label="Línea"
                            ></v-autocomplete>
                        </v-col>
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
                            v-model="formData.observaciones"
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
    data() {
        return {
            municipios: null,
            municipioYDepartamento: null,
            areas: [],
            lineas: [],
            lineaSeleccionada: 0,
            menu: null,
            fechaIngreso: null,
            formValidado: true,
            dialog: false,
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
            tiempoEntrega: [
                { id: 1, nombre: "15 Días" },
                { id: 2, nombre: "30 Días" },
                { id: 3, nombre: "60 Días" },
            ],
            estado: [
                { id: 0, estadoTexto: "Inactivo" },
                { id: 1, estadoTexto: "Activo" },
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
                area_id: null,
                estado: null,
                fecha_ingreso: null,
                tipo_proveedor: null,
                selectedLinea: [],
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

    mounted() {
        this.obtenerMunicipios(),
            this.traerAreas(),
            this.traerLineas(),
            this.obtenerPais();
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        obtenerMunicipios() {
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
                });
        },

        traerAreas() {
            this.$axios
                .get("/areas-proveedores/listar-areas")
                .then((response) => {
                    this.areas = response.data;
                })
                .catch((error) => {
                    console.error("Error al las areas", error);
                });
        },

        traerLineas() {
            this.$axios
                .get("/lineas-compras/listar-lineas")
                .then((response) => {
                    this.lineas = response.data;
                })
                .catch((error) => {
                    console.error("Error al obtener las lineas");
                });
        },

        agregarLineas() {
            this.$axios
                .post(
                    "/proveedores-compras/proveedores-lineas",
                    (params = {
                        proveedor_id: this.proveedor.id,
                        lineas: this.formData.id,
                    })
                )
                .then((response) => {
                    this.$swal({
                        title: "¡Lineas asignadas con éxito!",
                        icon: "success",
                    });
                })
                .catch(() => {
                    console.error("Error al enviar el formulario:", error);
                });
        },

        EnviarFormulario() {
            let formData2 = new FormData();

            formData2.append(
                "nombre_proveedor",
                this.formData.nombre_proveedor
            );
            formData2.append("nit", this.formData.nit);
            formData2.append(
                "nombre_representante",
                this.formData.nombre_representante
            );
            formData2.append("telefono", this.formData.telefono);
            formData2.append("direccion", this.formData.direccion);
            formData2.append("municipio_id", this.formData.municipio_id);
            formData2.append("email", this.formData.email);
            formData2.append(
                "actividad_economica",
                this.formData.actividad_economica
            );
            formData2.append(
                "modalidad_vinculacion",
                this.formData.modalidad_vinculacion
            );
            formData2.append("forma_pago", this.formData.forma_pago);
            formData2.append("tiempo_entrega", this.formData.tiempo_entrega);
            formData2.append(
                "operador_seleccionado",
                this.formData.operador_seleccionado
            );
            formData2.append("area_id", this.formData.area_id);
            formData2.append("estado", this.formData.estado);
            formData2.append("fecha_ingreso", this.formData.fecha_ingreso);
            formData2.append("tipo_proveedor", this.formData.tipo_proveedor);

            formData2.append(
                "tipo_documento_legal",
                this.formData.documentoSeleccionado
            );
            formData2.append("pais_id", this.formData.pais_id);
            formData2.append(
                "codigo_dian",
                this.formData.codigoDianSeleccionado
            );
            formData2.append(
                "responsabilidad_fiscal",
                this.formData.ResponsabilidadFiscalSeleccionada
            );

            this.formData.selectedLinea.forEach((linea) => {
                formData2.append("linea_id[]", linea);
            });

            formData2.append("observaciones", this.formData.observaciones);

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
            formData2.append("files[]", this.formData.adjuntoOtros.file);
            formData2.append("tipo_adjunto[]", this.formData.adjuntoOtros.tipo);

            this.$axios
                .post("/proveedores-compras/crear-proveedores", formData2)
                .then((response) => {
                    this.$swal({
                        title: "¡Proveedor creado con éxito!",
                        icon: "success",
                    });
                    this.cerrarModal();
                })
                .catch((error) => {
                    console.error("Error al enviar el formulario:", error);
                    this.$toast.error(
                        error.response.data.error ??
                            "Error al crear el proveedor"
                    );
                });
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

        remove(item) {
            this.chips.splice(this.chips.indexOf(item), 1);
        },

        cerrarModal() {
            this.$emit("cerrar");
        },
    },
};
</script>
