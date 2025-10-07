<template>
    <div>
        <v-form ref="formBusquedaAfiliado">
            <v-card flat :loading="loading.busquedaAfiliado" :disabled="loading.busquedaAfiliado">
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="6" md="5">
                            <v-autocomplete dense outlined label="Tipo de Documento" :items="opcionesTipoDocumento"
                                item-text="nombre" item-value="id" v-model="form.tipo_documento"
                                :loading="loading.opcionesTipoDocumento" :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" sm="6" md="5">
                            <v-text-field dense outlined label="Número de Documento" v-model="form.numero_documento"
                                :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" sm="12" md="1">
                            <v-btn block color="primary" dark @click="buscarAfiliado"
                                :loading="loading.busquedaAfiliado">
                                Buscar
                            </v-btn>
                        </v-col>
                        <v-col cols="12" sm="12" md="1">
                            <v-btn block color="warning" dark :loading="loading.busquedaAfiliado"
                                @click="limpiarFormulario">
                                Limpiar
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-form>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import { listarTipoDocumento } from "@/api/tiposDocumentos/tipoDocumento";

export default {
    name: "buscarAfiliadoComponente",
    data() {
        return {
            form: {
                numero_documento: "",
                tipo_documento: null,
            },
            opcionesTipoDocumento: [],
            loading: {
                opcionesTipoDocumento: false,
                busquedaAfiliado: false,
            },
            rules: {
                obligatorio: v => !!v || "Este campo es obligatorio",
            },
        };
    },
    mounted() {
        this.cargarTiposDocumentos();
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        async cargarTiposDocumentos() {
            this.loading.opcionesTipoDocumento = true;
            try {
                const response = await this.$axios.get(listarTipoDocumento());
                this.opcionesTipoDocumento = response.data;
            } catch (error) {
                this.$toast.error("Error al cargar los tipos de documentos");
            } finally {
                this.loading.opcionesTipoDocumento = false;
            }
        },

        async buscarAfiliado() {
            if (!this.$refs.formBusquedaAfiliado.validate()) return;

            this.setPreload(true);
            this.loading.busquedaAfiliado = true;
            try {
                const response = await this.$axios.get(
                    `/afiliados/${this.form.numero_documento}/${this.form.tipo_documento}`
                );
                this.$emit("afiliado-encontrado", response.data);
            } catch (error) {
                if (error.response?.status === 404) {
                    this.$toast.error("El afiliado no se encuentra en la base de datos");
                } else {
                    this.$toast.error("Error al buscar el afiliado");
                }
                this.$emit("afiliado-encontrado", null);
            } finally {
                this.loading.busquedaAfiliado = false;
                this.setPreload(false);
            }
            this.$emit("buscarAfiliado", this.form.numero_documento, this.form.tipo_documento);
        },

        limpiarFormulario() {
            this.form = {
                numero_documento: "",
                tipo_documento: null,
            };
            this.$refs.formBusquedaAfiliado.resetValidation();
            this.$emit("afiliado-encontrado", null);
            this.$emit("limpiar-afiliado");
        },
    },
};
</script>
