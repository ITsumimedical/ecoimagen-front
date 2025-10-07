<template>
    <div>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Verificación de datos</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>

            <v-card-text>
                <v-form ref="formBuscarAfiliado">
                    <v-row class="mt-4">
                        <v-col cols="12" md="4" sm="12">
                            <v-autocomplete dense outlined label="Tipo de documento" :items="tiposDocumentos"
                                :loading="loading.tiposDocumentos" no-data-text="No hay resultados" item-value="id"
                                item-text="nombre" v-model="datosBuscarAfiliado.tipo_documento"
                                hint="Ingresa el tipo de documento del afiliado" :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" md="4" sm="12">
                            <v-text-field dense outlined label="Número documento" @keyup.enter="
                                consultarAfiliado(
                                    datosBuscarAfiliado.numero_documento,
                                    datosBuscarAfiliado.tipo_documento
                                )
                                " v-model.trim="datosBuscarAfiliado.numero_documento"
                                hint="Ingresa el número de documento del afiliado" :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" md="4" sm="12" style="display: flex; gap: 0.2rem">
                            <v-btn color="primary" dark @click="
                                consultarAfiliado(
                                    datosBuscarAfiliado.numero_documento,
                                    datosBuscarAfiliado.tipo_documento
                                )
                                " style="width: 49%">Consultar <v-icon right>mdi-magnify</v-icon></v-btn>
                            <v-btn color="red" dark @click="limpiarAfiliado()" style="width: 49%">Limpiar<v-icon
                                    right>mdi-close</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-form>
                <v-row v-if="afiliado">
                    <v-col cols="12" sm="12" md="12">
                        <EditarAfiliadoComponente :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                            :mostrarClasificaciones="true" />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";

export default {
    components: {
        EditarAfiliadoComponente,
    },
    data() {
        return {
            datosBuscarAfiliado: {
                numero_documento: null,
                tipo_documento: null,
            },
            loading: {
                tiposDocumentos: false,
                novedadesAfiliado: false,
            },
            tiposDocumentos: [],
            afiliado: null,
            rules: {
                obligatorio: (value) => !!value || "Este campo es obligatorio.",
            },
        };
    },
    mounted() {
        this.listarTiposDocumentos();
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        listarTiposDocumentos() {
            this.loading.tiposDocumentos = true;
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
                    this.loading.tiposDocumentos = false;
                });
        },

        consultarAfiliado(numero_documento, tipo_documento) {
            if (!this.$refs.formBuscarAfiliado.validate()) {
                this.$toast.error(
                    "Por favor ingrese el tipo de documento y el número de documento."
                );
                return;
            }

            this.afiliado = null;
            this.setPreload(true);
            this.$axios
                .post(`/afiliados/buscarAfiliados/${numero_documento}/${tipo_documento}`)
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
                    this.setPreload(false);
                });
        },

        limpiarAfiliado() {
            this.datosBuscarAfiliado = {
                numero_documento: null,
                tipo_documento: null,
            };
            this.afiliado = null;

            this.$refs.formBuscarAfiliado.resetValidation();
        },
    },
};
</script>
