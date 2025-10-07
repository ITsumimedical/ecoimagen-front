<template>
    <v-card flat>
        <v-container fluid>
            <v-form ref="formBuscarAfiliado" class="pa-2">
                <v-row dense>
                    <v-col cols="12" sm="4">
                        <v-autocomplete dense outlined label="Tipo de documento" :items="tiposDocumentos"
                            :loading="loading.tiposDocumentos" no-data-text="No hay resultados" item-value="id"
                            item-text="nombre" v-model="datosBuscarAfiliado.tipo_documento"
                            hint="Ingresa el tipo de documento del afiliado" :rules="[rules.obligatorio]" />
                    </v-col>

                    <v-col cols="12" sm="4">
                        <v-text-field label="Número de documento" v-model="datosBuscarAfiliado.numero_documento" dense
                            outlined type="number" :rules="[rules.obligatorio]">
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="12" style="display: flex; gap: 0.2rem">
                        <v-btn color="primary" dark
                            @click="consultarAfiliado(datosBuscarAfiliado.numero_documento,datosBuscarAfiliado.tipo_documento)"
                            style="width: 49%">Consultar <v-icon right>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn color="warning" dark @click="limpiarAfiliado()" style="width: 49%">Limpiar<v-icon right>
                                mdi-close
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>

            <v-row v-if="afiliado">
                <v-col cols="12" sm="12" md="12">
                    <EditarAfiliadoComponente :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                        :mostrarClasificaciones="true" />
                </v-col>
                <v-col>
                    <registroBiopsiaPatologias :historia="false" :datos="afiliado" @limpiarFormulario="limpiarAfiliado()"></registroBiopsiaPatologias>
                </v-col>
            </v-row>

        </v-container>
    </v-card>
</template>

<script>
    import {
        mapActions
    } from "vuex";
    import registroBiopsiaPatologias from "@/components/historia/formularios/ResultadoBiopsiaPatologia.vue"
    import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
    export default {
        components: {
            EditarAfiliadoComponente,
            registroBiopsiaPatologias
        },
        data() {
            return {
                tiposDocumentos: [],
                loading: {
                    tiposDocumentos: false,
                    diagnostico: false,
                },
                datosBuscarAfiliado: {
                    numero_documento: null,
                    tipo_documento: null,
                },
                rules: {
                    obligatorio: (value) => !!value || "Este campo es obligatorio.",
                },
                afiliado: null,
                cie10s: [],
                cie10: null,
                resultadoBiopsia: {
                    cie10: null,
                },
                tipoCancer: null

            }
        },

        watch: {
            cie10(val) {
                if (!val || val.length < 4) {
                    this.cie10s = [];
                } else if (val.length === 4) {
                    this.listarCie10();
                }
            }
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
                this.afiliado = null;
                this.datosBuscarAfiliado.numero_documento = null;
                this.datosBuscarAfiliado.tipo_documento = null;
                this.$refs.formBuscarAfiliado.resetValidation();
                this.$refs?.refCancerMama?.limpiarInformacion();
                this.resultadoBiopsia.cie10 = null;
                this.tipoCancer = null;
            },

            listarCie10() {
                const data = {
                    valor: this.cie10
                };
                this.loading.diagnostico = true;
                this.$axios.$post('cie10/listarFiltro', data).then(res => {
                    this.cie10s = res;
                }).catch(err => {
                    console.log(err);
                    this.$toast.error(err.response ?.data?.mensaje || 'Error al buscar CIE10');
                }).finally(() => {
                    this.loading.diagnostico = false;
                });
            },

        }
    }

</script>
