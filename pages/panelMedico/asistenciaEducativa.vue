<template>
    <div>
        <!-- Preload -->
        <v-dialog v-model="preload" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Tranquilo procesamos tu solicitud !
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-container fluid>
            <v-row dense>
                <v-col cols="12" sm="12" md="12">
                    <v-alert text border="left" dense type="info" icon="mdi-book-education"><b>Asistencia
                            Educativa</b></v-alert>
                </v-col>
            </v-row>
            <!-- Buscar Afiliado -->
            <v-row dense>
                <v-col cols="12" md="4" sm="12">
                    <v-autocomplete dense outlined label="Tipo de Documento" :items="tiposDocumentos"
                        :loading="loading.tipoDocumento" no-data-text="No hay resultados" item-value="id"
                        item-text="nombre" v-model="datosBuscarAfiliado.tipo_documento" />
                </v-col>
                <v-col cols="12" md="4" sm="12">
                    <v-text-field dense outlined label="Número Documento" @keyup.enter="consultarAfiliado"
                        v-model.trim="datosBuscarAfiliado.numero_documento" />
                </v-col>
                <v-col cols="12" md="4" sm="12" style="display: flex; gap: 0.2rem">
                    <v-btn small color="primary" dark @click="consultarAfiliado" style="width: 50%">Consultar <v-icon
                            right>mdi-magnify</v-icon></v-btn>
                    <v-btn small color="red" dark @click="limpiarAfiliado" style="width: 50%">Limpiar<v-icon
                            right>mdi-close</v-icon></v-btn>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col cols="12" sm="12" md="12" v-if="afiliado">
                    <AfiliadoComponent :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                        :mostrarClasificaciones="true" @respuestaComponente="afiliado = {}" />
                </v-col>
            </v-row>
            <v-form ref="formAsistenciaEducativa">
                <v-row dense v-if="afiliado">
                    <v-col cols="12" sm="12" md="6">
                        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="formAsistenciaEducativa.fecha" label="Fecha"
                                    prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                                    :rules="rules.fecha"></v-text-field>
                            </template>
                            <v-date-picker v-model="formAsistenciaEducativa.fecha"
                                @input="menu = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                        <v-autocomplete v-model="formAsistenciaEducativa.tipo_educacion" :items="listaTipoEducacion"
                            label="Tipo de Educación" item-value="id" item-text="nombre"
                            :loading="loading.tipo_educacion" no-data-text="No hay resultados"
                            :rules="rules.tipo_educacion"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-textarea label="Tema" v-model="formAsistenciaEducativa.tema" auto-grow
                            :rules="rules.tema"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" class="d-flex justify-end">
                        <v-btn color="primary" @click="guardarAsistenciaEducativa" :disabled="preload"
                            :loading="preload">Guardar<v-icon right>mdi-content-save</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </div>
</template>

<script>
import AfiliadoComponent from "@/components/afiliado/FormularioAfiliadoComponente.vue";

export default {

    components: {
        AfiliadoComponent,
    },
    data() {
        return {
            preload: false,
            loading: {
                tipoDocumento: false,
                tipoEducacion: false,
            },
            tiposDocumentos: [],
            datosBuscarAfiliado: {
                numero_documento: null,
                tipo_documento: null,
            },
            afiliado: null,
            datosBasicos: true,
            editar: true,
            formAsistenciaEducativa: {
                fecha: null,
                tipo_educacion: null,
                tema: null,
            },
            rules: {
                fecha: [(v) => !!v || "La fecha es requerida."],
                tipo_educacion: [(v) => !!v || "El tipo de educación es requerido."],
                tema: [
                    (v) => !!v || "El tema es requerido.",
                    (v) =>
                        (v && v.length >= 10) ||
                        "El tema debe tener al menos 10 caracteres.",
                ],
            },
            listaTipoEducacion: [],
            menu: false,
        };
    },
    mounted() {
        this.listarTiposDocumentos();
        this.listarTiposDeEducacion();
    },
    methods: {
        listarTiposDocumentos() {
            this.loading.tipoDocumento = true;
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
                    this.loading.tipoDocumento = false;
                });
        },

        consultarAfiliado() {
            if (
                !this.datosBuscarAfiliado.numero_documento ||
                !this.datosBuscarAfiliado.tipo_documento
            ) {
                return this.$toast.error(
                    "Por favor ingrese el tipo de documento y el número de documento."
                );
            }
            this.preload = true;
            this.$axios
                .get(
                    `/afiliados/${this.datosBuscarAfiliado.numero_documento}/${this.datosBuscarAfiliado.tipo_documento}`
                )
                .then((res) => {
                    this.afiliado = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "El afiliado no se encuentra registrado en la base de datos."
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.preload = false;
                });
        },

        limpiarAfiliado() {
            this.datosBuscarAfiliado = {
                numero_documento: null,
                tipo_documento: null,
            };
            this.afiliado = null;
            this.formAsistenciaEducativa = {
                fecha: null,
                tipo_educacion: null,
                tema: null,
            };
        },

        listarTiposDeEducacion() {
            this.loading.tipoEducacion = true;
            this.$axios
                .get("cup/listarTiposEducacion")
                .then((res) => {
                    this.listaTipoEducacion = res.data;
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    this.loading.tipoEducacion = false;
                });
        },

        guardarAsistenciaEducativa() {
            this.$refs.formAsistenciaEducativa.validate();
            if (!this.$refs.formAsistenciaEducativa.validate()) {
                return this.$toast.error(
                    "Por favor, llene todos los campos requeridos."
                );
            }

            const data = {
                afiliado_id: this.afiliado.id,
                fecha: this.formAsistenciaEducativa.fecha,
                tipo_educacion: this.formAsistenciaEducativa.tipo_educacion,
                tema: this.formAsistenciaEducativa.tema,
            };

            this.preload = true;
            this.$axios
                .post("/asistencia-educativas/crear", data)
                .then((res) => {
                    this.$toast.success("Asistencia guardada con éxito");
                    this.$refs.formAsistenciaEducativa.reset();
                    this.limpiarAfiliado();
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al crear la asistencia educativa."
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.preload = false;
                });
        },
    },
};
</script>
