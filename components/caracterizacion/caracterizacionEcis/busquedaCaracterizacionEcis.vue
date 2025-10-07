<template>
    <v-form ref="formBusquedaCaracterizacion">
        <v-card flat :loading="caracterizacion.loading" :disabled="caracterizacion.loading">
            <v-card-text>
                <v-row dense>
                    <v-col cols="12" sm="6" md="5">
                        <v-autocomplete dense outlined label="Tipo de Documento" :items="tipo_documento.opciones"
                            item-text="nombre" item-value="id" v-model="form.tipo_documento"
                            :loading="tipo_documento.loading" :rules="[rules.obligatorio]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="5">
                        <v-text-field dense outlined label="Número de Documento" v-model="form.numero_documento"
                            :rules="[rules.obligatorio]" />
                    </v-col>
                    <v-col cols="12" sm="12" md="1">
                        <v-btn block color="primary" dark @click="buscarCaracterizacionEcisAfiliado"
                            :loading="caracterizacion.loading">
                            Buscar
                        </v-btn>
                    </v-col>
                    <v-col cols="12" sm="12" md="1">
                        <v-btn block color="warning" dark :loading="caracterizacion.loading" @click="limpiarFormulario">
                            Limpiar
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-form>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            form: {
                numero_documento: null,
                tipo_documento: null
            },
            tipo_documento: {
                loading: false,
                opciones: []
            },
            caracterizacion: {
                loading: false,
                data: null
            },
            rules: {
                obligatorio: v => !!v || 'Este campo es obligatorio.'
            }
        }
    },
    mounted() {
        this.listarTiposDocumento();
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        async listarTiposDocumento() {
            try {
                this.tipo_documento.loading = true;

                const { data } = await this.$axios.get('tipo-documento/listar');
                this.tipo_documento.opciones = data;
            } catch (error) {
                this.$toast.error('Error al listar los tipos de documento');
            } finally {
                this.tipo_documento.loading = false;
            }
        },

        async buscarCaracterizacionEcisAfiliado() {
            if (!this.$refs.formBusquedaCaracterizacion.validate()) return;

            this.caracterizacion.data = null;
            this.manejarEstadoCarga(true);
            try {
                const { data } = await this.$axios.get(`/caracterizacion/buscar-caracterizacion-ecis-afiliado`,
                    {
                        params: {
                            numero_documento: this.form.numero_documento,
                            tipo_documento: this.form.tipo_documento
                        }
                    }
                );

                this.caracterizacion.data = data;

                this.$emit("caracterizacion-encontrada", this.caracterizacion.data);
            } catch (error) {
                if (error?.response && error?.response?.data) {
                    this.$swal({
                        title: 'Error',
                        text: error.response.data,
                        type: 'error',
                        showConfirmButton: true
                    });
                } else {
                    this.$toast.error('Error al buscar la información del afiliado.');
                }
            } finally {
                this.manejarEstadoCarga(false);
            }
        },

        manejarEstadoCarga(estado) {
            this.caracterizacion.loading = estado;
            this.setPreload(estado);
        },

        limpiarFormulario() {
            this.$refs.formBusquedaCaracterizacion.reset();
            this.caracterizacion.data = null;
            this.$emit("caracterizacion-encontrada", null);
            this.$emit("limpiar-caracterizacion");
        }
    }
}
</script>