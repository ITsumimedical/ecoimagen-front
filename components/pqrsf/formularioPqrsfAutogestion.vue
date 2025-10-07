<template>
    <div>
        <v-row dense v-if="afiliado">
            <AfiliadoComponente :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                :mostrarClasificaciones="true" @respuestaComponente="componente = null" />
        </v-row>

        <v-form style="width: 100%" ref="formRegistroPQRSF">
            <v-row dense v-if="afiliado" class="mt-3">
                <v-col cols="12" sm="12" md="12">
                    <v-alert text dense border="left" type="info" icon="mdi-tooltip-question" class="text-center">
                        <b>REGISTRAR PQRSF</b></v-alert>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field prepend-icon="mdi-email-outline" dense type="email" v-model="formPQR.email"
                        label="Correo Electrónico *" :rules="[
                            () => !!formPQR.email || 'Este campo es requerido',
                            () =>
                                emailRegex.test(formPQR.email) ||
                                'Debe ser un correo electrónico válido',
                        ]"></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="6">
                    <v-text-field prepend-icon="mdi-phone-outline" dense v-model="formPQR.telefono"
                        label="Teléfono ó Celular *" :rules="[() => !!formPQR.telefono || 'Este campo es requerido']">
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-autocomplete dense prepend-icon="mdi-format-list-bulleted-type" v-model="formPQR.tipo_solicitud"
                        label="Tipo de Solicitud *" :items="opcionesTipoSolicitudes" :rules="[
                            () => !!formPQR.tipo_solicitud || 'Este campo es requerido',
                        ]" item-text="nombre" item-value="id"></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="6">
                    <v-file-input dense label="Adjuntar Archivos" v-model="formPQR.adjuntos" multiple small-chips
                        show-size counter prepend-icon="mdi-paperclip"
                        accept=".pdf, .doc, .docx, .png, .jpg, .jpeg, .xslx, .xls"></v-file-input>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-textarea auto-grow dense v-model="formPQR.descripcion" label="Descripción del caso *" :rules="[
                        () => !!formPQR.descripcion || 'Este campo es requerido',
                        () =>
                            formPQR.descripcion.length >= 10 ||
                            'Este campo debe tener al menos 10 caracteres',
                    ]"></v-textarea>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-checkbox v-model="ley1581" color="info" dense
                        label="Con el diligenciamiento de este formato autorizo expresamente el uso de mis datos personales según Ley 1581 de 2012.">
                    </v-checkbox>
                </v-col>
                <v-col cols="12" sm="12" md="12" class="text-right">
                    <v-btn small color="success" dark @click="enviarPQRSF()">
                        Enviar
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>
<script>
import {
    mapActions
} from "vuex";
import AfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";

export default {
    components: {
        AfiliadoComponente,
    },
    data() {
        return {
            afiliado: null,
            datosBasicos: true,
            editar: true,
            formPQR: {
                email: "",
                telefono: "",
                tipo_solicitud: null,
                adjuntos: [],
                descripcion: "",
            },
            emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            ley1581: false,
            loading: {
                tipoSolicitud: false,
            },
            opcionesTipoSolicitudes: [],
        };
    },
    created() {
        this.buscarAfiliado();
        this.listarTipoSolicitudesPqrsf();
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
                    this.avisoInicialAfiliado();
                })
                .catch(() => {
                    this.$toast.error("Ocurrió un error al obtener sus datos.");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        listarTipoSolicitudesPqrsf() {
            this.loading.tipoSolicitud = true;
            this.$axios
                .get("/tipos-solicitudes-pqrsf/listar")
                .then((res) => {
                    this.opcionesTipoSolicitudes = res.data.data;
                })
                .catch((e) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los tipos de solicitudes."
                    );
                })
                .finally(() => {
                    this.loading.tipoSolicitud = false;
                });
        },

        enviarPQRSF() {
            if (!this.ley1581) {
                return this.$swal({
                    type: "error",
                    title: "¡Debe aceptar el uso de sus datos personales según Ley 1581 de 2012!",
                });
            }

            if (this.$refs.formRegistroPQRSF.validate()) {
                const formData = new FormData();

                formData.append("quien_genera", "Usuario");
                formData.append("documento_genera", this.afiliado.numero_documento);
                formData.append("nombre_genera", `${this.afiliado.primer_nombre || ''} ${this.afiliado.segundo_nombre || ''} ${this.afiliado.primer_apellido || ''} ${this.afiliado.segundo_apellido || ''}`.trim());
                formData.append("correo", this.formPQR.email);
                formData.append("telefono", this.formPQR.telefono);
                formData.append("canal_id", 22);
                formData.append("descripcion", this.formPQR.descripcion);
                formData.append("tipo_solicitud_id", this.formPQR.tipo_solicitud);
                formData.append("afiliado_id", this.afiliado.id);
                formData.append("usuario_registra_id", this.afiliado.user_id);

                for (let i = 0; i < this.formPQR.adjuntos.length; i++) {
                    formData.append("adjuntos[]", this.formPQR.adjuntos[i]);
                }

                this.setPreload(true);

                this.$axios
                    .post("formularios-pqrsf/crearPqrsfAutogestion", formData)
                    .then((res) => {
                        this.$swal({
                            type: "success",
                            title: "¡Exito!",
                            text: `Sr(a)  su solicitud fue radicada con éxito N° de radicado ${res.data}
                            La respuesta será enviada a su correo electrónico dando cumplimiento a los tiempos de oportunidad establecidos
                            por Sumimedical.`,
                        });
                        this.limpiarFormulario();
                    })
                    .catch((e) => {
                        this.$toast.error("Ocurrió un error al registrar su PQRSF");
                    })
                    .finally(() => {
                        this.setPreload(false);
                    });
            } else {
                this.$toast.error("Por favor complete todos los campos obligatorios");
                return;
            }
        },

        limpiarFormulario() {
            this.formPQR = {
                email: "",
                telefono: "",
                tipo_solicitud: null,
                adjuntos: [],
                descripcion: "",
            };
            this.ley1581 = false;
            this.$refs.formRegistroPQRSF.resetValidation();
        },

        avisoInicialAfiliado() {
            const nombreCompleto = `${this.afiliado.primer_nombre || ''} ${this.afiliado.segundo_nombre || ''} ${this.afiliado.primer_apellido || ''} ${this.afiliado.segundo_apellido || ''}`.trim();
            this.$swal({
                type: "info",
                title: "Aviso",
                text: this.afiliado.entidad.id === 1
                    ? "Recuerda que este canal de PQRS es exclusivo para los servicios que presta Sumimedical en sus sedes de atención. PQRS relacionadas con servicios no prestados por Sumimedical, no podrán ser atendidos por este medio."
                    : `Señor(a) ${nombreCompleto}. Para Sumimedical es importante conocer las observaciones del servicio, pues nos permite implementar las acciones de mejoras para cada día fortalecer la atención a nuestros usuarios. En este modulo usted puede consultar el estado de su requerimiento o ir al formulario para realizar la radicación.`,
            });
        },
    },
};

</script>
